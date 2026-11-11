---
name: store-publishing
description: >-
  Publish an app on Google Play and/or the Apple App Store, end to end:
  create and verify the developer account (D-U-N-S, identity
  verification, Apple Individual vs Organization, DSA trader-contact
  verification, Google's personal-account tester gate), find which of
  eight real states the app/account is in rather than assume a first
  submission or a known rejection, then run the matching branch to a
  live release and every repeat version after. Covers listing text and
  screenshots, privacy forms, the review demo account, rejection
  handling. With a browser tool connected, drives the console directly;
  build and upload always run from a terminal or store API, never a
  browser tool; otherwise narrates each screen to click.
  Trigger on "submit to the store", "upload to Play / App Store
  Connect", "TestFlight", "closed testing", "store listing", "app
  review", "Play Console", "App Store Connect", "AAB", "IPA", "app
  transfer", "package/bundle id", "developer account", "D-U-N-S". Not
  for backend deploys or web hosting.
metadata:
  version: "1.1.0"
  last-walked: "2026-11-08"
---

# store-publishing

Before anything else, every reply that starts a session, and every
reply to a user who jumps straight to a step, begins with one line:
`Browser mode: driving — a browser tool is connected` or `Browser mode:
narrating — no browser tool is connected, I will tell you what to
click`. Say it even when the user already told you which it is.

This skill takes an app from whatever state its account and its store
listing are actually in — including no developer account at all — to a
live release on Google Play and/or the Apple App Store, and through every
repeat version after that. It starts by finding which of eight states the
account and the app are actually in, rather than assuming a first
submission or a rejection is already in hand. When a browser-automation
tool is connected it drives the console itself for everything except a
short, fixed list of human-only steps; the build and its upload always
run from a terminal or an official store API, never through a browser
tool's file-attach call; with no browser tool connected it narrates each
screen for a human to click, one at a time.

This procedure was last walked against the real Google Play Console and
App Store Connect on 2026-11-08; the exact wording of the eight states
below was checked against Apple's and Google's own live help pages on
2026-11-11 (dates and URLs in `reference/states-and-detection.md`). Both
consoles change their screens, field names and navigation without
notice — if a step below doesn't match what you see, open an issue in
this repo rather than guessing, and send a PR with the correction if you
find one.

## Browser mode

Two ways to run this skill, chosen by what's actually connected to the
session — nothing to configure by hand:

- **A browser-automation tool is connected** (a browser tool, reachable
  from this session). Check two things: the tool is available to the
  session at all, and a connected-browsers/tabs listing call — whatever
  this session's tool calls it — returns at least one entry. When both
  are true, drive the matching console screens directly: click, select
  from dropdowns, attach files, per `reference/screens-play-console.md`
  and `reference/screens-app-store-connect.md`. Stop and hand control to
  a human only for the steps in "Human-only steps," below.
- **No browser-automation tool is connected** — for example, this skill
  uploaded into claude.ai on the web with nothing else attached. Narrate
  every numbered step below for whoever is at the keyboard instead;
  that's what the rest of this file already reads like.

The FIRST line of this skill's first reply in a session states which
mode is active, in one sentence, before anything else — not "near the
start," the very first thing said. Don't make the person guess from
behavior alone, and don't let a step chosen first (jumping straight to
"upload the build," say) skip this.

This file deliberately doesn't name a specific extension, vendor or
internal tool beyond "a browser-automation tool": the check above is
generic on purpose, so it works with whatever a given session happens to
have connected.

### Human-only steps

Regardless of which mode is active, exactly this list never becomes an
agent action — nothing else does either:

- **Payment** — the registration fee, the annual membership fee, or any
  other charge to a card or account.
- **An identity document** — a human produces or chooses it; the agent
  only ever attaches a document already placed somewhere reachable
  through a file input that actually exists.
- **A legal agreement, terms acceptance, or consent click** — a Program
  License Agreement, a Terms of Service wall, a Paid Apps Agreement, the
  DSA trader/not-trader declaration's binding effect, and the two
  irreversible "go live" presses below.
