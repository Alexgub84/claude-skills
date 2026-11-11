# meta-whatsapp-cloud-api: developer console, screen by screen

Last reviewed: 2026-11-08.

Dated screen map of developer-console mechanics behind "## 2. Bringing
up the Cloud API" in `SKILL.md`. Same markers as the other screen map:
**agent** (drivable with a browser tool connected), **human** (never an
agent action), or a mix of both.

## App and WABA creation

- Create the app with the WhatsApp-focused use case ("Connect with
  customers through WhatsApp," or the console's current equivalent), and
  attach it to the **existing** business portfolio — never create a new
  one, which restarts verification from zero. — *agent*
- The app's WhatsApp setup panel connects to an existing WABA or creates
  one. Record the WABA ID and the test number's phone-number ID
  somewhere durable. — *agent*
- The apps list page has, in practice, sometimes failed to render at all
  in a browser tool; opening an app directly by its ID in the URL has
  worked when the list didn't. — *agent*
- A newly-loaded console page sometimes sits on a spinner; clicking the
  same left-nav item a second time tends to force it to render. — *agent*

## System-user token

Business settings → Users → System users → Add a system user with an
Admin or Employee role → assign the app to it with management access →
Generate token. The permissions needed are generally the WhatsApp
messaging and WABA-management scopes; the broader business-management
scope is also needed specifically to read verification status or
delete a WABA via the API — if the token dialog for a WhatsApp-only app
doesn't offer that broader scope, do those two operations through the
console UI instead of the API. — *agent* for clicking through the
dialog; *human* for actually copying and storing the generated token
(see "Never" in `SKILL.md` — never type or paste a token into a form
field through an automated action).

**A one-click quirk worth expecting:** the system-user detail panel can
have no "Assign assets" control at all for a WABA. When that happens,
assign it from the asset's own side instead: open the WABA in Business
settings → Accounts → WhatsApp accounts, and assign the system user from
there with full access. The grant applies to a token already generated
— no need to regenerate it. — *agent*

Token types, briefly: a temporary token from a quick-start panel lasts
roughly a day and is for testing only; a system-user token with "Never"
chosen for expiry is the production one; a third kind
("business-integration system user") only matters for a formal Tech
Provider doing Embedded Signup on behalf of other businesses, out of
scope here. Send it as `Authorization: Bearer <token>` and treat it as
an opaque string.

## Real phone number

Requirements: the number isn't currently active in a consumer WhatsApp
or WhatsApp Business app (delete the account there first and wait
roughly 24 hours before adding it to the Cloud API — registering a
number still tied to the consumer app from the Cloud API side fails
outright), and it isn't already registered to a different WABA.

1. WhatsApp Manager → Phone numbers → Add phone number into the target
   WABA (display name, category, the number itself). — *agent*
2. Request an SMS or voice code (see `reference/api-checks.md` for the
   exact call). — *agent*
3. The human types the received digits; a code that's sat for roughly
   25 minutes or more has been seen failing with a "request a new code"
   error, so use it promptly. — *human*
4. Verify the code, then register the number with a PIN the account
   holder chooses — never the agent. — *agent* for sending the calls,
   *human* for choosing and holding the PIN.

A number still linked to the consumer app returns an error naming "SMB
businesses" when registration is tried directly — that's the signal to
delete the consumer-app account first and wait, not a sign the Cloud API
call itself is wrong.

## Payment method

A WABA needs its own payment method attached, specifically at the WABA
level, not just the portfolio level — a WABA missing one eventually
reports a blocked `can_send_message` health status with an error code,
which stops every business-initiated send while the free test number
keeps working regardless, so it's easy to miss until a real send on a
real number fails. Entering the actual card is the account holder's
action in every console seen so far. — *human*

## Webhook

- Public HTTPS endpoint; the GET handshake echoes `hub.challenge` when
  `hub.mode=subscribe` and the stored verify-token matches; POST always
  returns 200 regardless of the internal processing result.
- Confirm the secret configured for signature-checking actually belongs
  to this app before trusting it — see `reference/api-checks.md`'s
  `debug_token` call; a mismatched secret comes back as an invalid-
  signature error.
- The "Webhook fields" table renders only after a successful verify —
  that's the proof it worked. Subscribing to the `messages` field is a
  separate toggle in that same table, not implied by saving the callback
  URL — saving the URL again has been seen silently clearing the field
  subscription, so reload and recheck after any callback change.
- Subscribe the app to the WABA (see `reference/api-checks.md` for the
  call) — it's additive, it does not remove whatever other app might
  already be subscribed to the same WABA. — *agent* throughout

## Publish / Live mode

An app left in its default development mode silently discards
production traffic in both directions: an outbound send still returns a
success-looking response with a real message id, and nothing is
actually delivered; inbound webhooks are dropped the same silent way,
with no error anywhere. This is the first thing worth checking in any
"messages aren't arriving" investigation, before suspecting the token,
the number, or the payment method. Publishing to live mode generally
just needs a privacy policy URL, an app icon, and a category filled in
under the app's basic settings — no formal review step has been seen for
this, and clicking "Publish" has not prompted for a password or any
further confirmation. — *agent*

## Templates

- Create under the WABA the number actually lives in, with a category
  and language.
- Meta's editor rejects a short body built from one variable alone
  ("too many variables for its length"); a variable can't open or close
  the body. A working shape keeps the body well over the one-variable
  minimum, with real text around the variable.
- Meta can silently recategorize a submitted template (Utility to
  Marketing, say) while it's "In review" — check the category column
  after submitting; a Marketing reclassification costs more and needs an
  edit or appeal once approved.
- A second language for an existing template name means creating the
  template again with the same name and the other language — there is
  no "add a language" action on a template still in review.
- Template IDs don't show in the list view; they're in the row's own
  "insights" link.

*Agent* throughout, except that the account holder decides what the
template actually says (brand voice, legal wording) — never the agent.

## General console mechanics worth expecting

- Text fields sometimes refuse a simulated keystroke; setting the
  field's value directly (whatever the browser tool calls that action)
  tends to work when typing doesn't.
- Dropdown lists for things like phone-number category or currency can
  be virtualized — open the list, scroll inside it while it's open, then
  click; a wheel-scroll over a closed list just closes it.
- An icon or logo upload sometimes has no visible `<input type="file">`
  until a "choose file" button is clicked once; the same hidden-input
  pattern from the verification wizard applies — attach the file to the
  input directly rather than waiting for an OS picker that may never
  appear.
- A token, once generated, is shown exactly once. Copy it before closing
  the dialog, by clipboard, never by reading it back through automation
  into a chat transcript or a plain-text file.
- "Revoke tokens" on a system user tends to be all-or-nothing — no
  per-token list — so an old, unused token is usually safer left alone
  than revoked by guesswork.
- A third-party integration (an Embedded Signup done through another
  vendor, say) can leave access in more than one place even after the
  obvious "Remove" button is clicked: a connected-apps list, a separate
  partners/collaborators list, and a personal-account-level integrations
  page outside the business portfolio entirely. The app-subscription
  check in `reference/api-checks.md` can still list a since-removed
  vendor's app — only that vendor's own token, or Meta support, actually
  unsubscribes it at that point.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08.
