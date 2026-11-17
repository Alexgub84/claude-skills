# store-publishing: building and uploading the artifact, outside the browser

Last reviewed: 2026-11-08.

The build and the upload of the actual binary are **desktop steps** —
run from a terminal, never through a browser tool, in either browser
mode. When no terminal is reachable in a session, narrate the commands
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
- The signing keystore (Android) and its password belong to whoever owns
  the account. Never commit it to a repository, never log it, never
  paste it anywhere outside a secrets manager — and delete any local
  copy pulled in for a single build once that build is done.

## Uploading — manual upload through the console is the default

**For a first release, upload the build by hand through the console's
own upload screen.** That's the documented default in this skill: no
extra tool to install, no credential to set up beforehand, and it's
what every stranger following this skill already has available the
moment the account exists.

This is a human click, in both browser modes, with no exception — the
same rule as every other mention of this in `SKILL.md`: **the artifact's
bytes never go through a browser-automation tool's file-attach call**
(see "Why a browser tool's file-attach is the wrong tool," below). With
a browser tool connected, this is the one console action in this
skill's whole flow that still gets handed to the human rather than
clicked by the agent — the human opens the real Play Console / App
Store Connect upload screen in their own browser and selects the file
from disk themselves; the agent resumes driving everything around it
(release notes, declarations, the rest of the release flow) once the
file has landed.

### An automated upload is an optional upgrade, once named tools are set up

Once manual upload has worked at least once, switching to a scripted
upload is a reasonable next step — but only using a real, named tool,
set up once, ahead of time. Don't promise an upload route this skill
doesn't actually teach:

- **Google Play**: `fastlane supply` or Gradle Play Publisher. Both
  need a Google Cloud service-account JSON key, created once in the
  Google Cloud console for the project linked to the Play Console
  account, then granted access under Play Console → Users and
  permissions → Invite new users, with at least Release permission on
  the app. After that one-time setup, either tool uploads the AAB and
  can set release notes and track from the command line.
- **Apple App Store**: `xcrun altool --upload-app`, Apple's Transporter
  app, or `fastlane deliver` — all need an App Store Connect API key
  (Users and Access → Integrations → App Store Connect API in App Store
  Connect), generated once by someone with the Admin role on the
  account, then used as a `.p8` key file plus its key ID and issuer ID.
  An Expo project can use `eas submit` instead, which wraps the same
  App Store Connect API key (and, on Android, the same kind of Google
  Cloud service-account JSON) under Expo's own CLI.
- Either way, the toolchain's own upload step (an
  `xcodebuild -exportArchive` with an upload destination, a `fastlane`
  lane, a direct `gradlew`/Play publishing plugin call) is still a
  desktop step, run from the terminal, never a browser action.

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
