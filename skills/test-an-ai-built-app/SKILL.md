---
name: test-an-ai-built-app
description: >-
  Put a working test suite on an app built with AI that now breaks whenever
  it is touched, starting from zero tests. Reads the project's real state
  first (stack, any runner, where the database is, where the model is
  called), then a fixed order: make a suite exist and go green, open one
  dependency seam, fake exactly one thing — the model call — behind a real
  client and a scripted fake that throws on an unscripted call, give every
  run its own real disposable database created and dropped by the run, write
  the first end-to-end test on one real flow, and start the run so it cannot
  lie. Carries the clock rule, the five failure modes that make a run look
  green while proving nothing, and what a phone app cannot prove without a
  device. Trigger on "add tests", "it breaks every time I change
  something", "my app has no tests", "mock the database", "test the AI
  part", "flaky test", "passes locally fails in CI", "test my React Native
  or Flutter app". Not for load or security testing, and not for judging a
  prompt's answers.
metadata:
  version: "1.0.0"
  last-walked: "2026-11-26"
---

# test-an-ai-built-app

Before anything else, every reply that starts a session, and every reply to
a user who jumps straight to a step, begins with one line:

`Test mode: running — I can run commands in this project`
or
`Test mode: narrating — no shell is attached; I will give you each command to paste and tell you what its output should say`

Say it even when the user already said which it is. Every step's output
block below opens with that same line. A step whose output does not open
with it is not done, even if the step's work happened.

**Literally first.** The first characters of the reply are `Test mode:`.
Nothing precedes them — no greeting, no "sure", no sentence reacting to a
tool that was unavailable or denied, no restatement of the question. If the
first thing you have to report is an obstacle (commands need approval one at
a time, there is no shell, a tool is missing), that obstacle *is* the mode:
mode line first, obstacle second. A reply that explains the obstacle and
leaves the person to work out which mode they are in has failed this rule
even if everything after it is correct.

Derived from a private working skill. Last walked through the real
procedure on production codebases on 2026-11-26. Languages, runners and
database tools change; this file does not promise to keep up. If a step no
longer matches what you see, open an issue:
https://github.com/Alexgub84/claude-skills/issues

## Who this is for, and what it costs

An app that works. Nobody wrote a test for it. Every change fixes one thing
and breaks another, and you find out from a person using it.

A test is a small program that runs your app the way a person would and then
asks one question with a yes or no answer: after this, is the record in the
database? does the page show that number? The run tells you which questions
answered no. That is the whole idea. Everything below is about making those
questions honest.

This procedure ends with one command that exercises one real flow of your
app against a real database, with exactly one thing faked, and fails when
the flow breaks. That is a floor, not a finished suite — but it is the floor
every later test stands on, and the first one is the only one that is hard.

Budget: one working session for Steps 1 to 4 on a small app, and a second
for Steps 5 to 8. If a step is taking much longer than that, the cause is
almost always the project's own shape (no seam anywhere, a database only
reachable in production), and the step that names it is Step 1.

## Test mode

Two ways to run this skill, chosen by what is actually attached to the
session — nothing to configure:

- **A shell is attached** and can run commands in this project. Run the
  commands yourself, read their real output, and quote the part that
  matters back to the user. Never report a command's result you did not
  run.
- **No shell is attached** — for example this skill uploaded into a chat
  with nothing else connected, or a session where every command needs
  approval one at a time. Then give the user one command at a time, say what
  its output should look like, and wait for them to paste back what they
  actually got before moving on. Do not continue past a step whose output
  you have not seen.

A session where commands exist but each needs approval is **narrating** for
the purpose of this line — announce narrating, offer to switch to running if
they would rather approve as you go, and never spend the first reply asking
which it is instead of saying one.

The first line of the first reply states which mode is active, before
anything else.

### The human does these, and nothing else

Everything in this procedure is work the agent does, with one short list of
exceptions:

- **A secret.** An API key, a database password, a token. The agent never
  invents one, never reads one out, and never writes one into a file that is
  committed.
- **A password prompt.** Installing system software, starting a container
  engine, anything that asks for the machine's own password.
- **Payment.** A paid plan for a model provider or a hosted database.
- **A physical device.** Plugging a phone in, unlocking it, trusting the
  computer (Step 10 only).

Nothing else is human-only. A file the user put somewhere reachable, a
command that needs no password, a config the agent can read — the agent does
those itself rather than handing them back.

## The shape, before the steps

