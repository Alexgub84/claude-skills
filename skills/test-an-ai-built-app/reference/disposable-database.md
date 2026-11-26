# A real disposable database, created and dropped by the run

Last reviewed: 2026-11-26

The rule: **the database is never faked.** Every run uses a real database of
the same engine production uses, created and dropped by the run itself.

Why, concretely. In an AI-built app the schema, the constraints, the
transactions and the queries are among the likeliest things to be wrong — a
missing unique constraint, a foreign key nobody declared, a query that works
on one row and not on two, a migration that was never applied. A fake
database agrees with whatever your code does, so it cannot be wrong about
any of them, which means your tests cannot find them. Replacing the database
with an in-memory stand-in deletes exactly the bugs you have.

The counter-argument is always speed. A local database on a modern machine
costs tens of milliseconds per test file. That is not the problem worth
optimising on the day you write your first test.

## The lifecycle, in order

Run by the suite itself, every time, pass or fail:

1. **Refuse to start without an explicit test connection string.** No
   falling back to the development one.
2. **Drop a database of this run's own name if one is there** — terminating
   any other session connected to it in the same breath.
3. **Create it.**
4. **Apply the committed migrations** — the real files, the same ones
   production uses.
5. **Run the tests** with the connection string pointing at that database,
   and print its name first.
6. **Drop it again**, pass or fail.

### 1. The refusal is the most important step

```ts
function baseTestDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL is not set. These tests empty every table, so they " +
        "refuse to run against the development database. Set it to a local " +
        "test server (see the readme) and run again.",
    );
  }
  return url;
}
```

Never `process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL`. That one
`??` is how a test run wipes a developer's seeded data, or worse. The error
message names the variable and where to set it, so the refusal costs the
reader thirty seconds rather than an hour.

### 2-6. The script

One file. The suite's `test` script runs this, and this runs the test
runner as a child process with the connection string in its environment.

```ts
// scripts/run-tests.ts
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import postgres from "postgres";

/** Everything below reuses the admin connection's host, port and credentials. */
function withDatabaseName(base: URL, name: string): string {
  const url = new URL(base);
  url.pathname = `/${name}`;
  return url.toString();
}

/** The maintenance connection: the server's own default database. */
function maintenanceUrl(base: URL): string {
  return withDatabaseName(base, "postgres");
}

/**
 * One name per checkout. Two copies of this project on one machine can
 * never compute the same name, and a leftover names the branch that made
 * it. Short enough to stay inside the engine's identifier limit.
 */
function checkoutSlug(): string {
  const git = (args: string[]) =>
    execFileSync("git", args, { encoding: "utf8" }).trim();
  const root = git(["rev-parse", "--show-toplevel"]);
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24);
  // The branch alone is not enough: two checkouts can be on the same
  // branch, or on none. The path hash is what guarantees no collision.
  const hash = createHash("sha1").update(root).digest("hex").slice(0, 8);
  return `${branch || "checkout"}_${hash}`;
}

async function dropDatabase(maintenance: string, name: string) {
  const sql = postgres(maintenance, { max: 1, onnotice: () => {} });
  try {
    // A connection left open by a killed run would block the drop outright.
    await sql`
      select pg_terminate_backend(pid) from pg_stat_activity
      where datname = ${name} and pid <> pg_backend_pid()
    `;
    await sql.unsafe(`drop database if exists "${name}"`);
  } finally {
    await sql.end();
  }
}

async function createDatabase(maintenance: string, name: string) {
  const sql = postgres(maintenance, { max: 1, onnotice: () => {} });
  try {
    await sql.unsafe(`create database "${name}"`);
  } finally {
    await sql.end();
  }
}

async function main() {
  const base = new URL(baseTestDatabaseUrl());
  const name = `app_test_${checkoutSlug()}`;
  const maintenance = maintenanceUrl(base);
  const own = withDatabaseName(base, name);

  // The first line of every run. This is how a reader tells a real pass
  // from a run that quietly used someone else's data.
  console.log(`test database: ${name}`);

  await dropDatabase(maintenance, name);
  await createDatabase(maintenance, name);

  // The real migrations, applied by the project's own migrate command.
  execFileSync("npm", ["run", "migrate"], {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: own },
  });

  const child = spawn("npx", ["vitest", "run"], {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: own, TEST_DATABASE_URL: own },
  });
  const forward = (signal: NodeJS.Signals) => void child.kill(signal);
  process.on("SIGINT", forward);
  process.on("SIGTERM", forward);
  const code = await new Promise<number>((resolve) =>
    child.on("exit", (c) => resolve(c ?? 1)),
  );

  // Pass or fail, the database goes.
  await dropDatabase(maintenance, name);
  process.exit(code);
}

await main();
```

