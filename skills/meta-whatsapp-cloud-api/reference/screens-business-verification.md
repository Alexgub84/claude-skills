# meta-whatsapp-cloud-api: business verification, screen by screen

Last reviewed: 2026-11-08.

Dated screen map of the Security Center verification wizard, for the
"Submitting" section of `SKILL.md`. Meta's exact wording and order shift
between UI revisions — the shape below has held stable across several
resubmissions, but if the next account walked through this diverges,
that's expected: update this file with what you actually saw rather than
assuming the old map is still right.

Each screen is marked **agent** (drivable through a browser-automation
tool once one is connected), **human** (never an agent action — see
"Human-only steps" in `SKILL.md`), or a mix of both.

1. **Entry.** Security Center → "Business Verification" card. If a
   rejection already happened, a "Learn more" button opens "Details &
   next steps" — read it before anything else, it's the only place the
   actual reason text lives. "Get started" (or "Continue," if a draft
   already exists) opens the wizard proper. — *agent*
2. **Country.** Usually prefilled from the portfolio's existing
   settings. — *agent*
3. **Business type.** Corporation / Sole Proprietorship / Partnership /
   Private Company / Institution, then a second question asking whether
   the business is officially registered. A sole trader holding any
   kind of tax-authority registration number is usually still
   "Registered," even with no formal company — if a rejection
   specifically cites this answer, try flipping it. — *agent*
4. **Business details.** A "business name" field expects the name
   exactly as the documents will show it (the registrant, not
   necessarily a trade name), and a separate optional "alternative /
   trade name" field covers the public-facing brand name if it differs.
   Filling both resolves most legal-name-vs-trade-name confusion before
   it starts. — *agent*
5. **Address.** Matches the documents, not a tidied-up version of them.
   — *agent*
6. **Contact information.** A phone number that can actually receive a
   confirmation code — never one already migrated onto the Cloud API —
   plus the website. — *agent*
7. **The CAPTCHA.** Always the human account holder, never the agent,
   browser tool or not. — *human*
8. **The public-records match trap.** Meta searches public business
   records and offers potential matches, asking to confirm the one
   that's "current and matches exactly." It has been seen offering a
   same-named but entirely unrelated organization. Verify every
   identifying detail — address, website domain, any visible
   registration or tax number — before accepting a match; when nothing
   matches exactly, choose "my business isn't listed" rather than a
   close-but-wrong record. If the screen re-renders with the selection
   cleared, reselect it and continue again. — *agent*, but read every
   field before clicking; this is a judgment call, not a rubber stamp.
9. **Confirmation channel.** Email, phone call, SMS, WhatsApp message,
   or domain verification. This choice decides which documents the next
   screen asks for — see "The confirmation channel changes which
   documents you need" in `SKILL.md`. Email tends to be the most
   forgiving route when the documents in hand prove name-and-address
   rather than name-and-phone. — *agent*
10. **Document upload.** Typically two sections — name, then address —
    though a single document covering both can usually be reused for
    both slots ("you may upload the same document more than once"). The
    page carries a hidden `<input type="file">` behind the styled
    upload control: with a browser tool connected, find it and attach
    the file to it directly by path — no OS picker, no human click
    needed. An easy-to-miss toggle — "did this document also include
    your phone number or address?" — sometimes defaults to "No" and
    opens an entirely separate second upload requirement; if the one
    document already attached does carry both pieces of information,
    switching that toggle to "Yes" removes the extra step. — *agent*
11. **Confirming the channel.** For email: two text inputs, both
    pre-filled with the bare domain (e.g. "@example.com"); the first is
    disabled, the second is the one to edit. The local part goes BEFORE
    the @ — click the field, press **Home**, then type. Clicking and
    typing without pressing Home appends after ".com" and silently does
    nothing; "Send email" just stays greyed out. — *agent*
12. **Entering the code.** A confirmation/OTP code, always typed by the
    human — this skill never sees or handles it. Codes are generally
    single-use; navigating backward past this screen after requesting
    one tends to void it and reset the upload step, so avoid going back
    once a code has been requested. — *human*
13. **"Resolve issues."** An automated OCR-style check that has been
    seen claiming the legal name wasn't detected on an uploaded document
    even when it was plainly printed in clear type, on both a PDF and a
    300-dpi PNG render of the same page — so it isn't a rendering
    problem to fix by re-exporting. Where the screen offers an explicit
    "I confirm this submission meets the requirements" checkbox
    alongside the warning, that's the intended way through a
    false-positive check, not a sign the documents need replacing. —
    *agent*
14. **Submission confirmation.** Typically quotes a review time around
    two business days. From here it's a waiting period — see
    "Re-checking status after submitting" in `SKILL.md`; don't touch the
    submission while it's pending. — *agent*, reading only

## Two traps worth expecting

- **"Back" is destructive past the confirmation-code screen.** Going
  back from there tends to reset the upload screen completely — document
  type cleared, attached file dropped — and void whatever code was
  already sent. Re-select the type and re-attach before continuing
  rather than trying to recover the old state.
- **The public-records match (screen 8) is the single costliest click
  in the whole wizard to get wrong.** Accepting someone else's business
  record is a policy violation that can restrict the whole portfolio,
  not just fail this one verification — never accept a match on
  plausibility alone.

## Before pressing the final submit

- [ ] The decision tree in `SKILL.md` actually says "Rejected" or "Never
      started" — if it says "Submitted, waiting," stop; a second
      submission only resets the queue.
- [ ] If rejected, the console's "Learn more" text has been read in
      full, and the documents in hand answer every complaint in it, not
      just the first one.
- [ ] Every document is a flat, unedited scan or render of the whole
      page — not cropped, annotated, retyped, or translated.
- [ ] Business info fields match the documents character-for-character,
      including any legal suffix, and haven't been "tidied up" mid-review.
- [ ] The website's homepage — fetched the way Meta's own crawler would
      (a bot-flavored User-Agent string, not a logged-in browser) —
      actually shows the legal name.
- [ ] The chosen confirmation channel matches the documents actually in
      hand (see "The confirmation channel changes which documents you
      need" in `SKILL.md`).
- [ ] The human who'll solve the CAPTCHA and type the code is actually
      available before the wizard gets that far — starting it and then
      going to find them loses the in-progress draft's state more often
      than not.
- [ ] A dated note is kept somewhere of exactly which files and field
      values went in, so a later rejection (if any) can be diffed
      against what was actually sent.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08.
