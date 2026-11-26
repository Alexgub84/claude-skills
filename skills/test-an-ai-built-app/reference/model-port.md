# The model port: one interface, a real client, a scripted fake

Last reviewed: 2026-11-26

Everything in this file is the one thing this procedure fakes. The examples
are TypeScript because that is the most common shape for an AI-built web
app; the "Other languages" section at the end gives the same shape
elsewhere. The running example is a small intake app: a person submits a
request in free text, the model turns it into a structured record, the app
stores it and answers with a confirmation number.

## 1. The interface

One file, no implementation in it. One method, shaped like a structured
call: a system prompt, a user prompt, and a schema for the answer.

```ts
// src/ai/types.ts
import type { Schema } from "ai";

/**
 * Every model call in this app goes through this one interface. Two
 * implementations exist: a real client (src/ai/real.ts) and a scripted
 * fake (src/ai/fake.ts). Nothing else in the app knows which it has.
 *
 * There is deliberately no open-ended chat method here. An answer with no
 * declared shape cannot be scripted, so a port with a chat method cannot
 * be faked honestly.
 */
export type ModelRequest<T> = {
  /** What this call is for. Recorded, never branched on. */
  purpose: "classify_request" | "summarise_request";
  /** A fixed id for this prompt's version, so a changed prompt is visible. */
  promptVersion: string;
  /**
   * A plain JSON schema for the answer, built with the SDK's own schema
   * helper. Not a validation-library object handed straight to the model
   * call: providers require an object at the schema root and some
   * validation libraries omit it, which fails at the provider with a
   * confusing complaint about a missing field.
   */
  schema: Schema<T>;
  schemaName?: string;
  system: string;
  prompt: string;
  temperature?: number;
  maxRetries?: number;
};

export type ModelResponse<T> = {
  object: T;
  /** Which model actually answered, for the audit row. */
  modelId: string;
  promptTokens: number | null;
  completionTokens: number | null;
};

export interface AiClient {
  generateObject<T>(request: ModelRequest<T>): Promise<ModelResponse<T>>;
}
```

The schema for the running example, written by hand next to the call site:

```ts
// src/intake/classify.ts
import { jsonSchema } from "ai";
import type { AiClient } from "../ai/types.ts";

type Classification = {
  category: "billing" | "delivery" | "technical" | "other";
  urgency: "low" | "normal" | "high";
};

const classificationSchema = jsonSchema<Classification>({
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: ["billing", "delivery", "technical", "other"],
    },
    urgency: { type: "string", enum: ["low", "normal", "high"] },
  },
  required: ["category", "urgency"],
  additionalProperties: false,
});

export async function classifyRequest(
  ai: AiClient,
  text: string,
): Promise<Classification> {
  const result = await ai.generateObject({
    purpose: "classify_request",
    promptVersion: "classify.v1",
    schema: classificationSchema,
    schemaName: "Classification",
    system: "Classify one customer request. Answer only with the schema.",
    prompt: text,
  });
  return result.object;
}
```

Note what `classifyRequest` does not do: it does not create a client, does
not read an API key, and does not know which implementation it has. That is
what makes it testable.

## 2. The real client

```ts
// src/ai/real.ts
import { generateObject, type LanguageModel } from "ai";
import type { AiClient, ModelRequest, ModelResponse } from "./types.ts";

/**
 * The real client. It takes an already-constructed model object rather than
 * a provider's API key, so this file is the same whichever provider you use
 * — the choice lives in src/index.ts, which is the only place a provider is
 * created.
 *
 * Temperature zero and a few retries by default, both overridable per call.
 * Zero temperature is not what makes a test deterministic — the fake is —
 * but it makes production's own behaviour repeatable, which is worth having
 * anyway.
 */
export function createRealAiClient(args: {
  model: LanguageModel;
  modelId: string;
}): AiClient {
  const { model, modelId } = args;
  return {
    async generateObject<T>(
      request: ModelRequest<T>,
    ): Promise<ModelResponse<T>> {
      const result = await generateObject({
        model,
        schema: request.schema,
        schemaName: request.schemaName,
        system: request.system,
        prompt: request.prompt,
        temperature: request.temperature ?? 0,
        maxRetries: request.maxRetries ?? 4,
      });
      return {
        object: result.object as T,
        modelId,
        promptTokens: result.usage.inputTokens ?? null,
        completionTokens: result.usage.outputTokens ?? null,
      };
    },
  };
}
```

