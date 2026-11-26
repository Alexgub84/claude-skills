# If there is a phone app too

Last reviewed: 2026-11-26

Short, because most readers do not need this on day one, and honest, because
the part people leave out is what a phone app cannot prove without a real
device.

The two ideas from the server side carry over unchanged:

- **The local data layer is real.** The same embedded engine the app ships
  with, migrated for real, not a stand-in. A phone app's local database is
  usually more load-bearing than the server's, because it is what the app
  shows when the network is gone.
- **Exactly one outside thing is faked**, through the same shape: one
  interface, a real implementation, a scripted fake that records calls and
  refuses an unscripted one. For a phone app that one thing is usually the
  server's API rather than a model call; the shape is identical.

What is different is that there are three tiers instead of one, and that the
tool for the top tier depends on your toolkit and does not transfer between
toolkits.

## Tier 1 — Logic and screen tests, on the computer

No device, no emulator. The app's own test runner, running the real code
against the real local data layer. This is where most of the value is and it
is the tier to build first.

- A Dart/Flutter app: the toolkit's own test command over a test folder.
- A React Native or Expo app: a JavaScript test runner with the toolkit's
  testing library for rendering screens.

What belongs here: the rules, the data layer, what a screen shows for a
given state, what happens when a request fails. What does not: anything that
needs the operating system to be real.

## Tier 2 — A screenshot tier, if your toolkit has one

An image per screen, rendered during the test and compared pixel for pixel
against a copy committed to the repository. A difference dumps both images
plus a diff so a person can look.

Worth its cost in one situation specifically: **a layout that must work in
two text directions.** A change that looks correct in a left-to-right
language can silently break the right-to-left version — a label overlapping
an icon, a chevron pointing the wrong way, a number flipped. Nothing else
catches that automatically, and nobody notices by eye unless they read that
language. Commit one image per screen per direction and the pair becomes a
single assertion.

The cost is real: every deliberate design change updates images, and a
font-rendering difference between two machines can make them fail for no
product reason. Generate the committed images on one agreed platform.

Flutter has this tier built in. A React Native project generally does not,
and buying it is rarely worth it unless the two-direction problem above is
yours.

## Tier 3 — A device tier

The real app, driven on an emulator, a simulator or a real phone. Slow,
valuable, and the tool is **toolkit-specific**:

- **A Dart/Flutter app** uses the toolkit's own `integration_test` driver,
  or Patrol, a wrapper around it that adds reliable tapping and native
  permission dialogs. Flows are written in Dart, in an `integration_test`
  folder, and run on a connected device or emulator.
- **A React Native or Expo app** usually uses Maestro, whose flows are plain
  YAML files, one per flow, run against either the development client or the
  standalone built app. A flow is a short list of steps: launch the app by
  its identifier, tap an element by its test id, assert some text is
  visible, take a screenshot.

```yaml
# maestro/submit-request.yaml — the whole shape, in one file
appId: com.example.intake
---
- launchApp
- tapOn: { id: "new-request-button" }
- inputText: "my parcel never arrived"
- tapOn: { id: "submit-request" }
# One assertion, written for every language this app ships in, or the
# flow passes only in the language its author speaks.
- assertVisible: "Request received|Anfrage erhalten"
- takeScreenshot: request-submitted
```

Pick the one for your stack. Do not read the other one's documentation and
try to translate; they do not have the same model of what a flow is.

Two things that make a device flow worth keeping rather than deleting after
a week:

- **Target elements by a test id**, never by position on screen and never by
  a label that is translated. A flow that taps coordinates breaks on the
  next device size.
- **Match text in every language the app ships**, as alternatives in one
  assertion, or the flow passes only in the language the author speaks.
- **Make each run's data unique** — a name with the run's timestamp in it —
  so a flow can run twice without colliding with its own leftovers, and so a
  failed run leaves evidence you can find.

Device flows normally run against a real staging server with a real test
account, not against a faked API. That is a deliberate exception to "fake
exactly one thing": at this tier the thing under test is the whole system,
and a faked server would remove the point.

## What no automated tier catches

State this to the user plainly. It is the honest part and it is why the last
section exists.

- **A camera, microphone or sensor behaving like the real thing.** A
  simulator's camera is a picture of a camera. Whether a photo taken in a
  dark room is usable is not a thing any test knows.
- **Whether a push notification actually arrives.** Delivery goes through the
  platform's own service, a real device token and a real network. A test can
  prove your app asked for the notification to be sent. It cannot prove a
  phone on a train received it.
- **A real radio going away.** Airplane mode, a lift, a tunnel, a flaky
  connection that half-succeeds. A mocked offline flag is not the same
  event, and the difference is where sync bugs live.
- **Store review behaviour.** A reviewer uses hardware, an account and a
  network you do not control, and a build configured differently from the one
  you test. Something that only happens in a release build only happens
  there.
- **Whether a person can find the button.** A screen can be present,
  correct, fully covered by tests, and unusable.

## The consequence: keep one hands-on pass

A mature suite still keeps one ordered, written, hands-on walk before every
release. Not because the automated tiers are weak — because features kept
passing every automated check and then breaking in the operator's hands: a
missing button, a screen nobody opened in that role, a flow that worked in
one language and not in the other.

What makes it work rather than become a ritual:

- It is a **numbered list in the repository**, not a memory. One line per
  step, each naming the role it is performed as.
- It covers **every role** the app has, because a screen that is correct for
  an administrator can be empty for everybody else.
- It is run in **every language the app ships**, starting with the one most
  of its users read.
- It includes at least one **genuinely offline** step on a real device, with
  the radio actually off.
- The person who ran it **records the date and what they saw**, in the same
  file, so a regression has a last-known-good.

That file is the cheapest artefact in this whole procedure and the one that
catches the failures nothing else does.
