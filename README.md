# Stingray Store

A no-login, no-database rewards store where students spend commendation
points on real-world perks. Built as a static site (plain HTML/CSS/JS) so it
can be hosted for free on GitHub Pages, with **zero student data stored
anywhere in the app**.

## How it works (the model this app implements)

1. **Self-reported points.** Students type in their own commendation and
   conduct point totals. Nothing is saved — it only drives what the page
   shows them (affordability, locked items).
2. **Browse & build a request.** Students add rewards to a cart. Items can
   optionally be locked behind a conduct-point ceiling (`maxConduct` in
   `js/items.js`).
3. **A private redemption code, not a login.** Each student is given a short
   code by the school (e.g. `SR-4821-BLUE`) that is *not* their name. The
   mapping of code → student identity → real point balance lives only in a
   spreadsheet or system your staff already control — **never in this
   app or its repo**. This is what keeps the store PII-free while still
   giving staff a way to verify a request is legitimate.
4. **Request, don't auto-redeem.** "Send Request" builds a `mailto:` link
   (pre-filled subject/body) to your admin inbox with the code, the cart,
   and the student's claimed balance. A "Copy Request Details" button is a
   fallback for devices where `mailto:` doesn't open a mail app. Staff cross
   check the code + claimed balance against the private roster before
   fulfilling — that's the actual "verification" step, done by a human, by
   design, since there's no backend here to do it automatically without
   storing data.

This trade-off (manual verification instead of an automated database) is
what lets the site ship with **no accounts, no server, and no student
records** — the biggest risk (a database of student names/points) simply
doesn't exist.

### If you outgrow this later
If the honor-system model ever becomes a problem (e.g. students inflating
their point claims), the natural next step is a small backend that looks up
a code against a real point balance server-side — at that point you are
intentionally choosing to store a code→points ledger (still not names) and
should treat it as a data system with its own privacy review. That is
out of scope for this static version on purpose.

## Customize it

Everything you're likely to change lives in two files:

- **`js/config.js`** — school name, motto, admin email address, logo path,
  website link, and the conduct-points explainer text.
- **`js/items.js`** — the reward catalog. Add/remove/edit items, set the
  point cost, and optionally set `maxConduct` to lock an item above a
  certain conduct-point total.

Colors and layout live in `css/style.css`, controlled by CSS variables at
the top (`--blue-dark`, `--blue`, `--blue-light`, `--red`).

### Adding your real logo
Drop your logo file into `assets/` (e.g. `assets/logo.png`) and update
`logoPath` in `js/config.js`. Until then, a placeholder stingray icon
(`assets/logo.svg`) is used.

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

| Category | Item | Cost |
|---|---|---|
| Dress Code | Untucked Shirt Pass | 15 |
| Dress Code | Fancy Shoes Pass | 15 |
| Dress Code | Wear a Hat Pass | 15 |
| Dress Code | Full Dress-Down Day (locked above 2 conduct pts) | 40 |
| Food & Social | Lunch Bunch Pass | 25 |
| Food & Social | Lunch With a Teacher | 20 |
| Academic | Homework Pass (locked above 1 conduct pt) | 30 |
| Academic | Extra Credit Points (locked above 1 conduct pt) | 35 |
| Recognition | Positive Call Home | 20 |
| Recognition | Positive Email Home | 15 |
| Recognition | V-Friends Card (locked above 2 conduct pts) | 50 |
