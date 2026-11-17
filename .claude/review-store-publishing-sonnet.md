# Audit: `store-publishing` public skill (read-only)

Scope: `SKILL.md` (427 lines) + `reference/*.md` (7 files, 813 lines), 1240
lines total, read in full. Current HEAD content == tag `v1.2.0` (verified
with `git diff v1.2.0 -- skills/store-publishing/` → empty).

## 1. Personal / private data leaks

**Clean. No BLOCKER or MAJOR leak found.** Ran targeted greps across every
file for: the author's legal name (Hebrew + Latin), email, phone, business
registration number, bank name, Apple Team ID, developer-account names,
bundle ids/package names (`com.zinberg.*`, `chillist`, `plumberg`, `koma`,
`bilton`, `xpand`), client names, `handinhandai.com`, `github.com/Alexgub84`,
`claude-skills`, private skill names (`boss-brain-hand`, `browse`,
`store-release`, `store-submission`, `meta-business-setup`,
`meta-waba-per-product`), role names (Boss/Brain/Hand), tooling names
(`cmux`, `Railway`, `wrangler`, `cloudflare`, `claude-in-chrome`,
`playwright`), and any `/Users/...` path. All returned empty except ordinary
English "hand" (e.g. SKILL.md:38 "already in hand", :57 "to configure by
hand", :65 "hand control to a human") — correctly covered by the skill's own
"hand" exception.

- **MINOR** — `reference/screens-play-console.md:147`: *"The console can
  render in whatever language the account's locale is set to, Hebrew
  included."* Not identifying, but it's the one place a non-Israeli reader
  might wonder why Hebrew specifically got named out of every possible
  locale. Harmless; could swap for a neutral example locale if the author
  wants zero trace of personal context, but this is not a leak — nothing
  ties it to the author or his accounts.
- No Israel-specific currency/tax/bank assumption anywhere: fees are quoted
  as Google's/Apple's actual USD figures ($25, $99/year), which are real,
  universal numbers, not a stand-in for an Israeli cost.
- Every "Source:" footer (`SKILL.md:420`, each `reference/*.md` final line)
  says *"generalized from a private, account-specific runbook"* — never
  names the private skill, matching Gate 2's provenance rule.

## 2. Would it actually work for a stranger (fresh Mac; Windows/Linux noted)

- **BLOCKER** — iOS build/signing requires a Mac (Xcode, `xcodebuild`), and
  this is never stated. `reference/build-and-upload-desktop.md:25-30` and
  `:54-63` ("`xcodebuild -exportArchive`", "archive and export... signed
  under the right Apple Developer Program team") assume the reader is
  already on macOS with Xcode installed. A Windows or Linux user following
  Section 3 for the Apple half gets no warning and will simply be stuck
  with commands that don't exist on their machine. The Android half (Gradle,
  Play Developer API) does work cross-platform and this distinction is never
  drawn either.
- **MAJOR** — No check anywhere that a local toolchain exists at all before
  the build step: no mention of Xcode Command Line Tools, Android
  Studio/JDK, Gradle, `fastlane`, or an existing signing
  certificate/keystore as something to confirm first. Section 3 and
  `build-and-upload-desktop.md` go straight into "build from a clean
  checkout," so a user with no dev environment set up gets stuck at step 3
  with no diagnosis of what's actually missing.
- **MAJOR** — No check that the user already has a finished, buildable app
  at all. The skill moves straight from account state to listing/build
  steps; nothing confirms a working project/repo exists before the account
  and listing work starts.
- **MAJOR** — Individual vs Organization (Apple) / Personal vs Organisation
  (Play) is treated as something the console state will reveal
  (`reference/developer-account-setup.md:11-13, 80-82`), but at state 1
  (no account yet) there is nothing to read — the skill never instructs
  asking the user which tier they want before beginning account creation,
  so a driving-mode session has no next click and a narrating-mode session
  has nothing concrete to say.
- **MAJOR** — The browser-tool-connected check (`SKILL.md:59-66`) is
  correctly generic, but once a browser tool is *not* connected, the
  narrating fallback never gives the human the two starting URLs
  (`play.google.com/console`, `developer.apple.com/account`) up front —
  those only appear buried inside `reference/states-and-detection.md:49-50`.
  A fresh user told "I'll narrate" has to wait for the agent to already
  know where to look.
- **MINOR** — No mention of having a payment method ready for the $25
  one-time / $99-a-year fees before starting account creation (Section 1
  treats payment as human-only but never flags "have a card ready" as a
  precondition).
- **MINOR** — No statement that the Android half of this skill is fully
  usable on Windows/Linux even though the Apple half is not — the BLOCKER
  above is as much a missing reassurance as a missing warning.

## 3. The missing preflight

Confirmed: the skill never asks the user anything. (`grep -i '\bask\b'
SKILL.md` returns one unrelated hit — "Both stores ask for these URLs.")
It opens directly with the mode line, then the eight-state ladder, and
expects console-reading to supply every fact. Draft to add at the top of
`SKILL.md`, after the mode line:

> **Before you start**
> - A browser-automation tool connected to this session, or a human at the
>   keyboard to read screens aloud to (Browser mode, above, covers both).
> - Build tooling for the platform(s) targeted: Xcode (macOS only) for
>   iOS, Android Studio/JDK/Gradle for Android — on the machine actually
>   running the build, not this session's machine if different.
> - Signed in (or ready to sign in) to the Google Play Console and/or
>   App Store Connect account that will own this app.
> - A working build of the app, ready to be shipped, before store work
>   starts.
>
> **Questions to ask before anything else:**
> 1. Which store(s) — Google Play, Apple App Store, or both? **(blocking)**
> 2. First submission for this app, or an update to an app already live?
>    **(blocking — changes which state we start detecting from)**
> 3. App name and the exact bundle id (iOS) / package name (Android) it
>    should ship under. **(blocking)**
> 4. Individual or organization account on each store being used?
>    **(blocking at state 1 — nothing to click without this)**
> 5. Who holds (or will hold) the signing keys/keystore — this skill never
>    takes custody of them. **(blocking before any build step)**
> 6. Will this app be available in the EU? If yes, is DSA
>    trader/not-trader status already answered on the account?
> 7. Does the app sell anything (IAP, subscriptions, one-time purchase)? If
>    yes, are tax forms and banking already on file with the store?
> 8. Privacy policy URL — does one already exist on the production domain?
>    **(blocking — both stores require it)**
> 9. Export-compliance / encryption answer: does the app use any encryption
>    beyond standard HTTPS?
> 10. Where will screenshots come from — real device/simulator captures
>     already in hand, or do they need to be taken as part of this work?
> 11. Which release track: internal/closed testing, TestFlight, or straight
>     to production?

## 4. What it should check and does not

- **MAJOR** — Screenshot sizing/dimensions are never stated anywhere in the
  skill (`grep -iE 'px|pixel|dimension|[0-9]{3,4}\s*[x×]\s*[0-9]{3,4}'`
  returns nothing but one unrelated "dimension-mismatch" mention). Both
  stores enforce exact or categorized sizes; a stranger has no way to know
  what to capture.
- **MAJOR** — Bundle id / package id match against the console is stated as
  a rule (`build-and-upload-desktop.md:23-24`) but never as an active
  preflight step — nothing instructs reading the console's own value and
  diffing it against the local project before building.
- **MAJOR** — Version/build number "strictly higher than last shipped" is
  stated repeatedly (`SKILL.md:310`, `build-and-upload-desktop.md:83-85`)
  but nothing instructs actually reading the last-shipped number off the
  console/API first — it's left to memory.
- **MINOR** — Tax/banking completeness for a paid app is described
  (`developer-account-setup.md:142-146`, `screens-app-store-connect.md:24-27`)
  but never added to the Section 5 repeat-release "Preconditions" checklist
  (`SKILL.md:298-311`) — a paid app's submission can proceed to the build
  step with incomplete banking and only fail later.
- **MINOR** — DSA/trader status is covered in depth for first-time setup
  but is likewise absent from the repeat-release Preconditions list — no
  instruction to re-check it still holds before a release that newly
  targets the EU.
- Good (no gap): data-safety/App-privacy consistency is well covered via
  the single data-inventory source and its diff-triggered re-check
  (`forms-data-safety-and-privacy.md`); review-account hygiene and
  re-verification before every submission is explicit and solid
  (`rejection-reasons.md:20-23`).

## Also noticed (outside the four requested groups)

Gate 9 of `publish-public-skill` flags exactly this pattern as a known,
recurring gap: the currently committed `SKILL.md` is tagged `v1.2.0` but
its own `metadata.version` still reads `"1.1.0"` (`SKILL.md:21`). Carry
forward per Gate 9 — fix before the next tag, not as part of this content
audit.
