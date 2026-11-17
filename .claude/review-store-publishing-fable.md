# Review: `skills/store-publishing/` for a stranger (read-only, 2026-11-17)

Scope: SKILL.md (427 lines) + 7 files under `reference/` (813 lines), all read in full. Reviewer: Fable 5.1.
Verdict in one line: the scrub for private data is clean (no BLOCKER leaks); the skill is NOT usable by a stranger end to end because it has no intake, never checks the local toolchain or signing, and hand-waves the build/upload step.

## 1. Personal / private data leaks

No name, email, phone, Team ID, account id, app name, bundle id/package name, client, private repo, `/Users/` path, private-skill name, `docs/`/`local/` path, or Israeli tax/bank/currency term appears anywhere. Grep for `alex|guberman|zinberg|chillist|plumberg|koma|bilton|xpand|/Users/|boss-brain|browse|store-release|store-submission|docs/|local/|israel|shekel|osek|patur|gmail|@` returns nothing. What remains are provenance tells, not identity leaks:

| Rank | File:line | Offending text | A stranger should see |
| --- | --- | --- | --- |
| MINOR | `reference/screens-play-console.md:146-147` | "The console can render in whatever language the account's locale is set to, **Hebrew included.**" | "...the account's locale, which may not be English. Quote the on-screen string and add an English translation." (Drop the language name; it is the one locale-specific fingerprint left.) |
| MINOR | `SKILL.md:421`, and the `Source:` footer of all 7 reference files | "generalized from a private, account-specific runbook" | Either delete the footer or say "Written from real submissions; console wording re-checked on <date>." The phrase invites a reader to wonder whose runbook. |
| MINOR | `reference/developer-account-setup.md:8-9, 32-33, 95-98` | "the original version of this skill didn't mention at all", "This resolves what earlier material in this skill's lineage left unstated" | Internal changelog talk. State the fact plainly; a stranger never saw the "original version". |
| MINOR | `SKILL.md:49-52` | "open an issue in **this repo**" | A ZIP has no repo. Name the public URL: `https://github.com/Alexgub84/claude-skills/issues` (public by design, not a leak). |
| MINOR | `reference/states-and-detection.md:49, 56, 57, 78`; `screens-*.md:78,108` | "dated, witnessed console observation (2026-10-07 / 2026-10-17 / 2026-11-01)" | Keep the dates (they are honest), but the phrase "witnessed" five times reads as one person's diary. "Observed in a live console on <date>" once per file is enough. |
| MINOR | `SKILL.md:244-247`; `reference/rejection-reasons.md:12-19, 39` | "a fixed identifier with a fixed one-time code... no real SMS", "company-issued-account model" | Shaped by the author's OTP-login B2B apps. Already conditional ("if that's genuinely the case"), so acceptable; add "or an ordinary email/password demo account" so a consumer app does not feel addressed sideways. |
| MINOR | `reference/developer-account-setup.md:119-125`; `screens-app-store-connect.md:30-33` | State-or-Province field "required even for a country whose structure doesn't obviously map" | Correct and useful for any stateless country; keep. Noted only because it is the trace of where the author lives. |

## 2. Would it work for a stranger (fresh Mac; Windows/Linux noted)