Three rules decide everything below. They come from codebases that run this
way in production, not from a preference.

1. **The database is never faked.** Every run uses a real database of the
   same engine production uses, created and dropped by the run itself. A
   fake database agrees with whatever your code does, which is the one thing
   a test must not do.
2. **Exactly one thing is faked: the model call.** One narrow interface, a
   real client on one side, a scripted fake on the other. The fake throws on
   a call nobody scripted instead of guessing an answer.
3. **Everything else is real.** The real router, the real validation, the
   real queries, the real business rules. The clock is injected rather than
   faked (Step 9), because a wall-clock read is the one remaining thing that
   makes a test depend on the machine it runs on.

If you only remember one thing: a test that passes because something was
faked is worse than no test, because it is believed.

## Step 1 — Write down the project's real state

Change nothing. Read. The answer to every question below is written down
before any file is created, because every later step branches on it.

1. **What runs this app?** The language, the package manager, and the one
   command that starts it today. Read it off the project's own manifest and
   its readme, not from the stack's conventions.
2. **Is there any test runner already?** A test dependency, a config file, a
   `test` script, a folder named for tests, a CI workflow. An abandoned
   half-configured runner is common in an AI-built project and is worth
   reusing rather than replacing.
3. **Where does data live?** Which engine, where the connection string comes
   from, whether migrations exist as committed files, and what command
   applies them. If data lives only in a hosted database with no local
   option, say so now — that is the single biggest cost in this procedure
   and Step 6 addresses it.
4. **Where is the model called?** Search the whole project for the provider's
   package name and for the call itself. Write down every call site. A model
   call pasted inline in a request handler is the normal finding, not a
   surprise.
5. **What outside services does it touch besides the model?** Email, text
   messages, push notifications, payment, file storage, a calendar. List
   them; Step 4 decides what happens to each.
6. **What is the one flow this app exists for?** In one sentence, in the
   user's own words, with the person doing it named: "a customer types a
   request and gets a confirmation with a number on it."
7. **What broke most recently?** The actual last complaint. That flow is
   almost always the right first test.

Also read, in this order, and quote what you find rather than paraphrasing
it: the project's own instructions file for an agent if it has one, its
readme, and its CI workflow.

**Name the hazards you just read, now, in one line each** — do not wait
until the step that fixes them. The usual four in an AI-built project, all
of them visible from Step 1's reading alone:

- A test connection string that **falls back** to the development one (Step
  6 refuses this).
- A rule computed from a **direct clock read** — anything using the hour,
  the day or "now" to decide an outcome (Step 9).
- A model client **created inside a request handler**, so nothing can get
  between them (Step 4).
- A readme or a CI file that **claims** tests exist when none do. Say the
  document is wrong; never imply the user deleted something.

**Output block**

    Test mode: <running|narrating>
    Stack: <language, package manager, start command>
    Test runner today: <none | name, config file, command>
    Data: <engine, where the URL comes from, migrations yes/no, apply command>
    Model call sites: <file:line, one per line, or "none">
    Other outside services: <list or "none">
    The one flow: <one sentence>
    Last thing that broke: <one sentence>
    Hazards already visible: <one line each, or "none">
    Biggest obstacle for this project: <one sentence>

Done when: that block is filled in with no blanks and nothing invented. A
question you could not answer is written as "could not establish, because
…", never guessed.

## Step 2 — Decide what the first test will and will not contain

One flow, from Step 1's answer 6. Now draw its edges.

**In the test.** The flow as a person performs it, from the outermost edge
your code owns to the result that outlasts the request:

- The real entry point: an HTTP request to the real route, or the real
  function a button calls. Not an internal helper three layers in.
- The real validation, the real rules, the real queries.
- An assertion on something a person could observe: the response the caller
  gets, and the row that is now in the database. Assert on both; a response
  that says "saved" while nothing was written is exactly the bug this
  catches.

**Not in the test.**

- **The model's wording.** Whether the answer is good is a different
  question, with a different suite, named at the end of this file. This test
  proves the plumbing around the model works.
- **Anyone else's network.** No real provider call, no real email sent, no
  real payment. A test that needs the internet fails for reasons that are
  not your code.
- **Pixels.** How a screen looks is a separate tier (Step 10), not part of a
  flow test.
- **Every branch of every function.** Those are unit tests, cheap and
  valuable and not the thing missing today. The flow test is what catches
  "a change three files away broke the one thing the app is for".
