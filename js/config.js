// ============================================================
// STINGRAY STORE — SITE CONFIGURATION
// Edit this file to customize school info, without touching
// any other code.
// ============================================================

const CONFIG = {
  schoolName: "Seminole Science STEM Charter School",
  storeName: "Stingray Store",
  motto: "We support each other, contribute to our community, and strive for excellence in all we do.",

  // Where redemption requests get emailed. Change to your real inbox.
  adminEmail: "stingraystore@seminolescience.org",

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
  // After Mr. McGaha runs the monthly behavior report, replace
  // data/points.json with a fresh file mapping each student's private
  // redemption code to their real commendation/conduct totals. Never put
  // a name or student ID in that file — codes only. See README.md.
  pointsDataUrl: "data/points.json",

  // Students at or below this many conduct points earn a schoolwide free
  // Dress-Down Day on the announced day each month. This is NOT a store
  // item — it's shown as a shoutout banner, not something to "buy".
  dressDownMaxConduct: 3,
  dressDownNote:
    "You qualify for a free Dress-Down Day this month. This is separate from the Full Dress-Down Day pass below, which anyone can redeem with points any day.",

  // Penalty for submitting a request with a self-reported balance that
  // turns out to be false. Shown to students before they can send an
  // unverified request. Actually applying the deduction happens in your
  // real system, this site only displays the policy.
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
  adminAccessPhrase: "sammy-swims-under-the-blue-and-red-bridge",

  // Direct link to edit the points file in GitHub's own web editor,
  // shown at the end of the admin tool. Update the branch name if you
  // rename or merge it.
  pointsFileEditUrl:
    "https://github.com/T1MLivingston/stingraystore/edit/claude/stingray-commendation-store-tmnbhp/data/points.json",
};
