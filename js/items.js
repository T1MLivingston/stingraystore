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
    desc: "Wear your uniform shirt untucked for the day.",
    cost: 3,
    category: "Dress Code Passes",
  },
  {
    id: "fancy-shoes",
    name: "Fancy Shoes Pass",
    desc: "Wear a shoe that doesn't fit the dress code. No Crocs or sandals, for safety.",
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
    desc: "Skip the uniform entirely. Dress down all day, any day.",
    cost: 15,
    category: "Dress Code Passes",
    maxConduct: 2,
  },
  {
    id: "locker-pass",
    name: "Early Locker Pass",
    desc: "Leave class 2 minutes before the bell to go to your locker.",
    cost: 4,
    category: "Privileges",
  },
  {
    id: "tardy-pass",
    name: "Tardy Pass",
    desc: "Show up up to 1 minute late without getting a conduct point.",
    cost: 5,
    category: "Privileges",
  },
  {
    id: "lunch-teacher",
    name: "Lunch With a Teacher",
    desc: "Enjoy a lunch invite with a teacher of your choice.",
    cost: 8,
    category: "Food & Social",
  },
  {
    id: "group-lunch-teacher",
    name: "Group Lunch With a Teacher",
    desc: "Bring two friends along to lunch with a teacher of your choice.",
    cost: 30,
    category: "Food & Social",
  },
  {
    id: "call-home",
    name: "Positive Call Home",
    desc: "A teacher or admin calls home with great news about you.",
    cost: 6,
    category: "Recognition",
  },
  {
    id: "email-home",
    name: "Positive Email Home",
    desc: "A teacher or admin sends a shout-out email to your family.",
    cost: 4,
    category: "Recognition",
  },
  {
    id: "collectible-card",
    name: "Collectible Card",
    desc: "Earn a very fun character card from Mr. Livingston.",
    cost: 50,
    category: "Collectibles",
    maxConduct: 2,
    detail:
      "This design is a VeeFriends for students exclusive. Collect them all.",
  },
  {
    id: "veefriends-comic",
    name: "VeeFriends Comic",
    desc: "Earn a VeeFriends for students exclusive comic book.",
    cost: 100,
    category: "Collectibles",
    maxConduct: 2,
  },
  {
    id: "pizza-party",
    name: "Pizza Party",
    desc: "Order a pizza delivered during lunch to share with your friends.",
    cost: 100,
    category: "Collectibles",
  },
  {
    id: "wof-dress-down",
    name: "Dress Down Day Fund",
    desc: "Donate to the goal. At 1,000 points, the whole school gets a dress-down day.",
    cost: 10,
    category: "Donation Bin",
  },
  {
    id: "wof-themed-day",
    name: "Themed Day Fund",
    desc: "Donate to the goal. At 1,500 points, the whole school gets a themed day, with the theme voted on by students.",
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