Then one line in the project manifest, and it never changes again:

```json
{ "scripts": { "test": "tsx scripts/run-tests.ts" } }
```

## Naming: two schemes, pick one

**One name per checkout** (the script above). Derived from the checkout's
own path, so two copies of the project on one machine cannot collide. A run
killed before its teardown leaves exactly one database behind, and the next
run of that same checkout drops it before doing anything else — so nothing
accumulates without a sweep. Choose this when a person works from more than
one copy of the repository at a time, or when more than one person shares a
machine.

**A unique name per run.** A timestamp and a few random characters:
`app_test_<seconds>_<hex>`. Dropped by the run's own teardown. Because a
killed run's name can never be recomputed, this scheme needs a sweep at the
start of the next run: list databases matching the prefix, drop any whose
timestamp is more than an hour old. Choose this for a single checkout, or
when runs must be able to overlap on purpose.

Either way, both of these are true:

- The prefix is this suite's own exclusive namespace. Nothing else on the
  machine may use it, and the sweep must only ever match that prefix.
- A drop terminates other sessions first, or does a forced drop if the
  engine supports one (`DROP DATABASE ... WITH (FORCE)` on a recent
  Postgres). A connection from a killed run otherwise blocks the drop
  forever and the next run fails for a reason that looks nothing like its
  cause.

## What to leave for later

**Cloning a prepared template database per test file.** Migrate once into a
template, then let every test file clone it in milliseconds instead of
replaying migrations. It is real, it works, and it is how a large suite
stays fast. It is also a pile of engine-specific machinery — a locked
template, a clone-safe permission, a proven assumption about what is and is
not shared between clones — for a project whose first test was written this
week. Come back to it when you can name the number of seconds your suite
spends on migrations.

**Parallel test files sharing one database.** Do not, while the suite is
small. Run files one at a time (every runner has a flag for it). Parallel
files against one database is the most common cause of "passes alone, fails
in a full run" — Trap 3 in `traps.md`.

## Between tests

Empty every table between test files, in one helper the files share:

```ts
export async function emptyEveryTable(sql: postgres.Sql) {
  const rows = await sql<{ table_name: string }[]>`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
  `;
  const names = rows
    .map((r) => r.table_name)
    .filter((n) => !n.startsWith("_"))   // the migration tool's own bookkeeping
    .map((n) => `"${n}"`)
    .join(", ");
  if (names) await sql.unsafe(`truncate table ${names} restart identity cascade`);
}
```

Read the table list from the database rather than keeping a list in code: a
hand-maintained list silently stops covering the table added last week, and
that table's leftover rows are the next mystery failure.

## Variants by engine

- **MySQL / MariaDB:** the same script. `drop database if exists`, `create
  database`, and `kill` the connection ids from `information_schema.processlist`
  instead of `pg_terminate_backend`.
- **A single-file database (SQLite and friends):** simpler and just as real.
  Create the file in a temporary directory with a per-run name, apply the
  real migrations to it, point the app at it, delete the directory
  afterwards. An **in-memory** database is acceptable here only when
  production also runs the same engine; using it to stand in for a different
  engine is faking the database by another name.
- **A hosted database with no local option.** This is the expensive case
  Step 1 asks about. In order of preference: run the same engine locally in
  a container (almost always possible); or create and drop a real database
  per run on the hosted server, on a non-production instance, with the
  refusal in step 1 above pointing at it and nothing else. What is never
  acceptable: running the suite against the database that holds real data.
  These tests empty tables.
- **An ORM or framework with its own test helper** that wraps each test in a
  transaction and rolls it back. Fine, and often faster — with one caveat
  worth knowing: code under test that opens its own connection or its own
  transaction does not see the uncommitted rows, so the helper quietly stops
  working exactly when the flow gets interesting. If a test fails in a way
  that suggests the data is not there, check this first.

## Output to show the user

    test database: app_test_<branch>_<hash>
    migrations: <n> applied
    <the runner's own summary line>

Those three lines are the proof the run used a database it made itself.
