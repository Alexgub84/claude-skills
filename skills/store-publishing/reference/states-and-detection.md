# store-publishing: the eight-state ladder, and how to detect each one

Last reviewed: 2026-11-11.

One ladder, read fresh at the start of every session — never assumed from
what the last session said, and never assumed to be "a first submission"
or "a rejection" before actually looking. The same eight states cover both
the first-time path and the repeat path: a first-time app starts at state
1 and climbs; a live app that needs a new version re-enters at state 4 or
5 for the new build and climbs again from there. There is one tree, not
two.

```
                 ┌─ 1. No developer account ───────────┐
                 │                                      │
                 ▼                                      │
 2. Account pending (ToS wall / tester gate / DSA /      │  (new app,
    agreements) ──────────────────────────────────────┐ │   same account)
                 │                                      ▼ │
                 ▼                            3. Account ready,
 3. Account ready, no app record ◄───────────── no app record
                 │
                 ▼
 4. App record exists, listing incomplete ◄──────────────┐ (a new build on
                 │                                        │  an app that's
                 ▼                                        │  already live
 5. Build uploaded, forms incomplete                      │  re-enters HERE,
                 │                                        │  not at state 1)
                 ▼                                        │
 6. In review ─────────────────────────────┐              │
                 │                          │              │
                 ▼                          ▼              │
 8. Live ◄──────────────────────── 7. Rejected, reason given
                 │                          │
                 └──────────────────────────┘
          (next version needed → back to state 4/5)
```

Every row below names: what the state looks like in each console, whether
a live Apple/Google doc page confirms the exact on-screen wording (with
the URL and the date it was read), and where it doesn't, that it doesn't
— per the rule that nothing from a private, unwitnessed assumption gets
presented as a confirmed fact.

## 1. No developer account

| Store | Detection | Wording confirmed? |
| --- | --- | --- |
| Google Play | `play.google.com/console` lands on a sign-up / enrollment page under the signed-in Google identity, with no developer profile visible at any `console/u/0` through `console/u/3` index for that identity. Google Play allows more than one developer identity under the same browser profile; probe each index before concluding the account doesn't exist — a wrong index looks identical to a genuinely missing account. | Not confirmed against a live Google help page naming this a distinct "no account" status — this is a dated, witnessed console observation (2026-11-01), not a quoted doc sentence. Treat the sign-up redirect itself as the signal. |
| Apple App Store | `developer.apple.com/account` shows the Program enrollment page rather than an account dashboard — no active membership on the signed-in Apple ID. | Not confirmed as a named status on Apple's own status-reference page (that page documents app/version statuses, not account-existence states) — this is a direct reading of the enrollment flow, not a quoted status label. |

## 2. Account pending

