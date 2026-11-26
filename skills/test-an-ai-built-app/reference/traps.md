# Five ways a run looks green and proves nothing

Last reviewed: 2026-11-26

Read this with the user once, properly, when the suite first runs. Every one
of these has happened in production codebases, more than once, and every one
of them is survivable only if it is recognised. A reader who hits one of
these without recognising it concludes that testing does not work — which is
the real cost, far bigger than the hour lost.

Each trap below is written symptom first, because the symptom is what you
will have.

---

## Trap 1 — The run attached to a server something else started

**Symptom.** The tests assert behaviour that is not in your code. A change
you just made has no effect on the result. A branch that cannot possibly
pass, passes. Or the reverse: a test fails on an assertion about a feature
you can see working in the browser.

**What it actually is.** The suite boots the app over HTTP on a fixed port,
and is configured to reuse a server already listening there. Another copy of
the project — another checkout, another worktree, a development server
someone left running yesterday — owns that port. Every request the suite
makes goes to that other code. The run is honest about what it found; what
it found is not yours.

**Fix.**

- The suite **starts its own server and talks only to that one.** Whatever
  your runner calls the "reuse an existing server" option, turn it off.
- **Derive the port from the checkout**, not from a constant: a hash of the
  checkout's own absolute path into a range of several hundred ports. Two
  copies of the project then get two servers and cannot meet.
- **Fail loudly on a busy port.** If the derived port is taken, the run
  stops, names the port, and executes zero tests. Do **not** add a fallback
  that retries on another port — a silent fallback is the same hazard
  wearing a helpful face.

```ts
// playwright.config.ts (the same idea applies to any runner that boots a server)
const root = execSync("git rev-parse --show-toplevel").toString().trim();
const PORT = 4400 + (createHash("sha256").update(root).digest().readUInt32BE(0) % 1000);

export default defineConfig({
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Never attach to a server this run did not start.
    reuseExistingServer: false,
  },
});
```

**How it went wrong in practice.** A first version of this used a hundred
ports. It collided about one run in a hundred, which sounds survivable until
several copies of the project are active on the same day — then two of them
land on the same port, one attaches to the other's server, and both report
results for the wrong code. The range was widened tenfold and the reuse
option turned off.

**How to prove it is fixed.** Change a visible string in the app. Run the
suite. The test must see the new string. If it does not, you are still
talking to someone else's server.

---

## Trap 2 — Two copies of the project collided on one shared thing

**Symptom.** A different set of tests fails on each of two runs of
**identical** code. Or: a test fails only when a colleague is also running
the suite. Or: a migration you have never written is already applied in the
test database.

**What it actually is.** Something the run assumes is private is shared. The
three usual candidates:

- **One physical test database** for every copy of the project. Migrations
  are applied additively, so a branch that adds one silently applies it to
  every other branch's runs for as long as that database lives. And two runs
  at once simply interfere — rows appearing and disappearing under each
  other, producing a different failure list each time.
- **One port**, which is Trap 1.
- **One container engine.** If every test file starts its own container, two
  full suites at once starve it, and container boot timeouts look exactly
  like real test failures. In one codebase a run went from hundreds passing
  to a dozen failing, then a different dozen, with zero actual assertion
  failures in any of it.

**Fix.**

- Database: a name private to the checkout, or private to the run. Both
  schemes are in `disposable-database.md`.
- Port: derived per checkout, as in Trap 1.
- A genuinely machine-wide resource: **one lock**, in the machine's temp
  directory, taken on **every** path that can start the suite. The lock
  stores the other run's process id and branch, breaks itself when that
  process is gone, and refuses with a message naming the other run.

**The subtlety that costs an afternoon.** A lock taken only by a git hook is
not a lock. A suite started by hand never goes through the hook, so it never
takes the lock, and it races a hook-triggered run happily — which is exactly
how this was found. Move the lock into the thing both paths call.

**How to prove it is fixed.** Start the suite in two copies of the project
at the same time. Either both pass independently, or the second refuses
immediately and names the first. Anything else — especially both passing
with odd timings — means they are still sharing something.

---

## Trap 3 — Passes alone, fails in a full run

**Symptom.** Run the one test: green. Run the suite: that test fails. Run
the suite with the files in a different order: a different test fails.
Nothing about the failure mentions time or the network.

