# store-publishing: Google Play Console, screen by screen

Last reviewed: 2026-11-08 (console mechanics); state-name wording checked
against Google's own help pages on 2026-11-11, cited in
`states-and-detection.md`.

Dated screen map for the Google Play half of `SKILL.md`. Play Console
changes field names, menu paths and wizard shape without notice — if a
step below doesn't match what you see, treat this file as stale for that
step, not the ground truth. Each entry is marked **agent** (drivable with
a browser-automation tool connected), **human** (never an agent action —
see "Human-only steps" in `SKILL.md`), or **desktop** (a terminal/API
step, no browser involved).

## Finding the right account — the index-probing trap

A Google identity can hold more than one developer profile, and Play
Console serves them at numbered paths: `console/u/0`, `console/u/1`,
`console/u/2`, `console/u/3`, and so on. The identity's *default* index is
not necessarily the one that owns the app being worked on — a session
that opens `console/u/0` and sees a sign-up/enrollment page, or an
unrelated app list, can wrongly conclude "no developer account exists" or
"the app is missing," when the real account sits at `u/1` or `u/2`.
Probe each index for the developer identity actually in use before
concluding either thing. — *agent* for navigating each index; confirming
which index is the right one is a judgment call the session should state
plainly once made, not something to assume silently.

## The Terms-of-Service wall

A new or changed Play Console Terms of Service can answer **every** URL
under that account with a redirect to `/accept-terms`, blocking all
console work until it's accepted. Accepting it is a legal acceptance on
the account's own terms — never an agent action, regardless of mode. —
*human*. Surface the exact URL and stop; there is no way around it except
accepting it.

## Account creation and verification

- **Registration fee.** A one-time payment, paid by the account holder
  directly. — *human*
- **Developer identity-verification step.** Google names this directly as
  "Verify your developer identity information" — a personal account needs
  an official government identity document; an organisation account needs
  that plus a D-U-N-S number and an official organisation document
  (https://support.google.com/googleplay/android-developer/answer/10841920 — read
  2026-11-11). The identity document itself is uploaded through a real
  file input where the console offers one, but the document is one a
  human has already obtained and placed somewhere reachable — never
  authored, cropped, or retyped by the agent (see "Never" in
  `SKILL.md`). — *agent* for attaching a file to a found input; *human*
  for producing the document and for any identity-document review step
  the console itself gates behind a human action.
- **Personal-account closed-testing gate.** A personal account created
  after 13 November 2023 needs a closed test with a minimum of 12 testers
  held continuously for at least 14 days before Google grants production
  access (https://support.google.com/googleplay/android-developer/answer/14151465
  — read 2026-11-11). This is a one-time condition on reaching production
  for that account, not a per-release requirement. Setting up the closed
  test itself (track, tester list, release) is agent-drivable; waiting out
  the 14 days is not something any mode speeds up. — *agent* for the
  console mechanics, *human* in the sense that only time, not a click,
  clears the gate.

## Creating the app

- Console → "Create app": app name, default language, app or game, free
  or paid, both required declarations. — *agent*
- Dashboard → "Set up your app" checklist, top to bottom: privacy policy
  URL, App access, ads declaration, content rating questionnaire, target
  audience and age, government-apps declaration, financial-features
  declaration, health declaration, Data safety (from the data inventory —
  see `forms-data-safety-and-privacy.md`), advertising ID declaration. —
  *agent* for every field and select; the actual truthful answers come
  from the product's own data inventory and behaviour, never invented.

## Play App Signing

Enroll so Google holds the app signing key and the upload key stays
replaceable if it's ever lost. A one-time, reversible-consequence
checkbox/agreement click on the account's own signing setup — not one of
the two irreversible "go live" presses this skill always pauses for, but
still worth doing deliberately rather than by habit. — *agent*

## Store listing

- Text fields (name, short/full description, category, support contacts),
  per supported language. — *agent*
- Graphics: feature graphic, app icon. — *agent* (the agent attaches a
  file a human already prepared; it never designs or edits the image
  itself).
- **★ Store-listing screenshots are human-only.** The listing's
  screenshot area carries no `input[type=file]` anywhere in its DOM,
  shadow roots included — the upload control opens a native OS file
  dialog on click, which a browser-automation session cannot drive and
  which has been observed to freeze the automation session outright
  (dated, witnessed observation, 2026-10-07). There is no agent-drivable
  path here: the screenshots are a human's own drag-and-drop into that
  area. — *human*
- **Screenshot order, once uploaded, is also human-only.** The tiles
  reorder only through the page's own drag protocol; there is no visible
  reorder button, and the drop order from a multi-file drag is not
  guaranteed to match the files' on-disk order. If the order matters,
  check it visually after the drop and have a human drag tiles into
  place rather than assuming the drop preserved order. — *human*

## Closed testing, then production

- Testing/Production → the chosen track → "Create new release." — *agent*
  for the console flow; the artifact itself is a desktop step (see
  `build-and-upload-desktop.md`) and should not be attached through a
  browser tool's file-attach call for anything near real release size.
- Release notes, every configured listing language, never an empty box.
  — *agent*
- App content declarations, re-checked against the current data
  inventory if it changed since the last release. — *agent*
- "Review release" — reading the summary before the next click. — *agent*
- **"Start rollout" is one of the two irreversible presses this skill
  never takes on its own.** State exactly what the press will do (move
  this release live to some or all of the track's users) and to whom, and
  click it only after the person confirms in that same turn — in either
  browser mode. — *agent to click, only after explicit confirmation*
- A production rollout can be staged by percentage and paused if
  something looks wrong after a few percent — pausing a staged rollout is
  not itself an irreversible press and doesn't need the same pause-and-
  confirm ceremony as starting it.

## General console mechanics worth expecting

- **The console can render in whatever language the account's locale is
  set to, Hebrew included.** Quote the console's own on-screen string in
  any report, with a translation alongside — don't silently translate it
  away, since the exact string is what the next session needs to match
  against this file or against a rejection email.
- A page that sits on a spinner after navigation sometimes renders only
  after the same left-nav item is clicked a second time.
- Direct deep-link URLs into a specific testing track have been seen
  404-ing into a generic error toast when a track has sub-tracks under
  it — navigate through the track's own menu rather than typing a guessed
  URL.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08. State-name and policy-page wording checked against Google's
own live help pages on 2026-11-11 (cited inline above).
