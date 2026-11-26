# The clock

Last reviewed: 2026-11-26

## The rule

**Production code takes its clock as an injected dependency. A test passes a
fixed instant. No test reads the real clock.**

Three defences, in the order they catch a mistake:

1. **Injection.** Production has one place that reads the time, taken from
   the dependency object, with a documented real-clock default. That default
   is the pattern, not a leak.
2. **The shape.** The test-side builder takes a fixed instant — a frozen
   value, not a function and not a live date object — so handing it the
   current time is a type error rather than a silent pass.
3. **The guard.** A lint rule banning a bare current-time read across the
   whole test tree. It catches what the shape cannot see the provenance of:
   a value that was computed from the wall clock and then frozen still moves
   with the calendar.

The shape alone is not enough and the guard alone is not enough. Both, or
the mistake comes back.

## Injection, concretely

```ts
// src/deps.ts
export type AppDeps = {
  db: Database;
  ai: AiClient;
  /** Production leaves this out and gets the real clock. */
  now?: () => Date;
};

// src/app.ts
export function buildApp(deps: AppDeps) {
  const now = deps.now ?? (() => new Date());   // the documented default
  // ... every time read in this app goes through `now()`
}
```

```ts
// test/support/fixed-instant.ts
/** A fixed point in time, with no path back to the wall clock. */
export function fixedInstant(iso: string): () => Date {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) throw new Error(`fixedInstant: bad date ${iso}`);
  return () => new Date(ms);
}
```

A test then builds the app with `now: fixedInstant("2026-03-01T12:00:00Z")`
and every date the flow produces is the same on every machine, every day.

## The guard

Scoped to the **whole** test tree, from the first day. A helper one folder
outside the checked area that reads the real clock and is imported in leaks
silently — which is exactly what a one-folder scope lets through. In one
codebase the first, narrowly-scoped version of this guard was followed by a
second pass that found more than a hundred further bare reads across dozens
of files, all of them behind that scope.

ESLint flat config:

```js
{
  files: ["test/**/*.ts"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "NewExpression[callee.name='Date'][arguments.length=0]",
        message:
          "new Date() reads the real wall clock, so this test's result depends on the machine and the day it runs on. Pass a fixed instant (test/support/fixed-instant.ts) into the code under test. Genuinely need the real clock, because the database or a spawned process stamped the value? Add a named helper to test/support/real-clock.ts and import it.",
      },
      {
        selector:
          "CallExpression[callee.object.name='Date'][callee.property.name='now']",
        message:
          "Date.now() reads the real wall clock — same hazard as new Date(). Pass a fixed instant, or performance.now() if you are measuring elapsed time rather than asking what day it is. Genuinely need the real clock? Add a named helper to test/support/real-clock.ts.",
      },
    ],
  },
}
```

The message does three jobs: it names the consequence, it gives the fix by
file path, and it names the one escape hatch. A message that only says
"forbidden" sends the reader straight to a disable comment.

What the selectors deliberately miss: a date **with an argument**
(`new Date("2026-03-01T12:00:00Z")`) and a monotonic elapsed-time read
(`performance.now()`). Both are allowed, and both are the intended
replacements.

Other languages: the same guard exists as a lint rule or a grep in CI — a
Python project bans bare `datetime.now()` and `time.time()` under its test
folder and injects a clock callable; a Go project passes a `func() time.Time`.
The mechanism differs, the rule does not.

## The one legitimate exception, and how to contain it

A value **the test cannot inject a clock into**. There are exactly three
kinds, and nobody anticipates them:

- A column the **database stamps itself** (`default now()`), or a comparison
  the database performs against **its own** clock inside the query. No clock
  a test injects reaches the database process, and faking the machine's
  clock does not reach a container's clock either.
- A value stamped by a **separately spawned process** whose clock is not
  injectable.
- A value a piece of **production code reads directly** with no injected
  parameter at all — a real gap, worth fixing in production rather than
  working around, but real until it is fixed.

Contain every one of them in a single module. One file in the test tree
holds every real-clock helper, each named for its reason, carrying the only
lint-disable comments under the test tree:

