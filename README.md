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
5. **Request, don't auto-redeem.** "Submit Request" copies the request to
   the clipboard and opens a Google Form, so submissions collect as rows in
   a sheet you review directly (see "Request queue" below). Staff still do
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
- `pointsSheetCsvUrl`: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=0`
  (swap in your sheet's ID; `gid=0` is its first tab).

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

Requests never go by email. "Submit Request" copies the formatted request
to the clipboard and opens a Google Form in a new tab for the student to
paste and submit — Google is what actually writes the row, so no
credential capable of writing to your Sheet or repo ever has to live in
this public site's code. To set it up:

1. Create a Google Form with one field (a paragraph/long-answer question,
   e.g. "Request details") and turn on **Responses → link a Sheet** —
   Google auto-creates it and timestamps every submission.
2. Add a `Status` column to that response sheet yourself. Approve or deny a
   request by typing into that column directly, in the sheet.
3. Share the response sheet the same "Anyone with the link → Viewer" way as
   the points sheet, and set `requestsSheetCsvUrl` in `js/config.js` to its
   CSV export URL (kept for your own reference; the site itself doesn't
   read it — there is no in-site requests table).
4. Set `requestsFormUrl` to the form's own public responder link (click
   **Publish**, top right of the form editor, then copy the link from
   there).

Review submissions and match codes against your private roster directly in
the sheet.

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
  point cost, and optionally set `maxConduct` to lock an item above a
  certain conduct-point total.

Colors and layout live in `css/style.css`, controlled by CSS variables at
the top (`--blue-dark`, `--blue`, `--blue-light`, `--red`).

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

| Category | Item | Cost |
|---|---|---|
| Dress Code | Untucked Shirt Pass | 3 |
| Dress Code | Fancy Shoes Pass | 5 |
| Dress Code | Wear a Hat Pass | 5 |
| Dress Code | Full Dress-Down Day (locked above 2 conduct pts) | 15 |
| Privileges | Early Locker Pass | 4 |
| Privileges | Tardy Pass | 5 |
| Food & Social | Lunch With a Teacher | 8 |
| Food & Social | Group Lunch With a Teacher | 30 |
| Recognition | Positive Call Home | 6 |
| Recognition | Positive Email Home | 4 |
| Collectibles | Collectible Card (locked above 2 conduct pts) | 50 |
| Collectibles | VeeFriends Comic (locked above 2 conduct pts) | 100 |
| Collectibles | Pizza Party | 100 |
| Donation Bin | Dress Down Day Fund | 10 |
| Donation Bin | Themed Day Fund | 10 |

**Donation Bin** items are running group goals (e.g. 1,000 points → a
schoolwide dress-down day, 1,500 → a themed day with the theme voted on by
students), not per-student rewards. This static site has no shared counter
to track those totals live — staff need to tally donations from submitted
requests and announce progress separately.

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
