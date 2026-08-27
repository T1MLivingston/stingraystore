// ============================================================
// STINGRAY STORE — CATALOG
// Add, remove, or edit reward items here. Each item:
//   id          unique short string, no spaces
//   name        shown to students
//   desc        one-line description
//   cost        commendation points required
//   category    groups items on the page
//   maxConduct  (optional) item is locked if the student's entered
//               conduct points are greater than this number
//   detail      (optional) extra text shown in a popup when a student
//               clicks "Learn more" on the card
// A new category picks up a default gray accent unless you add it to
// CATEGORY_COLORS below. Categories render in the order their first item
// appears here, so a category placed last in this list renders last.
// ============================================================

const ITEMS = [
  {
    id: "untucked",
    name: "Untucked Shirt Pass",
    desc: "Wear your shirt untucked for the day.",
    cost: 3,
    category: "Dress Code Passes",
  },
  {
    id: "fancy-shoes",
    name: "Fancy Shoes Pass",
    desc: "Wear shoes outside the dress code. No Crocs or sandals.",
    cost: 5,
    category: "Dress Code Passes",
  },
  {
    id: "hat-pass",
    name: "Wear a Hat Pass",
    desc: "Wear a hat in class for the day.",
    cost: 5,
    category: "Dress Code Passes",
  },
  {
    id: "dress-down",
    name: "Full Dress-Down Day",
    desc: "Skip the uniform. Dress down any day.",
    cost: 15,
    category: "Dress Code Passes",
    maxConduct: 2,
  },
  {
    id: "locker-pass",
    name: "Early Locker Pass",
    desc: "Leave 2 minutes early for your locker.",
    cost: 4,
    category: "Privileges",
  },
  {
    id: "tardy-pass",
    name: "Tardy Pass",
    desc: "Show up to 1 minute late, no conduct point.",
    cost: 5,
    category: "Privileges",
  },
  {
    id: "lunch-teacher",
    name: "Lunch With a Teacher",
    desc: "Lunch with a teacher of your choice.",
    cost: 8,
    category: "Food & Social",
  },
  {
    id: "group-lunch-teacher",
    name: "Group Lunch With a Teacher",
    desc: "Lunch with a teacher, plus two friends.",
    cost: 30,
    category: "Food & Social",
  },
  {
    id: "call-home",
    name: "Positive Call Home",
    desc: "A teacher calls home with good news.",
    cost: 6,
    category: "Recognition",
  },
  {
    id: "email-home",
    name: "Positive Email Home",
    desc: "A teacher emails your family good news.",
    cost: 4,
    category: "Recognition",
  },
  {
    id: "collectible-card",
    name: "Collectible Card",
    desc: "A fun character card from Mr. Livingston.",
    cost: 50,
    category: "Collectibles",
    maxConduct: 2,
    detail:
      "This design is a VeeFriends for students exclusive. Collect them all.",
  },
  {
    id: "veefriends-comic",
    name: "VeeFriends Comic",
    desc: "An exclusive VeeFriends comic book.",
    cost: 100,
    category: "Collectibles",
    maxConduct: 2,
  },
  {
    id: "pizza-party",
    name: "Pizza Party",
    desc: "A pizza delivered to share at lunch.",
    cost: 100,
    category: "Collectibles",
  },
  {
    id: "wof-dress-down",
    name: "Dress Down Day Fund",
    desc: "Goal: 1,000 points for a schoolwide dress-down day.",
    cost: 10,
    category: "Donation Bin",
  },
  {
    id: "wof-themed-day",
    name: "Themed Day Fund",
    desc: "Goal: 1,500 points for a student-voted theme day.",
    cost: 10,
    category: "Donation Bin",
  },
];

// Left-border accent color for each category on the storefront.
const CATEGORY_COLORS = {
  "Dress Code Passes": "#e63946",
  Privileges: "#4263eb",
  "Food & Social": "#f59f00",
  Recognition: "#7048e8",
  Collectibles: "#0c8599",
  "Donation Bin": "#d6336c",
};
