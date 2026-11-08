# meta-whatsapp-cloud-api: reference

Supporting detail for `SKILL.md`. Treat anything here as "true as of the
last walk date in SKILL.md" — Meta's policies and consoles both move.

## Rejection reasons and the usual fix

| Reason | Usual fix |
| --- | --- |
| Legal name mismatch (the most common reason) | Copy the name verbatim from the document into Business info — suffix and punctuation included |
| Address mismatch | Match the document string exactly: city spelling, street number, unit, postal code |
| Phone mismatch, or a personal phone used as the business phone | A business phone in international format, matching the documents |
| Website fails to load, isn't HTTPS, is a dead link, or doesn't show the business name on the homepage | Fix the site first, then submit; a domain with some age behind it also fares better |
| Free consumer email domain | Use an email on the website's own domain |
| Wrong document type (a lease, a personal bill, a screenshot) | An official registration document, or a bank/utility document, in the business's own name |
| Expired document (over roughly 90 days old, except formal registration papers) | A fresh bill or bank letter |
| Blurry, cropped, or edited scan | A flat, unedited scan of the whole page |
| An unanswered follow-up request from Meta | Check spam and the portfolio's support-case notifications, not just the inbox |
| Only one admin, or no two-factor authentication | Add a second admin; enable 2FA on both |
| Outside collaborators added directly to the portfolio | Remove them; use partner/collaborator access instead |
| No asset actually needing verification ("ineligible") | Attach the relevant asset (usually a WABA) to the portfolio first |
| Resubmitting too quickly after a rejection | Wait roughly 24 hours |
| Account history (prior policy strikes, a restricted ad account) | Clear the underlying restriction first |
| A sensitive category (finance, health, gambling, alcohol) | Extra documentation is likely required; pick a more neutral, still-honest category if one genuinely applies |

An appeal/review-request option, where offered, generally takes a few
business days and tends to succeed more often than a third blind
resubmission — but it isn't always offered; sometimes the only path after
a rejection is a fresh submission with the actual problem fixed.

## Accepted document types, worked through one jurisdiction (Israel)

Meta's accepted-document categories, quoted from its own verification
dialog:

- **Legal name**: a certificate/articles of incorporation, a business
  license or permit, a bank statement, or a bank letter.
- **Address**: the same four categories, plus a utility bill — water,
  gas, electric, or phone.

For an Israeli sole proprietor (`עוסק פטור` / `עוסק מורשה`, no formal
company registration), none of the certificate-of-incorporation-shaped
documents exist — there is no equivalent to a company registration
certificate for an unincorporated sole trader. What actually works:

- **Name**: a bank account-ownership letter (`אישור ניהול חשבון` /
  `אישור בעלות בחשבון`), obtainable as a self-service download from most
  Israeli banks' online portals, specifically requested "for business
  verification." Request the Hebrew version specifically — an English
  transliteration pulled from the same bank portal has been seen
  rendering the same name two different ways on the same page (a
  transliteration inconsistency that a Latin-script review then flags as
  a mismatch).
- **Address**: an electricity bill (or water, gas, or phone bill) in the
  business's name, under about 90 days old, showing the full address
  including postal code.
- **Explicitly rejected**: the `עוסק פטור`/`עוסק מורשה` certificate
  itself, quoted verbatim from Meta's response: "the document submitted
  to verify the legal business name isn't an accepted type." It is the
  standard Israeli proof of trading status, and it is still not on
  Meta's accepted list.
- **Also not accepted**: a municipal property-tax bill (Arnona) — it
  isn't in the utility-bill list Meta names (water, gas, electric,
  phone), so treat it as a last resort, not a plan.
- A mailed bank notice can carry a stale address if the account holder
  never updated their address with the bank — check what address is
  actually printed before relying on any mailed document for the address
  requirement, not just whichever document is easiest to obtain.

One document carrying both the legal name and the full address, printed
together on the same page, satisfies both requirements in a single
upload — worth asking for specifically rather than hunting for two
separate documents.

