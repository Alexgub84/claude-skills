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
  days, **then applying for production access on that specific app's
  own Dashboard**
  (https://support.google.com/googleplay/android-developer/answer/14151465 —
  read 2026-11-17). **This is per app, not per account** — the live
  page never says a granted application carries to a second app, so
  don't tell a developer shipping their second app that the gate is
  already cleared; each app runs its own closed test and its own
  application. Full detail, including what stays disabled until the
  gate clears and what can send an application back for continued
  testing: `screens-play-console.md`. **On the organisation exemption
  specifically:** that page never uses the word "exempt" for
  organisation accounts — it only ever scopes the requirement to
  personal accounts. Treat "an organisation account doesn't face this
  gate" as this skill's own inference from that scoping (an
  organisation account is, by definition, not a personal account
  created after that date), not as a sentence Google's page states
  outright. If this matters for a real decision, confirm current
  wording in-console before relying on the inference.

### What to do, in order

The closed-testing gate below needs an actual app record and an
uploaded release to run a test against — it cannot happen before state 3
(account ready, no app record) even exists, let alone before an app has
climbed to state 4 or 5. Account verification and app creation are not
interchangeable steps; the gate sits after both.

1. Register the account (personal or organisation) and pay the fee —
   *human*, it's a payment.
2. Complete developer identity verification for the account type —
   *human* for the identity document itself and any human-review step
   the console gates behind a person; *agent* for filling form fields and
   attaching an already-prepared document to a found file input.
3. The account is verified — state 3 begins. Create the app record (see
   `screens-play-console.md`), then walk it through to a build uploaded
   for testing (states 4 and 5 in `states-and-detection.md`).
4. **If a personal account**: open a closed test on **this specific
   app**, with the minimum tester count opted in continuously for the
   required number of days. Setting up the track, the tester list and
   the release is agent-drivable; clearing the continuous-days
   requirement is a matter of time, not a click.
5. **Apply for production access on this app's own Dashboard** — not an
   account-wide switch; a second app repeats steps 4 and 5 on its own,
   even on the same account. Google's own review of the application
   "usually takes seven days or less," and can send the app back for
   continued testing if fewer than 12 testers stayed opted in or
   engagement was judged insufficient. See "The 12-tester/14-day
   closed-testing gate," above, and `screens-play-console.md` for the
   full citation.

### EU trader-status declaration (Play Console → Account details)

Google Play has its own trader/non-trader declaration under the EU
Digital Services Act, separate from Apple's — covered for Apple only
until now, but required on Play too for distributing there. Google's
own wording: "All active developer accounts must declare whether they
are a trader or non-trader under European Economic Area (EEA) and
United Kingdom (UK) laws in Play Console."
(https://support.google.com/googleplay/android-developer/answer/17594752?hl=en
— read 2026-11-17.)

1. **Where**: Play Console → Manage account → Account details → About
   you → Trader status → Declare your trader status, for the
   account-level declaration; Play Console → Monitor and improve →
   Policy and programs → App content confirms the per-app status. —
   *agent* for navigating and reading the current answer.
2. **The choice**: trader or non-trader, defined by Google as "any
   natural or legal person acting for purposes relating to their trade,
   business, craft or profession." Someone publishing as a hobby, with
   no commercial purpose, answers non-trader; anyone distributing as
   part of a business answers trader — the same honesty rule as Apple's
   version of this question (see "DSA trader-contact verification,"
   below): a wrong "non-trader" answer to look simpler is a declaration
   Google can act on, not a shortcut. — *agent* for selecting the
   answer once the account holder has confirmed which one is true.
3. **Deadline**: existing accounts must declare by 1 February 2027; a
   newly created account must declare immediately on creation. A trader
   declaration also requires verifying a public phone number as part of
   the same flow. Missing the deadline blocks submitting app updates and
   removes the developer profile and its apps from Google Play
   worldwide — treat this as a blocking item, not a someday item, once
   the account is this close to the deadline.

## Apple App Store

### Individual vs. organisation membership

- **Individual**: $99/year, no D-U-N-S number needed, enrolled
  immediately once payment completes. The individual's own legal name
  appears as the seller on the store.
- **Organisation**: same $99/year price, but requires the organisation
  to be a real legal entity (no DBAs, fictitious businesses, trade names,
  or branches), **a D-U-N-S number** ("so that we can verify your
  organization's identity and legal entity status" — not required for
  government organisations; Apple's own page adds that requesting one is
  "free in most jurisdictions"), legal authority to bind the organisation to
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
   same turn it's taken — the same discipline as the four presses named
   in `SKILL.md`'s "Never" section, even though this particular "Next"
   isn't one of those four itself.
4. After both codes are confirmed, the Business page's compliance banner
   clears and the contact block shows as verified.

A **Paid Apps Agreement** is separate again, and only needed if the app
will sell anything (one-time purchases, subscriptions, or in-app
purchases): legal entity name, tax forms, and bank account details for
payouts, all account-holder material — never something this skill types
in on its own initiative, and never something it holds onto afterward.

## An app that sells anything: products must exist before review

**Tax and banking being complete does not create a purchasable
product, and this skill previously stopped at "are tax and banking on
file" as if that were the whole check.** If the app sells anything
in-app — a one-time purchase, a consumable, or a subscription — none
of the following is optional before a first submission, on either
store, and each is worth checking before the build is even submitted,
not discovered after a rejection:

1. **The product(s) themselves must actually exist in the console**,
   with the right identifier (matching what the code references) and
   the right type (consumable, non-consumable, auto-renewing
   subscription, non-renewing subscription), before the app version is
   submitted.
2. **On Apple**, a first-submission app with in-app purchases has its
   products reviewed *together with* the app binary — the products
   need to be in "Ready to Submit" status and explicitly attached to
   the version being submitted; a subscription additionally needs a
   subscription group with its own localized name and description.
   Leaving products unattached, or in a draft status, is a common,
   avoidable first-submission rejection.
3. **On Google Play**, the Monetize → Products screens for in-app
   products and subscriptions don't fully activate until **a build
   containing the Play Billing Library has already been uploaded** to
   at least an internal or closed track. Trying to configure products
   before that upload is in place is working out of order.
4. **Try a real sandbox purchase and a restore**, against the actual
   build being submitted, before submitting — Apple's sandbox
   environment and Play's license testers both exist for exactly this,
   and "the code compiles" is not the same claim as "a purchase
   actually completes and a restore actually works."
5. **Selling digital goods or functionality outside the store's own
   billing**, where the store's rules require using it (Apple
   guideline 3.1.1 in particular), is itself a common rejection reason —
   confirm which payment model the app is actually allowed to use on
   each store before building the purchase flow around it, not after.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08 (DSA procedure and field shapes), with every policy and
account-tier claim above checked against Apple's and Google's own live
help pages on 2026-11-11 or 2026-11-09 (dates per citation).