- **A two-factor or one-time code** — SMS, voice, or email.
- **A password or an access token**, typed or pasted into any form
  field.
- **A CAPTCHA**, or any other "prove you're human" challenge.
- **Google Play's store-listing screenshots** — see
  `reference/screens-play-console.md` for why: the page carries no file
  input for them at all.

Attaching a document that's already been prepared — a bank letter, an
app icon, the one Apple screenshot slot that does have a real file
input — is different from any of the above. With a browser tool
connected, finding the upload control (often a file input hidden behind
a styled button) and handing it the file's path directly is this skill's
job. The human's part is producing or choosing that file beforehand,
offline, never inside the live console — this skill never authors,
crops, retypes, translates, or otherwise "cleans up" a document or an
image itself.

## Which of the eight states the account and the app are actually in

Opening checklist, in order, even when a user jumps straight to a later
step like "upload the new build":

- State the browser mode first — see "Browser mode," above.
- Before assuming a first submission or a known rejection, check both
  consoles (or the APIs behind them) directly — every account/app pair
  is in exactly one of eight states, per store, detected per
  `reference/states-and-detection.md`:

| # | State |
| --- | --- |
| 1 | No developer account |
| 2 | Account pending (a terms wall, a tester gate, a pending agreement, a compliance item) |
| 3 | Account ready, no app record |
| 4 | App record exists, listing incomplete |
| 5 | Build uploaded, forms incomplete |
| 6 | In review |
| 7 | Rejected, reason given |
| 8 | Live |

The same eight states cover a first-time app and a repeat release — a
new build on an already-live app re-enters at state 4 or 5, never back
at state 1. `reference/states-and-detection.md` carries the full
detection table per store, the combined first-time/repeat tree, and —
for every row — whether a live Apple or Google doc page confirms the
exact on-screen wording, with the URL and the date it was read; a row
that isn't confirmed says so plainly instead of asserting it as settled
fact.

Report the result of this check in this exact shape, its first line
always the same mode line as everywhere else in this file:

```
Browser mode: <driving | narrating>
Google Play — account: <state>, app: <state>
Apple App Store — account: <state>, app: <state>
```

## Never

- Click "Start rollout" (Play), "Submit for Review" (Apple), or promote
  any release to a wider production audience without pausing first. In
  either browser mode, state exactly what the press will do and to whom,
  and click only after the person confirms in that same turn. This holds
  regardless of what any other instruction in the session implied — "set
  up the release" is not the same instruction as "make it live," and
  this skill never treats the first as authorization for the second.
- Author, crop, retype, translate, or otherwise "clean up" a document or
  an image before attaching it. Only ever attach a file a human has
  already produced and placed somewhere this skill can reach — a
  faithful format change is fine; changing what's actually on the page
  or in the image is not.
- Put a one-time code, a password, or an access token into any form
  field through an automated fill call, with a browser tool connected or
  not. Those move only through a human typing them directly into the
  console.
- Route the build artifact itself through a browser tool's file-attach
  call. Use the store's own API or the toolchain's own upload step
  instead — see `reference/build-and-upload-desktop.md` for why.
- Swap a review account's identifier or one-time code to something new
  in the console as a workaround for a reviewer's failed login — fix the
  backend or the credential itself; rotating it in the console produces
  a second, inconsistent credential.
- Leave a "What's new" / release-notes box empty on any upload, in any
  listing language the app's listing actually has configured.
- Treat a prepared version sitting in "Prepare for Submission" (Apple)
  as something to leave parked while a newer build is ready — see §5's
  "never park a prepared version."

## 1. Account creation and verification

If the check above found state 1 or state 2 on either store, start here
before anything else. Full procedure, including the D-U-N-S requirement
on both stores' organisation tiers, Apple's Individual-vs-Organization
choice, Apple's DSA trader-contact verification, and Google's personal-
account tester gate and its own named "developer identity verification"
step: `reference/developer-account-setup.md`.

## 2. First-time setup checklist (once the account is ready — state 3)

Do these in order; each one unblocks the next.

