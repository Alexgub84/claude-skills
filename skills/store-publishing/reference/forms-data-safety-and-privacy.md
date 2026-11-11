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

## Google Play — Data Safety and related declarations

- **Data Safety**: what's collected, shared, encrypted, and deletable —
  sourced from the inventory, never left stale after the app's actual
  data collection changes.
- **Content rating** questionnaire: answered truthfully from the app's
  actual behaviour, not optimistically.
- **Target audience** declaration, and an **ads** declaration — does the
  app show ads, from any SDK, including a third-party one the team
  didn't write itself.
- **Government-apps**, **financial-features**, and **health**
  declarations, each answered from what the app genuinely does.
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
  cover this release's questionnaire without checking.
- **Export compliance**: answer honestly based on what encryption the
  app actually uses beyond standard HTTPS. If the honest answer is "no
  additional encryption," add `ITSAppUsesNonExemptEncryption=false` to
  Info.plist once, to stop the question recurring on every single build.

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