| Store | Detection | Wording confirmed? |
| --- | --- | --- |
| Google Play | A Terms-of-Service accept wall (`/accept-terms`) answers every console URL — accepting it is a legal acceptance on the account and is human-only (see "Never" in `SKILL.md`). **Separately**, on a personal account, production access is blocked until a closed test clears a minimum tester count held continuously over a minimum number of days. | The 12-tester/14-continuous-day testing requirement, and that it applies to "personal developer accounts created after November 13, 2023," is Google's own wording: https://support.google.com/googleplay/android-developer/answer/14151465 — read 2026-11-11. The page never uses the word "exempt" for organisation accounts — it only scopes itself to personal accounts — so treat "organisation accounts are exempt" as this skill's inference from that scoping, not a quoted exemption clause. The `/accept-terms` wall itself is a dated, witnessed console observation (2026-10-17), not a quoted doc sentence. |
| Apple App Store | An **Organization** enrollment sits in Apple's own review queue after the form is submitted. A **verified, active Individual or Organization account** can separately show an open item under Business → Agreements, Tax and Banking (an unaccepted Paid Apps Agreement) or under Business → Compliance (the EU Digital Services Act trader-contact requirement) — either blocks a specific capability (paid apps, EU availability) without blocking the account itself. | Apple's own enrollment page states, for an Organization: "After you've submitted your information, it will be reviewed by Apple. You'll then receive an email with next steps," and later, "Once your enrollment information has been verified and approved, you'll receive an email letting you know that you can complete your enrollment." (https://developer.apple.com/help/account/membership/enrolling-in-the-app/ — read 2026-11-11). The same page states an **Individual** enrollment completes immediately on purchase — so this sub-state applies to Organization enrollment only, never Individual. The Business-tab compliance banner's exact on-screen text is a dated, witnessed observation (2026-10-07), not quoted from a live Apple help page found for this skill. |

## 3. Account ready, no app record

| Store | Detection | Wording confirmed? |
| --- | --- | --- |
| Google Play | Console → All apps is empty for this developer identity; "Create app" is available. | Not confirmed against a specific live doc sentence — ordinary, unremarked Play Console UI. |
| Apple App Store | App Store Connect → Apps is empty; "+ New App" is available. | Not confirmed against a specific live doc sentence — ordinary, unremarked App Store Connect UI. |

## 4. App record exists, listing incomplete

| Store | Detection | Wording confirmed? |
| --- | --- | --- |
| Google Play | The dashboard's "Set up your app" checklist has unfinished items (privacy policy URL, App access, declarations, store listing, and so on). | Not confirmed against a specific live doc sentence — this is Play Console's own setup-checklist UI, which has changed shape before. |
| Apple App Store | The app's own status reads **Prepare for Submission** — metadata still being entered, nothing submitted yet. | Confirmed: "You've created an app record in App Store Connect but are still preparing information for it." (https://developer.apple.com/help/app-store-connect/reference/app-and-submission-statuses — read 2026-11-11). |

## 5. Build uploaded, forms incomplete

| Store | Detection | Wording confirmed? |
| --- | --- | --- |
| Google Play | A release carries an uploaded AAB, but App content declarations (Data safety, target audience, ads, and the rest) are still flagged incomplete, blocking a submit. | Not confirmed against a specific live doc sentence — Play's own per-release checklist UI. |
| Apple App Store | A build attached to TestFlight shows **Missing Compliance** (the export-compliance question unanswered) or the version page simply has no build selected yet. A build that fails binary validation instead shows **Invalid Binary**. | "Invalid Binary" is confirmed: "You've submitted your app to App Review, but the build does not meet the current binary requirements." (same Apple status-reference page, read 2026-11-11). "Missing Compliance" on a specific TestFlight build is a dated, witnessed observation, not found as a named entry on that same reference page — treat it as accurate from direct experience, not as a confirmed doc quote. |

## 6. In review

| Store | Detection | Wording confirmed? |
| --- | --- | --- |
| Google Play | The Publishing overview shows the release "in review." | Confirmed: "We're reviewing your update." (https://support.google.com/googleplay/android-developer/answer/9859751 — read 2026-11-11). The same page's companion, https://support.google.com/googleplay/android-developer/answer/9859654 (read 2026-11-11), separately names "Changes in review" for a listing-only change under review, distinct from a release under review. |
| Apple App Store | The version status reads **Waiting for Review** (submitted, not yet picked up) or **In Review** (App Review is actively looking at it). | Confirmed: "You've submitted a new app or updated version. Apple received your submission, but hasn't started the review" (Waiting for Review), and "App Review is reviewing your app" (In Review). (https://developer.apple.com/help/app-store-connect/reference/app-and-submission-statuses — read 2026-11-11). |

## 7. Rejected, reason given

| Store | Detection | Wording confirmed? |
| --- | --- | --- |
| Google Play | The Publishing overview or App content page flags the specific declaration or policy area the rejection concerns, with reason text attached. | Confirmed, at the general level: "Update rejected: One or more of the changes in your update are not compliant with the Google Play policy or the Developer Distribution Agreement" for an already-published app's update, and a parallel "App rejected" wording for a first submission. (https://support.google.com/googleplay/android-developer/answer/9859751 — read 2026-11-11). |
| Apple App Store | The version status reads **Rejected** (App Review itself declined it), **Metadata Rejected** (the listing text/assets specifically, not the binary), or **Developer Rejected** (the submission was withdrawn before a decision, not a store decision at all). | Confirmed, all three: "Your app wasn't accepted. App Review notifies App Store Connect users with the Admin, App manager, or Developer role with the issues" (Rejected); "App Review didn't accept your metadata. Read the message from App Review, edit the metadata to resolve the issue, and reply to the message from App Review" (Metadata Rejected); "You removed your app from review. When you're ready, resubmit your build or submit a new build" (Developer Rejected). (same Apple status-reference page, read 2026-11-11). |

## 8. Live

| Store | Detection | Wording confirmed? |
| --- | --- | --- |
| Google Play | The dashboard reads "Published," and the production track's own status agrees. | Confirmed: "The most recent version of this item is available on your app and on Google Play." (https://support.google.com/googleplay/android-developer/answer/9859751 — read 2026-11-11). |
| Apple App Store | The version status reads **Ready for Distribution** (the current name for what was long called "Ready for Sale"). | Confirmed: "Your app has been accepted and is ready for distribution. To distribute your app, your agreements must be in effect." (https://developer.apple.com/help/app-store-connect/reference/app-and-submission-statuses — read 2026-11-11). |

### The sub-state that is not the same as live, confirmed by Apple's own wording

**Pending Developer Release is approved, not live.** Apple's own status page
states it plainly: "Your app was accepted, but you still need to release it
for distribution on the App Store." (same page, read 2026-11-11). A version
sitting here blocks creating the next version row at all — there is no "+"
next to the app's version list while one sits unreleased — so releasing or
cancelling it is a precondition, not an optional tidy-up, before the next
build can even be prepared. Automatic release moves a version through this
state on its own the moment review finishes; manual release (the safer
default for a deliberate "go live" moment) leaves it here until
"Release this version" is pressed — one of the four presses `SKILL.md`'s
"Never" section pauses for. It is agent-driven, the same as any other
console click, but only after the person confirms in that same turn
first — see "Never" in `SKILL.md` for the single statement of the rule.

---
Source: generalized from a private, account-specific runbook, as of
2026-11-08, with the exact state-name wording above checked against
Apple's and Google's own live help pages on 2026-11-11 (dates per row).
