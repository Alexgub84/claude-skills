---
name: store-publishing
description: >-
  Use for anything about shipping a mobile app to Google Play and/or the
  Apple App Store: first submission, a repeat version update, developer
  account questions (individual vs organization, transfers, package/bundle
  id rules), store listing text and screenshots, Data safety / App Privacy
  forms, the review demo account, and rejection handling. Trigger on
  "submit to the store", "upload to Play / App Store Connect", "TestFlight",
  "closed testing", "store screenshots", "store listing", "app review",
  "Play Console", "App Store Connect", "AAB", "IPA", "app transfer",
  "package name", "bundle id". Do not trigger for backend deploys or web
  hosting — this is about the two app stores only.
---

# store-publishing

This procedure was last walked against the real Google Play Console and
App Store Connect on 2026-11-08. Both consoles change their screens,
field names and navigation without notice — if a step below doesn't match
what you see, open an issue in this repo rather than guessing, and send a
PR with the correction if you find one.

## 0. Decide which path you're on

| Situation | Go to |
| --- | --- |
| App has never been submitted, no record in either console | §1, then §2, §3, §4 |
| App is already listed, a new build needs to ship | §5 (the repeat path) |
| Account question (individual vs organization, transfer, package name) | §6 |
| Reviewer can't log in, or the app got rejected | §7 |

Rule that applies everywhere: every upload needs release notes in every
listing language it ships. Never leave a "What's new" box empty — an empty
box reads as an untested build to a reviewer.

## 1. First-time setup checklist (both stores)

Do these in order; each one unblocks the next.

