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
- **Personal-account closed-testing gate — per app, not per account.**
  A personal account created after 13 November 2023 needs a closed test
  with a minimum of 12 testers held continuously for at least 14 days,
  **then applying for production access on that specific app's own
  Dashboard** — Google's own instruction: "Open the Dashboard in Play
  Console. Click Apply for production." Nothing on the live page says
  this grant carries to a second app; **don't tell a developer shipping
  their second app that this gate is already cleared** — each app goes
  through its own closed test and its own production-access
  application. Two more facts the page states, worth carrying forward:
  **Production and Pre-registration both stay disabled** on an app
  until its own gate is met, and an application **can come back needing
  continued testing** — Google's own reasons are "having fewer than 12
  opted-in testers or insufficient tester engagement during the testing
  period" — with review "usually tak[ing] seven days or less, but can
  occasionally take longer."
  (https://support.google.com/googleplay/android-developer/answer/14151465
  — read 2026-11-17.) Setting up the closed test itself (track, tester
  list, release) and submitting the production-access application are
  agent-drivable; waiting out the 14 days, and Google's own review of
  the application, are not something any mode speeds up. — *agent* for
  the console mechanics, *human* in the sense that only time, not a
  click, clears the gate.

## Creating the app

- Console → "Create app": app name, default language, app or game, free
  or paid, both required declarations, and the **package name** — set
  once, here. Play Console's own help states it plainly: "Package names
  for app files are unique and permanent, so name them carefully.
  Package names can't be deleted or re-used."
  (https://support.google.com/googleplay/android-developer/answer/9859152
  — read 2026-11-11). Android's own build documentation adds the same
  rule from the binary's side: "Once you publish your app, you should
  never change the application ID. If you change the application ID,
  Google Play Store treats the upload as a completely different app."
  (https://developer.android.com/build/configure-app-module — read
  2026-11-11). Confirm the package name is right before this step, not
  after. — *agent*
- Dashboard → "Set up your app" checklist, top to bottom: privacy policy
  URL, App access, ads declaration, content rating questionnaire, target
  audience and age, government-apps declaration, financial-features
  declaration, health declaration, Data safety (from the data inventory —
  see `forms-data-safety-and-privacy.md`), advertising ID declaration. —
  *agent* for navigating to each field and entering the selection, once
  the human has actually given the answer. **The content rating,
  target audience, government-apps, financial-features, and health
  questionnaires are never answered on the agent's own judgement** —
  these are legal/policy attestations, not facts to infer from a data
  inventory alone; read the question to the human and enter only what
  they confirm (see `forms-data-safety-and-privacy.md` and "Never" in
  `SKILL.md`). If the target audience includes children, stop first —
  see the children/regulated-category flag in `SKILL.md`.

## Play App Signing

Enroll so Google holds the app signing key and the upload key stays
replaceable if it's ever lost. **This is a human-only decision, not an
agent click** — it's an agreement, and it's effectively permanent for
this app once accepted, the same class of action as the other legal
acceptances in `SKILL.md`'s "Human-only steps." Explain the consequence
before the human decides: Google will hold the app-signing key from
here on (not the account holder), and in exchange, a lost or
compromised *upload key* becomes recoverable through Google's own
upload-key-reset flow instead of ending the app's updatability — see
`reference/build-and-upload-desktop.md`. — *human* for the actual
accept click, once the consequence has been explained; *agent* for
navigating to the screen and reading its current state.

## Store listing

- Text fields (name, short/full description, category, support contacts),
  per supported language. — *agent*
- Graphics: feature graphic, app icon. — *agent* (the agent attaches a
  file a human already prepared; it never designs or edits the image
  itself).
  - **App icon**: 512px by 512px, 32-bit PNG with alpha, max 1024KB.
  - **Feature graphic**: 1024px by 500px, JPEG or 24-bit PNG with no
    alpha.
  - **Phone screenshots**: every side between 320px and 3,840px, long
    side no more than twice the short side; at least 2 required, 8
    maximum. 1080 x 1920px (9:16 portrait) or 1920 x 1080px (16:9
    landscape) is the commonly used size and satisfies the large-format
    minimum of at least four screenshots at 1080px or higher.
    (https://support.google.com/googleplay/android-developer/answer/9866151?hl=en
    — read 2026-11-17.)
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
- **Once the build finishes processing, check Testing → Pre-launch
  report before promoting it further.** Google runs the uploaded build
  automatically on real test devices and flags startup crashes and
  other failures there — reading it before moving on catches a crash a
  human reviewer would otherwise catch instead, costing a review
  cycle. — *agent* to open and read it, flag anything red before
  continuing.
- "Review release" — reading the summary before the next click. — *agent*
- **"Start rollout"** — one of the four presses `SKILL.md`'s "Never"
  section pauses for; see that section for the single statement of the
  rule. State exactly what the press will do (move this release live to
  some or all of the track's users) and to whom, and click it only after
  the person confirms in that same turn — in either browser mode. —
  *agent to click, only after explicit confirmation*
- A production rollout can be **staged by percentage**. Lowering the
  percentage, or pausing it, is not covered by the pause rule — that
  only reduces exposure, never increases it. **Raising the percentage —
  including the final step to 100% — is the same pause-for-confirmation
  press as starting the rollout in the first place**, named in
  `SKILL.md`'s "Never" section: state what the new percentage reaches
  and confirm before clicking, every increase. — *agent to click, only
  after explicit confirmation, every increase*

## General console mechanics worth expecting

- **The console can render in whatever language the account's locale is
  set to** — it may not be English. Match on screen position and icon,
  not on the English label this file uses. Quote the console's own
  on-screen string in any report, with an English translation
  alongside — don't silently translate it away, since the exact string
  is what the next session needs to match against this file or against
  a rejection email.
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
