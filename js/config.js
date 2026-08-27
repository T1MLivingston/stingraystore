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

  // CSV export URL of that form's response sheet. Not read by this site;
  // just open the sheet directly to review submissions and approve or
  // deny them. Leave blank if requestsFormUrl above is blank too.
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
    "https://docs.google.com/spreadsheets/d/1JtMTjT3ksYRvyjQM6CxNptt5LlBBf7Jf7t9iRGgJFSI/export?format=csv&gid=0",

  // Normal Google Sheets link. Not read by the site, just kept here so
  // whoever maintains this file has it on hand to open and edit rows.
  pointsSheetEditUrl:
    "https://docs.google.com/spreadsheets/d/1JtMTjT3ksYRvyjQM6CxNptt5LlBBf7Jf7t9iRGgJFSI/edit",

  // Your own private sheet mapping codes to real student names. This
  // site never reads it, and nothing here does either. Just a place to
  // note the link for yourself once you've created it.
  rosterSheetUrl: "",

  // ---- Wall of Fame (moderated public quote board) ----
  // A publicly posted wall where students share quotes. Every submission
  // requires staff approval before it appears anywhere public: it lands
  // as a row in wallOfFameSheetCsvUrl with a blank Status column, and
  // only shows on the site once staff type "Approved" into that column
  // directly in the sheet. The student's code rides along in the sheet
  // for accountability, but the site never displays it publicly.
  wallOfFameSheetCsvUrl:
    "https://docs.google.com/spreadsheets/d/1lUorAsYcrtM-ehNfTJRcKaPaHbP-yq9A8Sv3jLoKRCs/export?format=csv&gid=0",

  // Normal Google Sheets link, for staff to review submissions and type
  // "Approved" into a row's Status column. Not read by the site.
  wallOfFameSheetEditUrl:
    "https://docs.google.com/spreadsheets/d/1lUorAsYcrtM-ehNfTJRcKaPaHbP-yq9A8Sv3jLoKRCs/edit",

  // Google Form that appends a submission to the sheet above. Same
  // "copy to clipboard, open the form, paste, submit" pattern as
  // requestsFormUrl. Leave blank to hide the submission box (the public
  // wall still shows if wallOfFameSheetCsvUrl is set).
  wallOfFameFormUrl: "",

  // Shown to students right where they submit a quote.
  wallOfFamePolicyNote:
    "Quotes are reviewed by staff before they are posted. An offensive quote, in any way, will not be approved and may result in consequences.",

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
};