- **Speed.** How long something takes is a different measurement and a
  famous source of tests that fail on a slow machine.

**One assertion rule.** Assert on observable state — the response, the
stored row, what the screen shows. The one legitimate exception is asserting
that the fake was asked the right thing: that the model was given the
customer's actual text, at the expected temperature, once and not twice.
That is a real behaviour of your code, and Step 5's fake records it for
exactly this.

**Output block**

    Test mode: <running|narrating>
    Flow under test: <one sentence>
    Entry point: <the real route or function>
    Assertions: <the response fact> and <the stored row fact>
    Explicitly out: <what this test will not cover>

Done when: the user agrees that if this test passes, the flow works, and
that if the flow breaks, this test fails.

## Step 3 — Make a suite exist, and watch it go green

Before anything hard. A reader with no tests needs to see the machinery run
once on something that cannot fail for an interesting reason.

1. Install the runner for your language — the one your stack's community
   actually uses, and the one already half-configured in the project if Step
   1 found one. Pin the exact version; no range.
2. Create the test folder and one file in it with one test that asserts
   something trivially true.
3. Add one script to the project's manifest, named `test`, that runs the
   runner. From here on, `test` is the only command anyone types. Every
   later step changes what that one command does, never what it is called.
4. Run it. Watch it pass.
5. Now break it on purpose — change the assertion to something false — and
   run it again. Watch it fail, and read the failure. A reader who has never
   seen a test fail does not yet know what the output means.
6. Put it back.

**Output block**

    Test mode: <running|narrating>
    Runner: <name, exact pinned version>
    Command: <the exact command the user now types>
    Pass output: <the runner's own summary line, quoted>
    Fail output: <the same line when it failed, quoted>

Done when: the user has seen their own project print a passing run and a
failing run, and knows which line of output to look at.

## Step 4 — Open one seam, so one thing can be swapped

A test can only replace something the code was built to accept. Today the
model call is probably created where it is used, and nothing can get between
them. That is the gap to close, and the shape to close it with is a plain
object — not a framework, not a container, not a global.

**The shape.** One type listing everything the app reaches outside itself,
one function that takes it and builds the app:

```ts
// src/deps.ts
export type AppDeps = {
  /** The database handle. Always real — see Step 6. */
  db: Database;
  /** The one faked thing — see Step 5. */
  ai: AiClient;
  /** Reads the current time. Tests pass a fixed instant — see Step 9. */
  now?: () => Date;
  /** Sends a message to a person. Tests pass a recorder. */
  notifier?: Notifier;
};

// src/app.ts
export function buildApp(deps: AppDeps) { /* routes, handlers, rules */ }
```

Five rules, and the whole value is in them:

1. **Production composes the real ones, once, in the entry file.** The
   factory that builds a real client never has a code path that builds a
   fake. A `provider: "fake"` setting readable in production is how a fake
   reaches a customer; the config schema should refuse that value outright.
2. **The fake is reachable only through this object.** Never a global mock,
   never a replaced module import, never an environment variable the app
   reads for itself. If a test has to reach inside a module to replace
   something, the seam is missing — add the field, do not reach in.
3. **Optional fields get a documented production default and a documented
   test substitute.** `buildApp` fills what a test left out with something
   safe and silent, so a test that does not care about notifications does
   not have to mention them.
4. **A capability that is absent behaves honestly.** If the model client is
   not provided at all, the route that needs it answers "unavailable" — it
   does not pretend to work. That makes "this route touches no model" a
   thing a test can prove by passing nothing.
5. **The type is the whole framework.** No dependency-injection library.
   The list of fields on that one type is also the list of everything your
   app can be blamed for reaching.

Move the model call out of the handler and behind the `ai` field. Nothing
else changes in this step. Run the suite; it still passes.

**Output block**

    Test mode: <running|narrating>
    Seam file: <path to the deps type>
    Fields: <one line each, with its production default>
    Call sites moved: <file:line, one per line>
    Suite after this change: <the runner's summary line, quoted>

Done when: the app still runs, the suite still passes, and no handler
creates its own model client.

## Step 5 — Fake exactly one thing: the model

Read `reference/model-port.md` for the full code of all three files. The
rules it implements:

- **One narrow interface, one method**, shaped like a structured call: in
  goes a system prompt, a user prompt, and a schema for the answer; out
  comes an object of that shape. No free-form chat method. A port with a
  `chat()` on it cannot be scripted, because its answer has no shape.
