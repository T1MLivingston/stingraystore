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
    desc: "Swap uniform shoes for the shoes of your choice.",
    cost: 3,
    category: "Dress Code Passes",
  },
  {
    id: "hat-pass",
    name: "Wear a Hat Pass",
    desc: "Wear a hat in class for the day.",
    cost: 3,
    category: "Dress Code Passes",
  },
  {
    id: "dress-down",
    name: "Full Dress-Down Day",
    desc: "Skip the uniform entirely. Dress down all day, any day.",
    cost: 10,
    category: "Dress Code Passes",
    maxConduct: 2,
  },
  {
    id: "lunch-bunch",
    name: "Lunch Bunch Pass",
    desc: "Eat lunch with friends outside your usual spot.",
    cost: 6,
    category: "Food & Social",
  },
  {
    id: "lunch-teacher",
    name: "Lunch With a Teacher",
    desc: "Enjoy a lunch invite with a teacher of your choice.",
    cost: 8,
    category: "Food & Social",
  },
  {
    id: "homework-pass",
    name: "Homework Pass",
    desc: "Skip one homework assignment, no questions asked.",
    cost: 10,
    category: "Academic Perks",
    maxConduct: 1,
  },
  {
    id: "extra-credit",
    name: "Extra Credit Points",
    desc: "Redeem for a small extra-credit boost in one class.",
    cost: 10,
    category: "Academic Perks",
    maxConduct: 1,
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
    id: "vfriends",
    name: "V-Friends Card",
    desc: "Earn an exclusive V-Friends recognition card.",
    cost: 12,
    category: "Recognition",
    maxConduct: 2,
  },
];
