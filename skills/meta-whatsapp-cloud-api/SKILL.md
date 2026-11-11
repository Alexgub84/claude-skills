---
name: meta-whatsapp-cloud-api
description: >-
  Get a Meta business portfolio verified and the official WhatsApp Cloud
  API (not a third-party reseller API) wired up end to end: find out
  which of four verification states an account is actually in, diagnose
  a rejection, prepare a resubmission with the right document types, and
  bring up the Cloud API itself — app, WABA, test number, system-user
  token, real phone number, webhook, smoke test, templates. When a
  browser-automation tool is connected to the session, drives the
  matching console screens directly (clicking, selecting, attaching
  files); otherwise narrates each screen for a human to click. Use when
  working on Meta business verification, a rejected or stalled
  verification, the WhatsApp Cloud API, a Meta developer app, a WABA, a
  system user token, or connecting a product to the official WhatsApp
  Business Platform. Not for Meta's own paid support tiers, and not for
  moving a number between WhatsApp Business Accounts once a portfolio is
  already verified and live — that's a narrower, separate procedure.
metadata:
  version: "1.1.1"
  last-walked: "2026-11-08"
---

# meta-whatsapp-cloud-api

This skill takes a Meta business portfolio from whatever state its
verification is actually in to a verified portfolio and a working
WhatsApp Cloud API — app, WABA, real phone number, webhook, and a first
delivered template message. It starts by finding which of four states
the account's verification is actually in, rather than assuming a
rejection is already in hand. When a browser-automation tool is
connected it drives the console itself; otherwise it narrates each
screen for a human to click, one at a time.

This procedure was last walked against the real Meta Business Suite and
developer console on 2026-11-08. Meta changes these screens, field names
and wizard flows often and without notice — if a step below doesn't match
what you see, open an issue in this repo rather than guessing, and send a
PR with the correction if you find one.

## Browser mode

Two ways to run this skill, chosen by what's actually connected to the
session — nothing to configure by hand:

- **A browser-automation tool is connected** (a Chrome-extension-style
  browser tool, reachable from this session). Check two things: the tool
  is available to the session at all, and a connected-browsers/tabs
  listing call — whatever this session's tool calls it — returns at
  least one entry. When both are true, drive the matching console
  screens directly: click, select from dropdowns, attach files, per
  `reference/screens-business-verification.md` and
  `reference/screens-developer-console.md`. Stop and hand control to a
  human only for the steps in "Human-only steps," below.
- **No browser-automation tool is connected** — for example, this skill
  uploaded into claude.ai on the web with nothing else attached.
  Narrate every numbered step below for whoever is at the keyboard
  instead; that's what the rest of this file already reads like.

The FIRST line of this skill's first reply in a session states which
mode is active, in one sentence, before anything else — not "near the
start," the very first thing said: "Browser mode: driving — a browser
tool is connected" or "Browser mode: narrating — no browser tool is
connected, I will tell you what to click." Don't make the person guess
from behavior alone, and don't let a step chosen first (jumping straight
to "Documents in hand," say) skip this.

This file deliberately doesn't name a specific extension, vendor or
internal tool beyond "a browser-automation tool": the check above is
generic on purpose, so it works with whatever a given session happens to
have connected.

### Human-only steps

Regardless of which mode is active, these never become an agent action:

- A reCAPTCHA, or any other "prove you're human" challenge.
- A confirmation code — an SMS, voice, or email one-time code.
- A two-step PIN.
- A password, or an access token, typed or pasted into any form field.

Attaching a document that's already been prepared — a bank letter, a
utility bill, an app icon — is different. With a browser tool connected,
that's this skill's job: finding the upload control (often a file input
hidden behind a styled button) and handing it the file's path directly,
no OS file picker involved. The human's part is producing or choosing
that file beforehand, offline, never inside the live wizard — this skill
never authors, crops, retypes, translates or otherwise "cleans up" a
document itself.

## Which of the four states this account is in

Opening checklist, in order, even when a user jumps straight to a later
step like "Documents in hand":

- State the browser mode first — see "Browser mode," above: "Browser
  mode: driving — a browser tool is connected" or "Browser mode:
  narrating — no browser tool is connected, I will tell you what to
  click."
- Before assuming a rejection, check the Graph API field and the console —
  every account is in exactly one of four situations:

