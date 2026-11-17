# Council: store-publishing-coverage

- Date: 2026-11-17
- Cwd: `/Users/alexguberman/Projects/claude-skills`
- Seats: openai/gpt-6.1-sol, google/gemini-4-argon, x-ai/grok-4.7, moonshotai/kimi-k3
- Chairman: the calling Claude session

## Brief

# Brief: is this app-store publishing skill missing whole steps or whole user situations?

## Context

I maintain a public, free "skill" (a structured instruction document an AI coding
assistant loads to perform a task) called `store-publishing`. Strangers download it
from a website and install it into their own AI assistant. The assistant then walks
them through getting a mobile app onto Google Play and/or the Apple App Store.

The assistant has two working modes: **driving**, where a browser-automation tool
is connected to the session and the assistant clicks through the store console
itself; and **narrating**, where no browser tool is connected, so the assistant
tells the human at the keyboard what to click and reads their answers back. The
skill never takes custody of signing keys, never attaches the app binary through a
browser-automation tool, and never clicks a legally binding accept on a human's
behalf.

The current content is attached:
- `skill-current.md` - the main instruction file as it stands after a rewrite.
- `skill-reference-all.md` - all its reference files concatenated (developer
  account setup, Play Console screens, App Store Connect screens, data safety and
  privacy forms, build and upload, state detection, rejection reasons).
- `rulings.md` - the work order that produced the current version. Its Design
  section R1 to R11 lists exactly what was just added, so you can see what is
  already handled and not repeat it.

Audience: the skill is written in English for a worldwide audience of solo
developers, small studios and non-technical founders shipping their first app, as
well as developers shipping routine updates. It must work for someone on Windows or
Linux, someone with no developer account yet, someone with no website, and someone
whose app is built with native tooling, React Native, Flutter, Expo or a web-app
shell.

## What was already fixed in this round

A preflight ("before you start") at the top; four blocking intake questions asked
before any console work, with the remaining questions deferred to the step that
needs them; the truth that an iOS build needs macOS plus the no-Mac routes;
manual console upload as the documented default with named optional automation
tools; a no-website fallback for the required privacy-policy URL; a signed-in
versus signed-out disambiguation before reading account state; EU trader status on
both stores, not just Apple; repeat-release preconditions that instruct reading the
real value off the console (last shipped version, bundle id, agreements, tax and
banking, target API level, screenshot sizes) rather than trusting memory; and a
report shape that only mentions the store the user actually targets.

## The question

**What whole steps, checks, or entire user situations is this skill still missing?**

I am not asking for wording improvements or a restructure. I am asking what a real
person could hit, on the path from "I have an app" to "it is live and updatable",
that this skill does not cover at all, or covers so thinly that the person gets
stuck, wastes a review cycle, gets rejected, loses money, or loses control of their
own app or account.

Think deliberately about situations outside the common case, for example and not
limited to: an app that must be transferred between developer accounts; an account
locked, suspended or stuck in identity verification; a team where the person running
the assistant is not the account holder; an app with in-app purchases or
subscriptions that needs products configured before the first submission can even
be reviewed; age ratings and content questionnaires; a game; an app aimed at
children; an app needing a special entitlement or declared permission (background
location, health data, accessibility services, SMS, exact alarms, camera);
region-restricted or regulated categories (finance, medical, gambling, crypto, VPN);
a required demo or test account for the reviewer; phased rollout, staged release and
halting a bad release; what to do when a release is live and broken; app signing key
ownership and recovery if a keystore is lost; closed, open and internal testing
requirements including Google Play's testing requirement for new personal accounts;
localisation of listings; pre-launch report warnings; privacy manifests and
third-party SDK declarations; account deletion requirements; export compliance;
version and build numbering across both stores; what happens to an app that is never
updated; and anything you can think of that I have not listed.

Also consider, separately, what the skill should *refuse* to do or hand back to the
human, and whether any current instruction is dangerous for a stranger to follow.

## Constraints

- The skill is a text instruction document, roughly 500 lines in the main file plus
  reference files loaded on demand. It cannot grow without limit: an addition has to
  earn its place over what is already there.
- It cannot call store APIs on its own behalf; it reads consoles through a browser
  or through the human.
- It must stay vendor-neutral: it may name categories of service, not recommend a
  specific paid vendor.
- It must stay accurate: store rules change, so an instruction that bakes in a
  number or a screen name needs to tell the reader to verify it on the live page.

## What a good answer looks like

A prioritised list of genuinely missing coverage, each item saying: the user
situation, what goes wrong today if the skill stays as it is, and the smallest
addition that would fix it (a new question, a new precondition check, a new
reference section, or a new state in the ladder). Then a clear recommendation of
which few additions matter most and which you would deliberately leave out, with
reasons. A survey with no pick is not useful.


## Attachments

- skill-current.md (30519 bytes)
- skill-reference-all.md (57218 bytes)
- rulings.md (10043 bytes)

## Round 1: answers

### C = openai/gpt-6.1-sol

**Recommendation:** add five compact branches before expanding the general walkthrough: **authority/account recovery, transfers/signing continuity, monetization, policy-sensitive apps, and release recovery.** Also fix several existing instructions that are actively unsafe or strand users.

The skill already mentions ratings, testing, export compliance, review access and privacy. The gaps are mostly **what happens after an answer reveals a nonstandard situation**. A declaration checkbox is not an implementation or approval procedure.

This assessment is against the supplied files; I have not independently verified their dated claims against live store documentation.

## 1. Fix these existing hazards first

These are not wording improvements; they change whether the procedure works safely.

| Current instruction | Risk | Smallest correction |
|---|---|---|
| Apple’s default upload is selecting an IPA in an App Store Connect browser upload screen. | The documented browser route does not provide the general iOS binary-upload workflow being promised. A first-time publisher reaches a nonexistent next step. | Split defaults by platform: Play’s human-operated console upload; Apple’s supported toolchain/upload application route. Give one executable Apple route, including the remote-builder handoff for no-Mac users. This corrects R3’s implementation rather than reopening its intent. |
| Never put the review password in the designated review information; keep it elsewhere. | Reviewers cannot necessarily access that “elsewhere.” The app is rejected for inaccessible functionality. | Enter dedicated, non-production-user review credentials in the stores’ designated reviewer-only access fields. Keep the canonical copy in the team’s secret store; never put credentials in public listing text or logs. Permit coordinated credential replacement and retesting when necessary. |
| Delete any local keystore copy after a build. | A solo developer may delete their only recoverable signing material. | Delete only temporary copies **after verifying a durable, owner-controlled backup and its recovery procedure**. Distinguish app-signing keys from upload keys. |
| A newer build must not leave an Apple version parked; decide to submit in the same sitting. | Creates pressure to submit or release an unready version merely to satisfy the runbook. | Permit intentional draft/approved holds. When blocked, inspect the actual status and supported replace, withdraw or cancel options. Never release merely to free a version slot. |
| Production code and migrations must already be deployed. | Encourages incompatible backend/schema changes before installed clients can update. | Require production readiness **and compatibility with the currently installed version**. Destructive migrations require a separate human-approved deployment plan. |
| Only four named buttons need release confirmation. | Misses equivalent actions: publishing approved changes, enabling automatic release, expanding countries, changing price, or distributing a tester build more widely. | Gate by consequence, not button label: confirm submission, external distribution, increased exposure, money changes and destructive ownership/configuration changes. Include version, audience and release behavior in the confirmation. |
| Play App Signing enrollment is agent-driven despite being described as an agreement click. | Contradicts the human-only legal-acceptance rule; key-custody decisions can have long-lived consequences. | Human handles any agreement acceptance and approves signing-custody choices after consequences are explained. |
| Read only the last **shipped** build number; marketing version changes only for noticeable changes. | An unshipped test/upload may already have consumed a number. An invisible maintenance update can still require a new public version. | Inspect existing uploads across relevant tracks/version trains. Apply platform-specific numbering rules; do not require cross-platform build-number synchronization. |

