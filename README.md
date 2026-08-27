# Stingray Store

A no-login, no-database rewards store where students spend commendation
points on real-world perks. Built as a static site (plain HTML/CSS/JS) so it
can be hosted for free on GitHub Pages, with **zero student data stored
anywhere in the app**.

## How it works (matches Ms. Malca's monthly workflow)

1. **Monthly upload, codes only.** At the end of each month, once
   Mr. McGaha runs the behavior report, whoever manages the store replaces
   `data/points.json` with each student's real commendation/conduct totals
   — keyed by their private redemption code (e.g. `SR-4821-BLUE`), **never
   by name**. The code → real identity mapping lives only in the school's
   own private roster, completely outside this app. Because a code alone
   isn't personally identifying, `data/points.json` can safely ship as part
   of the static site with no student-privacy exposure.
2. **Check My Points.** A student types their code into the lookup card at
   the top of the page. If it's in this month's file, the site shows their
   *real, verified* commendation and conduct totals (read-only) — this is
   the "as secure as the dismissal portal" property Ms. Malca asked for:
   the number displayed is exactly what staff uploaded, not something the
   student can edit. If a code isn't found yet (new student, upload not
   done yet), the student can fall back to typing their points in by hand —
   clearly labeled as self-reported, so staff know to double check it.
3. **Free Dress-Down Day, automatically.** Per Ms. Malca's rule, a verified
   student with conduct points at or below `CONFIG.dressDownMaxConduct`
   (default 3) sees a banner congratulating them on qualifying for the
   month's schoolwide free dress-down day. This is informational only — it
   is not a cart item and costs no points.
4. **Browse & build a request.** Students add rewards to a cart. Items can
   optionally be locked behind a conduct-point ceiling (`maxConduct` in
   `js/items.js`), separate from the schoolwide freebie above (e.g. the
   in-store "Full Dress-Down Day" pass anyone can buy with points, any day).
5. **Request, don't auto-redeem.** "Send Request" builds a `mailto:` link
   (pre-filled subject/body) to your admin inbox with the code, the cart,
   the claimed balance, and whether it was verified via lookup or
   self-reported. A "Copy Request Details" button is a fallback for devices
   where `mailto:` doesn't open a mail app. Staff still do a final human
   check before fulfilling — the lookup makes that check fast and accurate
   instead of removing it, since there's still no live inventory/redemption
   ledger tracking what's already been spent.

### Generating `data/points.json` each month
Format:
```json
{
  "codes": {
    "SR-4821-BLUE": { "commendations": 14, "conduct": 1 }
  }
}
```
Build it from the behavior report export (a quick spreadsheet formula or
script mapping each student's existing code to their totals works fine).
**Never add a name, student ID, email, or any other identifying column** —
the whole point is that this file is safe to publish. Replace the file and
redeploy (or host it elsewhere and point `pointsDataUrl` in `js/config.js`
at it) once a month.

### If you outgrow this later
If you want the store to also track *redemptions* (so a spent point can't
be spent twice), that requires a small backend with a real code→points
ledger it can write to — a deliberate step up in scope and a good time for
a privacy review, even though it still wouldn't need student names. Out of
scope for this static version on purpose.

## Customize it

Everything you're likely to change lives in two files:

- **`js/config.js`** — school name, motto, admin email address, logo path,
  website link, and the conduct-points explainer text.
- **`js/items.js`** — the reward catalog. Add/remove/edit items, set the
  point cost, and optionally set `maxConduct` to lock an item above a
  certain conduct-point total.

Colors and layout live in `css/style.css`, controlled by CSS variables at
the top (`--blue-dark`, `--blue`, `--blue-light`, `--red`).

### Adding your real logo and Sammy the Stingray art
The two seminolescience.org logo files and the "Sammy the Stingray" mascot
images from the CHAMPS board couldn't be downloaded automatically in this
session (blocked by network policy), so the site still uses a placeholder
stingray icon. Drop your real files into `assets/` (e.g.
`assets/logo-round.png`, `assets/logo-long.png`, `assets/sammy.png`) and
update `logoPath` in `js/config.js` — or send them to whoever's iterating on
this next and they can wire them in directly.

### Setting up email
The default "Send Request by Email" button uses a `mailto:` link — this
requires no third-party account or API key, but does require the student's
device to have a configured mail app. If you want a "send without leaving
the browser" option instead (e.g. via EmailJS), that can be layered on top
of `buildRequestText()` in `js/app.js` later; it would need a free EmailJS
account (service ID, template ID, public key) since it's a hosted
third-party mail-relay.

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

Costs are ballparked off Ms. Malca's examples (6 pts for lunch bunch, 3 pts
for an untucked-shirt pass) — treat every number here as a starting point to
tune once you see real monthly point totals.

| Category | Item | Cost |
|---|---|---|
| Dress Code | Untucked Shirt Pass | 3 |
| Dress Code | Fancy Shoes Pass | 3 |
| Dress Code | Wear a Hat Pass | 3 |
| Dress Code | Full Dress-Down Day (locked above 2 conduct pts) | 10 |
| Food & Social | Lunch Bunch Pass | 6 |
| Food & Social | Lunch With a Teacher | 8 |
| Academic | Homework Pass (locked above 1 conduct pt) | 10 |
| Academic | Extra Credit Points (locked above 1 conduct pt) | 10 |
| Recognition | Positive Call Home | 6 |
| Recognition | Positive Email Home | 4 |
| Recognition | V-Friends Card (locked above 2 conduct pts) | 12 |
