# Stingray Store

A no-login, no-database rewards store where students spend commendation
points on real-world perks. Built as a static site (plain HTML/CSS/JS) so it
can be hosted for free on GitHub Pages, with **zero student data stored
anywhere in the app**.

## How it works (matches Ms. Malca's monthly workflow)

1. **Live points, codes only.** Staff keep a Google Sheet (or `data/points.json`,
   see below) mapping each student's private redemption code to their real
   commendation/conduct totals — **never by name**. The code → real identity
   mapping lives only in a separate private roster, completely outside this
   app. Because a code alone isn't personally identifying, the points data
   this site actually fetches can safely be link-shared with no
   student-privacy exposure, as long as nothing else identifying rides
   along in it.
2. **Check My Points.** A student types their code into the lookup card at
   the top of the page. If it's found, the site shows their *real, verified*
   commendation and conduct totals (read-only) — this is the "as secure as
   the dismissal portal" property Ms. Malca asked for: the number displayed
   is exactly what staff entered, never something the student can edit.
   There is no self-report fallback: without a matching code, a student can
   still browse the catalog, but their balance shows as 0 until staff can
   confirm one.
3. **Free Dress-Down Day, automatically.** Per Ms. Malca's rule, a verified
   student with conduct points at or below `CONFIG.dressDownMaxConduct`
   (default 3) sees a banner congratulating them on qualifying for the
   month's schoolwide free dress-down day. This is informational only — it
   is not a cart item and costs no points.
4. **Browse & build a request.** Students add rewards to a cart. Items can
   optionally be locked behind a conduct-point ceiling (`maxConduct` in
   `js/items.js`), separate from the schoolwide freebie above (e.g. the
   in-store "Full Dress-Down Day" pass anyone can buy with points, any day).
   Requesting more than your known balance covers requires checking a box
   acknowledging `CONFIG.falseClaimPenalty` first.
5. **Request, don't auto-redeem.** "Submit Request" posts the request to a
   Google Form in the background, so submissions collect as rows in a
   sheet you review directly — code, points used, items, and balance each
   in their own column (see "Request queue" below). Staff still do
   a final human check before fulfilling — there's no live inventory/
   redemption ledger tracking what's already been spent.

### No admin panel, on purpose
There is no in-site staff tool. Updating this store is three things done
directly at the source, monthly:
- Edit the points sheet (or `data/points.json` via GitHub) with the
  numbers from Mr. McGaha's report.
- Approve or deny requests by typing into the Requests sheet's Status
  column.
- Approve or deny Wall of Fame quotes the same way, in their own sheet.

Everything below documents exactly how each of those three sheets works.
This repository is public, so anything that isn't already protected by
Google's own login (on the sheets) or GitHub's own login (on this repo)
would only ever be a speed bump, not real security — better to just use
those logins directly instead of building a page that pretends otherwise.

### Two ways to publish points: live sheet or static file

