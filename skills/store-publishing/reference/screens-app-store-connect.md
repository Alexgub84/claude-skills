# store-publishing: App Store Connect, screen by screen

Last reviewed: 2026-11-08 (console mechanics); state-name wording checked
against Apple's own help pages on 2026-11-11, cited in
`states-and-detection.md`.

Dated screen map for the Apple half of `SKILL.md`. App Store Connect
changes field names and screen layout without notice — if a step below
doesn't match what you see, treat this file as stale for that step, not
the ground truth. Each entry is marked **agent** (drivable with a
browser-automation tool connected), **human** (never an agent action —
see "Human-only steps" in `SKILL.md`), or **desktop** (a terminal/API
step, no browser involved — and for Apple specifically, the preferred
route for almost everything below the listing itself; see
`build-and-upload-desktop.md`).

## Account and membership

- Individual enrollment completes immediately on payment; Organization
  enrollment is reviewed by Apple before it's active (see
  `states-and-detection.md` and `developer-account-setup.md`). —
  *human* for payment and identity; *agent* for filling the enrollment
  form's own text fields once a browser tool is connected.
- **Agreements, Tax and Banking.** The account holder accepts the current
  Developer Program agreements themselves; if the app sells anything, the
  Paid Apps Agreement and banking/tax details are the account holder's to
  enter directly. — *human*, every time this screen is involved.
- **DSA trader-contact verification (Business tab).** A two-step modal:
  step one is a single radio choice (trader under the EU Digital Services
  Act, or not); step two is contact-detail fields (address, city, a
  State-or-Province field that is required even where a country has no
  real equivalent concept — the "Next" button stays disabled until it has
  text, and it is the easiest field on the screen to miss), a phone
  number and an email. — *agent* for filling both steps' fields; **stop
  before the "Next" that leaves step two** — that press sends phone and
  email confirmation codes, and only a human can read and enter them
  (see `developer-account-setup.md` for the full procedure and the
  field-by-field detail). — *human* for the confirmation codes themselves
  and for deciding whether to proceed past that "Next" at all.

## Creating the app record

- App Store Connect → Apps → "+ New App": platform, name, primary
  language, bundle ID (registered separately first under Certificates,
  Identifiers & Profiles), SKU. — *agent*
- The bundle ID locks the moment any build is uploaded against it — even
  a build that's never published — so confirm it's the right one before
  the very first archive, not after.

## The version page

- App Information: category, content rights, age rating questionnaire. —
  *agent* for the fields; the truthful answers come from the app's actual
  behaviour.
- App Privacy labels, from the data inventory (see
  `forms-data-safety-and-privacy.md`). — *agent*
- Pricing and availability, countries. — *agent*
- Version fields: description, keywords (character limit applies —
  check the current limit in-console, it has moved), support URL,
  copyright, release option (manual release keeps the "go live" moment
  separate from "approved" — the safer default). — *agent*
- App Review Information: sign-in instructions if the app needs them,
  review contact, notes (see `rejection-reasons.md` for what these notes
  need to cover). — *agent* for drafting and entering the text; a demo
  credential's password is never pasted here in plain text where it
  becomes a permanent console record (see "Never" in `SKILL.md`).

## ★ Screenshots — a real file input on one slot only

App Store Connect's Media Manager renders exactly **one**
`input[type=file]`, on the **required** "iPhone with Dynamic Island
(medium display)" slot. The **optional** large-display iPhone slot and
the iPad slot are drop zones only, with no file input behind them
(dated, witnessed observation, 2026-10-07).

- **Required medium-display iPhone slot** — a real file input exists.
  Attach images one at a time through it. — *agent*
- **Optional large-display iPhone slot** — drop-zone only. A human drags
  the files in (a Finder-style multi-drop). Once dropped, the **iPhone**
  tiles in this slot *can* be drag-reordered afterward through the page's
  own drag protocol. — *human* for the drop, *agent* for any reordering
  afterward.
- **iPad slot** (when the app supports iPad) — also drop-zone only, and
  unlike the iPhone slots, its tiles do **not** support drag-to-reorder
  once dropped. — *human* for both the drop and any reordering; there is
  no agent-drivable path to change iPad tile order once they land.
- A multi-file drop that overlaps a slot it doesn't belong in can throw a
  dimension-mismatch error for the files meant for a different slot while
  still landing correctly in the right one — read each slot's own file
  counter before treating a red error banner as a failed drop.
- Apple derives the smaller iPhone sizes shown elsewhere from the large
  set automatically in most cases — check the current console behaviour
  before assuming a size needs its own separate capture.

## TestFlight

- Attach the new build; answer the export-compliance question (or rely
  on `ITSAppUsesNonExemptEncryption=false` in Info.plist if that's
  genuinely true, to stop the question recurring). — *agent*
- "What to Test" text. — *agent*
- A build with **Missing Compliance** showing has not had the export
  question answered yet; it won't distribute to a group until it is.

## Export compliance and build selection

- Export-compliance answer on the version page, or the Info.plist flag
  set once at build time (a build/desktop step — see
  `build-and-upload-desktop.md`). — *agent* for the console answer,
  *desktop* for the Info.plist route.
- Selecting the build on the version page. — *agent*

## Submitting

- "Add for Review" assembles the submission. — *agent*
- **"Submit for Review" is one of the two irreversible presses this
  skill never takes on its own.** State exactly what the press does
  (sends this version to App Review) and click only after the person
  confirms in that same turn, in either browser mode. — *agent to click,
  only after explicit confirmation*

## Two traps that cost real time

- **A version sitting in "Pending Developer Release" blocks creating the
  next version row.** There is no "+" next to the app's version list
  while one sits there unreleased — release it or cancel its release
  first; "hold this one, submit the newer build instead" is not an
  available option. See `states-and-detection.md` for why this state is
  not the same as live.
- **"Resubmit" after a rejection stays disabled until "Update Review" is
  pressed first on the version page.** Pressing "Update Review" flips the
  item from Rejected to a resubmittable state; without it, the Resubmit
  action simply isn't clickable, which can look like a stuck page rather
  than a sequencing requirement.

## Session timeout

A long console sitting can end with every URL redirecting to a login
page. Only the account holder can sign back in (password, and likely
two-factor) — this is human-only in both browser modes, and a long
session should expect to hit it at least once. — *human*

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08. State-name and policy-page wording checked against Apple's
own live help pages on 2026-11-11 (cited inline above and in
`states-and-detection.md`).
