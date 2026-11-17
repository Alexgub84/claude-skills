# store-publishing: building and uploading the artifact, outside the browser

Last reviewed: 2026-11-08.

The build is always a desktop step — run from a terminal, never through
a browser-automation tool, in either browser mode. **The upload differs
by platform, and the two are not interchangeable: Play has a genuine
browser upload page; Apple does not.** See "Uploading," below, for the
split. When no terminal is reachable in a session, narrate the commands
below for whoever is at one instead of trying to route the artifact
itself through a browser-automation file-attach call.

## Building, toolchain-agnostic

Whatever the toolchain — Flutter, React Native, Expo, or a native
Swift/Kotlin project — build from a clean checkout of the exact commit
being released, never from a working directory with uncommitted changes.
Uncommitted edits leaking into a store binary are hard to notice after
the fact and harder to undo once submitted.

- **Android**: a signed release **AAB**, never an APK for a store upload.
  The build/version number (`versionCode` or equivalent) must be
  strictly higher than the last one shipped — Play refuses a repeat. The
  package name embedded in the bundle must match the one the target Play
  account actually owns; a mismatch fails at the upload step, not at
  submission.
- **iOS**: archive and export (or upload directly to App Store Connect
  from the archive step), signed under the right Apple Developer Program
  team — the same team the app record and its certificates belong to —
  with a build number strictly higher than the last one shipped, and the
  exact bundle identifier the App Store Connect record was created with.
  Automatic signing avoids most certificate problems.
- **Both**: the build must point at the production API/backend, verified
  as actually baked into the binary — not just passed as a build flag
  that could silently fall back to a default if the flag is ever
  dropped. Where the product has one shared version string across
  platforms, keep iOS and Android on the same build/version number, so a
  support conversation about "version 2.3" means the same thing on both.
- **The signing keystore (Android) and its password belong to whoever
  owns the account.** Never commit it to a repository, never log it,
  never paste it anywhere outside a secrets manager. **Never delete a
  local keystore copy as routine cleanup.** A solo developer with no
  other copy who deletes it has just made their own app permanently
  unupdatable — there is no "regenerate" for a lost signing key. The
  correct order is: back the keystore up to a password manager or
  secrets manager first, confirm that backup actually restores (open it
  back up from the backup, don't just trust that the copy step
  succeeded), and only then delete a *temporary* copy that was pulled
  onto a disposable build machine or CI runner for a single build —
  never the one durable copy. This distinguishes two different keys
  with two different recovery paths:
  - **The upload key** (used to sign the AAB handed to Google) — if
    it's lost or compromised and the app is enrolled in Play App
    Signing, Google's own "Request upload key reset" flow in Play
    Console → Setup → App signing replaces it without losing the app;
    not enrolling first is what makes this unrecoverable.
  - **The app-signing key itself** — Play-managed (Google holds it once
    enrolled in Play App Signing; recoverable through Google's own
    process) versus self-managed (the developer holds the only copy;
    losing it with no backup means the app can never receive an
    in-place update again, full stop — a brand-new package name and
    listing is the only route forward, per §6 in `SKILL.md`).

## Uploading — the default splits by platform

**The two stores are not symmetric here, and treating them as if they
were strands an Apple-only reader on a step that doesn't exist: Play
has a genuine browser upload page; App Store Connect does not have one
for a build at all.** This corrects an earlier version of this skill
that named "manual console upload" as the default for both — right for
Play, impossible for Apple.

### Google Play's default: upload by hand through the console

**For a first Play release, upload the AAB by hand through Play
Console's own upload screen.** No extra tool to install, no credential
to set up beforehand — what every stranger following this skill already
has the moment the account exists. This is a human click, in both
browser modes, with no exception: **the artifact's bytes never go
through a browser-automation tool's file-attach call** (see "Why a
browser tool's file-attach is the wrong tool," below). With a browser
tool connected, this is the one console action in this skill's whole
Play flow that still gets handed to the human rather than clicked by
the agent — the human opens the real Play Console upload screen in
their own browser and selects the file from disk themselves; the agent
resumes driving everything around it (release notes, declarations, the
rest of the release flow) once the file has landed.