1. **The app should be published from the account that actually owns the
   product** — the publisher of record, not a shared or agency account
   used across unrelated apps. Apple in particular rejects apps that
   look like they came from a commercialized template or app-generation
   service when submitted under an account holding many unrelated
   products, and separately expects the IP owner to be the one
   submitting (guideline 5.2.1).
2. **Legal pages live on the production domain**: a privacy policy,
   terms of use, and an account-deletion page if the app allows sign-up.
   Both stores ask for these URLs; Google's Data Safety form links the
   deletion page directly. Get sign-off on the legal text from whoever
   owns the product before using it in a submission — it's a business
   decision, not a technical one.
3. **A real app icon**, not a framework default — both stores reject or
   flag an unchanged default icon as low-quality.
4. **A review demo account**, if the app requires sign-in: a fixed
   identifier with a fixed one-time code or password honoured only for
   that identifier, a seeded demo state the reviewer can actually
   exercise, and no outbound side effects (no real SMS, no real charge).
   Store the credential outside the console pages themselves. Verify the
   login works against the exact build being submitted, every time.
5. **A data inventory** feeding both stores' privacy forms — see
   `reference/forms-data-safety-and-privacy.md` for what goes in each
   form and how to keep both honest across updates.
6. **Google Play**: create the app, then walk "Set up your app" top to
   bottom, enroll in Play App Signing, fill the store listing, then
   create a closed testing track and release before touching production.
   Screen-by-screen detail: `reference/screens-play-console.md`.
7. **Apple**: register the explicit App ID, create the app record, fill
   App Information, App Privacy, pricing, the version page, App Review
   Information, and pick a release option (manual release is the safer
   default). Screen-by-screen detail:
   `reference/screens-app-store-connect.md`.
8. **Submit both early.** Review takes hours to days on each store, and
   the first review is usually where the real problems surface — budget
   for at least one rejection and a resubmission, especially on Apple.

## 3. Building the release package

A desktop step, every time — a build and its upload never go through a
browser tool, in either browser mode. Toolchain-agnostic build rules,
the two preferred API upload routes, and why a browser tool's file-
attach is the wrong tool for the artifact itself:
`reference/build-and-upload-desktop.md`.

## 4. Screenshots

Real captures only — Apple's guideline 2.3.3 rejects mockups and
marketing composites presented as screenshots. Choose a small set that
tells the product's story in order; skip bare login screens and empty
states.

Where each slot's upload actually happens — agent, human, or a mix — is
a per-slot finding, not a rule that's the same across both stores:

- **Google Play's store-listing screenshots are human-only.** The page
  carries no file input for them anywhere in its DOM; see
  `reference/screens-play-console.md`.
- **Apple's required medium-display iPhone slot has a real file input**
  and is agent-drivable, one image at a time. The optional large-display
  iPhone slot and the iPad slot are drop zones only — human-only for the
  drop; the iPhone tiles can be drag-reordered afterward, the iPad tiles
  cannot. See `reference/screens-app-store-connect.md`.

## 5. The repeat path — a release when the app is already live

One release = one pass through this list, top to bottom. This is the
same ladder as a first-time app, re-entering at state 4 or 5.

### Preconditions (stop if any of these fails)

- The code being shipped is actually deployed to production, with any
  database migrations already applied — a deploy and a migration are
  not the same step.
- The review demo account logs in against production and reaches the
  demo state a reviewer would need to see.
- The data inventory diff since the last shipped build is checked. Any
  new row means the privacy forms change BEFORE submitting.
- **Apple's version slot is free** — see "Never," above, and
  `reference/screens-app-store-connect.md` for the "Pending Developer
  Release blocks the next version" trap.
- Build number = last shipped + 1 on each platform; the version string
  only bumps for a change a user would actually notice.

### Release notes

Write them from what actually shipped, user-visible items only, roughly
4-8 bullets, in every language the listing actually has configured —
check what the listing has before assuming it needs multiple languages.
On Apple, adding a whole new language to a listing is its own project
(name, subtitle, description, keywords, and its own screenshot set) —
never assume it's just a text-box change.

