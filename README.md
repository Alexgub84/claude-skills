# claude-skills

Two Claude Code skills, published by [Hand in Hand AI](https://handinhandai.com):

- **store-publishing** — getting an app into Google Play and the Apple App
  Store, first submission and every repeat release after that.
- **meta-whatsapp-cloud-api** — getting a business verified with Meta and
  connected to the official WhatsApp Cloud API.

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

Both skills are valid against the open [Agent Skills
specification](https://agentskills.io/specification) (read live on
2026-11-10). The version and the date each skill was last walked against
the real console live in that spec's optional `metadata` field — a map of
extra key/value data the spec reserves for exactly this, rather than a
frontmatter key the spec doesn't define.

## License

MIT — see `LICENSE`.