- **The schema is a plain JSON schema**, written by hand through the model
  SDK's own schema helper — not a validation-library object handed straight
  to the model call. Providers require an object at the schema root and some
  validation libraries omit it, which fails at the provider with a confusing
  message about a missing field.
- **The real client sets the boring defaults**: temperature at zero and a
  few retries, both overridable per call. Zero temperature is not what makes
  the test deterministic — the fake is — but it makes production's own
  behaviour repeatable, which is worth having anyway.
- **The fake is scripted by the test, in call order**, and records every
  request it was given so the test can assert what was asked.
- **An unscripted call throws.** This is the single most important line in
  the file. A fake that returns a plausible default when nobody scripted an
  answer turns a missing script into a passing test, and the test then
  proves nothing while looking green forever. The error names which call it
  was and what the call was for.
- **A separately spawned process gets a script file.** When the code under
  test runs as its own process, it shares no memory with the test, so the
  queue cannot be pushed into it. The fake then reads its script from a JSON
  file whose path comes from config, and appends every call it served to a
  log file beside it, so the test can read back what was asked.

Then write the test that proves the seam: call the flow with one scripted
answer, assert the stored result matches it, and assert the fake was given
the user's real text. Then write a second test with **no** answer scripted
and assert the call throws — that is the test that keeps rule five alive
after someone "helpfully" gives the fake a default.

A hand-written HTTP client instead of a model SDK is equally fine. The
real-and-fake pair behind one interface is the part that matters; the
library is not.

**Output block**

    Test mode: <running|narrating>
    Port: <path> — <method signature>
    Real client: <path> — <provider, temperature, retries>
    Fake: <path> — throws on unscripted call: yes
    Tests added: <names>
    Suite: <the runner's summary line, quoted>

Done when: the flow test passes with a scripted answer, and the unscripted
call test proves the fake refuses to guess.

## Step 6 — Give every run its own real database

Read `reference/disposable-database.md` for the full lifecycle script,
including the variant for a project whose database is a single file.

Never fake the database. The schema, the constraints, the transactions and
the queries are among the most likely things to be wrong in an AI-built app,
and they are precisely the things a fake database cannot be wrong about.
Replacing it with an in-memory stand-in deletes the test's ability to find
the bug you have.

The lifecycle, run by the suite itself, every time:

1. **Refuse to start without an explicit test connection string.** No
   falling back to the development one. These tests empty tables; pointing
   them at real data must not be possible by accident. The error names the
   variable and where to set it.
2. **Drop a database of this run's own name, if one is there.** A run killed
   half way leaves exactly one behind, and the next run removes it before
   doing anything else. Terminate other sessions connected to it in the same
   statement, or a connection left by that killed run blocks the drop
   forever.
3. **Create it.**
4. **Apply the committed migrations** — the real ones, the same files
   production uses. Not a schema dumped from somewhere; the migrations are
   part of what is under test.
5. **Run the tests** with the connection string pointing at that database,
   and print its name as the first line of the run so the reader can see
   which database their results came from.
6. **Drop it again, pass or fail.**

**Naming, and why it matters.** Two good answers, pick one:

- **One name per checkout**, derived from the checkout's own path, so two
  copies of the project on one machine can never compute the same name. A
  killed run leaves exactly one leftover and the next run overwrites it.
  This is the right default when a person works from more than one copy of
  the repository at a time.
- **A unique name per run** (a timestamp and a few random characters),
  dropped by the run's own teardown, plus a sweep at the start of the next
  run for anything of that shape older than an hour. The right default for a
  single checkout.

What not to do on day one: a template database cloned per test file. It is a
real technique and it is how a large suite stays fast, but it is a lot of
database machinery for a project whose first test was written this week.
Come back to it when the suite is slow enough that you can name the number
of seconds it costs.

**Between tests.** Empty every table between test files. While the suite is
small, run test files one at a time; a suite of ten files does not need
parallelism and parallel files sharing one database is Trap 3 in
`reference/traps.md`.

**Output block**

    Test mode: <running|narrating>
    Engine: <name and version, matching production>
    Test connection variable: <name>
    Database name scheme: <per-checkout | per-run>
    Lifecycle script: <path>
    First line of a run: <the database name line, quoted>
    Suite: <the runner's summary line, quoted>

Done when: a run creates its own database, prints its name, passes, and the
database is gone afterwards — and a second run started while the first is
still going does not touch the first one's data.

## Step 7 — Write the first end-to-end test, failing first

Now the real one, on the flow from Step 2.