**Option A: Live Google Sheet (recommended).** A sheet with header row
`Code, Commendations, Conduct` (any other columns, like a Name column, are
ignored by the site — but see the warning below). Share it
**File → Share → General access → Anyone with the link → Viewer**, then
set two things in `js/config.js`:
- `pointsSheetEditUrl`: the normal sheet URL, for staff to open and edit.
- `pointsSheetCsvUrl`: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:csv`
  (swap in your sheet's ID; this format defaults to the sheet's first tab
  and works reliably even signed out of Google, unlike the `/export?format=csv&gid=0`
  form, which needs the exact numeric tab ID and can fail with "unable to
  open the file" if you guess it wrong).

Edits take effect immediately, no redeploy needed.

A test sheet already exists at the URLs currently in `js/config.js`
(**Stingray Store Points (Test)**, created for this conversation) with three
demo rows (Mr. Livingston, Ms. Malcolm, Mr. McGaha) — replace it with your
own before going live with real students, and **do the "Anyone with the
link" sharing step yourself**; no available tool can set that permission
type, only share with one named person at a time, so it still needs you to
click it once.

**Never put a real student's name in the sheet this site fetches.** Once
you share it as "Anyone with the link," every column in it is exactly as
public as `data/points.json` in this public repo — the site choosing to
ignore a Name column doesn't stop anyone else from reading it directly. Keep
the code → real name mapping in a **second, separate sheet you never share
that way** — that's `rosterSheetUrl` in config, a place to note the link
for yourself, never fetched by the site itself.

**Option B: static `data/points.json`.** Used automatically whenever
`pointsSheetCsvUrl` is blank. Format:
```json
{
  "codes": {
    "SR-4821-BLUE": { "commendations": 14, "conduct": 1 }
  }
}
```
Edit this file directly in GitHub's own web editor (open it in the repo,
click the pencil icon, edit, commit) — that GitHub login is the actual
security boundary for this option. Redeploy (a push to the Pages branch
does this automatically) to publish.

### Request queue: Google Form to Sheet, no backend

Requests never go by email, and students never see a Google Form. "Submit
Request" posts the formatted request straight to the Form's response
endpoint from a hidden iframe on the page — Google is what actually writes
the row, so no credential capable of writing to your Sheet or repo ever
has to live in this public site's code, and there's nothing for the
student to paste or submit themselves. To set it up:

1. Create a Google Form with one question per piece of a request, so each
   lands in its own column of the response sheet. Add them in this order,
   and mark every one **not** required (a student's note is often empty,
   and one empty required question rejects the whole submission):

   | Question title | Type | Maps to |
   | --- | --- | --- |
   | Redemption Code | Short answer | `code` |
   | Points Used | Short answer | `pointsUsed` |
   | Items Requested | Paragraph | `items` (one reward per line) |
   | Student Balance | Short answer | `balance` |
   | Conduct Points | Short answer | `conduct` (optional) |
   | Verified? | Short answer | `verified` (optional) |
   | Note From Student | Paragraph | `note` (optional) |
   | Full Request | Paragraph | `details` (optional) |

   Then turn on **Responses → link a Sheet** — Google auto-creates it and
   timestamps every submission.
2. Add a `Status` column to that response sheet yourself. Approve or deny a
   request by typing into that column directly, in the sheet.
3. Share the response sheet the same "Anyone with the link → Viewer" way as
   the points sheet, and set `requestsSheetCsvUrl` in `js/config.js` to its
   CSV export URL (kept for your own reference; the site itself doesn't
   read it — there is no in-site requests table).
4. Set `requestsFormUrl` to the form's own public responder link (click
   **Publish**, top right of the form editor, then copy the link from
   there).
5. Find each question's internal name for `requestsFormFields`: in the
   form editor, three-dot menu → **Get pre-filled link** → type a
   throwaway answer into **every** question → **Get Link** → copy the
   generated URL. It lists one `entry.<number>=` per question, in the
   same top-to-bottom order as the form, e.g.

   ```
   ...viewform?usp=pp_url&entry.1111111=A&entry.2222222=B&entry.3333333=C
   ```

   Paste each number into the matching key of `requestsFormFields` in
   `js/config.js`. Leave a key blank to skip that question entirely.

   `requestsFormFieldId` below it is the old single-question setup, where
   the whole request arrived as one blob of text in one column. It is
   only used while every key in `requestsFormFields` is still blank, so
   an existing form keeps working until you finish wiring up the new
   one — filling in even one named field is what flips the site over.

Review submissions and match codes against your private roster directly in
the sheet.

Because the response comes back inside a hidden iframe, the site can't
actually read whether Google accepted it (cross-origin content can't be
inspected by client-side JS) — it shows "Request submitted" either once
the iframe finishes loading or after a few seconds either way. This is the
same fire-and-forget tradeoff as the rest of this static site: staff still
do a final human check in the sheet before fulfilling anything.

Approving or denying by typing into a Status column, rather than building
real buttons for it, was a deliberate choice: buttons that actually write
back would need a small script (Google Apps Script) deployed by hand as a
"Web App" — a real option later, just more setup than this needed to be
useful today, and one more moving part than "open the sheet you already
have open anyway."

I could not create the Form itself here — Google Drive's file-creation tool
only makes native Docs, Sheets, and Slides, not Forms — so step 1 above is
on you, and takes about two minutes.

### If you outgrow this later
If you want the store to also track *redemptions* (so a spent point can't
be spent twice), that requires a small backend with a real code→points
ledger it can write to — a deliberate step up in scope and a good time for
a privacy review, even though it still wouldn't need student names. Out of
scope for this static version on purpose.

## Customize it

Everything you're likely to change lives in two files:

- **`js/config.js`** — school name, motto, logo path, website link, and
  the conduct-points explainer text.
- **`js/items.js`** — the reward catalog. Add/remove/edit items, set the
  point cost, and optionally set `maxConduct` (lock the item above a
  conduct-point total), `approval` (who has to say yes), or `notePrompt`
  (what the student must write in the note).
- **`js/eggs.js`** — the hidden tap animations. See "Easter eggs" below.
- **`js/challenges.js`** — the grade-level math problems. See "Math
  challenges" below.

Colors and layout live in `css/style.css`. The top of that file holds the
theme tokens: a short block of fixed brand colors (`--blue`, `--red`), then
one block per theme defining the semantic tokens everything else uses —
`--surface`, `--text`, `--border`, `--heading`, and so on.

**Adding a rule?** Reach for a semantic token, not a hex value. A literal
color will look wrong in one of the two themes, which is the one mistake
this structure exists to prevent.

### Dark and light mode

The store opens in dark mode. The toggle sits in the top bar, and the
choice is remembered per browser in `localStorage`. A small inline script
in `index.html` applies the saved theme before the stylesheet paints, so a
returning student never sees a flash of the wrong theme — if you move that
script, keep it in `<head>` and ahead of the stylesheet.

Both themes were checked against WCAG AA contrast on every text style on
the page. If you retint something, re-check it rather than eyeballing it:
dark text on a dark surface is easy to ship by accident and hard to
notice on the one bright monitor you happen to be testing on.

### Branding assets
`assets/` holds the real school seal (`school-seal.png`, used as the logo
and favicon) and three Sammy the Stingray poses: `sammy-monitor.png` (hero),
`sammy-backpack.png` (next to "Check My Points"), and `sammy-medal.png`
(footer, by the motto). Swap any of these for a different pose or crop by
replacing the file and keeping the same name, or update the paths in
`index.html` / `js/config.js` to point at new files.

### False claim policy
`CONFIG.falseClaimPenalty` (default 5) is shown to students in a
confirmation checkbox they must check before sending a request that costs
more than their known balance (a request within balance skips this, since
there's nothing to falsely claim). The site only displays the policy —
actually applying the deduction happens in your real system.

## Running locally

No build step — just serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying (GitHub Pages)

1. Push this repo to GitHub.
2. In repo Settings → Pages, set the source to the `main` branch, root
   folder.
3. Your store will be live at `https://<org>.github.io/<repo>/`.

