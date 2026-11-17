# Dry run: `store-publishing` v1.3.0, as a stranger

Method: the skill was copied to an isolated scratch directory with no
other skill, no repo context, and no access to this machine's other
skills or private material. Read `SKILL.md` top to bottom exactly once,
in order, as a first-time publisher with:

- an Android-only app, built with Expo;
- no Google Play or Apple developer account yet;
- no website, no backend, no existing privacy policy;
- a laptop, no browser-automation tool connected (narrating mode);
- no prior knowledge of either console.

Every point below is a place the file was tested for "what do I do
next" — not a list of improvements wished for, a literal walk.

## The walk

1. **Opening mode line.** The file states, before anything else, that
   this is narrating mode. Clear — I know immediately the agent will
   tell me what to click rather than click it itself.

2. **"Before you start."** All five bullets answer cleanly for this
   scenario:
   - I have no browser tool, but a human (me) at the keyboard — covered.
   - "Signed in" — I'm not signed in to a developer console at all
     because I have no account yet; the bullet points to "Signed in or
     signed out?" for the distinction, which I don't need yet since
     I'm not confusing the two states.
   - Paid account — I don't have one, but I'm willing to pay $25 now.
     No blocker.
   - Build tooling — this is the one that mattered most for my
     scenario, and it answered the real question immediately: Android
     has no OS restriction, only the Apple half needs a Mac. I stopped
     worrying about whether my Windows laptop would be a problem right
     here, on the first read.
   - Working buildable app — yes, I have one (Expo, builds locally and
     via `eas build`).
   No stuck point.

3. **Intake, 4 blocking questions.** All four are answerable without
   outside research: Google Play only; first submission; yes, a
   working Expo build; I own the account and I'll hold the keystore
   myself. Nothing here requires me to already know store mechanics —
   good, since I don't yet.

4. **Deferred intake list.** Read as a preview of what's coming, not a
   wall to answer now — correctly didn't stop me from moving on. One
   soft spot, not a stuck point: the bullet bundles "EU availability,
   and trader status on both stores" as one line. I'm not targeting the
   EU, so my first instinct was to assume I could skip trader status
   entirely. `reference/developer-account-setup.md`'s new Google Play
   section corrects this once I get there — Google's declaration is
   required of *every* active account by 1 February 2027, not only
   accounts shipping in the EU — but the SKILL.md bullet itself doesn't
   signal that, and this is a real place a reader could walk away with
   the wrong idea before reaching the reference file. Noted, not fatal:
   I did reach the correct answer once I opened the reference file the
   bullet points to, which happens before account creation actually
   starts (step 1 below).

5. **Browser mode section.** Reinforces narrating mode, and gives me
   `play.google.com/console` up front — I now know exactly where to go
   without reading further into a reference file first.

6. **Human-only steps.** Read as a list of things I'll be asked to do
   personally rather than things an agent would otherwise do for me
   (moot in narrating mode since I'm doing everything personally
   anyway, but it told me which steps carry extra weight — payment,
   identity document, any 2FA code — so I knew to have my ID and
   payment card ready before starting, which "Before you start" had
   already flagged).

7. **Eight-state check.** I go to `play.google.com/console`,  land on a
   sign-up/enrollment page. The new "confirm signed in" bullet asks me
   to distinguish a plain Google sign-in prompt from this enrollment
   page — I was in fact already signed into a Google account, so this
   correctly reads as genuine state 1, not a sign-in problem. The
   report shape only shows a Google Play line, matching my answer to
   intake question 1 — I never saw an Apple App Store line I'd have had
   to mentally discard.

8. **Section 1, account creation.** Sent to
   `reference/developer-account-setup.md`. Personal account, $25, the
   identity-verification step named and explained, the 12-tester/14-day
   gate stated with its own citation and date. Found the Google Play
   trader-status section here and got the real answer to the soft spot
   from step 4: it applies to my account regardless of EU targeting,
   with a plain February 2027 deadline — I know what to do (declare
   non-trader, since I'm not distributing commercially... or trader, if
   I am — either way, the "where" and "how" are both stated: Manage
   account → Account details → About you → Trader status).