Also remove the universal “tester channels generally need no review” assumption: **external TestFlight distribution can require beta review**. Testing paths need their own eligibility checks.

## 2. Prioritized missing coverage

### P0 — 1. Delegated operator, unavailable owner, restricted account

**Situation:** A contractor or employee runs the assistant; the account holder is elsewhere. Alternatively, enrollment is stuck, identity verification failed, access was revoked, or the account/app is suspended.

**What goes wrong:** “Who owns it?” does not establish the operator’s authority or permissions. Missing access can be misread as a missing app. A suspension can be treated as routine rejection, prompting repeated submissions or a dangerous replacement account.

**Smallest addition:**

- At the first account check, establish **selected team/developer account, operator role, app access, and reachable account holder**.
- Add an interrupting state: **restricted / recovery required**, separate from “pending” and app rejection.
- Reference section: preserve the exact notice, scope, deadline and case ID; identify the required owner/admin action; use official recovery/support/appeal channels; record the next checkpoint.
- Explicitly prohibit creating replacement accounts or listings to evade enforcement.

**Why first:** This prevents actions in the wrong account and recognizes situations where the assistant must stop rather than “continue the ladder.”

### P0 — 2. Actual app transfers and signing recovery

**Situation:** An agency hands over an app, a company acquires it, an individual incorporates, or a key is missing.

**What goes wrong:** Section 6 largely substitutes a new package/listing for a transfer. That is not continuity: users, purchases, subscriptions, ratings and integrations may not follow. “Retire the old listing” can compound the damage. Apple transfer procedure is absent.

**Smallest addition:** An on-demand transfer/signing section, routed from the existing ownership question:

1. Establish whether this is an existing store record being transferred—not a fresh submission.
2. Check current transfer eligibility and source/recipient standing on the official store pages.
3. Identify dependencies: purchases/subscriptions, sign-in, push, cloud services, shared containers, server credentials, certificates and signing arrangements.
4. Require source and recipient approvals, a pre-transfer inventory and post-transfer verification.
5. Do not remove the source listing or change the identifier as a routine workaround.

For missing keys, first distinguish **Play upload key, Play-managed app-signing key, self-managed app-signing key, and Apple certificates/profiles**. Their recovery consequences differ. Verify backups and authorized recovery options before declaring an app unupdatable.

**Risk:** Transfer details vary by capability. Teach an eligibility/dependency checklist, not a universal sequence that promises every integration transfers automatically.

### P0 — 3. Purchases, subscriptions and paid-app decisions

**Situation:** The app sells digital functionality, subscriptions, physical goods, or services.

**What goes wrong:** Tax and banking checks do not create purchasable products. Review may encounter missing/unsubmitted products, mismatched identifiers, broken entitlement delivery, or a prohibited payment flow.

**Smallest addition:** At “does the app sell anything?”, branch to a short monetization reference:

- Classify what is sold and which billing rules apply for the intended storefronts.
- Obtain human approval for paid/free status, prices, territories and subscription terms; check irreversible store restrictions before selecting them.
- Configure product IDs/types, availability, required metadata and review materials.
- Verify sandbox/license-testing purchase, restore, cancellation/refund/revocation handling and server-side entitlement behavior.
- Check whether initial products must accompany the app submission and whether each product is actually review-ready.

**Risk:** Regional billing exceptions change frequently. Do not infer eligibility for alternative billing or external purchase links; verify the current program and approval requirements.

### P0 — 4. A policy-sensitive feature gate before building/submitting

**Situation:** Children, games with paid randomized rewards, user-generated content, health/finance/gambling/crypto/VPN functionality, or restricted permissions/entitlements.

**What goes wrong:** The current questionnaires record facts but do not discover missing product controls, approvals or evidence. A perfectly completed form can still describe an ineligible app.

**Smallest addition:** One just-in-time question before release preparation:

> Does the app involve children, user-generated content, regulated services, restricted device permissions/capabilities, or purchases with randomized rewards?

Load only applicable subsections covering:

- **Children:** audience selection, applicable family/kids rules, SDK/advertising restrictions, parental gates and consent requirements.
- **UGC/social:** reporting, blocking, moderation and contact/support arrangements.
- **Permissions/capabilities:** inspect the **release artifact’s** permissions/entitlements; check eligibility, approval requests, declarations, prominent disclosures, purpose strings and any required demonstration video.
- **Regulated regions/categories:** licenses, eligible publisher entity, territory restrictions and store approval evidence.
- **Games:** rating-relevant chat/content, ads and purchase mechanics; odds disclosures where required.

**Risk:** This should identify blockers and route to official requirements—not claim to certify legal compliance. Unresolved licensing, child-privacy or medical claims go back to the product owner and qualified advisers.

### P0 — 5. Live-but-broken release and controlled recovery

**Situation:** Review passes, but production login, purchases, startup or migrations fail.

**What goes wrong:** “Pause the rollout” is not a recovery procedure. Already-updated users remain affected. There is no Apple phased-release procedure, hotfix route, or post-release verification.

**Smallest addition:** A compact release/recovery section:

- Before publishing: choose rollout method, observation window, responsible human and stop conditions.
- After publishing: verify storefront availability in intended regions and perform a fresh store install plus an update from the previous public version.
- Check startup, login, purchase/restore and critical backend flows; monitor crash/ANR and business failures.
- On failure: halt further exposure using currently supported controls; assess feature disablement or compatible backend recovery; prepare a higher-numbered hotfix and consider official expedited-review options when eligible.
- Explain explicitly: **halting distribution does not uninstall or downgrade affected installations**. Do not promise a universal rollback button.
- Require human approval before removal from sale, destructive backend changes or broad service shutdown.

The current claim that a rollout percentage can simply be lowered should be verified against the live controls; do not equate changing a number with reclaiming installed releases.

### P1 — 6. Privacy compliance that requires app behavior or binary changes