## WhatsApp Cloud API: account model

A business portfolio can own one or more WhatsApp Business Accounts
(WABAs). A WABA belongs to exactly one portfolio and cannot be
transferred to a different one. Each WABA holds a limited number of
phone numbers (a small fixed cap when unverified, a much larger one once
the portfolio is verified). An app — created with a WhatsApp-focused use
case — is attached to the portfolio and calls the Graph API using a
system-user token scoped to that WABA. Messaging limits apply at the
portfolio level, shared across every number in it, not per individual
number.

The identifiers an integration needs in its own configuration: the app
ID, the app secret (used to validate webhook signatures), the WABA ID,
each phone number's own ID, and a permanent access token.

## Token types

- **Temporary user token** (from a quick-start panel): lasts roughly 24
  hours. Testing only — never ship this.
- **System user token** (an Admin or Employee-level system user): no
  expiry if "Never" is chosen when generating it. This is the production
  token. Needed permissions generally include the WhatsApp messaging and
  WABA-management scopes; a broader business-management scope is also
  required specifically to read verification status or delete a WABA via
  the API — if the token-generation dialog for a WhatsApp-only app
  doesn't offer that broader scope, do those two particular operations
  through the console UI instead of the API.
- **Business-integration system user token**: only relevant for a formal
  Tech Provider doing Embedded Signup on behalf of other businesses —
  not the ordinary single-business setup this skill covers.

Send the token as `Authorization: Bearer <token>`. Treat it as an opaque
string — never attempt to parse or decode it.

## Display name rules

Generally 3 to 75 characters (practically, keep it well under 25), in
Title Case or Sentence case, matching the actual brand or legal name — no
slogans, no generic descriptive words, no city name alone, no person's
full name unless that genuinely is the brand, and none of the words
"WhatsApp," "WA," "FB," "Meta," or "Insta" anywhere in it. On an
unverified portfolio the name is accepted but shown small, next to the
number, in the contacts view only. Verification triggers a full display-
name review; a mismatch between the display name and the portfolio's
legal or trading name is its own separate rejection reason at that point.

## Messaging limits ladder

Roughly: 250 unique contacts per 24 hours → 1,000 once verified → then 2K
→ 10K → 100K → unlimited, stepping up automatically when message quality
is rated Medium or High and the portfolio has used more than about half
of its current limit in the preceding week. A step-up typically lands
within a few hours of qualifying. There's also a way to reach the first
step-up (to the 2K tier) without verification at all: deliver roughly
2,000 template messages to unique recipients within a rolling 30-day
window while maintaining good quality. Replies sent inside the 24-hour
customer-service window (i.e., within 24 hours of that specific user's
last message) never count against any of these limits.

## Webhook contract

- **GET** (the verification handshake): Meta calls the endpoint with
  `hub.mode=subscribe`, `hub.verify_token=<your stored token>`, and
  `hub.challenge=<some value>`. Respond with HTTP 200 and a body
  containing exactly that challenge value, only when the verify token
  matches what's configured.
- **POST** (actual events): a JSON body shaped roughly as
  `{"object":"whatsapp_business_account","entry":[{"changes":[{"field":"messages","value":{...}}]}]}`.
  Always respond 200, regardless of internal processing outcome — a
  non-200 response causes Meta to retry, which can double-process a
  message if the handler isn't idempotent. Validate the
  `X-Hub-Signature-256: sha256=<hex>` header as an HMAC-SHA256 of the
  raw request body using the app secret, before trusting the payload.
  Deduplicate incoming events on each message's own id, since Meta does
  retry deliveries.
- Subscribing the app to receive a WABA's events is a separate API call
  (`POST /{WABA_ID}/subscribed_apps`) from configuring the webhook URL
  itself — and it's additive, not a swap: it doesn't remove whatever
  other app might already be subscribed to that same WABA.
- An app left in its default development mode drops production webhook
  deliveries silently — no error, nothing in any dashboard, the sending
  side even gets back a response that looks successful. Publishing the
  app (see SKILL.md §2 step 8) is the fix, not a webhook configuration
  change.