9. **Section 2, first-time checklist.** Item 2 is the one I was
   dreading going in — I have no website. It asked rather than assumed,
   and told me plainly that any publicly reachable static page works,
   naming categories (a static host, a source-control pages site, a
   one-page hosted-doc link) without pushing a specific vendor on me.
   I didn't get a click-by-click "here's exactly how to stand up a free
   page" — that's a real gap for someone who has genuinely never hosted
   a static page before — but the file is explicit that this is a
   deliberate choice (no vendor recommendation), and it gave me enough
   to go find one myself (I know what to search for: "free static page
   hosting"). Not a stuck point under this skill's own stated design;
   flagging only because a from-scratch beginner's next fifteen minutes
   are "go figure out a hosting provider," which the skill correctly
   predicts rather than hides.

10. **Section 3, building.** Sent to
    `reference/build-and-upload-desktop.md`. Expo is named explicitly
    in the toolchain list. The rewritten upload section matches what I
    expected after "Before you start" already told me the build side
    was fine on my machine: **manual upload through the console is the
    documented default**, no API key or service account needed for a
    first release. I go to Play Console myself, create a release, and
    upload the AAB by hand on the actual upload screen — exactly the
    path "Human-only steps" in `SKILL.md` now names directly, so there
    was no moment of doubt about whether this was something the file
    expected a tool to do instead. The optional `fastlane
    supply`/Gradle-Play-Publisher upgrade is named with its real
    one-time setup step, but I didn't need it and the file is explicit
    that I don't need it for a first release.

11. **Section 4, screenshots**, and the required sizes now stated in
    `reference/screens-play-console.md` (512×512 icon, 1024×500 feature
    graphic, 1080×1920 phone screenshots, with a real citation and
    date). I know exactly what to capture before I open the console,
    instead of discovering a rejected upload after the fact.

12. **Closed testing, then production**, in
    `reference/screens-play-console.md`. Create the app, work the
    "Set up your app" checklist, enroll in Play App Signing, fill the
    listing, open a closed test, recruit the 12 testers for 14 days
    (my own logistics problem from here, not a skill gap), then "Start
    rollout" — paused for my explicit confirmation, which the file
    told me to expect back in "Never."

No step in the walk left me without a next action. The one soft spot
(EU/trader-status bundling in the SKILL.md intake bullet) resolved
itself by the time it mattered and before any account work started, so
it is a note, not a stuck point.

## Bug found and fixed during this dry run

Before this report's final pass, `reference/build-and-upload-desktop.md`
said the console-upload page was "driven by a human or by a connected
browser tool" — which directly contradicted the standing rule elsewhere
in this skill that a build artifact's upload never goes through a
browser-automation tool's file-attach call. A driving-mode session
reading that sentence could have concluded it was allowed to click the
upload button itself. Fixed in this same change: the file now states
plainly that this one console action is a human click in both browser
modes, with no exception, and `SKILL.md`'s "Human-only steps" list now
names it directly instead of leaving it only inside the "Never" section
and a reference file. Re-walked steps 10-11 above against the corrected
file; no further contradiction found.

## Verdict (persona 1)

PASS. A first-time, Android-only, no-account, no-website publisher
reaches a working next action at every single point in this walk.

---

# Second dry run: the persona verification actually failed on

Verification on this branch came back FAIL on acceptance item 6 for a
different persona than the one walked above, and R11 was added to the
work order to fix the specific line that stranded it. Re-walking that
exact persona here, against the fixed file, in a fresh scratch copy
with no access to this machine's other skills or private material.

Persona: a Windows developer with a **native** Android app already
**live** on Google Play, about to ship an **update** to it, who also
wants to **add an iOS version** of the same product. Has a Google Play
developer account already. Has **no** Apple Developer account and
**no Mac** — a Windows machine only. No browser-automation tool
connected (narrating mode).

## The walk

1. **Opening mode line** — narrating, as expected on Windows with no
   browser tool connected. No issue.

2. **"Before you start."** This is the exact paragraph R11 rewrote, so
   it's the one read most carefully:
   - Browser/human — I'm the human, narrating. Fine.
   - Signed in — I'm signed in to Google Play already (I have a live
     app there); I have no Apple ID signed in anywhere yet, which is
     a real "not signed in" state, correctly distinct from Apple
     account *not existing* (see step 4 below).
   - Paid account — I already paid Google's $25 once; I'm willing to
     pay Apple's $99/year now.
   - **Build tooling — this is the line that stranded me in the
     previous version of this file.** Reading it now: it states the
     same underlying truth (iOS building and signing runs on macOS
     with Xcode, not Windows or Linux) but immediately follows with
     "Not owning a Mac doesn't end the iOS goal" and names four actual
     routes: borrowed/rented access to someone else's Mac, a cloud
     macOS machine by the hour, a hosted macOS runner in a CI service,
     or (my case, if my Android app happens to be React Native/Expo —
     if it's genuinely native Kotlin, this fourth option doesn't apply
     to me, but the first three do) a managed cloud build service.
     **This is the fix working as intended**: I now know my next
     action is "find one of these four kinds of macOS access," not
     "give up on iOS." It also tells me plainly that getting macOS
     access doesn't skip the Apple Developer Program fee or Apple's
     own forms — I don't walk away thinking a rented Mac is a
     shortcut around paying Apple or answering their questions.
   - Working app — yes for Android. For iOS specifically, I don't have
     an iOS build yet (my app is native Android); the bullet's last
     line ("if the app isn't finished and buildable today, that's the
     actual first task") correctly tells me the iOS side of this needs
     an iOS codebase before store work starts — I read this as "the
     Android update can proceed independently; the iOS submission
     waits until there's something to build," not as a dead end for
     either goal.
   No stuck point. The specific line the verifier flagged no longer
   strands this persona.

3. **Intake, 4 blocking questions.** Answered for a mixed scenario: (1)
   both stores; (2) update for Android, first submission for iOS —
   the file doesn't force one answer across both stores, and the
   eight-state report shape (step 5, below) is per-store anyway, so a
   mixed answer here isn't a contradiction; (3) yes for Android
   (native Kotlin), not yet for iOS, consistent with point 2 above; (4)
   I own the account and hold the Android keystore myself; no Apple
   signing identity exists yet, which is expected since no Apple
   account exists yet either.

4. **Browser mode section.** Both console URLs given up front, as
   before. No issue.

5. **Eight-state check**, now for two stores at once: Google Play
   reads state 8 (live) for the account and the existing app — I
   confirm I'm signed in to the right Google identity first, per the
   "confirm signed in" bullet, then read "Live" correctly rather than
   assuming anything from memory. Apple reads as **not signed in at
   all** (no Apple ID entered anywhere yet) rather than state 1 — the
   "Signed in or signed out?" distinction in
   `reference/states-and-detection.md` tells me to get an Apple ID
   first (free, no purchase) before even reaching the Program
   enrollment page that would be genuine state 1. Report shows both
   stores, since I answered "both" to intake question 1 — matches R9.

6. **Section 1, account creation**, Apple half. All web-based —
   Individual vs Organization, D-U-N-S if Organization, the DSA
   trader-contact verification, now alongside Google Play's own
   trader-status declaration (I already did Google's, if not, the
   reference file tells me where). None of this needs a Mac — I can
   do all of it today, on Windows, while I separately go find macOS
   access for the build step later. The file doesn't make me block
   account setup on having solved the Mac question first.

7. **Section 2**, Apple's first-time checklist — again, no Mac needed:
   app record, App Information, App Privacy, pricing, review
   information. The one new blocker specific to me: I don't have an
   iOS build to point App Review at yet — expected, matches what
   "Before you start" already told me.

8. **Section 3, building.** `reference/build-and-upload-desktop.md`'s
   build rules describe what has to happen (archive, sign, export) —
   it doesn't re-litigate where that happens, which is fine, because
   "Before you start" already told me where: on whichever of the four
   macOS-access routes I picked. Nothing here re-strands me with a
   bare "requires a Mac" the way the old preflight line did.

9. **Android update, independently.** The repeat-release path
   (Section 5) walks cleanly for the Android side regardless of where
   the iOS side stands — reading the real last-shipped build number
   off Play, confirming the new one is higher, the rest of the
   preconditions list. The two platforms never block each other in
   this file.

## Verdict (persona 2 — the one verification failed on)

PASS after the R11 fix. The specific dead end the verifier found — "no
Mac" reading as "no iOS, full stop" — is gone: the preflight now states
the real routes and reaches a next action the same way the no-website
paragraph already did. Re-reading `build-and-upload-desktop.md` and
`states-and-detection.md` for any place the same absolutism might have
survived under a different sentence found none:
`grep -rniE "no workaround|cannot be done" skills/store-publishing/`
now returns zero matches anywhere in the skill.

---

# Third dry run: Round 2 (council-sourced rulings R12-R23)

Round 2 corrected four hazards a three-seat council found already
sitting in the text (telling a solo developer to delete their
keystore, banning the reviewer credential from the one field a
reviewer actually reads, an Apple upload default that doesn't exist,
and Play App Signing treated as a reversible checkbox) and added the
missing-situation coverage the council ranked highest. This walk is
acceptance item 13: a persona built specifically to hit the biggest of
the new additions at once. Fresh scratch copy, no other skill, no
access to this machine's other material.

Persona: a **solo developer** shipping a **subscription app** to
**both stores**, for the **first time** on each, whose **Apple account
is stuck in identity verification**. No browser-automation tool
connected (narrating mode).

## The walk

1. **Opening mode line, "Before you start," and intake.** All familiar
   from the first two walks — nothing new breaks here. Intake question
   4 is read in its now-longer form (authority, not just ownership):
   I answer that I'm the account holder on both stores, I hold my own
   Android keystore (there isn't one yet — this is a first submission —
   but I note I'll be generating one), and there's no one else to
   reach for authority since it's just me. This is a clean answer and
   the question doesn't slow me down for a one-person operation.

2. **The deferred "does the app sell anything" bullet — now carrying
   the subscription precondition.** Reading it, I'm told plainly that
   tax and banking being complete is *not* the same as being ready to
   submit, and pointed at "An app that sells anything" in
   `reference/developer-account-setup.md`. Opening that section: I
   need the subscription product itself created and in "Ready to
   Submit" status, attached to the version, with its own subscription
   group and localized name, *before* I submit — and on Play, the
   Monetize screens won't even fully activate until a build with the
   Play Billing Library has already reached a track. This is new
   information I didn't have before reading it, and it changes my plan
   immediately: I now know to get a first build uploaded to an internal
   Play track *before* trying to finish configuring the Play
   subscription product, and to create and attach the Apple
   subscription before I ever press Submit. No stuck point — a
   concrete, ordered next action.

3. **The children/regulated-category flag**, read before any listing
   work. My app is a plain subscription utility, none of children,
   regulated category, or restricted permission apply — I answer no to
   all three and move on in the same minute. The section does its job
   by being fast to clear when the answer is genuinely no.

4. **Browser mode and the eight-state checklist**, now with two extra
   checks before the ladder: confirm signed in (yes, to both), confirm
   role and account-holder reachability (I'm the account holder on
   both, so this clears immediately), **then check for a restricted or
   recovery-required state before assigning any of the eight below.**

5. **This is where the persona's actual situation hits.** On Google
   Play, my account reads as ordinary state 3 (account ready, no app
   record yet) — no restriction there. On Apple, `developer.apple.com
   /account` shows my identity-verification step sitting with no
   further prompt to correct it — exactly the Apple row in "Restricted
   or recovery required" in `reference/states-and-detection.md`. The
   file tells me, explicitly, not to read this as state 1 or as a
   routine rejection, and gives me a next action instead of a dead
   end:
   - Preserve the exact on-screen notice rather than paraphrasing it.
   - The notice itself says what's needed (sometimes nothing but
     "wait," sometimes a document request) — I check which.
   - Use Apple's own appeal/support channel, not a generic contact
     form.
   - Record the checkpoint ("re-check after I hear back from Apple, or
     in N days") so a later session doesn't restart this from zero.
   - **And, critically: never open a second Apple ID or a replacement
     enrollment to get around the stuck one.** This is the one place a
     "helpful" AI instinct — "let's just try signing up again" — would
     actually make things worse (both stores treat that as evasion),
     and the skill names the refusal directly rather than leaving me to
     find out the hard way.

6. **The report shape reflects this correctly.** Since I answered
   "both" to intake question 1, the report shows both stores — Google
   Play's real state 3, and Apple flagged as restricted/recovery
   required rather than forced into one of the eight numbered rows.
   I'm not left wondering why Apple's line doesn't match the table.

7. **Meanwhile, Google Play is not blocked by Apple's stall.** Nothing
   in the file makes the Play side wait on Apple's identity
   verification clearing — I continue the Play side of section 2 (app
   record, listing, Play Billing-enabled upload to unlock the
   subscription product, data inventory, export-compliance answer from
   an actual encryption inventory since I use only standard HTTPS) while
   the Apple appeal is pending in the background. This matters for the
   persona specifically: a worse version of this skill could have me
   sitting idle on both stores waiting for one appeal to clear.

8. **When Apple's verification eventually clears** (outside the scope
   of this walk, but worth confirming the file doesn't strand me
   here either): section 1 and section 2's Apple steps are unaffected —
   nothing about the earlier restricted state leaves a residue once
   it's resolved, I simply continue from wherever the ladder says state
   3 or 4 begins.

## Verdict (persona 3 — acceptance item 13)

PASS. Every point in the walk, including the stop on the restricted
Apple state, produced a concrete next action rather than a dead end.
The persona was built to hit the subscription precondition, the
authority intake question, and the restricted-state interrupt
simultaneously, on purpose — all three held up together, not just in
isolation.
