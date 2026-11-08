# store-publishing: reference

Supporting detail for `SKILL.md`. Policy specifics move — treat anything
here as "true as of the last walk date in SKILL.md," confirm current
policy in-console before relying on a number.

## Google Play

### The account question

The app should be published from the account that actually owns the
product — typically the developer's or the business's own Google Play
Developer account, not a shared account used across many unrelated apps.

- A brand-new account pays Google's one-time registration fee directly.
- A **personal** account created after the policy cutoff (13 November
  2023 at time of writing) must complete a closed test with a minimum
  tester count (12, at time of writing) over a minimum number of
  continuous days (14) before Google grants production access. A
  **verified organization account** (the kind that requires a business
  registration number) is generally exempt. This is a one-time condition
  on reaching production, not something that repeats per release.
- If someone other than the account owner needs to do the console work,
  the account owner invites them into Play Console with only the
  permissions that work needs — never full account admin, never
  financial data access, and never by sharing the account password in
  any form.

### Building the package

- The upload artifact is always a signed release **AAB**. Play no longer
  accepts APK uploads for new apps.
- The package name is permanent once an app record exists with it —
  confirm it before the very first upload, not after.
- Target API level has a floor that Google raises periodically for new
  submissions and for updates to existing apps; check the current floor
  before every submission cycle, it has moved more than once.
- The upload keystore and its password belong to whoever owns the
  account — never commit a keystore to a repository, never log its
  password, never paste it anywhere outside a secrets manager. Enroll in
  **Play App Signing** so Google holds the actual app signing key; the
  upload key then stays replaceable if it's ever lost or compromised.

### Store listing and forms

- Store listing text (per supported language): app name, short
  description, full description, category, support email, support
  website.
- Graphics: feature graphic 1024×500, app icon, at least 2 phone
  screenshots (1080×1920 or an equivalent aspect ratio).
- **Data Safety** form: filled from a written data inventory of what's
  actually collected, shared, encrypted, and deletable — never from
  memory, and never left stale after the app's data collection changes.
- **Content rating** questionnaire: answered truthfully from the app's
  actual behaviour, not optimistically.
- **Target audience** declaration, and an ads declaration (does the app
  show ads, from any SDK, including third-party ones the team didn't
  write).
- Countries/markets to release in, per the product's actual go-to-market
  plan — don't default to "everywhere."

### Submission and the review loop

- Submit to closed testing first if the account still needs to clear the
  tester gate above; submit straight to production if it's already
  eligible.
- Typical review is 1 to 7 days — communicate this as "typically," never
  as a promise, to anyone waiting on the result.
- Every rejection or policy email should be read fully and translated
  into a plain list of exactly what needs to change — never assume the
  summary line tells the whole story.