## Suggested reward catalog (included, edit freely)

Costs are ballparked off Ms. Malca's examples (3 pts for an untucked-shirt
pass) — treat every number here as a starting point to tune once you see
real monthly point totals.

A ⏳ marks an item that shows a **Pending approval** badge, and 📝 one that
makes the note box required at checkout.

| Category | Item | Cost |
|---|---|---|
| Dress Code | Untucked Shirt Pass | 3 |
| Dress Code | Fancy Shoes Pass | 5 |
| Dress Code | Wear a Hat Pass | 5 |
| Dress Code | Full Dress-Down Day (locked above 3 conduct pts) | 15 |
| Privileges | Early Locker Pass | 4 |
| Privileges | Tardy Pass | 5 |
| Privileges | Stuffed Animal Buddy | 10 |
| Privileges | Elevator Pass, you and a friend ⏳📝 | 12 |
| Privileges | Chair Swap With a Teacher ⏳📝 | 20 |
| Privileges | You Pick the P.E. Game ⏳📝 | 20 |
| Privileges | Erase One Conduct Point ⏳ | 40 |
| Food & Social | Lunch With a Teacher | 8 |
| Food & Social | Group Lunch With a Teacher | 30 |
| Recognition | Positive Call Home | 6 |
| Recognition | Positive Email Home | 4 |
| Recognition | Shout-Out on the PA 📝 | 15 |
| Recognition | Inspirational Quote on the PA 📝 | 15 |
| Recognition | Celebration Board Square 📝 | 25 |
| Recognition | Read the Announcements ⏳ | 30 |
| Big Ticket Events | Performance at Lunch ⏳📝 | 35 |
| Big Ticket Events | Electronics Day ⏳ | 50 |
| Big Ticket Events | Dance Party Upstairs ⏳ | 75 |
| Big Ticket Events | Pie a Teacher ⏳📝 | 100 |
| Collectibles | Collectible Card (locked above 2 conduct pts) | 50 |
| Collectibles | VeeFriends Comic (locked above 2 conduct pts) | 100 |
| Collectibles | Pizza Party | 100 |
| Donation Bin | Dress Down Day Fund | 10 |
| Donation Bin | Themed Day Fund | 10 |

**Dress-down and conduct points.** A student above 3 conduct points cannot
dress down, either way it is offered: `maxConduct: 3` locks the Full
Dress-Down Day card in the store, and `CONFIG.dressDownMaxConduct` (also 3)
decides who sees the free monthly Dress-Down Day banner. Change both
together or the two will disagree.

**Pending approval** is a label, not a workflow. The badge tells the student
up front that someone has to say yes, and the words ride along into the
sheet's Items column as `[PENDING APPROVAL: ...]` so staff see it there too.
The actual yes or no still happens the way everything else here does — a
person typing into the Status column.