## Test number facts

Meta's own free test number: available for a limited trial period
(roughly 90 days as of this writing), up to around 5 whitelisted
recipient numbers (each needing its own one-time code to get
whitelisted), restricted to pre-approved templates plus free-form
replies inside the 24-hour customer window. It can't carry a reviewed
display name or go through business verification itself. It's genuinely
useful for building and testing the webhook and the message-sending code
before a real phone number is ready to register.

## Timing, roughly

- A channel-verified (phone/email/domain) submission: 1 to 2 business
  days.
- A document-based review: 3 to 7 business days, occasionally up to 14.
- Meta runs periodic policy-update windows (roughly mid-January,
  mid-April, mid-September in recent years) during which reviews of any
  kind tend to run noticeably slower.
- After deleting a number from a consumer WhatsApp app, wait about 24
  hours before adding it to the Cloud API.
- After any rejection, wait about 24 hours before resubmitting.

## The verification wizard, screen by screen

The exact wording and order shift between Meta's UI revisions, but the
shape has been stable:

1. An intro screen naming the portfolio being verified.
2. Country selection (usually prefilled from the portfolio's existing
   settings).
3. Business type (Corporation / Sole Proprietorship / Partnership /
   Private Company / Institution), then a second question asking whether
   the business is officially registered. A sole trader holding any kind
   of tax-authority registration number is usually still "Registered,"
   even with no formal company — if a rejection specifically cites this
   answer, try flipping it.
4. Business details: a "business name" field expecting the name exactly
   as the documents will show it (the registrant, not necessarily a
   trade name), and a separate optional "alternative/trade name" field
   for the public-facing brand name if it differs. Filling both resolves
   most legal-name-vs-trade-name confusion up front.
5. Address fields, matching the documents.
6. Contact information: a phone number that can actually receive a
   confirmation code (so never a number already moved onto the Cloud
   API), and the website.
7. A CAPTCHA — always completed by the human account holder, never
   automated.
8. **The public-records match trap.** Meta searches public business
   records and offers potential matches, asking to confirm the one that
   is "current and matches exactly." It has been seen offering a
   same-named but entirely unrelated organization. Verify every
   identifying detail — address, website domain, any visible
   registration or tax number — before accepting a match; if nothing
   matches exactly, choose "my business isn't listed" rather than
   accepting a close-but-wrong record. If the screen re-renders with the
   selection cleared, reselect it and continue again.
9. Choosing a confirmation channel — email, phone call, SMS, WhatsApp
   message, or domain verification. This choice determines which
   documents the next screen will ask for (see SKILL.md's "confirmation
   channel" section) — email tends to be the most forgiving if the
   available documents prove name-and-address rather than
   name-and-phone.
10. Document upload. Typically two logical sections (name, then
    address), though a single document covering both can usually be
    reused for both slots. **An easy-to-miss toggle** — "did this
    document also include your phone number or address?" — frequently
    defaults to "No," which then opens up an entirely separate second
    upload requirement. If the one document already uploaded does carry
    both pieces of information, switching that toggle to "Yes" removes
    the extra requirement.
11. A confirmation step for whichever channel was chosen (an emailed
    code, a phone call, an SMS code). Codes are generally single-use —
    navigating backward past this screen after requesting a code tends
    to void it and reset the upload step, so avoid going back once a
    code has been requested.
12. A final review/confirmation screen, including — on at least one
    observed run — an automated OCR-style check claiming the legal name
    wasn't detected on the uploaded document even when it plainly was
    printed there in clear type. Where the screen offers an explicit
    "I confirm this submission meets the requirements" checkbox alongside
    the warning, that is the intended way through a false-positive OCR
    check, not a sign the documents need replacing.
13. Submission confirmation, typically quoting a review time of around
    two business days. From here it's a waiting period — see SKILL.md's
    guidance on not touching a pending submission.

---
Source: meta-business-setup (SKILL.md + reference.md), as of 2026-11-08.