| State | Meta's own field | Console (Security Center) |
| --- | --- | --- |
| Never started | Field absent, or `not_verified` / `ineligible` / `pending_submission` | "Start verification," no draft in progress; "Ineligible" specifically when nothing is attached yet to verify |
| Submitted, waiting | `pending` | "In review" chip, no "Learn more" action to click |
| Rejected — Meta wants something from you | `pending_need_more_info` (seen in practice), or `failed` / `rejected` / `expired` / `revoked` (documented, not yet seen on a real screen) | A "Learn more" button opens "Details & next steps" — the ONLY place the actual reason text lives; the Graph field never carries it, only that something is wrong |
| Verified | `verified` | Heading shows the legal name; the same state also shows at WhatsApp Manager → Settings → Business verification |

Check it with one call, which needs no browser, no login and no
extension — the single cheapest, most reliable way to catch a status
change, since Meta's own notification email goes to whichever address is
set as the portfolio's admin contact, which is very often not an inbox
anyone checks daily. Find out which address that actually is (Business
settings → Business info names the portfolio's admin contact) before
relying on email at all, and check that inbox at least once a day for as
long as anything is in review — Meta does not resend a notification that
sat unread, and the Graph check below is a supplement to watching that
inbox, not a replacement for it:

```bash
curl -s "https://graph.facebook.com/v25.0/$WABA_ID?fields=business_verification_status" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**On the enum values.** Meta's own Graph API field reference
(https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/
— read 2026-11-11) documents the field as
`enum {expired, failed, ineligible, not_verified, pending, pending_need_more_info, pending_submission, rejected, revoked, verified}`,
with a single one-line description — "Current status of business
verification of Meta Business Account which owns this WhatsApp Business
Account" — and no per-value explanation. Only three of those ten values
— `pending`, `pending_need_more_info`, and `verified` — have actually
been matched against a real console screen so far; the table above puts
the other seven (`expired`, `failed`, `ineligible`, `not_verified`,
`pending_submission`, `rejected`, `revoked`) into the branch their names
most plausibly describe (not-started vs. refused outright), as the best
reading of the name alone, not a confirmed fact. If one of those seven
turns up in practice and the console disagrees with the branch above,
trust the console text over this table, and send a correction.

## Never

- Resubmit a rejected verification the same day it was rejected. Fix the
  actual problem, wait 24 hours, then submit. Same-day retries tend to
  get flagged for an even longer review.
- Guess or "clean up" the legal name, address or phone number entered
  into Business info. Copy them character-for-character from the
  document that will be uploaded to prove them.
- Author, crop, retype, translate, or otherwise "clean up" a document
  before attaching it. Only ever attach a file a human has already
  produced and placed somewhere this skill can reach — a faithful format
  change (PDF to a high-resolution PNG, say) is fine; changing what's
  actually printed on the page is not. Reading a document — opening it
  to extract the name and address actually printed on it, as in
  "Documents in hand" below — is not covered by this rule; only editing
  what's on the page is forbidden.
- Put a confirmation/OTP code, a two-step PIN, a password, or an access
  token into any form field through an automated fill call, with a
  browser tool connected or not. Those move only through a human typing
  them directly into Meta's own console.
- Treat a long-running `pending` status as "Meta is just slow" without
  re-checking the actual status field (see "Which of the four states
  this account is in," above). It can silently become "needs more
  information," and the notification email tends to land in an inbox
  nobody actively watches.
- Offer a sole-proprietor tax-registration certificate as proof of legal
  name or address, if the local jurisdiction's equivalent isn't on
  Meta's accepted-document list for that purpose — see the worked
  example in "Picking the right document set," below. Meta states
  plainly when a document "isn't an accepted type"; read that message
  instead of assuming a well-known local document will be accepted
  because it's official.
- Submit with the legal business name absent from the website's actual
  homepage. Meta fetches `/`, not an About or Terms page, and fails
  verification on this specifically if the name isn't there.
- Add outside collaborators as full portfolio users just to get help with
  a task. That's an explicit rejection reason in Meta's own list — use a
  narrower partner/collaborator access level instead.
- Type a verification code, a two-step PIN, or any password into
  anything other than Meta's own console, typed by the account holder.

## 1. Business verification

Start here once "Which of the four states this account is in," above,
says **Never started** or **Rejected — Meta wants something from you**.
The other two states need nothing from the rest of this section:

- **Submitted, waiting** → nothing to do. Re-check the Graph field in a
  day or two instead of opening a support thread.
- **Verified** → nothing here applies. See the Quick reference table at
  the bottom of this file for what changes once verification lands.

When the state is **Rejected**, open Security Center's "Learn more" /
"Details & next steps" dialog first — it's the only place the actual
complaint text lives — then match it against
`reference/rejection-reasons.md`'s table of reasons and fixes before
touching anything else below.

### What verification is, and isn't

Business verification in Meta Business Suite is a different thing from the
paid Meta Verified subscription, and it does not produce a verified badge.
Meta states this directly: "Verifying your business in Meta Business Suite
is different from Meta Verified for businesses and won't give you a
verified badge." (Meta Business Help Center, "How to verify your business
in Meta Business Suite",
https://www.facebook.com/business/help/2058515294227817
— read 2026-11-09 — the same sentence is restated at
https://www.facebook.com/business/help/2342133782492969
— read 2026-11-09).
The verified badge is specifically a Meta Verified benefit: "Meta Verified
for businesses is a paid subscription that provides tools to help you build
more confidence with new audiences and protect your brand. This
subscription comes with benefits like the verified badge, enhanced support,
impersonation protection, and more."
(https://www.facebook.com/business/help/308979828303560
— read 2026-11-09).
Meta Verified is billed on a recurring basis and is a separate purchase
from the free verification procedure this skill covers.

What business verification actually unlocks, in Meta's own words: "Business
verification is required to access certain advertising, developer, billing
and spending features."
(https://www.facebook.com/business/help/2058515294227817
— read 2026-11-09).
Spelled out further on
https://www.facebook.com/business/help/1095661473946872 (read 2026-11-09):
the daily spending limit, eligible developer features, Meta Business
Partners access, the News Page index, the WhatsApp Business Platform, Page
transparency, agencies based in China, and financial-services advertiser
status. For the WhatsApp Business Platform specifically, the same page
says: "Businesses using the WhatsApp Business Platform may need to complete
verification to access certain features." On the developer side: "Advanced
Access now requires Business Verification... Apps that request advanced
access for permissions and apps that allow other Businesses to access
their own data must be connected to a Business that has completed Business
Verification."
(https://developers.facebook.com/docs/development/release/business-verification/
— read 2026-11-09).

Checked and not found on any of the pages above, or on Meta's account-
scaling page for WhatsApp
(https://www.facebook.com/business/help/595597942906808
— read 2026-11-09):
any statement from Meta about how many times to resubmit before stopping,
or advice to fix documents at the root rather than resubmit again. That
advice is common on third-party agency blogs but Meta does not say it
anywhere checked for this skill, so it isn't repeated here as fact. The
"Never" list above sticks to what Meta's own pages do support: a timing
rule, not a count.

### Picking the right document set

Meta's own accepted-document categories (read directly off its "Details &
next steps" dialog, which only appears once a verification attempt has
actually run):

| Proves | Accepted types |
| --- | --- |
| Legal business name | Certificate/Articles of Incorporation, a business license or permit, a bank statement, or a bank letter |
| Address | The same four, plus a utility bill — water, gas, electric or phone |

For a registered company, the incorporation certificate is usually the
cleanest single document. For a sole proprietor with no company
registration, there is often no exact equivalent — don't assume a
jurisdiction's generic small-business tax registration certificate
counts, even though it feels like the obvious document. **Worked
example (Israel):** an Israeli sole proprietor's `עוסק פטור`/`עוסק מורשה`
certificate is explicitly rejected by Meta ("isn't an accepted type"),
even though it is the standard proof of legal trading status in Israel.
What worked instead was a bank account-ownership letter for the legal
name (most banks can issue one on request, specifically for business
verification) plus a utility bill for the address — one document from
each of the two accepted categories, each printing the name or address
exactly as entered in Business info. The full rejection-reason table —
what Meta's console says and the usual fix for each — lives in
`reference/rejection-reasons.md`.

General rules that hold regardless of jurisdiction:
- A single document carrying both the name and the address in full,
  clearly, satisfies both requirements in one upload.
- Hebrew, or any non-English script, is accepted as-is — no translation
  required — but pick one language for name/address and use it
  consistently across Business info, the website homepage, and the
  documents themselves.
- Reject, on sight, as not worth attempting: leases, a personal (not
  business) bill, a screenshot of a portal page, anything cropped,
  annotated, or otherwise edited, and any document older than about 90
  days except formal registration papers.
- A faithful full-page render from one file format to another (PDF to a
  high-resolution PNG, say) is fine; cropping or retyping any part of it
  is not.

### Documents in hand

Before anything is submitted, and before opening the wizard, ask which
documents are actually available — not which ones would ideally exist.
Walk through the accepted categories in the table above and have each
candidate document handed over as a PDF or an image. Reading it is
fine; it's editing it that's forbidden (see "Never," above — a document
is read, never authored, cropped, retyped, translated, or "cleaned
up").

For each document actually in hand:

1. Read what's printed on it: the exact legal name, and the exact
   address if it carries one.
2. Compare that, character for character, against two things: the
   Business info fields, and the legal-name line on the website's own
   homepage.
3. Flag every difference, down to a missing word, an abbreviation, a
   transliteration spelled two different ways on the same document, or
   an address that's simply stale because whoever issued the document
   was never told about a move. A document that looks official can
   still carry the wrong information printed on it.
4. Say which two documents (ideally one per category — name, and
   address or phone) are the ones to actually submit, and which field —
   Business info, or the homepage text — has to change to match the
   document. The document is never the thing that gets changed; it was
   already issued by someone else. If a field disagrees with a document
   that's otherwise right, fix the field. If the document itself is
   wrong for the purpose (the wrong name on it, an expired date), it
   doesn't go in the pile at all — go get a different one.

This step catches two real failure modes before either one costs a
review cycle: a document that doesn't actually prove what it's being
submitted to prove, and a silent mismatch between a document and
Business info that would otherwise only surface once Meta's own review
flags it.

This step always ends with a required output block, in this exact
shape, naming no fact beyond what the documents and fields already say:

```
Submit these 2:
<filename> — <category: legal business name | address>
<filename> — <category: legal business name | address>
Fix before submitting:
<mismatch> — <which side changes: the field, or nothing (go get a
different document)>
Do not submit:
<filename or "none"> — <why it's ruled out, or omit the line>
```

"Submit these 2" is always exactly 2 named documents — never 1, even
when a single document in hand genuinely carries both the name and the
address and would, on paper, cover both accepted categories (see
"General rules that hold regardless of jurisdiction," above). Meta's
wizard still asks for a document per category; offering one document
to cover both is the riskier submission, not a shortcut, because it
leaves no second document if that single one gets challenged. Name a
second document from the other category, even an imperfect one, rather
than resting on one. If the person holds truly only 1 usable document,
say that plainly instead of forcing a second line — "Submit this 1 — no
document for the other category is in hand yet" — and name what kind of
document to obtain for the missing category, per the table in "Picking
the right document set," above.

### Preparing the portfolio before submitting

- Business info fields must mirror the uploaded document exactly,
  punctuation and legal suffixes included (a company suffix like "Ltd"
  either appears in both places or neither). Decide which language to
  standardize on and use it everywhere.
- The website must be reachable, serve HTTPS, show no error or
  under-construction state on any page, and — this is checked
  separately and fails independently of reachability — show the exact
  legal name on the **homepage** specifically. A domain registered very
  recently is also more likely to raise suspicion; a domain with some
  age behind it fares better.
- The business email should be on the same domain as the website. A
  free consumer email domain measurably increases the rejection rate and
  slows review when it isn't.
- Pick a listing category that honestly matches the business — a
  sensitive category (finance, health, gambling, alcohol) invites extra
  scrutiny and extra required documents.
- Two admins on the portfolio with two-factor authentication enabled on
  both tends to reduce friction; a lone unprotected admin is itself
  listed as a rejection trigger.
- Whatever asset needs verifying (usually a WABA) must already be
  attached to the portfolio before starting — otherwise the verification
  entry point itself is greyed out as "ineligible."

If the website keeps failing its own check even once the above is fixed,
Meta documents two alternative ways to confirm the business identity
instead of a working website: a confirmation email on a different
domain genuinely associated with the business, or confirming by business
phone number instead.

### The confirmation channel changes which documents you need

Whichever confirmation channel is chosen during the wizard changes what
the upload step actually asks for:
- Phone call, SMS, or WhatsApp message as the channel → the wizard then
  wants documents proving the legal name **and a phone number**.
- Email as the channel → the wizard wants documents proving the legal
  name **and an address or phone number**.

So pick the channel to match whatever documents are actually easiest to
obtain, not the other way around — if a bank letter and a utility bill
are what's available, choose email.

### Submitting

Go to the verification entry point (Security Center, in Meta's current
layout), pick the use case that matches what's being verified (there is
usually a separate option specifically for setting up a WhatsApp Business
account — prefer that one over a generic "app permissions" option if both
exist), and walk the wizard: country, business type, business details, a
CAPTCHA (always completed by the human account holder, never by this
skill), a public-records match step, the confirmation channel, document
upload, and a final review/submit. With a browser tool connected, the
screen-by-screen mechanics — which fields are dropdowns, which upload
control is a hidden file input, which single wrong click resets a code —
live in `reference/screens-business-verification.md`; walk it screen by
screen instead of improvising.

Two traps worth expecting on the public-records step and the upload
step, in brief (the full detail, with every screen in order, is in
`reference/screens-business-verification.md`):
- Meta may offer a public-records match that looks plausible but belongs
  to a different, unrelated entity with a similar name. Verify every
  identifying detail (address, domain, any tax or registration number
  shown) before accepting a match — claiming someone else's business
  record is a policy violation that can restrict the whole portfolio, not
  just fail this one verification. When in doubt, choose "my business
  isn't listed."
- Some document-upload steps default an easy-to-miss toggle ("did your
  document include your phone number or address?") to "No," which then
  demands an entirely separate second document most applicants don't have
  lying around. If the single document already uploaded does carry both
  pieces of information, flip that toggle to "Yes" and the extra step
  disappears.

After submitting, expect roughly 1-2 business days for a channel-verified
submission and 3-7 (up to 14 during Meta's periodic policy-update windows)
for a document-based one. Don't touch the submission while it's "pending"
— don't add admins, change settings, or open a support thread on a whim;
none of that speeds up a queued review, and anything that creates a
disagreement with what was submitted can only hurt.

### Re-checking status after submitting

Don't rely on the notification email to tell you a status changed — see
"Which of the four states this account is in," above, for why. Re-run
that same Graph call periodically instead of waiting to be told; the gap
between a status silently flipping to "needs more information" and
someone actually noticing has cost real submissions a full review cycle.

## 2. Bringing up the Cloud API (works before verification lands too)

Every step below works on an unverified portfolio — verification only
changes the messaging-volume ceiling, not whether the API itself works.
Bring the two up in parallel rather than waiting for one before starting
the other. A business portfolio must already exist (created at
business.facebook.com) before step 1 — the step below attaches a new app
to that existing portfolio, it does not create one. With a browser tool
connected, the exact console mechanics for every step here — menu paths,
UI quirks, which clicks are agent-drivable and which aren't — live in
`reference/screens-developer-console.md`; the underlying Graph calls,
with example `curl` commands and the values seen in practice, live in
`reference/api-checks.md`.

1. **Create the app.** In the developer console, create an app using the
   WhatsApp-focused use case ("connect with customers through WhatsApp,"
   or the equivalent in whatever the current console calls it), and
   attach it to the **existing** business portfolio — never create a new
   portfolio for this, which would restart verification from zero.
2. **Attach or create a WhatsApp Business Account (WABA).** The app's
   WhatsApp setup panel either connects to an existing WABA or creates
   one. Record the WABA ID and the test phone number's ID somewhere
   durable.
3. **Try the Meta-issued test number first.** It's free for a limited
   trial period, supports a handful of pre-approved recipient numbers
   (each needing a one-time code to whitelist), and is the fastest way to
   prove the webhook and message-sending code work before a real SIM is
   involved. It can't carry a reviewed display name, and it never goes
   through business verification itself — both only start to matter once
   a real number replaces it.
4. **Generate a system-user access token**, not a temporary user token.
   A system user with the right role, assigned to the app with
   management access, can generate a token with no expiry — the
   permissions needed are generally the messaging and WABA-management
   scopes; a broader business-management scope is also needed if the
   integration will ever read verification status or delete a WABA via
   the API rather than the console. Temporary tokens from quick-start
   panels expire within a day and should never ship in production.
5. **Add the real phone number.** It must not currently be active in a
   consumer WhatsApp or WhatsApp Business app — if it is, delete the
   account inside that app first and wait roughly 24 hours before adding
   it to the Cloud API. Registering a number still tied to the consumer
   app from the Cloud API side fails outright. Once added, it typically
   needs an SMS or voice one-time code, followed by registering it on the
   Cloud API with a two-step PIN the account holder chooses. A number
   that must keep answering from the WhatsApp phone app needs a
   different route (coexistence) that this skill doesn't cover.
6. **Add a payment method to the WABA specifically**, not just at the
   portfolio level — a WABA with no payment method on file eventually
   blocks all outbound business-initiated messages with no warning beyond
   an API error code, even though the free test number keeps working.
7. **Configure the webhook.** It needs a public HTTPS endpoint that
   answers Meta's verification handshake (echo a challenge value when the
   stored verify-token matches) and that always returns a 200 on the
   actual message-delivery POSTs, whatever the internal processing
   result. Validate the signing header against the app's secret before
   trusting a payload, and deduplicate on each message's own id since
   Meta retries. Subscribing to webhook fields (the "messages" field
   specifically) is a separate toggle from saving the callback URL —
   check both are actually set after any change, since saving the URL
   again has been known to silently clear the field subscription.
8. **Publish the app.** An app left in its default development mode
   silently discards production traffic in both directions — an outbound
   send still returns a success-looking response with no error, and
   nothing is actually delivered; inbound webhooks are dropped the same
   silent way. This is stated outright in the console once you look at
   the right settings page, and is worth checking first in any
   "messages aren't arriving" investigation, before suspecting the token,
   the number, or the payment method. Publishing to live mode generally
   just needs a privacy policy URL, an app icon, and a category filled in
   under the app's basic settings — no formal review step for this.
9. **Run a smoke test**: send one approved template message and confirm
   both the API response carries a message id and the webhook actually
   receives the resulting status/reply. There's no polling endpoint for
   delivery status in the Cloud API — it only ever arrives through the
   webhook, so a quiet phone with no webhook traffic at all is the first
   thing to check before assuming the message failed.
10. **Create any message templates the product needs** before relying on
    them outside the 24-hour reply window — any message initiated by the
    business toward a user more than 24 hours after that user's last
    message needs an approved template, not free-form text.

## 3. One WABA per product

If more than one product or client sends WhatsApp messages through the
same Meta business portfolio, give each one its own WABA and its own
app, rather than sharing one WABA across products. Webhooks are
delivered per-WABA, not per phone number — an app subscribed to a WABA
receives every number's traffic in that WABA, all signed with the same
app secret, so a signature check alone can't separate one product's
messages from another's. A recipient-id filter in code (checking the
destination phone-number-id on every inbound event, failing closed when
it's unset) is good defense-in-depth regardless, but the structural fix
is separate WABAs: separate quality ratings, separate messaging-limit
ladders, and no risk of one product's bad sends dragging another's limit
down.

Before troubleshooting anything about a message that seems to have gone
nowhere, confirm the destination app is actually published (step 8
above) — an unpublished app is the first thing to check when messages
appear to succeed but never arrive, and it produces no error anywhere.

Moving an already-registered number from a shared WABA onto its own,
dedicated WABA is a bigger, separate procedure (new app and WABA
creation, backing up and restoring the WhatsApp business profile,
migrating approved templates across, freeing the number from its old
WABA, then re-adding and re-registering it on the new one) — out of scope
for this skill, which only covers getting a number live for the first
time.

## Quick reference

| Thing | Unverified portfolio | After verification |
| --- | --- | --- |
| Business-initiated conversations / 24h | 250 unique contacts, shared across the whole portfolio | 1,000 immediately, then stepping up further by usage and quality |
| Registered phone numbers | A small fixed cap per portfolio | A much higher cap per portfolio |
| Display name | Accepted but shown small, no formal review | Reviewed, shown normally in chats |
| Replies inside the 24h customer window | Unlimited, free-form, doesn't count against any limit | Same |

Verification isn't the only way to step up from the 250-contact tier.
Meta's own messaging-limits documentation
(https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits
— read 2026-11-11) names, among its scaling paths to the 2,000-contact
tier: "Send 2,000 delivered messages outside of customer service
windows to unique WhatsApp user phone numbers within a 30-day moving
period, using templates with a high quality rating" — no verification
required, just that usage and quality history.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08. The status-field enum in "Which of the four states this
account is in" was read directly off Meta's own live Graph API
reference on 2026-11-11.