A hand-written HTTP client against the provider's REST endpoint is equally
valid here and is what some production code does. The real-and-fake pair
behind one interface is the part that matters; the library is not.

## 3. The scripted fake

```ts
// src/ai/fake.ts
import { appendFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { AiClient, ModelRequest, ModelResponse } from "./types.ts";

/** One call the fake served, as the test will read it back. */
export type RecordedCall = {
  purpose: ModelRequest<unknown>["purpose"];
  promptVersion: string;
  system: string;
  prompt: string;
  temperature: number | undefined;
  maxRetries: number | undefined;
};

export type ScriptedEntry = {
  object?: unknown;
  error?: string;
};

export interface FakeAiClient extends AiClient {
  /** Queue one answer for the next call. */
  enqueueObject(object: unknown): void;
  /** Queue one failure for the next call, to test the error path. */
  enqueueError(error: Error): void;
  /** Everything the app asked, in order, so a test can assert on it. */
  getCallHistory(): RecordedCall[];
  clearCallHistory(): void;
}

type QueueEntry = { object: unknown } | { error: Error };

function loadScript(path: string): QueueEntry[] {
  const entries = JSON.parse(readFileSync(path, "utf8")) as ScriptedEntry[];
  return entries.map((entry) =>
    entry.error !== undefined
      ? { error: new Error(entry.error) }
      : { object: entry.object },
  );
}

/**
 * Deterministic fake. Needs no API key and opens no network connection.
 * Every answer is scripted by the test ahead of time, and every request is
 * recorded so the test can assert exactly what the app asked.
 *
 * An unscripted call THROWS. This is the most important line in the file: a
 * fake that returns a plausible default when nobody scripted an answer
 * turns a missing script into a passing test, and the test then proves
 * nothing while looking green forever. An empty queue is a bug in the test,
 * not a default.
 *
 * `scriptFile` exists for one case: the code under test runs as a
 * separately spawned process, so it shares no memory with the test and
 * nothing can push onto its queue. It then reads its script from that JSON
 * file and appends every call it served, one JSON object per line, to
 * calls.jsonl beside it — which is how the parent process reads back what
 * was asked.
 */
export function createFakeAiClient(options?: {
  scriptFile?: string;
}): FakeAiClient {
  const scriptFile = options?.scriptFile;
  const queue: QueueEntry[] = scriptFile ? loadScript(scriptFile) : [];
  const history: RecordedCall[] = [];
  const log = scriptFile ? join(dirname(scriptFile), "calls.jsonl") : null;

  return {
    enqueueObject(object: unknown): void {
      queue.push({ object });
    },
    enqueueError(error: Error): void {
      queue.push({ error });
    },
    getCallHistory(): RecordedCall[] {
      return history;
    },
    clearCallHistory(): void {
      history.length = 0;
    },
    generateObject<T>(request: ModelRequest<T>): Promise<ModelResponse<T>> {
      const record: RecordedCall = {
        purpose: request.purpose,
        promptVersion: request.promptVersion,
        system: request.system,
        prompt: request.prompt,
        temperature: request.temperature,
        maxRetries: request.maxRetries,
      };
      history.push(record);
      if (log) appendFileSync(log, `${JSON.stringify(record)}\n`);

      const next = queue.shift();
      if (next === undefined) {
        return Promise.reject(
          new Error(
            `FakeAiClient: nothing scripted for call ${history.length} ` +
              `(purpose "${request.purpose}"). Script an answer with ` +
              `enqueueObject, or assert that this call should not happen.`,
          ),
        );
      }
      if ("error" in next) return Promise.reject(next.error);
      return Promise.resolve({
        object: next.object as T,
        modelId: "fake-model",
        promptTokens: null,
        completionTokens: null,
      });
    },
  };
}
```