**Situation:** The app creates accounts, includes advertising/tracking SDKs, or ships third-party SDKs with additional platform requirements.

**What goes wrong:** A deletion webpage and correct labels are treated as sufficient. The binary can still lack deletion, consent, required disclosures or manifest declarations.

**Smallest addition:** Extend the existing privacy reference with a **“forms are not enough”** checklist:

- Account deletion: verify the currently required **in-app and web request routes**, actual backend deletion, subscription implications, retention exceptions and reviewer instructions.
- SDK inventory: record SDK versions, their collection defaults and any required privacy manifests, required-reason API declarations or SDK signatures.
- Tracking: check consent/permission requirements and behavior before consent; do not infer “not tracking” from the absence of an advertising ID.
- Verify privacy-policy accessibility and content against current store requirements. “Any public hosted document works” is too broad if its format, access or content fails those requirements.
- Verify required in-app access to policy/disclosure information.

Export compliance belongs here too: the existing “beyond standard HTTPS” shortcut is insufficient as a decision method. Use the actual encryption inventory and official exemption questionnaire; unresolved classification or filing obligations require human resolution.

### P1 — 7. Testing that people can actually join—and production access that is actually granted

**Situation:** A first-time publisher selects internal, closed, open or external beta testing.

**What goes wrong:** Creating a track does not enroll testers. Testers use the wrong account, cannot see the app, or never satisfy eligibility. The current files also contradict themselves about whether Play’s gate is account-wide or app-specific.

**Smallest addition:** A testing subsection covering:

- Current account/app eligibility and the exact production-access requirement shown for this app.
- Tester lists/groups, invitation or opt-in links, countries, account identity and installation.
- Distinguish internal testing, internal sharing, closed/open testing and production; distinguish internal/external TestFlight.
- Check distribution status, compliance, beta review and build expiry where applicable.
- Verify one real tester completes installation and core flows.
- For gated production access, retain genuine testing/feedback evidence and complete the application truthfully; waiting out a timer alone is not the whole procedure.

Do not mandate closed testing for every Play app regardless of account and goal.

### P1 — 8. Release-artifact validation and upload-processing failures

**Situation:** The development build works, but release optimization, signing, device support or binary validation fails.

**What goes wrong:** “Working, buildable app” is accepted as proof of releasability. The assistant has no branch for processing failures, missing capabilities or release-only crashes.

**Smallest addition:** Add a pre-submission artifact gate:

- Test the signed release build on representative supported devices, including fresh install and upgrade.
- Verify current SDK/toolchain and Android native-library compatibility requirements.
- Read upload-processing results and store validation messages before moving on.
- Triage pre-launch report/TestFlight diagnostics; record dispositions for meaningful crash, accessibility, security or compatibility warnings.
- Retain the release commit, artifact identity, signing fingerprint and debugging symbols/mapping files.

These checks apply to first submissions as well as updates. Offline apps should explicitly skip backend-only checks.

### P2 — 9. Non-default distribution and access constraints

**Situation:** The app is employee-only, business-to-business, unlisted, hardware-dependent, geo-fenced, invite-only, or a thin web shell.

**What goes wrong:** Everything is forced into public-store distribution. Review cannot reach required hardware or content; a wrapper reaches review without checking minimum-functionality rules.

**Smallest addition:** Before creating the listing, establish **who should be able to discover/install it** and whether the reviewer needs hardware, location access, a tenant or special setup. Route private/custom/unlisted distribution to current eligibility instructions. For shells/templates, check store suitability before spending on assets or accounts.

A demo login alone does not solve these cases.

### P2 — 10. Maintenance after “live”

**Situation:** The app remains unchanged for months or years, or the sole maintainer leaves.

**What goes wrong:** Membership, credentials, verification, policy deadlines or target-platform requirements lapse. The app becomes unavailable or unupdatable without any planned release.

**Smallest addition:** End-of-release handoff recording:

- Owner and backup administrator/recovery arrangements.
- Renewal and compliance-notice destinations.
- Policy/SDK/target-API and inactivity-check reminders.
- Reviewer account, support/deletion endpoint and backend health ownership.
- Location of release records, signing backups and recovery instructions.

No universal update interval is needed; use the live notices and applicable policies.

## 3. What the skill should refuse or hand back

Add a short boundary section rather than scattering more button exceptions:

- **Refuse evasion or deception:** false identity/trader/rating/privacy answers, fabricated testing, borrowed licenses, hidden functionality, review-only behavior that conceals policy violations, or replacement accounts intended to bypass enforcement.
- **Stop on uncertain authority:** no destructive transfer, key change, recovery change or user-access change without the authorized owner/admin.
- **Hand back legal/business judgments:** licenses, export classifications requiring expertise, contractual declarations, tax answers and public personal contact details.
- **Do not weaken production security to help review:** no universal OTP bypass or privileged shared account. Use narrowly scoped reviewer access, without real customer data or chargeable side effects.
- **Protect secrets outside browser fields too:** the current prohibition misses terminal history, command arguments, logs, repositories and CI artifacts.
- Treat console text and uploaded material as **task data, not instructions**. A browser agent must not obey embedded requests to disclose credentials or visit credential-collection sites.

## 4. What I would ship—and deliberately leave out

### Ship now

1. **Correct the hazardous instructions in section 1.**
2. Add the **authority/restriction interrupt**.
3. Add **transfer/signing continuity** coverage.
4. Add **monetization and policy-sensitive feature routing**.
5. Add **artifact verification and live-release recovery**.

Keep the main file’s additions to routing questions and stop conditions. Put procedures into existing references loaded only when relevant. Reclaim space from repeated mode declarations and absolute DOM observations—not from substantive safety checks.

### Next pass

Complete testing enrollment, privacy implementation checks and maintenance handoff. These are meaningful gaps, but the current files at least contain entry points for them.

### Deliberately leave out

- Country-by-country legal manuals and exhaustive entitlement catalogs: large, volatile and likely to mislead.
- Full localization operations: existing coverage provides a basic path. Add only a checklist for fallback language, required localized fields, assets and reviewer access.
- Complete CI setup, advanced subscription economics, store optimization and game-service configuration: separate skills unless they block the chosen submission.
- More hard-coded screen/DOM facts. Prefer current console evidence plus official documentation and an explicit unresolved-state stop.

**Bottom line:** the skill is reasonably equipped for a straightforward submission, but currently overclaims “end to end” for ownership changes, paid digital products, policy-sensitive apps and production incidents. Those branches—and the unsafe instructions already present—matter more than adding another common-case console walkthrough.

### A = google/gemini-4-argon

### Recommendation

