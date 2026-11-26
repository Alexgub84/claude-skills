# claude-skills

Three Claude Code skills, published by [Hand in Hand AI](https://handinhandai.com):

- **store-publishing** — getting an app into Google Play and the Apple App
  Store, first submission and every repeat release after that.
- **meta-whatsapp-cloud-api** — getting a business verified with Meta and
  connected to the official WhatsApp Cloud API.
- **test-an-ai-built-app** — putting a working test suite on an app that was
  built with AI and now breaks whenever it is touched.

Both are rewrites of real, working procedures, generalized so they carry
no client name, account, product, or machine-specific path. Each
`SKILL.md` opens with the date it was last walked against the real
console and a note that consoles change — if a step doesn't match what
you see, [open an issue](https://github.com/Alexgub84/claude-skills/issues)
in this repo.

## Download

No GitHub account, terminal or Claude Code needed. Each skill is also a
downloadable ZIP, built by this repo's own release workflow from the
`skills/<name>/` folder at every tagged release — nobody edits these by hand:

- [store-publishing.zip](https://github.com/Alexgub84/claude-skills/releases/latest/download/store-publishing.zip)
- [meta-whatsapp-cloud-api.zip](https://github.com/Alexgub84/claude-skills/releases/latest/download/meta-whatsapp-cloud-api.zip)
- [test-an-ai-built-app.zip](https://github.com/Alexgub84/claude-skills/releases/latest/download/test-an-ai-built-app.zip)

The downloaded file uploads as is in Claude's **Customize → Skills → Upload a
skill**. An installed copy does not update itself — it stays exactly as it
was the day you uploaded it, so come back to this link for a newer version
rather than assuming it is current.

## Install

In Claude Code:

```
/plugin marketplace add Alexgub84/claude-skills
```

Then install either or both skills from the marketplace it adds.

## What's in each skill

- `skills/store-publishing/SKILL.md` — first checks which of eight states
  the developer account and the app are actually in on each store (no
  account yet / account pending / account ready, no app / listing
  incomplete / build uploaded, forms incomplete / in review / rejected /
  live), including creating and verifying the developer account itself
  (D-U-N-S, Apple's Individual vs Organization choice, Apple's DSA
  trader-contact verification, Google's personal-account tester gate),
  then runs the matching branch through to a live release and every
  repeat version after that. With a browser-automation tool connected it
  drives the console screens directly; the build and its upload always
  run from a terminal or an official store API, never a browser tool;
  otherwise it narrates each screen for a human to click. Its
  `reference/` folder carries the per-store state-detection table
  (`states-and-detection.md`), dated screen maps for Play Console and
  App Store Connect (`screens-play-console.md`,
  `screens-app-store-connect.md`), the account-creation procedure
  (`developer-account-setup.md`), toolchain-agnostic build/upload
  guidance (`build-and-upload-desktop.md`), the rejection-reason table
  (`rejection-reasons.md`), and the Data Safety / App Privacy forms
  guidance (`forms-data-safety-and-privacy.md`).
- `skills/meta-whatsapp-cloud-api/SKILL.md` — first checks which of four
  states an account's verification is actually in (never started /
  submitted and waiting / rejected with a reason / verified) from the
  Graph API field plus the console, then the matching document
  requirements and resubmission process, then bringing up the Cloud API
  itself in order: app, WABA, test number, system-user token, real phone
  number, webhook, smoke test, templates. With a browser-automation tool
  connected it drives the console screens directly; otherwise it
  narrates each screen for a human to click. Its `reference/` folder
  carries the rejection-reason table and Israeli document worked example
  (`rejection-reasons.md`), the business-verification wizard walked
  screen by screen (`screens-business-verification.md`), the developer-
  console mechanics for the app/WABA/token/webhook/template steps
  (`screens-developer-console.md`), and the underlying Graph API calls
  with example `curl` commands (`api-checks.md`).

- `skills/test-an-ai-built-app/SKILL.md` — for a project with no tests at
  all. It reads the project's real state first (stack, any existing test
  runner, where the database is, where the model is called), then runs a
  fixed order: make a suite exist and watch it go green, open one dependency
  seam, fake exactly one thing — the model call — behind a real client and a
  scripted fake that throws on an unscripted call, give every run its own
  real disposable database created and dropped by the run, write the first
  end-to-end test on one real flow, and start the run so it cannot lie. It
  needs no browser; with a shell attached it runs the commands, otherwise it
  narrates them one at a time. Its `reference/` folder carries the model port
  with its real client and scripted fake in full (`model-port.md`), the
  database create/migrate/run/drop lifecycle and both naming schemes
  (`disposable-database.md`), the clock rule with its lint guard and single
  sanctioned exception module (`clock-and-time.md`), five failure modes that
  make a run look green while proving nothing (`traps.md`), and the three
  phone-app tiers with an honest account of what no automated tier catches
  (`phone-app.md`).

All three skills are valid against the open [Agent Skills
specification](https://agentskills.io/specification) (read live on
2026-11-10). The version and the date each skill was last walked against
the real console live in that spec's optional `metadata` field — a map of
extra key/value data the spec reserves for exactly this, rather than a
frontmatter key the spec doesn't define.

## License

MIT — see `LICENSE`.
