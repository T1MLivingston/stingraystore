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
// A new category picks up a default gray accent unless you add it to
// CATEGORY_COLORS below.
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
    id: "locker-pass",
    name: "Early Locker Pass",
    desc: "Leave class 2 minutes before the bell to go to your locker.",
    cost: 4,
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
    id: "wall-of-fame",
    name: "Wall of Fame Donation",
    desc: "Donate points to the schoolwide fund. At 5,000 points, Mr. Livingston shaves his head.",
    cost: 10,
    category: "Recognition",
  },
  {
    id: "veefriends",
    name: "VeeFriends Card",
    desc: "Earn an exclusive VeeFriends collectible card.",
    cost: 50,
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
];

// Left-border accent color for each category on the storefront.
const CATEGORY_COLORS = {
  "Dress Code Passes": "#e63946",
  Privileges: "#4263eb",
  "Food & Social": "#f59f00",
  Recognition: "#7048e8",
  Collectibles: "#0c8599",
};
