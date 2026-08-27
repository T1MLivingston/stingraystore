// ============================================================
// STINGRAY STORE — SITE CONFIGURATION
// Edit this file to customize school info, without touching
// any other code.
// ============================================================

const CONFIG = {
  schoolName: "Seminole Science STEM Charter School",
  storeName: "Stingray Store",
  motto: "We support each other, contribute to our community, and strive for excellence in all we do.",

  // Where redemption requests get emailed. Only used while
  // requestsFormUrl below is blank.
  adminEmail: "stingraystore@seminolescience.org",

  // ---- Request submission (optional upgrade from email) ----
  // If set, "Send Request" copies the request details to the clipboard
  // and opens this Google Form in a new tab, where the student pastes
  // them into a single text field and submits. Each submission becomes
  // a timestamped row in the form's linked response sheet automatically,
  // no backend needed. Leave blank to keep the default mailto: flow.
  // See README.md for the two-minute steps to create this form.
  requestsFormUrl: "",

  // CSV export URL of that form's response sheet, so the admin page can
  // list submitted requests and offer a CSV download. Leave blank if
  // requestsFormUrl above is blank too.
  requestsSheetCsvUrl: "",

  // School seal, shown in the top bar.
  logoPath: "assets/school-seal.png",

  // Link to your school website (shown in the footer).
  websiteUrl: "https://www.seminolescience.org",

  // Reference documents (shown in the footer).
  codeOfConductUrl:
    "https://seminolescience.org/images/media/sscs/2627/2026-2027_SSCS_Student_Handbook_and_Code_of_Conduct.pdf",
  uniformPolicyUrl:
    "https://seminolescience.org/images/media/sscs/2024-25/StudentHandbook/SSCS_Uniform_Policy.pdf",

  // Conduct points: set what your school's scale means so the note
  // on the page matches your actual conduct system.
  conductNote:
    "Conduct points reflect your discipline record this month. Lower is better. Some rewards are unavailable above a certain conduct point total.",

  // ---- Monthly points upload (per Ms. Malca's plan) ----
  // Two ways to publish this month's points, in priority order:
  //
  // 1. Live Google Sheet (checked first, if set). Edit rows any time,
  //    students see the change immediately, no redeploy needed.
  // 2. data/points.json (fallback, or if you leave pointsSheetCsvUrl
  //    blank). Replace this file and redeploy once a month.
  //
  // Either way, the data itself must be code -> commendations/conduct
  // ONLY. Never put a name or student ID in whatever the site actually
  // fetches. See README.md for the two-sheet privacy model.
  pointsDataUrl: "data/points.json",

  // The sheet's CSV export endpoint, fetched directly by the site.
  // Needs a header row with "Code", "Commendations", and "Conduct"
  // columns (any others, like a Name column, are ignored by the site,
  // but are still technically public once the sheet is link-shared, so
  // don't rely on the site ignoring them for real privacy). Leave blank
  // to use data/points.json instead.
  pointsSheetCsvUrl:
    "https://docs.google.com/spreadsheets/d/1BNjrOeiSft-aEOkaUjDK4xEXP91PhEv2euRISy0LcuU/export?format=csv&gid=0",

  // Normal Google Sheets link, for staff to open and edit rows directly.
  // Shown on the admin page.
  pointsSheetEditUrl:
    "https://docs.google.com/spreadsheets/d/1BNjrOeiSft-aEOkaUjDK4xEXP91PhEv2euRISy0LcuU/edit",

  // Your own private sheet mapping codes to real student names. This
  // site never reads it. It's just a convenience link on the admin page
  // once you've created it. Leave blank until then.
  rosterSheetUrl: "",

  // Students at or below this many conduct points earn a schoolwide free
  // Dress-Down Day on the announced day each month. This is NOT a store
  // item — it's shown as a shoutout banner, not something to "buy".
  dressDownMaxConduct: 3,
  dressDownNote:
    "You qualify for a free Dress-Down Day this month. This is separate from the Full Dress-Down Day pass below, which anyone can redeem with points any day.",

  // Penalty for requesting more than your real balance covers. Shown to
  // students before they can send a request that exceeds their known
  // balance. Actually applying the deduction happens in your real
  // system, this site only displays the policy.
  falseClaimPenalty: 5,

  // ---- Admin access ----
  // This phrase gates the admin page (admin.html), where staff turn a
  // spreadsheet of codes and points into the data/points.json file.
  // IMPORTANT: this repository is public, and this site is a static page
  // with no backend. A phrase stored here is visible to anyone who views
  // this file's source, on the live site or on GitHub, no matter how long
  // it is. Treat it as a speed bump that keeps casual visitors out of the
  // admin tool, not as real security. The actual security boundary is
  // GitHub's own login, which is required to commit the generated file.
  // Change this phrase before publishing, and never gate anything more
  // sensitive than "help me format a JSON file" behind it.
  adminAccessPhrase: "TitoTime!",

  // Direct link to edit the points file in GitHub's own web editor,
  // shown at the end of the admin tool. Update the branch name if you
  // rename or merge it.
  pointsFileEditUrl:
    "https://github.com/T1MLivingston/stingraystore/edit/claude/stingray-commendation-store-tmnbhp/data/points.json",
};