### Apple's default: the toolchain itself — there is no browser route

**App Store Connect has no page where a human (or an agent) drags or
selects an IPA to upload it.** The only routes onto Apple's servers are
desktop tools talking to Apple's own upload service directly, so one of
these is the default, not an upgrade, for every Apple release, first or
repeat:

- **Xcode Organizer's "Distribute App"** — the built-in route when the
  archive step itself ran on a Mac: Window → Organizer → select the
  archive → Distribute App → App Store Connect → Upload.
- **Transporter** — Apple's own free upload app (Mac App Store), for
  uploading an already-exported `.ipa` without reopening Xcode.
- **`xcrun altool --upload-app`** — the command-line route, usable from
  any script or CI job that already has the signed `.ipa` and an App
  Store Connect API key.

**For a reader with no Mac**, this is exactly where the no-Mac routes
named in "Before you start" (in `SKILL.md`) matter in practice: a
borrowed/rented Mac, a cloud macOS machine, or a hosted macOS CI runner
can run any of the three tools above; or, for a React Native/Expo
project, a managed cloud build service (`eas submit`, for instance)
produces the signed artifact **and** performs this exact upload
remotely, with no local Mac and no local Xcode/Transporter/`altool`
step at all.

### An automated upload is an optional upgrade — on Play only

Once Play's manual upload has worked at least once, switching to a
scripted upload is a reasonable next step on Play — but only using a
real, named tool, set up once, ahead of time:

- **Google Play**: `fastlane supply` or Gradle Play Publisher. Both
  need a Google Cloud service-account JSON key, created once in the
  Google Cloud console for the project linked to the Play Console
  account, then granted access under Play Console → Users and
  permissions → Invite new users, with at least Release permission on
  the app. After that one-time setup, either tool uploads the AAB and
  can set release notes and track from the command line.
- There's no equivalent "upgrade" framing on Apple's side, because the
  toolchain route above already *is* the default, not a fallback.
  `fastlane deliver` (wrapping `altool`) or `eas submit` just add
  convenience — release notes, track selection, metadata — on top of
  the same App Store Connect API key (Users and Access → Integrations →
  App Store Connect API in App Store Connect; generated once by someone
  with the Admin role, used as a `.p8` key file plus its key ID and
  issuer ID).
- Either way, the toolchain's own upload step (an
  `xcodebuild -exportArchive` with an upload destination, a `fastlane`
  lane, a direct `gradlew`/Play publishing plugin call) is a desktop
  step, run from a terminal, never a browser action, on both platforms.

## Why a browser tool's file-attach is the wrong tool for this specific step

A browser-automation tool's own file-attach call generally ships the
file's bytes over its own control channel in one message, which has a
real, much-lower-than-you'd-expect ceiling — well under what a typical
release artifact weighs in at (a real-world release bundle in the tens
of megabytes has been observed failing through this exact path, where
the artifact itself was nowhere near any store's own size limit — the
browser tool's transport, not the store, was the actual ceiling). Relying
on it for the artifact risks a silent stall or an outright failure that
looks like a console problem rather than a tooling limit. Use the API or
the toolchain's own upload step instead; reserve a browser tool, if one
is connected, for everything around the artifact — the console fields,
the declarations, the release notes — not the artifact's bytes
themselves.

## Version and build-number bookkeeping

- Build number: strictly increasing per platform, every upload, no
  exceptions — a repeat number is refused outright on at least one
  store's side and silently risks confusion on the other.
- Version string: the binary's own version string should equal what the
  console's listing/version page shows, every time — a mismatch here is
  a common, avoidable rejection reason, not a cosmetic detail.
- After a manual override of either number at build time, make sure the
  project's own version file is bumped to match in the same change — a
  forgotten bump means the next ordinary build silently reuses a number
  that's already been shipped.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08.