1. **Write the assertion before the test passes.** Write the whole test and
   run it. If it passes on the first run, be suspicious: either the flow
   already works and the test proves nothing new yet, or the test is
   asserting something that cannot fail.
2. **Prove it can fail.** Break the flow deliberately — comment out the line
   that writes the row — and run again. The test must fail, and its failure
   message must name what was missing. Put the line back. A test nobody has
   seen fail is not yet a test.
3. **Drive it from the outside.** Build the app with the real database and
   the fake model client through `buildApp`, send the real request, read the
   real response, then query the database directly and assert on the row.
4. **Keep the flow's own data out of other tests.** One test, its own rows,
   created by itself with names that could not collide (a per-test prefix is
   enough).
5. **Name the test after the flow in a person's words**, not after the
   function it calls. `a customer request is stored with a confirmation
   number` survives a refactor; `handleSubmit returns 201` does not.

Then do it once more for the flow that broke most recently, from Step 1's
answer 7. Two flow tests is the point at which the suite starts paying.

**Output block**

    Test mode: <running|narrating>
    Test file: <path>
    Test name: <the sentence>
    Proof it can fail: <what was broken, and the failure message, quoted>
    Suite: <the runner's summary line, quoted>

Done when: the test passes with the flow intact, fails with the flow broken,
and the user has seen both.

## Step 8 — Start the run so it cannot lie

One command. `test`, from Step 3. What it has to do now:

- **Start its own server, and only talk to that one.** If the suite boots the
  app over HTTP, it must never attach to a server that was already running.
  This is the trap that produces a passing run on code that cannot pass —
  see Trap 1.
- **Fail loudly on a busy port rather than retrying on another.** A silent
  retry is how a run ends up asserting against the wrong copy of the code.
  If the port is taken, the run stops, names the port, and runs zero tests.
- **Derive the port from the checkout, not a constant.** A hash of the
  checkout's own path into a range of several hundred ports gives two copies
  of the project two different servers. A fixed port plus "reuse whatever is
  there" is the exact recipe for Trap 1.
- **Run the built app, not the development server, for the end-to-end
  tier**, if those differ in your stack. The development server forgives
  things production does not.
- **Take a lock when the suite starts a shared resource.** If the suite
  starts containers, two suites at once on one machine starve the container
  engine and produce boot timeouts that look exactly like real failures. One
  lock, in the machine's temp directory, taken on *every* path that can start
  the suite — the hand-typed command as well as any git hook — and a refusal
  message that names the other run. A lock only the hook takes is no lock.
- **Print, as the first lines of the run**, the database it created and the
  port it bound. Those two lines are how a reader tells a real pass from
  Trap 1.

Then read `reference/traps.md` with the user, once, properly. It carries
five failure modes with the symptom first:

1. The run attached to a server something else started.
2. Two copies of the project collided on one port or one database.
3. A test that passes alone and fails in a full run.
4. A test that fails at a particular time of day.
5. A native build breaking a run that changed no code.

A reader who hits one of these without recognising it concludes that testing
does not work. That is the whole reason this file ships with that reference.

**Output block**

    Test mode: <running|narrating>
    Command: <the one command>
    Server: <starts its own | no server needed>
    Port scheme: <derived from checkout | not applicable>
    Reuses an existing server: no
    Lock: <path, or "not needed — the suite starts nothing shared">
    First lines of a run: <quoted>

Done when: the command passes from a cold machine, and a second run started
while the first is going either fails immediately with a clear reason or
runs completely independently — never quietly joins it.

## Step 9 — The clock

One rule, and it is the cause of Trap 4:

**Production code takes its clock as an injected dependency. A test passes a
fixed instant. No test reads the real clock.**

`reference/clock-and-time.md` carries the enforcement: the lint rule that
bans a bare current-time read across the whole test tree, the one sanctioned
module where a genuinely uninjectable time read is allowed to live, and how
to migrate a project that already has hundreds of them. Read it when writing
or fixing any test that touches a date, and when a test fails on one machine
and passes on another.

Two things from it that belong here, because they are the ones a reader gets
wrong:

- The guard covers the **whole** test tree, not the folder where the problem
  was found. A helper one folder outside the checked area that reads the
  real clock and is imported in leaks silently.
- The exception is real but narrow: a value **the test cannot inject a clock
  into** — a column the database stamps itself, a comparison the database
  performs against its own clock inside the query, or a value stamped by a
  separately spawned process. No injected clock reaches inside the database
  process, and faking the machine's clock does not reach a container's
  clock either. Every such case goes in one module, as one named function
  whose name says why, so the count of exceptions is one search of one file.