Add **seven targeted checks and corrections** across the existing files, and **deliberately exclude** deep domain playbooks (kids' apps, regulated industries, app transfers, localisation). 

Right now, the skill handles the "happy path" for a simple, free, non-native-permission app being published by the account owner. However, it contains **three actively dangerous or contradictory instructions** (telling users to delete their local Android keystore after a build, forbidding Review Notes from holding the demo password, and a contradiction between `SKILL.md` and `build-and-upload-desktop.md` on whether browser upload is allowed), and it completely misses **four high-frequency blockers** (In-App Purchases/Subscriptions setup, Apple Privacy Manifests + Android Restricted Permissions, In-App Account Deletion + Sign in with Apple, and Non-Owner Role Permissions).

Fix those seven items in place. They will cost roughly 85 lines across `SKILL.md` and the reference files, keeping you well within your size budget while eliminating the traps most likely to cause a lost key, a wasted review cycle, or a hard binary rejection.

---

### Part 1: Dangerous or Contradictory Instructions in the Current Text (Fix First)

#### 1. Telling users to delete their Android keystore without verifying backup
* **Where:** `reference/build-and-upload-desktop.md` ("*delete any local copy pulled in for a single build once that build is done.*")
* **User situation:** A solo founder generates an upload keystore on their laptop to build their first Android AAB, reads this rule, and deletes the `.jks` file from their laptop without having backed it up to a secrets manager.
* **What goes wrong:** They permanently lose the ability to update their app (or must go through a multi-day support reset with Google if enrolled in Play App Signing, or lose the app forever if not).
* **Smallest fix:** Rewrite that sentence in `reference/build-and-upload-desktop.md` to: *"Never commit the keystore to a repository. Back it up immediately in a password manager or secrets manager; only delete a temporary CI/build-machine copy after confirming the primary backup exists and is restorable."* Add a brief note in `screens-play-console.md` under Play App Signing explaining how to request an "Upload key reset" if the upload key is lost.

#### 2. Forbidding the review demo password from being put in App Review Notes
* **Where:** `SKILL.md` §2.4 ("*Store the credential outside the console pages themselves*"), `reference/rejection-reasons.md`, and `reference/screens-app-store-connect.md` ("*a demo credential's password is never pasted here in plain text*").
* **User situation:** A developer with a login-gated app follows the skill literally and refuses to type the demo account's password or fixed OTP into App Store Connect's "App Review Information" or Play Console's "App access" fields.
* **What goes wrong:** Immediate rejection (Apple Guideline 2.1 / Google App Access policy). Reviewers have no access to the developer's external password manager; the consoles have dedicated username/password fields *specifically* for this purpose. The skill is confusing the rule *"don't paste production admin secrets into the agent chat"* with *"don't give the store reviewer the demo password in the console."*
* **Smallest fix:** Correct all three places: the human *must* enter the demo username and password/fixed OTP into the dedicated "Sign-in information" / "App access" fields in both consoles, while the *agent* must never see, generate, or type that password via browser automation (making the demo password field a **Human-only step**).

#### 3. Contradiction on how the binary is uploaded
* **Where:** `SKILL.md` lines 16 & 214 ("*the build and its upload always run from a terminal or an official store API*") vs. `SKILL.md` line 124 and `reference/build-and-upload-desktop.md` ("*For a first release, upload the build by hand through the console's own upload screen.*")
* **User situation:** The AI assistant reads `SKILL.md` first, sees the absolute rule that uploads only happen via terminal/API, and forces a non-technical founder on Windows to set up Google Cloud Service Accounts and `fastlane` for their very first Android upload—violating Ruling R3.
* **What goes wrong:** The user gets stuck in IAM permission hell before ever uploading an AAB.
* **Smallest fix:** Align `SKILL.md` lines 16, 40, 214, and Quick Reference with Ruling R3: state that the binary is never uploaded *through the browser-automation tool*, and is instead uploaded either *by the human clicking the console's upload screen in their own browser (the default for Android)* or *from a terminal/desktop tool (Xcode, Transporter, or CLI).* Note also that App Store Connect **does not have a browser upload screen** for binaries—iOS binaries *must* go through Xcode, Transporter, `altool`, or a cloud build service.

---

### Part 2: Prioritised Missing User Situations & Steps

#### Priority 1: In-App Purchases (IAP) and Subscriptions first-submission trap
* **User situation:** The app sells a subscription or consumable via Apple IAP or Google Play Billing.
* **What goes wrong today:** The skill asks whether the app sells anything, checks Tax/Banking, and submits the binary. On **Apple**, you cannot test or approve an IAP-enabled app unless the IAP/Subscription products are created in App Store Connect, have metadata + review screenshots attached, and are *explicitly attached to the version page alongside the binary* for the first submission. On **Google Play**, you cannot even create In-App Products or Subscriptions until a binary containing the `com.android.vending.BILLING` permission has been uploaded to a track first. Developers get rejected under Guideline 2.1 ("IAPs not working in review") because the products aren't submitted with the app.
* **Smallest fix:** In `SKILL.md` deferred intake ("whether the app sells anything"), distinguish *paid upfront* vs *in-app purchases/subscriptions* vs *physical goods (Stripe/etc.)*. Add 6 lines to `screens-app-store-connect.md` (create IAPs, upload IAP review screenshot, attach IAPs to the Version page before hitting Submit) and 4 lines to `screens-play-console.md` (upload the billing-enabled AAB to an internal/closed track *first* to unlock the Monetize → Products screens, then activate the products before rollout).

#### Priority 2: Apple Privacy Manifests (`PrivacyInfo.xcprivacy`) & Android High-Risk Permissions
* **User situation:** A React Native, Flutter, or native app uses standard SDKs (Firebase, Sentry, shared preferences, file timestamps) or requests sensitive Android permissions (Camera, Background Location, Health Connect, `READ_MEDIA_IMAGES`, `USE_EXACT_ALARMS`, Accessibility, SMS).
* **What goes wrong today:** 
  * **Apple:** Since May 2024, Apple rejects binaries at upload time (**Invalid Binary** / ITMS-91053) if the app or any embedded third-party SDK touches "Required Reason APIs" (like `NSUserDefaults` or file timestamp APIs) without a `PrivacyInfo.xcprivacy` file, or lacks signatures on listed SDKs.
  * **Google Play:** Play blocks submission or rejects updates if the binary's `AndroidManifest.xml` contains restricted permissions (even inherited transiently from a library) unless the developer fills out the Permissions Declaration Form (with a YouTube video demonstrating the prominent disclosure) or strips the permission via `tools:node="remove"`.
* **Smallest fix:** Add a pre-upload check in `reference/forms-data-safety-and-privacy.md` and `reference/rejection-reasons.md`:
  1. For iOS: check that `PrivacyInfo.xcprivacy` is included for Required Reason APIs if upload fails with ITMS-91053.
  2. For Android: inspect the merged manifest (or Play Console's "App bundle explorer → Permissions") on upload; if Play flags a restricted permission (`ACCESS_BACKGROUND_LOCATION`, `READ_MEDIA_IMAGES`, `REQUEST_INSTALL_PACKAGES`, etc.), either strip the unused transitive permission in `AndroidManifest.xml` or prepare the mandatory video declaration in App Content.

#### Priority 3: In-App Account Deletion & "Sign in with Apple" parity
* **User situation:** The app lets users create an account, and optionally offers Google/Facebook/social login.
* **What goes wrong today:** `SKILL.md` §2.2 only mentions having an *account-deletion page URL* for Google's Data Safety form. **Apple Guideline 5.1.1(v)** requires account deletion to exist *inside the app UI itself* (not just a web link), and it must actually delete the account, not merely deactivate it or open a mailto link. Furthermore, **Apple Guideline 4.8** mandates that if an app offers any third-party social login (e.g., "Sign in with Google"), it *must* also offer "Sign in with Apple" unless it falls under narrow exceptions. Both are top-5 causes of instant rejection for first-time apps.
* **Smallest fix:** Expand `SKILL.md` §2.2 by 3 sentences: if the app has account creation, verify that (a) *in-app* deletion exists in the UI (for Apple) AND a *web* deletion URL exists (for Google), and (b) if any third-party social sign-in is present, "Sign in with Apple" is implemented on iOS.

#### Priority 4: Team Role & Permission Mismatch (User is not the Account Holder)
* **User situation:** The person running the skill is a developer or contractor invited to a client's or company's console, not the Account Holder / Owner.
* **What goes wrong today:** Intake Question 4 asks who owns the account, and `states-and-detection.md` checks if the user is signed in. However, if a signed-in user has the "Developer" or "Marketer" role instead of "Account Holder / Admin", buttons like "+ New App", "Agreements, Tax, and Banking", or "Production Rollout" are missing or greyed out. The agent gets confused by the missing UI elements or misdiagnoses the state.
* **Smallest fix:** In `reference/states-and-detection.md` right after "Signed in or signed out?", add a 4-line check: **"Which role does this signed-in user hold?"** Specify that accepting legal agreements, enrolling in Play App Signing, or setting up tax/banking requires the **Account Holder / Account Owner** specifically (even an Admin cannot sign Apple's Paid Apps Agreement), and creating an app or releasing to production requires **Admin / App Manager / Release Manager**. If blocked by role, stop and hand the step to the Account Holder.

#### Priority 5: Emergency Hotfix / Halting a Broken Live Release
* **User situation:** A release goes live (State 8), and the developer immediately discovers a fatal crash or backend bug.
* **What goes wrong today:** The skill ends at "Live". A panicking developer asks the assistant "How do I roll back?" Neither store supports a true binary rollback to an older version for users who already updated, and mistakes here (like unpublishing the whole app instead of halting the rollout) are destructive.
* **Smallest fix:** Add a short subsection to `SKILL.md` §5 ("If a live release is broken"):
  * **Google Play:** Click "Halt rollout" on the production release immediately (reduces exposure; no confirmation needed per the "Never" rule). You cannot downgrade users who already got the update; to fix them, build a patched binary with a *higher* `versionCode` and ship it.
  * **Apple:** If using Phased Release, click "Pause Phased Release" on the version page (you cannot revert an already-live 100% release without unpublishing the whole app). Ship a hotfix build with a bumped version, and explain when and how to request an **Expedited App Review** cautiously.

#### Priority 6: Web-App Shell / Wrapper Rejection Risk (Apple Guideline 4.2)
* **User situation:** Intake Question 3 explicitly invites users whose app is built with a "web-app shell" (Capacitor, Cordova, PWA wrapper, WebView).
* **What goes wrong today:** The skill treats a web-app shell identically to a native or Flutter build. On Google Play it usually passes; on Apple, a pure website wrapped in a WebView with no native OS integration (push notifications, native navigation, offline behavior, biometrics) is almost guaranteed to be rejected under **Guideline 4.2 (Minimum Functionality)**.
* **Smallest fix:** In `SKILL.md` Intake Question 3 or `reference/rejection-reasons.md`, add a 2-sentence warning: if the build is a web-app shell targeting Apple, warn the user before submission that Apple rejects simple WebView wrappers under Guideline 4.2 unless they include genuine native platform features and feel like an app, not a mobile website.

#### Priority 7: Play Console Pre-Launch Report & Automated Crash Testing
* **User situation:** A developer uploads an AAB to a testing track on Google Play.
* **What goes wrong today:** Google automatically runs Robo scripts on physical Firebase Test Lab devices (generating the **Pre-launch report**). If the app crashes on startup on a specific Android API level or leaks credentials in logs, it flags red errors in the console and frequently triggers a rejection on production submission.
* **Smallest fix:** Add 3 lines in `reference/screens-play-console.md` under "Closed testing, then production": after uploading a build to a testing track, check **Testing → Pre-launch report** once processing finishes to verify Google's automated test devices didn't hit a startup crash before promoting that build to Production.

#### Priority 8: Account Terminated / Suspended or Identity Verification Failed
* **User situation:** The developer's account was previously terminated for policy violations, dormantly closed (Google closes dormant accounts with 0 installs/updates), or failed the ID verification check with no retry left.
* **What goes wrong today:** This falls outside the 8 states (it is not State 2 "Account pending"). Furthermore, if an account is terminated for policy violations, creating a *new* account triggers an automatic "associated account" ban ( wasting their $25/$99 fee).
* **Smallest fix:** Add a note under State 2 in `reference/states-and-detection.md`: if the console shows a red **Account Terminated / Closed / Identity Verification Failed** banner, **STOP**. Do not instruct the user to register a new account (which violates circumvention rules and will be banned); hand back to the human to file an official appeal.

#### Priority 9: App Transfer Between Accounts
* **User situation:** The trigger list in `SKILL.md` frontmatter explicitly includes `"app transfer"`, and §6 mentions it in one sentence for Android only.
* **What goes wrong today:** If a user triggers the skill asking for an "app transfer" on iOS, the skill has zero instructions for Apple's App Transfer flow and misses the preconditions that block transfers (e.g., active TestFlight builds, iCloud entitlements, pending subscriptions, or Play App Signing key alignment).
* **Smallest fix:** Either remove `"app transfer"` from the frontmatter trigger list, or add 5 lines to `SKILL.md` §6 covering Apple's path (App Store Connect → App Information → Transfer App; requires no builds in review/TestFlight active testing and both accounts having active agreements) alongside Google Play's self-service transfer page.

---

### Part 3: What the Skill Should Refuse to Do (Additions to "Human-only" / "Never")

1. **Never enter or generate the review demo account's password** (as noted in Part 1 #2 — make typing the demo password into the console a **Human-only** step, just like the user's own console password).
2. **Never answer medical, financial, government, children's (COPPA/Kids Category), or export-encryption questionnaires on the agent's own judgment.** Currently, `screens-play-console.md` and `screens-app-store-connect.md` mark these questionnaires as `*agent*` ("the truthful answers come from the app's actual behaviour"). The agent does not know the legal regulatory status of the user's company. The agent may *click* the radio buttons in driving mode, but must explicitly read the compliance questions to the human and get the human's answer before selecting them.
3. **Never click "Remove App", "Delete App", "Unpublish", or "Transfer App".** Destructive lifecycle actions are not currently listed in the "Never" block. Add a bullet to `SKILL.md` "Never": *Never unpublish, remove from sale, delete, or initiate a transfer of an app in either mode—hand those clicks to the human.*

---

### Part 4: What to Deliberately Leave Out (and Why)

To keep the skill lean (~500 lines) and maintainable, **do not add playbooks** for the following:

1. **Apps aimed at children / Apple Kids Category / Google Play Families Policy:** The rules here (zero third-party analytics/advertising SDKs unless certified, neutral age screens, COPPA/GDPR-K compliance) are strict product-architecture constraints. If an app violates them, no console walkthrough can fix it—the code must be rewritten. *Just add a 1-line warning in `forms-data-safety-and-privacy.md` that selecting an under-13 target audience activates strict Families/Kids policies that ban most standard analytics and ad SDKs.*
2. **Regulated categories (Gambling, Crypto, Medical Devices, Loans, VPNs):** These require jurisdiction-specific government licenses and pre-authorization forms. They affect <2% of general users and change constantly.
3. **Games-specific services (Game Center, Play Games Services, Chinese ISBN license numbers):** Aside from selecting "Game" instead of "App" at creation, game services are SDK-level features, not core publishing blockers.
4. **Deep Localisation workflows:** You already correctly note in §5 that adding a language on Apple is a full asset project. Teaching translation management wastes space.
5. **Dormant / un-updated app takedown policies:** Both stores send emails months in advance before removing outdated apps; handling that is identical to the standard §5 repeat release path.

---

### Risks of Making vs. Not Making These Changes

* **Risk of NOT adding these:** 
  * A user loses their Android keystore following your current deletion rule (catastrophic loss of app control).
  * Every login-gated app fails review because the skill forbids putting the demo password in the console's review-credentials field.
  * Every monetized app (IAP/Subscriptions) or social-login app fails its first Apple review, burning days of developer time.
* **Risk of ADDING these:** 
  * Context-window bloat if written too verbosely. Mitigate this by placing the detailed mechanics (IAP attachment, Privacy Manifests/Restricted Permissions, Role checks) into the `reference/*.md` files, adding only brief pointer bullets to `SKILL.md`.

### x-ai/grok-4.7 (abstained: The operation was aborted due to timeout)

### B = moonshotai/kimi-k3

## Recommendation up front

Four additions matter most, in this order: **(1) a "live and broken" response path, (2) in-app purchase / subscription configuration before first review, (3) Apple privacy-manifest and required-reason-API check, (4) account suspended/terminated as a handled condition with a hard refusal attached.** Everything else I list is either a one-to-three-line addition or something I'd deliberately exclude. Total growth across all files: roughly 70–90 lines, with detail pushed into the reference files per your existing architecture.

## Ranked missing coverage

**1. A live release is broken — the panic path. (Whole situation, zero coverage.)**
Situation: release is live, users are hitting a crash or a broken backend, founder is improvising.
What goes wrong today: the skill has Play's halt/pause mechanics only as a side-note to staged rollouts, says nothing about Apple, and never says the critical truth: *neither store has a rollback.* The irreversible wrong move a panicked stranger makes is deleting the Apple app record (loses the record permanently) or unpublishing on Play, when the right moves are: Play — halt the staged rollout or ship a fixed build at a higher versionCode (you can re-upload an old APK/AAB re-versioned upward); Apple — request an expedited review of a fixed build, optionally remove from sale.
Smallest fix: a new short section in SKILL.md (~15 lines), covering halt vs. remove-from-sale vs. expedited review on both stores, with an explicit "never delete the app record to stop a bad release" line.

**2. In-app purchases and subscriptions must exist before review. (Whole step, zero coverage.)**
Situation: a subscription app reaches first submission.
What goes wrong today: the intake question "does the app sell anything" feeds only tax/banking. Nobody is told Apple reviews the first IAP *with* the app version (products in "Ready to Submit," attached to the submission; subscriptions need a subscription group and localization), that Play needs products created and active before the release can be reviewed, or that selling digital goods *outside* the store IAP is itself a rejection (Apple 3.1.1) — one of the most common founder rejections, absent from your rejection table.
Smallest fix: a new reference section (~15 lines) plus extending the existing intake hook: "sells anything" branches into *paid app / physical goods / digital goods*, and digital goods adds a precondition at state 5: products configured and attached.

**3. Apple privacy manifest and required-reason APIs. (Check, zero coverage.)**
Situation: any iOS app using listed third-party SDKs or required-reason APIs (nearly every React Native / Expo / Flutter app).
What goes wrong today: the build uploads and stalls at state 5 with ITMS-91053/91061-style failures that look like a toolchain problem. The data inventory covers the *forms*; nothing covers the build-time `PrivacyInfo.xcprivacy` file or the SDK-signature requirement. For this skill's actual audience (heavy RN/Flutter/Expo), this is a near-universal stumbling block.
Smallest fix: ~5 lines in `build-and-upload-desktop.md` plus one repeat-path precondition: verify the manifest exists and covers the SDKs actually linked, citing Apple's SDK list page with the usual verify-on-live-page caveat.

**4. Account suspended, terminated, or stuck in identity verification. (Whole user situation, not in the ladder.)**
Situation: the console opens to a termination banner, or identity verification has been "pending" for weeks.
What goes wrong today: the eight states have no row for this, and the default helpful-AI behavior — "let's just create a new developer account" — is account-evasion on both stores and converts a recoverable situation into a permanent ban. This is the one place the skill's silence is actively dangerous.
Smallest fix: don't add a ninth state. Extend state 2's detection table with restricted/terminated signals, and add one bullet to "Never": *never create, or help create, a replacement developer account in response to a suspension or termination — the route is the store's own appeal process, and it is the account holder's, not this skill's.* Also covers the "stuck in verification" case: hand back with the support/appeal route, don't loop.

**5. Apple app transfer. (Promised by the trigger words, delivered only for Android.)**
Situation: an app moving between Apple developer accounts — an acquisition, a client handoff, an agency that published under the wrong account.
What goes wrong today: the skill's `description` triggers on "app transfer," but §6 covers only Play. Apple's transfer has real preconditions (both accounts in good standing, no version in review, agreements current) and real consequences a stranger won't anticipate: the Team ID changes, so keychain access groups, App Groups, associated domains, and Wallet passes break; APNs keys are account-scoped and must be re-created under the new account.
Smallest fix: ~10 lines in §6: preconditions and consequences, every item marked "verify against Apple's live transfer checklist" to stay within the skill's citation discipline — some of these (iCloud entitlement transferability, e.g.) change and shouldn't be asserted as settled.

**6. Restricted permissions and entitlement declarations. (Thin to absent.)**
Situation: app uses background location, accessibility services, SMS, exact alarms, HealthKit, camera.
What goes wrong today: the rejection table has "permission with no explanation," but Play's gated permissions require *declaration forms* (background location historically required a video) that block a release at state 5, and Apple rejects for missing purpose strings in Info.plist. Neither is named.
Smallest fix: a subsection in the forms reference (~8 lines): named permission categories trigger extra declarations on Play; every iOS permission needs a purpose string at build time; verify current gating on the live policy pages.

**7. Child-directed apps. (Silent trap.)**
Situation: a first-time founder's app targets or appeals to children.
What goes wrong today: the target-audience declaration is listed as just another form. Answering "includes children" silently switches the app into Play's Families policy regime (certified ad SDKs only) and Apple's kids-category rules (no third-party analytics/ads, parental gates). Wrong answers here risk policy action, not just rejection.
Smallest fix: ~4 lines at the target-audience items in both store references: if the audience includes children, stop and read both stores' families/kids policies *before* answering anything else.

**8. Operator is not the account holder. (One-line fix.)**
Situation: an engineer runs the assistant on an employer's account with a Developer role.
What goes wrong today: the Agreements/Tax/Banking screens simply don't render for non-Account-Holder roles on Apple; the session hunts for missing pages.
Smallest fix: one precondition line in state-2 detection and the repeat path: if account-level screens aren't visible, the signed-in identity lacks the role — escalate to the account holder rather than searching.

**9. Lost keystore / apps predating Play App Signing. (Brief explicitly names this.)**
Situation: updating an old self-signed app; nobody knows where the keystore is.
What goes wrong today: intake Q4 asks who holds the keys but gives no branch for "nobody does." For a non-enrolled app, a lost keystore means the app can never be updated again — new package name, fresh listing.
Smallest fix: ~6 lines in §6: enrolled → upload-key reset is routine; not enrolled and keystore lost → say plainly the app is un-updatable and the only route is a new listing; offer Play App Signing enrollment (key upgrade) for old apps *before* loss happens.

**10. One-liners that earn their place:** check Play's pre-launch report warnings after upload (1 line, catches crashes before review does); Apple requires *in-app* account deletion, not just the web URL (1 line in checklist item 2); Apple's support URL gets the same no-website fallback as the privacy policy (extend the existing paragraph by a sentence); an app left untouched still accrues obligations — the target-API floor moves annually and Apple prunes long-unupdated apps (3 lines in §6, closes the "live *and updatable*" promise).

## Deliberately left out

- **Games-specific flows** (Game Center, Play Games Services): the normal path covers a plain game; gambling is caught by the regulated-category note below. Not worth dedicated coverage.
- **Full regulated-category matrices** (finance, crypto, gambling, medical, VPN, news, China ICP): unmaintainable and changes per country. What earns its place is one ~5-line flag section naming the categories and stating that these trigger extra declarations, license uploads, or storefront restrictions — expect to produce licensing documentation and verify on live policy pages. That sets expectations without pretending to cover the law.
- **TestFlight external-test beta review, managed publishing, pre-orders, custom product pages, app bundles:** real but optional; none strand a user.
- **Apple Business Manager / custom B2B distribution:** a different product for a different audience; mentioning it would confuse the audience you named.
- **Web-shell rejection risk (Apple 4.2):** I considered adding it to the rejection table, but the audience clause supports web shells — a single row ("repackaged website / minimum functionality — add native value") is worth one line and no more.

## Refusals and the danger check

Nothing currently in the skill instructs a harmful act — the human-only list, the four-press confirmation rule, and the honesty rules on trader status and privacy forms are all sound. Three gaps to close:

1. **Add the never-create-a-replacement-account refusal** (item 4) — the only place today's silence could produce harmful help.
2. **Fix one understated fact:** Play App Signing enrollment is described as a "reversible-consequence checkbox." Enrollment is effectively permanent for that app — the recommendation is right, the word is wrong, and this is exactly the class of action (irreversible, account-level) where your own "Never" standard demands precision.
3. Consider one more refusal, cheap to state: the skill should decline to *invent* data-inventory answers, age-rating answers, or declaration responses on the user's behalf — it may transcribe what the human confirms, never guess. Your forms reference implies this; say it once in "Never," since these are legal attestations.

## Round 2: rankings

| Reviewer | Ranking (best to worst) |
|---|---|
| openai/gpt-6.1-sol | C: Best prioritization and coverage of ownership, monetization, policy gates, and recovery, with minimal additions and careful caveats; its claims about unseen source files remain unverified.; A: Actionable fixes and concrete blocker checks, but several policy claims are overbroad or brittle, transfer guidance is oversimplified, and its promised scope is internally inconsistent.; B: Useful compact prioritization, but dismisses significant safety hazards, understates testing and delegated-access blockers, and includes overly absolute rollback and transfer claims. |
| google/gemini-4-argon | A: Pinpoints exact file locations for critical existing hazards (keystore deletion, review password ban, nonexistent ASC browser upload), provides concrete platform-specific mechanics (IAP attachment, ITMS-91053, Play billing upload prerequisite), and gives the tightest, most actionable scope within the line-budget constraint.; C: Extremely thorough identification of existing hazards and missing edge cases (including backend migration compatibility and Play App Signing legal-click contradictions), though its proposed additions are somewhat broad and abstract compared to A.; B: Well-prioritized and concise on missing features and budget discipline, but misses the glaring dangerous/broken instructions already present in the current skill text (keystore deletion, forbidden review passwords, and the ASC browser upload impossibility). |
| moonshotai/kimi-k3 | C: Most complete and rigorous: corroborated hazard fixes (keystore deletion, demo-password ban, iOS upload path), full situation/wrong/smallest-fix structure across the widest brief-named gaps (testing enrollment, transfers, distribution models, maintenance), refusal/hand-back section, and disciplined verify-live hedging with a clear ship/defer/omit plan.; A: Strong, mechanically actionable edits with exact file/line targets and accurate store specifics (IAP attach-to-version, ITMS-91053 manifests, Sign in with Apple parity, role gating), but narrower on whole situations like tester enrollment mechanics, non-default distribution, and post-live maintenance.; B: Economical prioritization with good unique catches (Apple transfer consequences, never-invent-answers refusal), but incorrectly declares no current instruction dangerous—missing the keystore/demo-password/upload-contradiction hazards the other two reviewers independently cite—and gives thin treatment to several brief-named cases. |

| Model | Label | Points | Mean position |
|---|---|---|---|
| openai/gpt-6.1-sol | C | 8 | 1.33 |
| google/gemini-4-argon | A | 7 | 1.67 |
| moonshotai/kimi-k3 | B | 3 | 3.00 |

## Cost

| Seat | Prompt tokens | Completion tokens | USD |
|---|---|---|---|
| openai/gpt-6.1-sol | 34794 | 3942 | 0.1264 |
| google/gemini-4-argon | 37161 | 4443 | 0.1188 |
| x-ai/grok-4.7 | 0 | 0 | 0.0000 |
| moonshotai/kimi-k3 | 34848 | 12666 | 0.1832 |
| Total | 106803 | 21051 | 0.4283 |

## Trace

Trace: `/Users/alexguberman/.claude/council/logs/2026-11-17-store-publishing-coverage.jsonl`

| Seat | Round | Response ID | Status | Latency (ms) |
|---|---|---|---|---|
| moonshotai/kimi-k3 | 1 | gen-1794895423-j4f6XRubFjUcOA6VxHyZ | 200 | 63597 |
| google/gemini-4-argon | 1 | gen-1794895422-vXzMj3RUxnwNzCEL1n8W | 200 | 94171 |
| openai/gpt-6.1-sol | 1 | gen-1794895423-vdoZtH466HEzWeGCWd5a | 200 | 105687 |
| google/gemini-4-argon | 2 | gen-1794895930-Zop444kmEqtiAHY8twow | 200 | 7739 |
| openai/gpt-6.1-sol | 2 | gen-1794895930-VhWeWXv4qGum3OfXiljL | 200 | 8817 |
| moonshotai/kimi-k3 | 2 | gen-1794895930-oGtMrEk9oR5A9bMfwYCa | 200 | 31432 |

## Synthesis

_Chairman: the calling Claude session (Opus manager). Three of four seats answered;
`x-ai/grok-4.7` timed out and abstained. Peer ranking put `openai/gpt-6.1-sol`
first (8 points, mean position 1.33), `google/gemini-4-argon` second (7, 1.67),
`moonshotai/kimi-k3` third (3, 3.00)._

### Agreement

All three answering seats, independently, found the same four **hazards already in
the text** — not missing coverage, but present instructions that are wrong or
unsafe for a stranger:

1. **"Delete any local keystore copy once the build is done."** A solo developer
   with no backup destroys their only signing material and loses the ability to
   update the app. All three flagged it. The correction is identical in all three:
   back up first, verify the backup is restorable, and only then delete a
   temporary build-machine copy; distinguish the Play upload key from the
   Play-managed app-signing key, whose recovery paths differ.
2. **The ban on putting the review account's password into the store's own review
   field.** The skill tells the reader to keep the credential "outside the console
   pages". App Review Information (Apple) and App access (Play) are the
   reviewer-only fields the reviewer actually reads; withholding it there produces
   a rejection for inaccessible functionality. The rule should become: dedicated
   non-production reviewer credentials go in those designated fields, never in
   public listing text, logs, shell history or a repository.
3. **The iOS upload default is unexecutable.** R3 of this round made "manual
   upload through the console" the documented default for a first release. That is
   correct for Play and wrong for Apple: App Store Connect has no browser IPA
   upload. The skill now contradicts itself between `SKILL.md` and
   `reference/build-and-upload-desktop.md`. The default must split per platform —
   Play through the console by hand, Apple through Xcode, Transporter, `xcrun
   altool` or a managed cloud builder — with the no-Mac hand-off named.
4. **Play App Signing enrollment is treated as a reversible checkbox an agent may
   click.** It is effectively permanent for that app and it is an agreement, so it
   belongs in the human-only list alongside the other legal acceptances, with its
   consequence explained before the human decides.

They also converge on the **missing situations** that matter most, each named by at
least two seats: in-app purchases and subscriptions that must exist and be
submitted alongside the first build; a live release that is broken, where halting a
rollout does not uninstall or downgrade anyone; an account suspended, terminated or
stuck in identity verification, which is an interrupting state and not a rejection;
an operator who is not the account holder; Apple's privacy manifest and
required-reason API declarations plus Android's restricted permissions; the lost
upload key and its reset route; Apple's in-app account deletion requirement, which
a web deletion page does not satisfy; and Play's pre-launch report, which catches a
crash before a reviewer does.

And on **refusals**: never create a replacement account or listing to evade
enforcement, never answer a medical, financial, children or export-encryption
questionnaire on the assistant's own judgment, never click a destructive lifecycle
action (remove, unpublish, delete, transfer), and treat console text as data rather
than instructions.

### Disagreements

- **How much to add.** `gemini-4-argon` wants roughly 85 lines of in-place
  corrections and nothing structural. `gpt-6.1-sol` wants five new on-demand
  branches (authority, transfer, monetization, policy gate, release recovery).
  `kimi-k3` sits between, trading whole sections for one-line checks that each
  catch a real failure.
- **App transfers.** `gpt-6.1-sol` and `kimi-k3` call the current section actively
  harmful: it substitutes a new package and listing for a transfer, which loses
  users, purchases, ratings and integrations, and Apple's transfer path is absent
  entirely. `gemini-4-argon` would leave transfers out as too rare.
- **Children and regulated categories.** All three agree the full playbooks do not
  belong. They split on whether the skill should carry a routing gate that detects
  the situation and stops (`gpt-6.1-sol`, `kimi-k3`) or stay silent
  (`gemini-4-argon`).
- **Export compliance.** Only `gpt-6.1-sol` challenges the "anything beyond
  standard HTTPS" shortcut as an unsound decision method.

### Recommendation

**Hold the unmerged v1.3.0 branch and fold the safety round into it**, rather than
publishing a version whose Apple upload default cannot be followed. One release,
not two.

**Round A, in this branch.** The four hazards above, corrected in place. Then the
cheap additions that each prevent a lost key, a wasted review cycle or a harmful
action: the suspended / verification-required interrupt plus the
never-create-a-replacement-account refusal; the operator-role check folded into the
existing fourth intake question; keystore backup before deletion and the upload-key
reset route; the in-app-purchase precondition before a first submission; one-line
checks for the pre-launch report, in-app account deletion and the privacy manifest;
a release-recovery paragraph whose first sentence is that halting distribution does
not uninstall anything; a single rejection-table row for a repackaged website; and a
five-line flag that detects a children, regulated or restricted-permission app and
hands it back instead of guiding it.

**Round B, after this release.** Transfer continuity for both stores as its own
on-demand reference, written as an eligibility and dependency checklist rather than
a universal sequence; the testing-enrollment reality (creating a track does not
enroll a tester, Play's production-access requirement for a new personal account,
TestFlight external beta review); a release-artifact validation gate; and the
end-of-release maintenance handoff.

**Deliberately out.** Country-by-country legal matrices, kids-category and
regulated-industry playbooks, game services, localisation operations, business or
custom distribution, and continuous-integration setup. Each is volatile, large, or
a different product for a different reader.

### Confidence

High on the four hazards: three independent seats found them without prompting,
their corrections agree, and one of them contradicts a ruling this manager made
earlier the same day. High on Round A's content. Medium on the Round A versus
Round B split, which is a judgement about how much a single instruction file can
carry before a reader stops reading it. Unverified by anyone here: every dated
store fact in the attached files was taken on trust, and no seat opened a live
store page.