| Rank | Assumption never stated or checked | Where it bites | What breaks |
| --- | --- | --- | --- |
| BLOCKER | **iOS needs macOS + Xcode (or a cloud build service).** `reference/build-and-upload-desktop.md:25-30, 61` names `xcodebuild -exportArchive` as if it exists everywhere. | §3 "Building the release package" | A Windows/Linux user targeting the App Store cannot build or upload at all and is never told so. The skill should say up front: "iOS build and upload require a Mac with Xcode installed, or EAS/Codemagic/Bitrise; this skill covers only the local Mac route." |
| BLOCKER | **A keystore / upload key and an Apple signing identity exist and the user holds them.** `build-and-upload-desktop.md:37-40` says the keystore "belong[s] to whoever owns the account"; nothing says how to create one (`keytool`), how to check Play App Signing enrollment, or what to do when another developer holds the key. "Automatic signing avoids most certificate problems" (line 30) silently needs Xcode signed into the Apple ID of the right team. | §3 | A first-timer has no keystore; a repeat-release stranger whose previous agency holds the key gets `Your Android App Bundle is signed with the wrong key` at upload and the skill has no branch for it. |
| BLOCKER | **The "preferred" API upload route is unexecutable as written.** `build-and-upload-desktop.md:48-59`: "a script wrapping `edits.bundles.upload`", "a signed JWT against an API key" with no tool named and no setup steps. | §3 upload | A stranger has no such script. Name the real tools: `fastlane supply` / Gradle Play Publisher (Play, needs a service-account JSON created in Google Cloud and granted in Play Console → Users and permissions); `xcrun altool --upload-app` / Transporter / `fastlane deliver` / `eas submit` (Apple). |
| BLOCKER | **A privacy-policy URL exists on "the production domain".** `SKILL.md:236-241` assumes a website and a backend. | §2 step 2; Play "Set up your app" first item; Apple App Information | A stranger with no site is stopped at the very first Play checklist item. Offer the alternative in one line (a hosted page, e.g. GitHub Pages or a Notion/Google Doc public page) and ask for the URL before anything starts. |
| MAJOR | **The browser is signed in to the right identity.** `SKILL.md:129-132` and `states-and-detection.md:49-50` read "lands on a sign-up/enrollment page" as state 1. | Opening state check | A signed-out Google account or an Apple ID without a membership looks the same as "no account"; the agent would start account creation for someone who merely needs to log in. Add "confirm signed in as <email>; a login page is not a state." |
| MAJOR | **How to get driving mode.** `SKILL.md:78-81` deliberately names no extension. | Opening mode line | A stranger in narrating mode is never told "install the Claude in Chrome extension and sign in to both consoles in that Chrome profile" — the one sentence that would move them to the better mode. Generic wording is fine; a one-line pointer is not vendor lock-in. |
| MAJOR | **Android toolchain present** (JDK 17, Android SDK, `ANDROID_HOME`, a `gradlew` that runs). Never mentioned. | §3 | `./gradlew bundleRelease` fails on a fresh Mac; the skill has no "check first" step. |
| MAJOR | **A finished app that builds and runs on a device.** `SKILL.md:33` "takes an app from whatever state its account... [is] in" — the eight states are about the account and listing, never about the code. | §2-§3 | A stranger with a half-done app completes account setup, pays $25/$99, then stalls at §3 with nothing to upload. Ask first. |
| MAJOR | **Platform target.** The mandated report shape `SKILL.md:157-161` prints both stores every time. | Opening check | An Android-only user is walked through Apple states and D-U-N-S questions that do not concern them. |
| MAJOR | **The 12-tester / 14-day gate is a calendar item.** `developer-account-setup.md:36-48` states it correctly but only inside the Google section. | Any personal Play account | A solo developer discovers after paying and building that production is two weeks and twelve friends away. Say it in the preflight. |
| MAJOR | **Play's target API level requirement.** Not mentioned anywhere. | Play upload | An upload with an old `targetSdkVersion` is refused with a policy error the skill never names. |
| MINOR | `SKILL.md:299-301` "code deployed to production, with any database migrations" assumes a backend. | §5 preconditions | Confusing for an offline/local-only app; prefix with "if the app has a backend". |
| MINOR | Node/Expo/Flutter CLIs: `build-and-upload-desktop.md:13` lists toolchains but never asks which one the project uses. | §3 | The skill cannot give the right build command without knowing. |
| MINOR | Narrating mode on claude.ai web has no terminal either (`build-and-upload-desktop.md:7-9` handles it by narrating). Fine, but say the user needs a terminal on a Mac. | §3 | — |

## 3. The missing preflight (draft for the top of SKILL.md, after the mode line)

```markdown
## Before you start

You need, ready and reachable, or this skill will stall partway:
- A finished app that builds and runs on a real device today. This skill publishes; it does not finish the app.
- The developer accounts you intend to use, already signed in **in the browser this session drives**:
  Google Play Console (play.google.com/console) and/or App Store Connect (appstoreconnect.apple.com)
  plus developer.apple.com for certificates and bundle IDs. A login page is not an account state.
- Money and time: Google Play is a one-time US$25; Apple is US$99 per year. A personal Play account
  created after 13 Nov 2023 must run a closed test with 12 testers for 14 continuous days before
  production. An Apple Organization enrollment waits for Apple's review and needs a D-U-N-S number.
- Local toolchain: iOS needs a Mac with Xcode signed into the Apple team (or a cloud build service,
  not covered here). Android needs JDK 17 and the Android SDK. Plus your framework's CLI.
- Signing: the Android upload keystore and its password; the Apple team's signing identity.
  If someone else holds these, get them before step 3.
- A public privacy-policy URL (and an account-deletion URL if the app has sign-up).
- Screenshots captured from the real app, or a device/simulator you can capture them on now.
- Optional, for driving mode: the Claude in Chrome extension connected to this session.

## Questions I will ask before touching a console (B = blocking; I will not proceed without an answer)
1. (B) Which stores: Google Play, App Store, or both?
2. (B) First submission ever for this app, or a new version of an app already live? If live: current
   version string and build number on each store.
3. (B) App identity: Android package name; iOS bundle ID. Do they already exist in the console?
4. (B) Account type: personal/Individual or organisation/Organization? Does the account exist and
   is identity verification complete? Which email owns it?
5. (B) Who holds the signing keys (Android keystore + password; Apple team)? Can you build a signed
   release on this machine right now?
6. (B) Which framework and build command (Flutter / React Native / Expo / native)?
7. (B) Privacy-policy URL (and account-deletion URL if sign-up exists). Does it load publicly now?
8. (B) Export compliance: does the app use encryption beyond standard HTTPS? (Yes / No / Unsure)
9. EU trader status under the DSA: are you distributing commercially (trader) or not? Which address,
   phone and email may be published on EU product pages?
10. Does the app need sign-in? If yes: review demo account identifier and how its login works.
11. Screenshots: do they exist at the required sizes, or do we capture them now, and from what device?
12. Release track for this run: Play internal / closed / open / production (and staged %); Apple
    TestFlight only, or App Review with manual or automatic release?
13. Does the app sell anything (IAP, subscriptions)? Then tax and banking forms are yours to complete.
14. Which countries, and which listing languages, actually ship?
```