The recorded request deliberately leaves out the schema. A function compared
for equality carries no useful signal, and including it makes every
assertion on the history noisy.

## 4. The two tests that keep this honest

```ts
// test/intake/classify.test.ts
import { createFakeAiClient } from "../../src/ai/fake.ts";
import { classifyRequest } from "../../src/intake/classify.ts";

test("a request is classified from the model's answer", async () => {
  const ai = createFakeAiClient();
  ai.enqueueObject({ category: "billing", urgency: "high" });

  const result = await classifyRequest(ai, "I was charged twice");

  expect(result).toEqual({ category: "billing", urgency: "high" });

  // The one legitimate assertion on a call rather than on state: the app
  // sent the person's actual words, once, at the expected settings.
  const calls = ai.getCallHistory();
  expect(calls).toHaveLength(1);
  expect(calls[0].prompt).toBe("I was charged twice");
  expect(calls[0].purpose).toBe("classify_request");
});

test("an unscripted model call fails loudly", async () => {
  const ai = createFakeAiClient();
  // Nothing enqueued, on purpose.
  await expect(classifyRequest(ai, "anything")).rejects.toThrow(
    /nothing scripted/,
  );
});
```

The second test looks pointless and is not. It is the test that fails the
day someone gives the fake a friendly default to make another test pass, and
it is the only thing standing between this suite and a fake that quietly
answers every question.

## 5. Where the swap happens, and only there

```ts
// src/index.ts — production, the only place a provider is created
import { createRealAiClient } from "./ai/real.ts";
import { buildApp } from "./app.ts";
import { openDatabase } from "./db.ts";
import { config } from "./config.ts";
// Whichever provider you use; this import is the one line that names it.
import { createProvider } from "<your provider's sdk package>";

const provider = createProvider({ apiKey: config.aiApiKey });

const app = buildApp({
  db: openDatabase(config.databaseUrl),
  ai: createRealAiClient({
    model: provider(config.aiModel),
    modelId: config.aiModel,
  }),
});
```

```ts
// test/support/app.ts — the test's own composition
import { createFakeAiClient } from "../../src/ai/fake.ts";
import { buildApp } from "../../src/app.ts";

export function buildTestApp(db: Database) {
  const ai = createFakeAiClient();
  return { app: buildApp({ db, ai }), ai };
}
```

Three refusals that go with this:

- **No factory that can produce the fake.** The function that builds a real
  client has no branch, no setting and no environment variable that makes it
  return the fake instead. A `provider: "fake"` value readable in production
  is how a fake reaches a customer; the config schema should reject that
  value outright, with a message saying so.
- **No global mock, no replaced module import.** If a test has to reach into
  a module to swap something, the seam is missing. Add the field to the deps
  type instead.
- **No second code path for tests.** The fake arrives through the same
  argument the real client arrives through, so every line of processing
  around the call runs in the test exactly as it runs in production.

## 6. Other languages, same shape

- **Python:** a `Protocol` (or abstract base class) with one method, a real
  implementation, and a fake whose `generate_object` pops from a list and
  raises when the list is empty. Injected through the constructor of the
  object that uses it, or through a single dependency dataclass.
- **Go:** an interface with one method, two implementations, passed in a
  struct of dependencies to the constructor.
- **Ruby, PHP, C#, Java:** the same — an interface, two implementations, and
  constructor injection. No test-double framework is needed for any of them,
  and a framework that patches a method in place reintroduces exactly the
  "reached in instead of adding a seam" problem.

The language does not change any of the four rules: one narrow interface, a
declared answer shape, a fake scripted in call order, and a loud failure on
an unscripted call.
