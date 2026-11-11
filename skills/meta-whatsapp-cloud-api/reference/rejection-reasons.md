# meta-whatsapp-cloud-api: rejection reasons

Last reviewed: 2026-11-08.

For the "Rejected — Meta wants something from you" branch of the status
decision tree in `SKILL.md`. Read Security Center's "Learn more" /
"Details & next steps" dialog first — it's the only place the actual
complaint text lives — then match it against the table below.

## Rejection reasons and the usual fix

| Reason | Usual fix |
| --- | --- |
| Legal name mismatch (most common, 2026 field reports) | Copy the name verbatim from the document into Business info — suffix and punctuation included |
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

An appeal or review-request option is sometimes offered after a
rejection and sometimes absent entirely. When it is absent, the only
route is a corrected resubmission with the actual problem fixed.

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

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08.
