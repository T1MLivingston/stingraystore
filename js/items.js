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
//   approval    (optional) who has to say yes before this actually
//               happens. Shows a "Pending approval" badge on the card and
//               rides along in the request so staff see it in the sheet.
//   notePrompt  (optional) what the student must put in the note box.
//               Any item with this makes the note required at checkout.
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
    maxConduct: 3,
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
    id: "stuffed-animal",
    name: "Stuffed Animal Buddy",
    desc: "Carry a stuffed animal with you all day.",
    cost: 10,
    category: "Privileges",
    detail:
      "Bring your own from home. It rides with you class to class, but it stays in your bag during tests and anything hands-on like a lab or P.E.",
  },
  {
    id: "elevator-pass",
    name: "Elevator Pass",
    desc: "You and one friend ride the elevator for the day.",
    cost: 30,
    category: "Privileges",
    approval: "Front office approval",
    notePrompt: "Name the friend riding with you.",
  },
  {
    id: "chair-swap",
    name: "Chair Swap With a Teacher",
    desc: "Trade seats with a teacher for one class period.",
    cost: 20,
    category: "Privileges",
    approval: "That teacher has to agree first",
    notePrompt: "Name the teacher and the class period. Ask them before you request.",
    detail:
      "You sit at the teacher's desk, they take your seat. Ask the teacher first and put their name in the note. You are still doing the class work either way.",
  },
  {
    id: "pe-game",
    name: "You Pick the P.E. Game",
    desc: "Choose the game your class plays in P.E.",
    cost: 20,
    category: "Privileges",
    approval: "P.E. coach approval",
    notePrompt: "Name the game you want, and your P.E. period.",
  },
  {
    id: "conduct-erase",
    name: "Erase One Conduct Point",
    desc: "Take a single conduct point off your record.",
    cost: 40,
    category: "Privileges",
    approval: "Administration reviews every one of these",
    detail:
      "This clears one conduct point, not a referral or a suspension. Administration looks at your record before approving, and it can only be used on a point already on your record.",
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
    id: "pa-shoutout",
    name: "Shout-Out on the PA",
    desc: "Your shout-out read on the morning announcements.",
    cost: 15,
    category: "Recognition",
    notePrompt: "Write exactly what you want read aloud.",
  },
  {
    id: "pa-quote",
    name: "Inspirational Quote on the PA",
    desc: "Share a quote with the whole school.",
    cost: 15,
    category: "Recognition",
    notePrompt: "Write the quote, and who said it.",
  },
  {
    id: "announcements",
    name: "Read the Announcements",
    desc: "Be the voice of the morning announcements.",
    cost: 30,
    category: "Recognition",
    approval: "Front office approval",
    detail:
      "You read the whole morning announcement script over the PA. Staff will go over it with you beforehand so you know what is on it.",
  },
  {
    id: "celebration-board",
    name: "Celebration Board Square",
    desc: "Fill a spot on the celebration board with your work.",
    cost: 25,
    category: "Recognition",
    notePrompt: "Say what you want to put up: a quote, artwork, or a fact.",
    detail:
      "You get an 8.5 x 11 sheet on the celebration board. Put up an inspirational quote, your own original artwork, or an interesting fact, with your name on it. You will work with Ms. Griffiths or another art teacher to make your square look sharp before it goes up.",
  },
  {
    id: "lunch-performance",
    name: "Performance at Lunch",
    desc: "Perform in the show room while everyone eats.",
    cost: 35,
    category: "Big Ticket Events",
    approval: "Staff approval, and your act gets a look first",
    notePrompt: "Describe your act, and how long it runs.",
    detail:
      "A room is set up like a little talent show. You perform, students eat and watch, and other performers can sign up for the same lunch. Staff will want to see or hear about the act first.",
  },
  {
    id: "electronics-day",
    name: "Electronics Day",
    desc: "A room set up with video games for the period.",
    cost: 50,
    category: "Big Ticket Events",
    approval: "Staff approval, and it depends on room availability",
    detail:
      "We set up a game in one of the spare rooms upstairs. Which day it lands on depends on what rooms are open, so this one gets scheduled rather than handed out on the spot.",
  },
  {
    id: "dance-party",
    name: "Dance Party Upstairs",
    desc: "A room upstairs turns into a dance floor.",
    cost: 75,
    category: "Big Ticket Events",
    approval: "Staff approval, and it depends on room availability",
    detail:
      "One of the upstairs rooms becomes a dance party with music, and students can come dance. Staff pick the day and the playlist gets a once-over first.",
  },
  {
    id: "pie-a-teacher",
    name: "Pie a Teacher",
    desc: "A pie to the face. The teacher has to say yes.",
    cost: 100,
    category: "Big Ticket Events",
    approval: "The teacher has to agree, and administration schedules it",
    notePrompt: "Name the teacher. Ask them first.",
    detail:
      "The biggest one on the board. Ask the teacher first and put their name in the note. Administration picks the day and place, usually at an assembly or a spirit event.",
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
  "Big Ticket Events": "#f76707",
  Collectibles: "#0c8599",
  "Donation Bin": "#d6336c",
};