**Output block**

    Test mode: <running|narrating>
    Clock injected as: <field name on the deps type>
    Fixed instant helper: <path>
    Guard: <lint rule in place: yes/no, scope>
    Sanctioned exceptions: <count, and the file they live in>

Done when: no test reads the current time, and the suite's pass count does
not change when the machine's clock is moved years in either direction.

## Step 10 — If there is a phone app too

Short and honest. Read `reference/phone-app.md` before doing any of it.

The same two ideas carry over unchanged: a **real** local data layer, and
**one** faked outside call. What changes is that there are three tiers
instead of one, and that the tool for the top tier depends on your toolkit
and is not portable between them.

1. **Logic and screen tests on the computer**, no device involved. This is
   where most of the value is and where the two ideas above apply exactly as
   on the server. Run the data layer for real — the same embedded engine the
   app ships with — not against a stand-in.
2. **A screenshot tier**, if your toolkit has one: an image per screen,
   compared pixel for pixel against a committed copy. Worth its cost
   specifically for a layout that must work in two text directions, where a
   change that looks fine in one language silently breaks the other.
3. **A device tier**, driving the real app on an emulator or a real phone.
   The tool is toolkit-specific: one for a Dart/Flutter app, a different one
   for a React Native or Expo app. Pick the one for your stack;
   `reference/phone-app.md` names both and what each flow file actually
   looks like. Do not copy the other one's shape.

**What no automated tier catches, stated plainly** — this is the part most
skills leave out:

- Whether a camera, microphone or sensor behaves like the real thing. A
  simulator's camera is a picture of a camera.
- Whether a push notification actually arrives on a real phone.
- How the app behaves on a real radio going away — airplane mode, a lift, a
  tunnel — as opposed to a mocked offline flag.
- How it behaves during store review, on hardware and an account you do not
  control.
- Whether a person can find the button. A screen can be present, correct and
  unusable.

The honest consequence: a mature suite still keeps one hands-on pass before
a release — an ordered, written walk through every role on a real device, in
every language the app ships, by a person. Not because the automated tiers
are weak, but because features kept passing every check and then breaking in
the operator's hands: a missing button, a screen nobody opened in that role,
a flow that worked in one language and not the other. Write that walk down
as a numbered list in the repository and keep it; a release checklist that
lives in someone's memory is not one.

**Output block**

    Test mode: <running|narrating>
    Toolkit: <name>
    Tier 1 runner: <name, command>
    Tier 2 screenshots: <in place | skipped, and why>
    Tier 3 device tool: <name, command> | <deferred>
    Hands-on pass: <path to the written walk>

Done when: tier 1 runs and passes on the user's machine, and the user can
say in their own words which of the five unprovable things above applies to
their app.

## Step 11 — Hand back

State, in plain words:

- The one command, and what passing looks like.
- The flows now covered, named as sentences.
- The one thing that is faked, and the one place it is swapped.
- The database the run creates and drops, and the variable that points at
  it.
- What is deliberately not covered yet, and which of Step 2's exclusions
  were deliberate.
- The next two flows worth a test, in order, with the reason.

Then one sentence on the suite that is **not** this one: whether the model's
answers are any good is a separate question, with its own tests, its own
config, its own command, run by hand against the real provider with real
credentials, and never part of this suite or of CI. Mixing the two produces
a run that fails because a prompt got worse, which teaches a team to ignore
a red run. Keep them apart from the first day; name the distinction now,
build it later.

## Reference

- `reference/model-port.md` — the interface, the real client, and the
  scripted fake, in full, with the two tests that keep them honest.
- `reference/disposable-database.md` — the create/migrate/run/drop
  lifecycle, both naming schemes, the single-file-database variant, and the
  refusals.
- `reference/clock-and-time.md` — the clock rule, the lint guard, the one
  sanctioned exception module, and the migration recipe for a project that
  already has hundreds of real-clock reads.
- `reference/traps.md` — five failure modes, symptom first: a reused server,
  a port or database collision between copies of the project, a test that
  passes alone and fails in a full run, a test that fails at a particular
  time of day, and a native build breaking a run that changed no code.
- `reference/phone-app.md` — the three tiers, the two toolkit-specific device
  tools, and the honest limits.

## Changelog

- 2026-11-26: first public version.