**Note-required items** won't submit with an empty note. The checkout screen
lists exactly what to write for each one ("Name the teacher and the class
period"), and Submit is refused until the box has something in it. This is
what makes "the teacher has to agree first" enforceable at all: the student
has to name them, and staff can check.

**A word on food.** New items deliberately avoid food. Anything edible drags
in allergies, dietary restrictions, and parent permission, none of which
this site can track. The two food items that predate this (Lunch With a
Teacher, Pizza Party) were left alone — worth a look if you want the rule
applied consistently.

**Donation Bin** items are running group goals (e.g. 1,000 points → a
schoolwide dress-down day, 1,500 → a themed day with the theme voted on by
students), not per-student rewards. This static site has no shared counter
to track those totals live — staff need to tally donations from submitted
requests and announce progress separately.

## Math challenges

Seminole Science is a STEM school, so the bottom of the page carries six
math problems — one each for 5th through 10th grade. **Solving any single
one unlocks the Donation Bin**, which is hidden from the store until then.
A student only has to beat their own grade, not all six.

- Which category is gated is `CONFIG.challengeUnlocksCategory` in
  `js/config.js`. Set it to `""` to switch the whole thing off and show
  every category from the start.
- The problems live in the `CHALLENGES` array at the top of
  `js/challenges.js`. Each grade has a **pool**, and one problem is drawn
  from it at random per page load, so an answer going around the lunch
  table stops working tomorrow. Add more to a pool and it gets harder to
  pass around.
- Answers are compared as trimmed, lowercased, space-stripped text, so
  `36pi`, `36 PI`, and ` 36pi ` all pass the same problem. When a problem
  has more than one reasonable form, list them all: `a: ["10", "x=10",
  "x = 10"]`.
- The unlock is stored in that browser's `localStorage`. It is a
  motivator, not a security boundary — anyone who opens dev tools can
  clear or set it, and that is fine. Nothing behind it is sensitive; the
  reward is seeing two more cards.

## Easter eggs

Kids poke at things. `js/eggs.js` gives them something to find: **triple-tap
a category heading and its cards flip; quadruple-tap and the section does
something of its own.** Each section has its own pair, so finding one
doesn't spoil the rest.

| Section | Triple-tap | Quadruple-tap |
|---|---|---|
| Dress Code Passes | cards spin on their Y axis | cards change outfits (colors cycle) |
| Privileges | cards spin on their X axis | cards take a hall pass across the room |
| Food & Social | cards spin flat | a case of the wiggles |
| Recognition | cards flip one after another | each card gets a turn in the spotlight |
| Big Ticket Events | cards tumble | the whole section throws a dance party |
| Collectibles | cards spin on their Y axis | the cards go foil |
| Donation Bin | cards spin on their X axis | points drop into the bin |
| Sammy (hero image) | Sammy spins | a school of stingrays swims across |

A counter in the footer keeps score ("Secrets found: 3 of 16") once a
student finds their first one. The Donation Bin's two secrets only count
toward the total once the math challenge has unlocked that section, so the
number goes up when it appears rather than showing an unreachable goal. It is stored in that browser's
`localStorage` — nothing is sent anywhere, nothing is tied to a student,
and clearing site data resets it. The total counts only the sections
actually on the page, so deleting a category can't strand it at an
unreachable number.

Taps are counted in one burst and judged when the burst ends, which is why
a quadruple-tap doesn't set off the triple on its way past three. A
double-tap does nothing at all. Anyone whose device asks for reduced
motion gets a quiet fade instead of the animation, and still gets the
count.

To add, change, or remove one, edit the `EGGS` map at the top of
`js/eggs.js` — the values are CSS class names defined at the bottom of
`css/style.css`. A category with no entry falls back to a plain flip and a
wiggle.

## Wall of Fame: a moderated public quote board

This is a different feature from the Donation Bin above, despite the
similar-sounding name in earlier drafts. The Wall of Fame is a public wall
of student-submitted quotes — **nothing posts automatically.** A student
submits a quote plus their code (for accountability, never shown publicly),
it lands in a Google Sheet with a blank `Status` column, and it is only
**rendered on the site once staff type `Approved` into that row's Status
column**, directly in the sheet — the same "the sheet is the approval
mechanism" pattern as the Requests queue.

Set up:
1. `wallOfFameSheetCsvUrl` / `wallOfFameSheetEditUrl` — a sheet with header
   row `Timestamp, Code, Quote, Status`, shared "Anyone with the link →
   Viewer" like the other sheets. A test sheet already exists at the URLs
   currently in `js/config.js` (**Stingray Store Wall of Fame (Test)**) with
   two sample approved quotes and one still pending, to demonstrate the
   filter. Replace it before going live.
2. `wallOfFameFormUrl` — a Google Form (same two-minute recipe as the
   Request queue: one long-answer field, linked response sheet) that
   students submit through. Leave blank to hide the submission box while
   still showing the public wall.

`CONFIG.wallOfFamePolicyNote` is shown right at the submission box: quotes
are reviewed before posting, and an offensive one won't be approved and may
carry consequences — adjust the wording to match your actual policy.
