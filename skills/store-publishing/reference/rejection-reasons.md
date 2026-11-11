# store-publishing: review accounts, rejections, and the usual fixes

Last reviewed: 2026-11-08.

For state 7 ("Rejected, reason given") in `states-and-detection.md`, and
for keeping a review account working across every submission before a
rejection ever happens.

## The review account

- App Review notes (Apple) or App access instructions (Play) need to
  explain, every time: exactly how to log in (identifier format, the
  fixed code or password, confirmation that no real message is sent),
  what the reviewer lands on after logging in, where the core flows
  live, why there's no public sign-up if that's genuinely the case
  (accounts issued by a business process rather than self-serve — cite
  the relevant guideline if Apple asks), what each requested permission
  is actually for, and what any "delete account" action does to a
  shared review account.
- Store the credential itself somewhere outside the console pages —
  never as plain text pasted into App Review notes, where it becomes a
  permanent, widely-readable record. Verify the login works against the
  exact build being submitted, every time, right before submitting.
- **If the reviewer's login fails, fix the backend or the credential
  itself — never swap the demo identifier or its code to something new
  in the console as a workaround.** Rotating it there just produces a
  second, inconsistent credential and a review account that no longer
  matches whatever the notes describe.

## Common rejections and their usual fix

| Reason | Usual fix |
| --- | --- |
| Mockup or composited screenshots presented as real captures | Resubmit with real device/simulator captures of the actual running app |
| A Data Safety / App Privacy mismatch against what the binary actually does | Redo the forms from the data inventory, not from memory |
| Version-string mismatch between the binary and the console's listing | Make the binary's own version string equal the console's version page |
| "Can't find a way to sign in" | Add or clarify the review account and its login instructions |
| A default or unchanged app icon | Ship a real one — both stores flag an unchanged framework default |
| "Where's the sign-up flow?" | Explain the company-issued-account model in App Review notes if that's genuinely how the app works, citing the relevant guideline |
| A permission the app requests with no explanation in the privacy forms | Add the explanation, or remove the permission if it isn't actually used |

## Apple's resubmission sequencing trap

After a rejection, "Resubmit to App Review" stays disabled on the
version/thread page until **"Update Review" is pressed first** — that
press flips the item from Rejected to a resubmittable state. A session
that doesn't know this can spend real time looking for a broken
Resubmit button that is, in fact, working exactly as designed; it's
simply gated behind a different button first. See
`screens-app-store-connect.md` for where this sits on the actual page.

## Reading a rejection before acting on it

Read the full rejection notice — the specific guideline or policy cited,
and every sentence of it, not just the headline — before changing
anything. A rejection sometimes carries more than one issue in the same
notice; fixing only the first one invites a second rejection cycle for
the second issue that was sitting in the same message the whole time.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08.