**What it actually is.** State crossing from one test to the next. A row an
earlier test left behind that this test's count assertion now includes; a
module-level variable or cache the first test warmed; a sequence that
restarts at a different number; files in a temp folder; an environment
variable one test set.

**Fix.**

- **Empty every table between test files**, from a list read out of the
  database rather than kept in code (`disposable-database.md`).
- **Run test files one at a time** while the suite is small. Every runner has
  a flag. Parallel files sharing one database is the single most common cause
  of this trap, and parallelism buys nothing on a suite of ten files.
- **Each test creates the data it asserts on**, with names that could not
  collide — a per-test prefix is enough — and asserts on *its own* rows, not
  on a total count of the table.
- **Never depend on a test's own cleanup to protect the next test.** A crash
  skips it. Cleanup belongs in the harness that runs before each file, not
  at the end of the one that made the mess.

**How to prove it is fixed.** Run the suite twice in a row without
restarting anything, and run it once with the file order reversed. Same
result all three times.

---

## Trap 4 — Fails at a particular time of day

**Symptom.** A push blocked at eleven at night; the same code green at nine
in the morning. Or a test that fails on the first of the month, or on one
machine whose timezone differs, or only when the suite is slow.

**What it actually is.** A test anchored to the real wall clock meeting a
rule that depends on the clock. The rule is correct, the test is correct,
and together they are a trap: the test's data lands outside the window the
rule allows, so the rule refuses, so every assertion fails — for hours, then
stops.

**Fix.** The whole of `clock-and-time.md`: production takes an injected
clock, the test passes a fixed instant, a lint rule bans a bare current-time
read across the whole test tree, and the few genuinely uninjectable reads
live in one module as named helpers.

**How to prove it is fixed.** Run the suite with the machine's clock faked
far in the past and far in the future. Same pass count both times.

**What this is not.** If the failure does not move with the calendar or with
machine speed, it is not a time flake even if it feels like one. Two
lookalikes:

- **Container contention** — the failure is on container start or a
  connection timeout, not on an assertion. That is Trap 2.
- **A read-then-write race** — two callers both read the same stale count and
  both decide "allowed"; the failure is an assertion on a count or a
  duplicate row, and it moves with concurrency, not with the clock. The fix
  is to count, decide and write in one transaction behind a lock on the
  record, not to touch the test.

---

## Trap 5 — A native build broke a run that changed no code

**Symptom.** A change that touched only documentation fails the run. The
error names a file ending in `.node`, or a module that "cannot be found"
with a platform in its name, or a compiler running during install. It passes
on your machine and fails in CI, or it started failing on a day nobody
changed anything.

**What it actually is.** Some packages ship a compiled binary per platform
and architecture. A lockfile generated on one machine records only that
machine's binaries, so an install on a different platform silently skips the
one it needs — and the failure arrives much later, at build time, as a
missing module. A second version of the same trap: a package that compiles
from source whenever no prebuilt binary matches the runner's exact runtime
and operating-system version, so the day the CI image moves, the build
starts failing with no change on your side.

**Fix.**

- **Pin the platform binaries your CI actually needs** as optional
  dependencies in the manifest, at versions matching their parent package.
  Your own machine ignores them because the platform does not match; CI
  installs them; the lockfile then carries both. When the parent package is
  upgraded, bump the matching platform binary in the same change.
- **Keep a native package nothing in the test path imports out of the
  dependency list entirely.** If one script needs a heavy native library and
  nothing else does, do not make every install pay for it. Install it by hand
  when that script is run.
- **Make that script fail usefully.** When the import is missing, print the
  exact install command and exit non-zero, rather than throwing a raw
  module-not-found error that reads like a broken project.

**How it went wrong in practice.** A documentation-only change failed CI on
a native library that no test and no build imported. It was in the
dependency list only because one occasional maintenance script used it, and
the CI image had moved so no prebuilt binary matched any more. The fix was to
take it out of the manifest completely and have the script print its own
one-line install command.

**How to prove it is fixed.** Make a change that touches only a markdown
file. The full run must pass. Then install from a clean checkout with no
cached modules, on the platform CI uses, and build.

---

## The common thread

Four of the five are the same mistake: **something was shared that the run
assumed was its own**, and the run was never told to check. The fix is always
the same shape — make it private, and make the collision loud.

The fifth, time, is the same mistake in a different coat: the clock is a
shared resource too, and every machine has a different one.
