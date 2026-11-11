# meta-whatsapp-cloud-api: API checks

Last reviewed: 2026-11-08 for the calls themselves; the enum values
cited below were read directly from Meta's live docs on 2026-11-11 —
see "Which of the four states this account is in" in `SKILL.md`.

The Graph calls behind the status decision tree and ongoing diagnosis.
Values marked "seen in practice" come from a real account; everything
else is read off Meta's own field reference and hasn't been matched
against a real screen yet — flagged the same way in `SKILL.md`.

## Verification status

```bash
curl -s "https://graph.facebook.com/v21.0/$WABA_ID?fields=business_verification_status" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Seen in practice: `pending`, `pending_need_more_info`, `verified`.
Documented but not yet seen on a real screen: `expired`, `failed`,
`ineligible`, `not_verified`, `pending_submission`, `rejected`,
`revoked`
(https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/
— read 2026-11-11).

## Confirming a webhook secret belongs to this app

```bash
curl -s "https://graph.facebook.com/debug_token?input_token=$ACCESS_TOKEN" \
  -H "Authorization: Bearer ${APP_ID}|${APP_SECRET}"
```

A mismatched app secret comes back as an invalid-signature error rather
than a normal token-debug payload — that mismatch is itself the useful
signal, before spending time on the webhook code.

## Phone numbers on a WABA

```bash
curl -s "https://graph.facebook.com/v21.0/$WABA_ID/phone_numbers" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Returns each number's own ID, display number, verified name, and
`quality_rating`.

## Which apps are subscribed to a WABA

```bash
curl -s "https://graph.facebook.com/v21.0/$WABA_ID/subscribed_apps" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Additive — subscribing a new app does not remove one already
subscribed. Useful for confirming an old integration's app is actually
gone, not just removed from the places the console shows by default.

## Message templates

```bash
curl -s "https://graph.facebook.com/v21.0/$WABA_ID/message_templates?fields=name,status,category,language" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Catches a template Meta quietly recategorized (Utility to Marketing,
say) while it was "In review" — the console's own list shows the same
column, but this is the version to check from a script or a CI job.

## Whether a WABA can actually send

```bash
curl -s "https://graph.facebook.com/v21.0/$WABA_ID?fields=health_status" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

A `can_send_message` value of `BLOCKED` with an error code most often
means the WABA has no payment method attached at the WABA level — a
card on file at the portfolio level alone isn't enough. The free test
number keeps working regardless, so this can go unnoticed until a real
send on a real number fails.

## Requesting, verifying and registering a real number

```bash
curl -X POST "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/request_code" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code_method":"SMS","language":"en_US"}'

curl -X POST "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/verify_code" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"123456"}'

curl -X POST "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/register" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"messaging_product":"whatsapp","pin":"'"$PIN"'"}'
```

The code and the PIN are always the account holder's own values — this
skill issues the calls, never chooses or types the code or the PIN
itself (see "Human-only steps" in `SKILL.md`).

## Subscribing an app to a WABA

```bash
curl -X POST "https://graph.facebook.com/v21.0/$WABA_ID/subscribed_apps" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08. Enum values read directly from Meta's live Graph API
reference, 2026-11-11.