## 4. What it should check and does not

| Rank | Check | Today | What to add |
| --- | --- | --- | --- |
| MAJOR | **Agreements in effect (free apps too).** Apple: `states-and-detection.md:99` quotes "your agreements must be in effect" but no step opens Business → Agreements, Tax and Banking before upload. Google: ToS wall covered (`screens-play-console.md:29-36`); Developer Distribution Agreement not named. | Partial | Step 0: read the agreements page on both; an "Action required" banner stops the run until the account holder accepts. |
| MAJOR | **Tax and banking complete** when anything is sold. `developer-account-setup.md:142-146` says it is human material; nothing checks status. | Rule only | Confirm Paid Apps Agreement = Active and a payout account exists before enabling IAP in the version. |
| MAJOR | **Account ready state**: Google identity verification can sit "pending" for days; Apple membership can be expired (apps are pulled). Not checked. | Not checked | Read Play Console → Account details verification status; read developer.apple.com membership expiry. |
| MAJOR | **Google Play's own EU trader-status declaration** (Play Console → Developer account → Account details) is absent; DSA is covered for Apple only (`developer-account-setup.md:108-140`). | Missing | Add the Play row, cited from Google's help page per the skill's own citation rule; without it EU distribution on Play is blocked too. |
| MAJOR | **Privacy forms vs the binary.** `forms-data-safety-and-privacy.md` says "from the inventory", never from the artifact. | Inventory only | Diff the inventory against `AndroidManifest.xml` permissions (`aapt dump permissions`) and Info.plist `NS*UsageDescription` keys of the exact build; any permission missing from the forms stops submission. |
| MAJOR | **Version/build higher than last.** `SKILL.md:310` states the rule; no step reads the last build number off the console and compares it to `versionCode` / `CFBundleVersion` in the artifact. | Rule only | Read both, print both, refuse to upload if not strictly higher. |
| MAJOR | **Bundle id / package name matches the console.** `build-and-upload-desktop.md:22-29` states it; no check. | Rule only | Read `applicationId` / `PRODUCT_BUNDLE_IDENTIFIER` from the build output and compare to the console record before the upload command runs. |
| MAJOR | **Screenshot and icon dimensions.** No sizes anywhere; `screens-app-store-connect.md:95-97` only says sizes "move". | Missing | Before upload, run `sips -g pixelWidth -g pixelHeight` (Mac) on every file; compare against the current per-slot requirement read live from each console's uploader; Apple icon 1024x1024 PNG, no alpha; Play feature graphic 1024x500. |
| MAJOR | **Play target API level** of the AAB meets the current requirement. | Missing | Read `targetSdkVersion` from the bundle and compare with Google's current policy page (cite it). |
| MINOR | **Privacy-policy URL resolves** (HTTP 200, public, no login). | Missing | `curl -sI <url>` before filling the form. |
| MINOR | **Review demo login** against the exact build. `SKILL.md:248-249` says "verify"; no how. | Rule only | Log in once on a device with the submitted build and record the time in the run notes. |
| MINOR | **Release notes present in every configured language.** `SKILL.md:202-203` is a "Never"; no enumeration step. | Rule only | List the listing's languages from the console first, then fill each. |

## Ranked summary
BLOCKER (4): iOS-needs-a-Mac unstated; signing keys assumed; API upload route unexecutable as written; privacy-policy URL assumed. No BLOCKER data leak.
MAJOR (15): no intake/preflight (platform, first-vs-update, identity, keys, toolchain, finished app); signed-in state unchecked; driving mode not reachable; Android toolchain; tester gate as calendar item; target API; agreements/tax/account-ready/Play-DSA/forms-vs-binary/version/bundle-id/screenshot-size checks absent.
MINOR (12): "Hebrew included"; provenance footers; lineage talk; unnamed repo; "witnessed" phrasing; OTP-shaped demo account; backend-shaped preconditions; framework not asked; privacy URL curl; demo login how; release-note language enumeration; State-or-Province trace.
