# store-publishing: creating and verifying the developer account

Last reviewed: 2026-11-11 (every citation below was read live on this
date).

Covers state 1 (no developer account) and state 2 (account pending) from
`states-and-detection.md`, for both stores, including the account-
verification sub-states the original version of this skill didn't
mention at all.

## Google Play

### Personal vs. organisation account

- **Personal account**: the developer name, legal name, legal address,
  and contact details of an individual. Registration costs a one-time
  US$25 fee, paid directly by the account holder
  (https://support.google.com/googleplay/android-developer/answer/6112435 — read
  2026-11-09).
- **Organisation account**: the same contact fields plus a D-U-N-S
  number, an organisation name, address, phone number and website
  (https://support.google.com/googleplay/android-developer/answer/13628312 —
  read 2026-11-11).
- **Developer identity verification** is Google's own named step,
  distinct from registering the account: "As part of ongoing efforts to
  keep Google Play a safe and trusted platform, you must complete
  identity verification when setting up your Google Play Console
  developer account." A personal account needs an official government
  identity document; an organisation account needs that plus the D-U-N-S
  number and an official organisation document
  (https://support.google.com/googleplay/android-developer/answer/10841920 —
  read 2026-11-11). This is the step the original version of this skill
  didn't name at all — it is real, it is Google's own terminology, and it
  happens as part of linking a Google Payments profile during account
  setup.
- **The 12-tester/14-day closed-testing gate** applies, by Google's own
  wording, to "personal developer accounts created after November 13,
  2023" — a minimum of 12 testers opted in continuously for at least 14
  days before production access is granted
  (https://support.google.com/googleplay/android-developer/answer/14151465 —
  read 2026-11-11). **On the organisation exemption specifically:** that
  page never uses the word "exempt" for organisation accounts — it only
  ever scopes the requirement to personal accounts. Treat "an
  organisation account doesn't face this gate" as this skill's own
  inference from that scoping (an organisation account is, by definition,
  not a personal account created after that date), not as a sentence
  Google's page states outright. If this matters for a real decision,
  confirm current wording in-console before relying on the inference.

### What to do, in order

1. Register the account (personal or organisation) and pay the fee —
   *human*, it's a payment.
2. Complete developer identity verification for the account type —
   *human* for the identity document itself and any human-review step
   the console gates behind a person; *agent* for filling form fields and
   attaching an already-prepared document to a found file input.
3. If a personal account: expect the closed-testing gate before
   production access. Setting up the closed test (track, tester list,
   release) is agent-drivable; clearing 14 continuous days is a matter of
   time, not a click.
4. Only then does state 3 (account ready, no app record) begin.

## Apple App Store

### Individual vs. organisation membership

- **Individual**: $99/year, no D-U-N-S number needed, enrolled
  immediately once payment completes. The individual's own legal name
  appears as the seller on the store.
- **Organisation**: same $99/year price, but requires the organisation
  to be a real legal entity (no DBAs, fictitious businesses, trade names,
  or branches), **a D-U-N-S number** ("so that we can verify your
  organization's identity and legal entity status" — not required for
  government organisations), legal authority to bind the organisation to
  agreements, a work email on the organisation's own domain, and a
  working website on that domain. Enrollment is reviewed by Apple before
  it activates — not immediate the way Individual is.
  (https://developer.apple.com/help/account/membership/program-enrollment/ —
  read 2026-11-11). This resolves what earlier material in this skill's
  lineage left unstated: **yes, Apple's Organization tier does require
  its own D-U-N-S number**, with the stated exception of government
  organisations; only the Individual tier skips it.
- A **fee waiver** exists, but only for a nonprofit organisation, an
  accredited educational institution, or a government entity that has
  not signed (or has terminated) the Paid Applications Agreement and
  doesn't otherwise sell digital goods through its apps. An individual, a
  sole proprietor, or a single-person business is explicitly not eligible
  (https://developer.apple.com/help/account/membership/fee-waivers/ — read
  2026-11-11).
- Two-factor authentication on the Apple ID is required to enroll.

### DSA trader-contact verification (App Store Connect → Business)

A separate compliance item, not an account-identity step: until it's
answered, the app's availability in the EU is blocked, but the
developer-account identity and tier are unaffected either way.

1. **Step one** — a single radio choice: "I'm a trader" or "I'm not a
   trader" under the EU Digital Services Act. Answer honestly based on
   whether the account is actually distributing commercially — a wrong
   "not a trader" answer can hide the app from EU availability rather
   than simplify anything. — *agent*
2. **Step two** — contact-detail fields: address lines, city, a State-or-
   Province field, country, postal code, country calling code, a contact
   phone number, and a contact email. **The State-or-Province field is
   required even for a country whose structure doesn't obviously map to
   "state" or "province"** — leaving it blank keeps the "Next" button
   disabled, and it's the field most likely to be missed because nothing
   else on the screen flags it as mandatory. — *agent* for filling every
   field; the values themselves are information a human provides (they
   become visible on EU product pages once submitted, so confirm with
   the account holder which address, phone and email are acceptable to
   publish before typing them in).
3. **Stop before the "Next" that leaves step two**, unless told
   explicitly to proceed. That press triggers Apple's own verification:
   a one-time code to the phone number and a one-time code to the email
   address entered above. Only a human can read and enter those codes —
   this skill never sees them. — *human* for the codes; the decision to
   press "Next" and start that process at all should be confirmed in the
   same turn it's taken, the same discipline as the two irreversible
   "go live" presses this skill always pauses for.
4. After both codes are confirmed, the Business page's compliance banner
   clears and the contact block shows as verified.

A **Paid Apps Agreement** is separate again, and only needed if the app
will sell anything (one-time purchases, subscriptions, or in-app
purchases): legal entity name, tax forms, and bank account details for
payouts, all account-holder material — never something this skill types
in on its own initiative, and never something it holds onto afterward.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08 (DSA procedure and field shapes), with every policy and
account-tier claim above checked against Apple's and Google's own live
help pages on 2026-11-11 or 2026-11-09 (dates per citation).