- Keep console sessions scoped to one app (and one client's account, if
  managing more than one product's listing) at a time; cross-app
  copy-paste mistakes in store text happen more easily than it sounds.

## Apple App Store

### The account question

Apple expects the app to be submitted by the entity that owns its
intellectual property (guideline 5.2.1), and rejects apps that look like
they came from a template/generation service submitted under an
unrelated developer account (guideline 4.2.6). There is no "exempt
organization account" equivalent to Google's D-U-N-S exemption here —
every Apple Developer Program membership, Individual or Organization,
is expected to belong to (or have clear written authorization from) the
app's actual owner.

- Registering as an Individual costs a fixed annual fee, paid directly
  by the account holder, with two-factor authentication required on the
  Apple ID. Apple's own approval of a brand-new account typically takes
  a few days.
- Anyone doing console work on someone else's behalf needs an invite into
  **App Store Connect → Users and Access** with the narrowest role that
  covers the work (Admin or App Manager, depending on what's needed) —
  never a shared password in either direction.
- The account holder accepts the current Developer Program agreements
  themselves under Agreements, Tax, and Banking. If the app sells
  anything, the Paid Apps agreement and banking/tax details are the
  account holder's to fill in directly — nobody doing console work on
  their behalf should see or hold that information.
- None of the upload steps work until the invite is accepted and the
  agreements are signed — confirm this is actually done in the console,
  not just reported as done by whoever registered the account.

### Certificates, provisioning, build, upload

- Certificates and provisioning profiles are created under the
  account's own team; automatic signing works for most project setups.
- Build from a clean checkout of the exact source being shipped — exact
  commands depend on the project's stack (Flutter, React Native, Expo,
  native Swift/Kotlin) and belong in that project's own build docs, not
  reinvented generically here.
- The bundle ID locks the moment any build is uploaded against it, even
  a build that never gets published — confirm the bundle ID with
  whoever owns the product before the very first archive.
- Export compliance: answer honestly based on what encryption the app
  actually uses beyond standard HTTPS. If the answer is "no additional
  encryption," add `ITSAppUsesNonExemptEncryption=false` to Info.plist
  once, to stop the question recurring on every single build.
- Upload straight to App Store Connect from the archive/export step
  rather than exporting an intermediate file when possible — fewer
  places for a stale build to hide.

### TestFlight, listing, privacy, age rating

- Run a TestFlight sanity check on the uploaded build before touching
  the public listing at all.
- Listing fields: name, subtitle (≤30 characters), description, keywords
  (≤100 characters total), support URL, copyright line, screenshots (a
  current large-iPhone size, at least 3 images; an iPad set if the app
  supports iPad), category, pricing, and countries.
- **App Privacy** labels: filled from the same data inventory used for
  Android's Data Safety form, re-checked against what the build actually
  requests permission for — not written once and forgotten.
- Age rating questionnaire, including whatever social/communication
  capability questions the current version of the form asks — these
  change periodically. New builds also periodically need a newer Xcode
  / iOS SDK floor; check this is satisfied before archiving, since it's
  a common first-submission failure for projects that haven't rebuilt in
  a while.
- **Review notes and the demo account**: explain exactly how to log in
  (identifier format, fixed code, confirmation no real message is sent),
  what the reviewer lands on, where the core flows live, why there's no
  public sign-up if that's genuinely the model. Never paste the demo
  credential's password in plain text somewhere it becomes a permanent,
  widely-readable console record — describe how to obtain or use it
  instead where the form allows.

### Submission and rejections

- Submit with manual release unless there's a specific reason for
  automatic release — manual keeps the "go live" moment a deliberate,
  separate decision from "approved."
- First review typically takes 1 to 3 days; a first-submission rejection
  is common enough that it shouldn't be read as a sign anything is
  broken — say so up front to whoever is waiting on the outcome.
- Reply to Apple's reviewer only through App Store Connect's own
  reviewer-reply channel, under the account's own access — never through
  a personal email thread, and never by asking someone else to respond
  to Apple directly on the account holder's behalf.
- Translate every rejection into plain language naming the exact
  guideline cited and the exact thing to change, before anyone starts
  fixing anything.

## Readiness check (run before touching either console)

On a real device, not just a simulator/emulator:

- [ ] Install and run the actual release build without crashing.
- [ ] Log in with the review account and complete the app's core function
      end to end.
- [ ] If the app allows self-service sign-up, confirm there is an in-app
      way to delete the account, reachable without contacting support.
- [ ] Every permission the app requests at runtime matches what the
      privacy policy and the Data Safety / App Privacy answers say is
      collected — no unexplained permission request.
- [ ] If the app sells any digital good inside the app, the purchase flow
      goes through the store's own in-app purchase mechanism, not an
      external payment link — both stores require this for digital goods.

In the build and its metadata:

- [ ] Target SDK / API level meets the current floor for new submissions.
- [ ] App icon and screenshots are the product's own assets — not a
      framework default, not a stock asset or another brand's work used
      without rights.
- [ ] The app name doesn't collide with an existing trademark or listing.
- [ ] No other brand's name, logo, or copyrighted content appears
      anywhere in the build (splash screen, onboarding copy, sample
      data).
- [ ] Package name / bundle id is genuinely final — both lock at the
      first upload to the console, even for a build that's never
      published.
- [ ] Export compliance answer matches what the build actually does.

Output of a readiness check should be specific: not a vague "needs work,"
but a numbered list naming exactly which permission, which policy clause,
or which screen needs a fix, so the fix is unambiguous.

## Updates — version bump versus first submission

### What stays the same as a first submission

- The privacy/data forms only need re-doing for what's new — if the
  update adds a data type, a new permission, or a new category of data
  collection, redo the relevant Data Safety / App Privacy rows for the
  diff. Never carry forward an answer that's gone stale.
- Rejections are handled the same way as a first submission: translate
  to plain language, fix, resubmit.
- Package name / bundle id never change on an update — they locked at
  first upload and stay fixed for the life of the app on that account.

### What's different

**Google Play:**
- No new account setup, no listing from scratch — edit the existing
  listing only where the update actually changed it.
- The closed-testing gate doesn't repeat per update; it was a one-time
  condition on first reaching production.
- The new AAB needs a strictly higher version code than the last shipped
  build.
- Release notes in every configured listing language, every upload,
  never an empty box.

**Apple:**
- New build needs a strictly higher build number; bump the version
  string only if the update is actually user-visible.
- The build's own version string must equal the version string on the
  App Store Connect version page — a mismatch here is a common,
  avoidable rejection reason.
- Metadata (description, keywords, screenshots) carries over from the
  previous version unless the update changed what they describe; "What's
  New" is required on every version regardless of whether anything else
  changed.
- Every update goes through App Review again — usually faster than a
  first submission, but never assume a same-day turnaround.

### Losing the Android upload key

If the signing keystore (or its password) is lost, **Play App Signing**
(mandatory for every app created after mid-2021) makes this recoverable:
the account requests an upload-key reset in Play Console, and Google
keeps shipping updates to the same package name under the app signing
key it already holds. The reset request has its own review delay — it's
recoverable, not instant, so the keystore still shouldn't be treated
casually. The one case with genuinely no recovery path is an app that
opted out of Play App Signing and manages its own signing key — for that
narrow case, a lost key really does mean a new package name and a fresh
listing.

---
Source: store-submission + store-release + app-publishing (google-play.md, apple.md, readiness-check.md, updates.md), as of 2026-11-08.
