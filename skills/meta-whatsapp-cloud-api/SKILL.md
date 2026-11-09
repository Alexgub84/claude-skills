---
name: meta-whatsapp-cloud-api
description: >-
  Get a Meta business portfolio verified and the official WhatsApp Cloud
  API (not a third-party reseller API) wired up end to end: diagnose a
  rejected business verification, prepare a resubmission with the right
  document types, and bring up the Cloud API itself — app, WABA, test
  number, system-user token, real phone number, webhook, smoke test,
  templates. Use when working on Meta business verification, a rejected
  or stalled verification, the WhatsApp Cloud API, a Meta developer app,
  a WABA, a system user token, or connecting a product to the official
  WhatsApp Business Platform. Not for Meta's own paid support tiers, and
  not for moving a number between WhatsApp Business Accounts once a
  portfolio is already verified and live — that's a narrower, separate
  procedure.
---

# meta-whatsapp-cloud-api

This procedure was last walked against the real Meta Business Suite and
developer console on 2026-11-08. Meta changes these screens, field names
and wizard flows often and without notice — if a step below doesn't match
what you see, open an issue in this repo rather than guessing, and send a
PR with the correction if you find one.

## Never

- Resubmit a rejected verification the same day it was rejected. Fix the
  actual problem, wait 24 hours, then submit. Same-day retries tend to
  get flagged for an even longer review.
- Guess or "clean up" the legal name, address or phone number entered
  into Business info. Copy them character-for-character from the
  document that will be uploaded to prove them.
- Treat a long-running `pending` status as "Meta is just slow" without
  re-checking the actual status field (see §2). It can silently become
  "needs more information," and the notification email tends to land in
  an inbox nobody actively watches.
- Offer a sole-proprietor tax-registration certificate as proof of legal
  name or address, if the local jurisdiction's equivalent isn't on
  Meta's accepted-document list for that purpose — see the worked
  example in §1. Meta states plainly when a document "isn't an accepted
  type"; read that message instead of assuming a well-known local
  document will be accepted because it's official.
- Submit with the legal business name absent from the website's actual
  homepage. Meta fetches `/`, not an About or Terms page, and fails
  verification on this specifically if the name isn't there.
- Add outside collaborators as full portfolio users just to get help with
  a task. That's an explicit rejection reason in Meta's own list — use a
  narrower partner/collaborator access level instead.
- Type a verification code, a two-step PIN, or any password into
  anything other than Meta's own console, typed by the account holder.

## 1. Business verification

### What verification is, and isn't

Business verification in Meta Business Suite is a different thing from the
paid Meta Verified subscription, and it does not produce a verified badge.
Meta states this directly: "Verifying your business in Meta Business Suite
is different from Meta Verified for businesses and won't give you a
verified badge." (Meta Business Help Center, "How to verify your business
in Meta Business Suite",
https://www.facebook.com/business/help/2058515294227817, read 2026-11-09 —
the same sentence is restated at
https://www.facebook.com/business/help/2342133782492969, read 2026-11-09).
The verified badge is specifically a Meta Verified benefit: "Meta Verified
for businesses is a paid subscription that provides tools to help you build
more confidence with new audiences and protect your brand. This
subscription comes with benefits like the verified badge, enhanced support,
impersonation protection, and more."
(https://www.facebook.com/business/help/308979828303560, read 2026-11-09).
Meta Verified is billed on a recurring basis and is a separate purchase
from the free verification procedure this skill covers.

What business verification actually unlocks, in Meta's own words: "Business
verification is required to access certain advertising, developer, billing
and spending features."
(https://www.facebook.com/business/help/2058515294227817, read 2026-11-09).
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
(https://developers.facebook.com/docs/development/release/business-verification/,
read 2026-11-09).

Checked and not found on any of the pages above, or on Meta's account-
scaling page for WhatsApp
(https://www.facebook.com/business/help/595597942906808, read 2026-11-09):
any statement from Meta about how many times to resubmit before stopping,
or advice to fix documents at the root rather than resubmit again. That
advice is common on third-party agency blogs but Meta does not say it
anywhere checked for this skill, so it isn't repeated here as fact. The
"Never" list below sticks to what Meta's own pages do support: a timing
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
exactly as entered in Business info.

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
exist), and walk the wizard: country, business type (an unregistered sole
trader is usually "Sole Proprietorship," and is often still answered as
"Registered" if the local tax authority has issued any registration
number to it, even without a formal company), business details, a
CAPTCHA (always completed by a human, never by an automated agent), a
public-records match step, the confirmation channel, document upload, and
a final review/submit.

Two traps worth expecting on that public-records step and the upload
step:
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

### Watching for "needs more information" without relying on email

Meta's notification about a status change goes to whatever email address
is set as the portfolio's admin contact — which is very often not the
inbox someone checks daily. The one browser-free, reliable way to check
is a direct API call once any API access already exists:

```bash
curl -s "https://graph.facebook.com/v21.0/$WABA_ID?fields=business_verification_status" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Values seen in practice: `pending` (Meta's turn, nothing to do but wait),
`pending_need_more_info` (your turn — go read exactly what's being asked
in the console, which this field alone doesn't say), and `verified`. Poll
this periodically rather than waiting to be told — the gap between a
status silently flipping to "needs more information" and someone actually
noticing has cost real submissions a full review cycle.

## 2. Bringing up the Cloud API (works before verification lands too)

Every step below works on an unverified portfolio — verification only
changes the messaging-volume ceiling, not whether the API itself works.
Bring the two up in parallel rather than waiting for one before starting
the other. A business portfolio must already exist (created at
business.facebook.com) before step 1 — the step below attaches a new app
to that existing portfolio, it does not create one.

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
   involved.
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
   Cloud API with a two-step PIN the account holder chooses.
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

---
Source: meta-business-setup (SKILL.md + reference.md), as of 2026-11-08.
