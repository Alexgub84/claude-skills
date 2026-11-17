# store-publishing: Data Safety / App Privacy, content rating, and the inventory they come from

Last reviewed: 2026-11-08.

## The data inventory — the one source for both forms

One document (in the repo, in a wiki, wherever the team keeps specs)
listing every data type the app collects, why, and through which SDK.
Google's Data Safety form and Apple's App Privacy form get filled FROM
this document, never from memory. Whenever the app gains a new
permission or a new analytics/diagnostic SDK, the inventory changes in
the same change that adds it, and both forms get redone before the next
submission — a mismatch between what the forms say and what the binary
actually does is a common, avoidable rejection reason, not a technicality
either store treats lightly.

**None of the questionnaires below are the assistant's to answer from
its own judgement, in either browser mode.** Content rating, target
audience, government/financial/health declarations, and the children's-
audience question all have real legal and policy weight. The agent may
fill in the selected answer once the human has actually given it — read
from the data inventory and confirmed by the human, never inferred or
guessed to keep things moving. Where the human hasn't actually answered
yet, stop and ask rather than selecting the plausible-looking option.

## Google Play — Data Safety and related declarations

- **Data Safety**: what's collected, shared, encrypted, and deletable —
  sourced from the inventory, never left stale after the app's actual
  data collection changes.
- **Content rating** questionnaire: the human's actual answer, from the
  app's real behaviour — never optimistic, never a guess to move faster.
- **Target audience** declaration, and an **ads** declaration — does the
  app show ads, from any SDK, including a third-party one the team
  didn't write itself. **If the target audience includes children, stop
  before answering anything else** — see the children/regulated-category
  flag in `SKILL.md`, read before any listing work begins.
- **Government-apps**, **financial-features**, and **health**
  declarations — human-confirmed answers only; these are exactly the
  categories this skill does not get to infer on its own.
- **Advertising ID** declaration.
- Countries/markets to release in, per the product's actual go-to-market
  plan — never default to "everywhere" without checking that's actually
  intended.

## Apple App Store — App Privacy and age rating

- **App Privacy** labels: filled from the same inventory used for Play's
  Data Safety form, re-checked against what the build actually requests
  permission for at runtime — not written once and forgotten.
- **Age rating** questionnaire, including whatever social/communication
  capability questions the current version of the form asks — these
  change periodically, so don't assume last release's answers still
  cover this release's questionnaire without checking. The human
  confirms each answer; see the note above.
- **Export compliance**: this is not a shortcut question. Build a short
  encryption inventory first — does the app use any cryptography beyond
  what the OS's standard HTTPS/TLS stack already provides (a custom
  protocol, end-to-end encryption, a crypto library linked for a
  non-HTTPS purpose) — and answer the store's own questionnaire against
  that inventory, not a one-line guess. If the honest, inventoried
  answer is "no encryption beyond standard HTTPS," add
  `ITSAppUsesNonExemptEncryption=false` to Info.plist once, to stop the
  question recurring on every single build. **If the classification is
  genuinely unclear** (a library whose exact cryptographic use is hard
  to pin down, a possible export-license requirement), say so plainly
  and hand it back to the human — this skill doesn't resolve export-law
  questions on anyone's behalf.

## A correct form over an undeclared binary is still a rejection

Filling the forms honestly isn't the whole job — the binary itself has
to declare, at the platform level, what it actually does:

- **Apple's privacy manifest.** If the app (or a third-party SDK it
  links, including one the team didn't write) touches a "Required
  Reason API" — common ones include `UserDefaults`, file-timestamp
  APIs, and disk-space APIs — Apple expects a `PrivacyInfo.xcprivacy`
  file declaring the reason, and may expect the SDK itself to carry a
  verified signature. A binary missing this doesn't fail the App
  Privacy *form* — it fails at upload or review with an Invalid Binary
  / compliance error that reads like a toolchain problem rather than a
  privacy one. Check this before the first upload of any iOS build
  that links Firebase, Sentry, or any other common analytics/crash SDK.
- **Android's restricted permissions.** A permission like background
  location, `READ_MEDIA_IMAGES`, or `REQUEST_INSTALL_PACKAGES` —
  including one pulled in transitively by a library, never consciously
  requested — blocks a Play submission until either the Permissions
  Declaration form is completed (sometimes with a short screen
  recording demonstrating the prominent in-app disclosure) or the
  permission is stripped from the merged manifest
  (`tools:node="remove"`) because the app doesn't actually need it.
  Check the merged manifest (or Play Console's own "App bundle explorer
  → Permissions" view on an uploaded build) before assuming the data
  inventory already covered this.
- **Apple's in-app account deletion.** A web page that deletes the
  account is necessary for Google's Data Safety form, but it is **not
  sufficient for Apple** — guideline 5.1.1(v) requires the deletion
  path to be reachable *inside the app's own UI*, and it has to
  actually delete the account rather than merely deactivate it or open
  a `mailto:` link. If the app lets someone create an account, confirm
  the in-app path exists before submitting to Apple, even when the
  Play side is already satisfied by the web page.

## Keeping both forms honest across updates

- The forms only need redoing for what's genuinely new — if an update
  adds a data type, a new permission, or a new category of collection,
  redo the relevant rows for that diff. Never carry forward an answer
  that's gone stale because nobody checked.
- A new permission added anywhere in the binary (even one pulled in by a
  third-party SDK the team didn't write) is a trigger to re-check both
  forms before the next submission, not just the data types the product
  team consciously added.
- Treat the inventory diff since the last shipped build as a standing
  pre-submission check, not a one-time setup task done only on the first
  submission.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08.
