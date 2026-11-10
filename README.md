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

- `skills/store-publishing/SKILL.md` — first-time setup for both stores,
  developer-account questions (individual vs organization, app transfers,
  package/bundle id rules), the repeat-release checklist, and rejection
  handling. `reference.md` carries the longer per-store detail and the
  pre-submission readiness checklist.
- `skills/meta-whatsapp-cloud-api/SKILL.md` — business-verification
  document requirements and the resubmission process, then bringing up
  the Cloud API itself in order: app, WABA, test number, system-user
  token, real phone number, webhook, smoke test, templates. `reference.md`
  carries the rejection-reason table, token types, display-name rules,
  the messaging-limit ladder, the webhook payload contract, and the
  verification wizard walked screen by screen.

Both skills are valid against the open [Agent Skills
specification](https://agentskills.io/specification) (read live on
2026-11-10). The version and the date each skill was last walked against
the real console live in that spec's optional `metadata` field — a map of
extra key/value data the spec reserves for exactly this, rather than a
frontmatter key the spec doesn't define.

## License

MIT — see `LICENSE`.