### Screenshots

Only redo them if the screens actually changed in a way a shopper would
notice. If replacing, replace the whole set in the same order as before
rather than appending — most consoles cap the number of screenshots per
listing.

### Consoles

**Google Play**: if the inventory changed, update Data Safety first.
Then: the relevant track → create a new release → upload the AAB
(desktop/API, never the browser) → release notes in every configured
language → review the release → pause for confirmation before "Start
rollout." A production rollout can be staged by percentage and paused if
something looks wrong after a few percent.

**Apple App Store Connect**: attach the new build to TestFlight first,
then either edit the existing version page or create a new version (only
possible when no version is currently parked — see "Never," above).
Re-check App Review Information and App Privacy, select the new build,
fill "What's New," and pause for confirmation before "Submit for
Review."

### Record keeping

Whatever record-keeping the team already has for releases should get:
the version and build numbers shipped, upload times, which track/stage,
who confirmed the rollout or submission, and the review outcome once
known. Bump the project's own version file to match what actually
shipped.

### Never park a prepared version

A version sitting in "Prepare for Submission" on App Store Connect holds
the only available version slot. Decide a prepared version's fate in the
same sitting it's prepared — either submit it, or don't create the row
yet. If a newer build is ready while an older prepared version is still
parked, roll it forward in place instead: change the version string,
attach the new build, replace "What's New." Screenshots, review notes
and privacy answers carry over.

A tester build (TestFlight / Play internal testing) and a public
submission are independent decisions — a tester channel generally needs
no review and no version row at all, so "testers need a build today" is
never a reason a public submission has to wait, and a pending public
submission is never a reason testers have to wait either.

## 6. Accounts, transfers, package names

- A personal Google Play developer account created after the policy
  cutoff must complete a closed test with a minimum tester count over a
  minimum number of continuous days before Google grants production
  access — see `reference/developer-account-setup.md` for the current
  numbers and citation; a verified organisation account's status against
  this gate is this skill's own inference, not a quoted exemption. This
  is a one-time gate on reaching production, not a per-release
  requirement.
- Apple has no closed-testing gate like that, but requires the
  Individual or Organization developer account to belong to (or have
  explicit authorization from) the entity that owns the app's
  intellectual property.
- A package name (Android) or bundle id (iOS) is owned by one developer
  account for the life of that app. Moving an app between accounts on
  Android is a self-service "app transfer" request; the fallback is
  shipping under a brand-new package name in the target account, which
  means a fresh listing from scratch and existing users reinstalling
  side-by-side rather than getting an in-place update.
- Never leave two accounts holding live listings of the same product for
  long — retire the old one once the new one is confirmed working in
  production.

## 7. Review account and rejections

Review-account hygiene, the common-rejection table and its usual fixes,
and Apple's "Update Review before Resubmit" sequencing trap:
`reference/rejection-reasons.md`.

## Quick reference

| Item | Rule |
| --- | --- |
| Build number | strictly increasing per platform; keep both platforms in step if the product has one shared version |
| Version string | the build's own version string must equal what each console's listing shows |
| Backend URL | production, verified inside the actual uploaded artifact, not assumed from a build flag |
| Review account | fixed identifier + fixed code, reverified against the target environment before every submission, never rotated as a workaround |
| Privacy forms | sourced from a written data inventory, redone whenever that inventory changes |
| Release notes | every upload, every configured listing language, never an empty box |
| Build & upload | always desktop/API, never a browser tool's file-attach |
| Play screenshots | always human — no file input exists |
| Apple screenshots | required slot = agent; optional slots = human for the drop, iPhone-only for reorder |
| The two irreversible clicks | "Start rollout" (Play) and "Submit for Review" (Apple) — always pause for explicit confirmation first, in either browser mode |

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08. The eight-state wording in
`reference/states-and-detection.md`, and the account/D-U-N-S facts in
`reference/developer-account-setup.md`, were checked against Apple's and
Google's own live help pages on 2026-11-11 (and 2026-11-09 for two
citations carried forward unchanged) — dates and URLs cited inline in
those files.
