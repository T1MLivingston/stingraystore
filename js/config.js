// ============================================================
// STINGRAY STORE — SITE CONFIGURATION
// Edit this file to customize school info, without touching
// any other code.
// ============================================================

const CONFIG = {
  schoolName: "Seminole Science STEM Charter School",
  storeName: "Stingray Commendation Store",
  motto: "We support each other, contribute to our community, and strive for excellence in all we do.",

  // ---- Math challenge gate ----
  // The category hidden in the store until a student solves any one of
  // the grade-level problems at the bottom of the page. Every grade's
  // challenge unlocks this same category, so a student only has to beat
  // their own grade. Set to "" to turn the whole thing off and show
  // every category from the start. Edit the problems in js/challenges.js.
  challengeUnlocksCategory: "Donation Bin",

  // ---- Request submission ----
  // "Submit Request" posts the request text straight to this Google
  // Form's response endpoint from a hidden iframe, so it lands as a row
  // in the form's linked sheet without the student ever seeing the Form
  // itself. No backend, no email, and nothing to paste. See README.md
  // for how to find requestsFormFieldId below for your own form.
  requestsFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSf8EOiBpJOhWVSDixgdnbiw0MMX4USlHS4Jenu0MXAe4khsTQ/viewform",

  // The Form's internal field names, one "entry.123456789" per question.
  // Each key below is a separate question on the Form, so each lands in
  // its own column of the response sheet instead of all being crammed
  // into a single blob of text.
  //
  // Find every entry number at once: in the Form editor, three-dot menu
  // -> "Get pre-filled link" -> type a throwaway answer into EVERY
  // question -> Get Link -> the generated URL lists each question's
  // "entry.<number>=" in the same top-to-bottom order as the Form.
  //
  // Leave any key blank ("") to skip it -- the site simply won't send
  // that field. Any question you do map must NOT be marked "Required"
  // unless it is always filled in (a student's note, for instance, is
  // often empty), or Google will reject the whole submission.
  requestsFormFields: {
    code: "entry.1214264987", // Redemption Code (short answer) -- which student this is
    pointsUsed: "entry.407241922", // Points Used (short answer) -- total cost of the request
    items: "entry.216679292", // Items Requested (paragraph) -- one reward per line
    balance: "entry.1167893473", // Student Balance (short answer) -- commendation points on hand
    conduct: "entry.1425404857", // Conduct Points (short answer, optional)
    verified: "", // Verified? (short answer, optional) -- did the code check out
    note: "entry.999526134", // Note From Student (paragraph, optional)
    details: "", // Full Request (paragraph, optional) -- the whole thing as text
  },

  // Legacy single-question setup: the entry id of one paragraph question
  // that receives the entire request as one block of text. Only used if
  // every key in requestsFormFields above is left blank, so filling in
  // requestsFormFields is what switches the site over to separate
  // columns. Keep this set until the new Form is ready.
  requestsFormFieldId: "entry.1989281097",

  // CSV export URL of that form's response sheet. Not read by this site;
  // just open the sheet directly to review submissions and approve or
  // deny them.
  requestsSheetCsvUrl:
    "https://docs.google.com/spreadsheets/d/1ATTaHooIHiuO0pYvWVCy3Q4ZUDrZD1xWF-5fLpCn7DU/gviz/tq?tqx=out:csv",

  // The same sheet as a normal Google Sheets link, which is the one staff
  // actually open to work the queue. Not read by the site either.
  requestsSheetEditUrl:
    "https://docs.google.com/spreadsheets/d/1ATTaHooIHiuO0pYvWVCy3Q4ZUDrZD1xWF-5fLpCn7DU/edit",

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
    "https://docs.google.com/spreadsheets/d/1JtMTjT3ksYRvyjQM6CxNptt5LlBBf7Jf7t9iRGgJFSI/gviz/tq?tqx=out:csv",

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
    "https://docs.google.com/spreadsheets/d/1lUorAsYcrtM-ehNfTJRcKaPaHbP-yq9A8Sv3jLoKRCs/gviz/tq?tqx=out:csv",

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