```ts
// test/support/real-clock.ts
/**
 * The ONE sanctioned place in the test tree for a real-clock read. Every
 * genuine exception lives here as a named helper carrying its reason, so
 * the count of exceptions is one search of one file.
 */

/**
 * `requests.created_at` is stamped by the database itself (`default now()`),
 * from a clock no test can inject. A row placed relative to that stamp has
 * to be placed relative to the same real clock.
 *
 * Used by: test/intake/store.test.ts.
 */
export function dbRelativeNow(offsetMs = 0): Date {
  // eslint-disable-next-line no-restricted-syntax -- the sanctioned read; see above.
  return new Date(Date.now() + offsetMs);
}
```

Three properties make the containment work — not the file's existence:

- **The name carries the reason.** A reader at the call site knows why it is
  allowed.
- **The doc comment names the uninjectable stamp and lists the callers.**
  When that stamp becomes injectable, the helper is deletable by following
  the list.
- **The count of exceptions is one search of one file.** In a real codebase
  this module holds under ten helpers for a migration that touched dozens of
  files — the whole exception budget, on one screen.

**A real-clock exception keeps a generous margin.** Half a window, not a few
milliseconds. A margin of milliseconds is a flake wearing the exception's
clothes.

## Migrating a project that already has hundreds of these

### Find the sites

```sh
# Total, comment lines excluded
grep -rnE 'new Date\(\)|Date\.now\(\)' test/ --include='*.ts' \
  | grep -vE ':[0-9]+: *\*' | wc -l

# Per file, worst first — this is the work queue
grep -rlE 'new Date\(\)|Date\.now\(\)' test/ --include='*.ts' \
  | while read -r f; do
      printf '%4d %s\n' "$(grep -cE 'new Date\(\)|Date\.now\(\)' "$f")" "$f"
    done | sort -rn

# Elapsed-time reads: these become performance.now() and need no exception
grep -rnE 'Date\.now\(\)' test/ --include='*.ts' \
  | grep -iE 'deadline|elapsed|latency|timeout|started'
```

### Four categories, one rule each

| Category | Looks like | Rewrite |
|---|---|---|
| A structural seed stamp, never compared against anything | `createdAt: new Date()` in a fixture | one named constant per seed file, far from every date any test compares against |
| A window value an engine compares against its own `now` | `expiresAt: new Date(Date.now() - 1000)` | derive it from the test's own fixed instant, which is also injected into the engine. Keep the offset on the same side of `now` it is on today |
| An elapsed-time measurement | `const deadline = Date.now() + timeoutMs` | `performance.now()` — monotonic, not a calendar read, needs no exception |
| A genuinely uninjectable stamp | the database's own `default now()`, a spawned process | a named helper in the sanctioned module |

The window-value row is the live hazard and the only one where
search-and-replace is wrong. Read each of those by hand.

### Three rules for the migration itself

- **Sites first, scope last — the scope is the proof.** A lint run that
  passes with the guard covering the whole test tree is the only evidence
  every site is gone.
- **No per-site disables.** A disable comment added to make lint pass is a
  failed migration, not a workaround. A genuine need goes into the
  sanctioned module as a named helper.
- **An expected value is never quietly re-baselined.** A test that only
  passes after its expected number was changed was silently depending on
  today's date. Report it as its own finding, with file and line. This is
  the one rule that cannot be mechanised and the one that catches real
  product bugs.

### Prove date independence

Run the suite with the machine's clock faked, far in the past and far in the
future, and compare the pass count:

```sh
faketime '1999-01-01 00:00:00' npm test
faketime '2099-12-31 23:00:00' npm test
```

Same pass count both times as the unfaked run. Note what this does **not**
reach: a database running in a container keeps its own clock, which is
precisely why the database-stamped exception above exists. If the tool
cannot hook your runtime on your machine, report that criterion as
unverifiable rather than skipping it silently.

## The failure this prevents, as it actually happens

A test anchored its data to the real wall clock, truncated to the hour.
Elsewhere in the same product a business rule refused writes outside working
hours. Nothing was wrong with either piece. The result was that every
assertion in that test failed between late evening and early morning local
time, so a developer pushing at night was blocked by a test rather than by a
bug — and the same suite was green the next morning, which is the worst
possible evidence for finding the cause.

The tell for a real time flake: **the assertion is on a date, a duration or
a window, and the failure moves with the calendar or with machine speed.**
If it does not move with either, the cause is one of the other four traps —
see `traps.md`.