1. **Developer accounts exist and are verified.** The app should be
   published from the account that actually owns the product — the
   publisher of record, not a shared or agency account used across
   unrelated apps. Apple in particular rejects apps from an account that
   holds many unrelated products (guideline 4.2.6, "apps created from a
   commercialized template or app generation service") and guideline
   5.2.1 expects the IP owner to be the one submitting. See §6 for the
   individual-vs-organization decision.
2. **Legal pages live on the production domain**: a privacy policy, terms
   of use, and an account-deletion page if the app allows sign-up. Both
   stores ask for these URLs; Google's Data safety form links the
   deletion page directly. Get sign-off on the legal text from whoever
   owns the product before using it in a submission — it's a business
   decision, not a technical one.
3. **A real app icon**, not a framework default — both stores reject or
   flag an unchanged default icon as low-quality. Assets needed: the
   adaptive/foreground icon inside the binary, a 512×512 Play icon, a
   1024×500 Play feature graphic, and a 1024×1024 Apple icon in the asset
   catalog (no transparency — Apple flattens it, usually to black).
4. **A review demo account**, if the app requires sign-in. It needs: a
   fixed identifier (phone, email or username) with a fixed one-time code
   or password that is honoured only for that identifier, a seeded demo
   state the reviewer can actually exercise, and no outbound side effects
   (no real SMS, no real charge). Store the credential somewhere outside
   the console pages themselves — never as plain text pasted into App
   Review notes where it becomes a permanent, widely-readable record.
   Verify the login works against the exact build being submitted, every
   time, right before submitting.
5. **A data inventory**: one document (in the repo, in a wiki, wherever
   the team keeps specs) listing every data type the app collects, why,
   and through which SDK. Google's Data safety form and Apple's App
   Privacy form get filled FROM this document, never from memory — and
   whenever the app gains a new permission or a new analytics/diagnostic
   SDK, the inventory changes in the same change that adds the
   permission, and both forms get redone before the next submission. A
   mismatch between what the forms say and what the binary actually does
   is a common, avoidable rejection reason.
6. **Google Play — Create app**, then walk "Set up your app" top to
   bottom: privacy policy URL, App access (public, or restricted with the
   review account and instructions), ads declaration, content rating
   questionnaire (answered truthfully from the app's actual behaviour),
   target audience and age, government-apps declaration, financial
   features declaration, health declaration, Data safety (from the
   inventory), advertising ID declaration. Accept Play App Signing so
   Google holds the app signing key and the upload key stays replaceable.
   Fill the main store listing (name, descriptions, icon, feature
   graphic, at least 2 phone screenshots). Then create a closed testing
   track and a release before touching production.
7. **Apple — register the explicit App ID**, create the app record in App
   Store Connect (name, SKU, primary language), fill App Information
   (category, content rights, age rating), App Privacy (from the
   inventory), Pricing and availability, the version page (screenshots,
   description, keywords ≤100 characters, support URL, copyright), App
   Review Information (sign-in instructions if needed, review contact,
   notes), and pick a release option (manual release is the safer
   default — it puts the "go live" decision in a separate, deliberate
   click after approval). For TestFlight builds, either answer the
   export-compliance question every time, or add
   `ITSAppUsesNonExemptEncryption=false` to Info.plist once if that's
   true, to stop the question recurring.
8. **Submit both early.** Review takes hours to days on each store, and
   the first review is usually where the real problems surface — budget
   for at least one rejection and a resubmission, especially on Apple.

## 2. Building the release package

Whatever the toolchain — Flutter, React Native, Expo, or a native
Swift/Kotlin project — build from a clean checkout of the exact commit
being released, never from a working directory with uncommitted changes.
Uncommitted edits leaking into a store binary are very hard to notice
after the fact.

- **Android**: produce a signed release **AAB** (never an APK for a store
  upload), with a build number (`versionCode` or equivalent) strictly
  higher than the last one shipped. Check the package name embedded in
  the bundle matches the one the target Play account owns before
  uploading — a mismatched package name fails at the upload step, or
  worse, silently creates a second listing.
- **iOS**: archive and export (or upload directly to App Store Connect
  from the archive step) with a build number strictly higher than the
  last one shipped, and the exact bundle identifier the App Store Connect
  record was created with. Automatic signing under the right team avoids
  most certificate problems.
- **Both**: point the build at the production API/backend, not a staging
  or local one — verify this is actually baked into the binary, not just
  passed as a build flag that might silently fall through to a default.
  Keep iOS and Android on the same build/version number where the
  product has one shared version string, so a support conversation about
  "version 2.3" means the same thing on both platforms.

## 3. Screenshots

Real captures only — Apple's guideline 2.3.3 explicitly rejects mockups
and marketing composites presented as screenshots. The reliable pattern
is an automated UI test that runs the actual app, logs in with the review
account against a real (not mocked) backend, navigates to each screen,
and captures the frame — never a hand-held phone photo of a simulator.

Typical device sizes to cover (check current store requirements before
relying on these, they move): a large modern iPhone (Apple's current
"largest" requirement), an iPad if the app supports iPad, and a
representative Android phone and/or tablet for Play. Apple derives
smaller iPhone sizes from the largest set automatically in most cases.

Choose a small set (5-8 images) that tells the product's story in order:
a list or home view, a core structural screen, a single unit/detail view,
the main workflow in progress, a completed/success state, and settings if
relevant. Skip bare login screens and empty states — they say nothing
about what the app does.

Known gotchas, toolchain-agnostic:
- A debug build often shows a visible debug ribbon or watermark — turn it
  off before capturing.
- A simulator or emulator session can keep a previous login across
  reinstalls; log out explicitly inside the test, or wipe the
  simulator/emulator state first.
- Re-navigating to the "same" screen with different parameters sometimes
  doesn't re-render a stateful screen cleanly; navigate through a parent
  screen in between captures.
- Running two capture sessions from the same project directory at once
  tends to collide on generated build artifacts; use separate working
  copies if running in parallel.

## 4. Update flow (app already listed)

See §5 for the dedicated repeat-release checklist. The short version: a
new build gets a strictly higher build number than the last one shipped,
the data inventory diff since the last release decides whether the
privacy forms need updating, release notes are never skipped, and the
review demo account is reverified on the exact environment the new
binary points at before every submission.

## 5. The repeat path — a release when the app is already live

One release = one pass through this list, top to bottom.

### Preconditions (stop if any of these fails)

- The code being shipped is actually deployed to production, with any
  database migrations already applied — a deploy and a migration are not
  the same step, and deploying before migrating (or not migrating at all)
  produces a build that talks to a backend that isn't ready for it.
- The review demo account logs in against production and reaches the
  demo state a reviewer would need to see.
- The data inventory diff since the last shipped build is checked. Any
  new row means the privacy forms change BEFORE submitting, not after a
  rejection points it out.
- **Apple's version slot is free.** If a previous version is sitting at
  "Pending Developer Release" or still in review, App Store Connect will
  not let you create the next version row at all. Release or cancel the
  pending one first — there is no "hold this one, submit the newer build
  instead" option.
- The version string and build number are decided: build number = last
  shipped + 1 on each platform; the version string only bumps for a
  change a user would actually notice.

### Release notes

Write them from what actually shipped (the merged changes since the last
release), user-visible items only, roughly 4-8 bullets, in every
language the listing supports — check what the listing actually has
before assuming it needs multiple languages; a listing with only one
language configured will reject a release-notes field for a language it
doesn't have. On Apple, adding a whole new language to a listing is its
own project (name, subtitle, description, keywords, and its own
screenshot set) — never assume it's just a text-box change.

### Screenshots

Only redo them if the screens actually changed in a way a shopper would
notice. Otherwise leave the existing set alone. If replacing, replace the
whole set in the same order as before rather than appending — most
consoles cap the number of screenshots per listing, so partial
replacement risks hitting that cap.

### Consoles

**Google Play**: if the inventory changed, update the Data safety form
first. Then: the relevant testing or production track → create a new
release → upload the AAB → release notes in every configured language →
review the release → start the rollout (treat "start rollout" as a
deliberate, confirmed action — it's the one irreversible click in the Play
flow). A production rollout can be staged by percentage and paused if
something looks wrong after a few percent.

**Apple App Store Connect**: attach the new build to TestFlight first
(export compliance, "what to test"), then either edit the existing
version page (if the version string hasn't changed and the previous
version isn't released yet) or create a new version (only possible when
no version is currently parked in "Prepare for Submission" — see the
precondition above). Re-check App Review Information is still accurate,
re-check App Privacy if the inventory changed, select the new build, fill
"What's New", and submit for review. Treat "submit for review" the same
way as Play's rollout click — a deliberate, confirmed action, not
something to fire off automatically.

### Record keeping

Whatever record-keeping the team already has for releases (a changelog,
a release issue, a spreadsheet) should get: the version and build numbers
shipped, upload times, which track/stage, who confirmed the rollout or
submission, and the review outcome once it's known. Bump the project's
own version file to match what was actually shipped — a mismatch here is
exactly how the next release accidentally reuses a build number.

### Never park a prepared version

A version sitting in "Prepare for Submission" on App Store Connect holds
the only available version slot — no new version can be created underneath
it. So: decide a prepared version's fate in the same sitting it's
prepared. Either submit it, or don't create the row yet.

If a newer build is ready while an older prepared version is still
parked, do not delete the parked row and do not submit the stale build
just to clear the slot. While a version sits in "Prepare for Submission"
its version string is still an editable field — roll it forward in place:
change the version string to the new one, attach the new build, replace
"What's New". Screenshots, review notes and privacy answers carry over, so
nothing prepared is wasted.

A tester build (TestFlight) and a public submission are independent
decisions — TestFlight's internal testing track in particular needs no
review and no version row at all, so "testers need a build today" is
never a reason a public submission has to wait, and a pending public
submission is never a reason testers have to wait either.

## 6. Accounts, transfers, package names

- A personal Google Play developer account created after the policy
  cutoff (13 Nov 2023 as of this writing — check current policy) must
  complete a closed test with a minimum tester count over a minimum
  number of continuous days before Google grants production access.
  A verified organization account is generally exempt from this. This is
  a one-time gate on reaching production, not a per-release requirement.
- Apple has no closed-testing gate like that, but does require the
  Individual or Organization developer account to belong to (or have
  explicit authorization from) the entity that owns the app's
  intellectual property. An individual account can publish an app on
  behalf of someone else only with clear authorization on file for when
  guideline 5.2.1 gets asked.
- A package name (Android) or bundle id (iOS) is owned by one developer
  account for the life of that app. Moving an app between accounts on
  Android is a self-service "app transfer" request (the current owner
  initiates, the new owner approves); it generally takes a few business
  days and testers do not carry over automatically. If that wait isn't
  acceptable, the fallback is shipping under a brand-new package name in
  the target account — but that means a fresh listing from scratch,
  every declaration redone, and existing users having to reinstall
  side-by-side rather than getting an in-place update. Check nothing
  else (deep links, backend config, associated domains) depends on the
  old package name before doing this.
- Never leave two accounts holding live listings of the same product for
  long — retire the old one once the new one is confirmed working in
  production.

## 7. Review account and rejections

- App Review notes (Apple) or App access instructions (Play) need to
  explain: exactly how to log in (the identifier format, the fixed
  code/password, confirmation that no real message is sent), what the
  reviewer lands on after logging in, where the core flows live, why
  there's no public sign-up if that's the case (often: accounts are
  issued by a business process, not self-serve — cite the relevant
  guideline if Apple asks), what each requested permission is actually
  for, and what any "delete account" action does to a shared review
  account.
- If the reviewer's login fails, fix the backend or the credential
  itself — never swap the demo identifier or code to something new in
  the console as a workaround; that just produces a second,
  inconsistent credential.
- Common rejections and their usual fix: mockup/composited screenshots →
  resubmit with real captures; a privacy-form mismatch → redo the forms
  from the data inventory; a version-string mismatch → make the binary's
  version string equal the console's version page; "can't find a way to
  sign in" → add or clarify the review account; a default/unchanged icon
  → ship a real one; "where's the sign-up flow" → explain the
  company-issued-account model if that's genuinely how the app works.

## Quick reference

| Item | Rule |
| --- | --- |
| Build number | strictly increasing per platform; keep both platforms in step if the product has one shared version |
| Version string | the build's own version string must equal what each console's listing shows |
| Backend URL | production, verified inside the actual uploaded artifact, not assumed from a build flag |
| Review account | fixed identifier + fixed code, reverified against the target environment before every submission, never rotated casually |
| Privacy forms | sourced from a written data inventory, redone whenever that inventory changes |
| Release notes | every upload, every configured listing language, never an empty box |
| The two irreversible clicks | "Start rollout" (Play) and "Submit for review" (Apple) — treat both as deliberate, confirmed actions |

---
Source: store-submission + store-release + app-publishing (google-play.md, apple.md, readiness-check.md, updates.md), as of 2026-11-08.
