// ============================================================
// STINGRAY STORE — DAD JOKE GENERATOR
// Locked until a student has solved EVERY grade-level math
// challenge. Setups show first; the punchline waits for a tap,
// which is the whole point of a dad joke.
//
// Add or remove jokes freely. Keep them school appropriate —
// this is on a public page with the school's name at the top.
// ============================================================

const DAD_JOKES = [
  { setup: "What do you call a guy with a rubber toe?", punch: "Roberto." },
  { setup: "What does a sea monster eat?", punch: "Fish and chips." },
  { setup: "What's a dog that is also a magician?", punch: "A labracadabrador." },
  { setup: "What do you call a fake noodle?", punch: "An impasta." },
  { setup: "How do you know a joke is a dad joke?", punch: "It's apparent." },
  { setup: "What kind of music do blacksmiths love?", punch: "Heavy metal." },
  { setup: "How do you make a tissue dance?", punch: "Put a little boogie in it." },
  { setup: "Why was the scarecrow given an award?", punch: "He was outstanding in his field." },
  { setup: "Did you hear the rumor about butter?", punch: "Never mind, I don't want to spread it." },
  { setup: "Why don't skeletons ever fight each other?", punch: "They don't have the guts." },
  { setup: "What do you call cheese that isn't yours?", punch: "Nacho cheese." },
  { setup: "Why did the math book look so sad?", punch: "It had too many problems." },
  { setup: "What do you call a bear with no teeth?", punch: "A gummy bear." },
  { setup: "What do you call a factory that makes okay products?", punch: "A satisfactory." },
  { setup: "Why did the bicycle fall over?", punch: "It was two tired." },
  { setup: "What did the ocean say to the beach?", punch: "Nothing. It just waved." },
  { setup: "Why did the scientist take out his doorbell?", punch: "He wanted to win the No-bell Prize." },
  { setup: "What is brown and sticky?", punch: "A stick." },
  { setup: "Why do seagulls fly over the sea?", punch: "If they flew over the bay, they'd be bagels." },
  { setup: "What did one wall say to the other wall?", punch: "I'll meet you at the corner." },
  { setup: "How does a penguin build its house?", punch: "Igloos it together." },
  { setup: "What do you call a dinosaur with an extensive vocabulary?", punch: "A thesaurus." },
  { setup: "Why was the belt arrested?", punch: "For holding up a pair of pants." },
  { setup: "What do you call a pile of cats?", punch: "A meowtain." },
  { setup: "Why did the coffee file a police report?", punch: "It got mugged." },
  { setup: "What do you call a boomerang that doesn't come back?", punch: "A stick." },
  { setup: "Why don't eggs tell jokes?", punch: "They'd crack each other up." },
  { setup: "What did the janitor say when he jumped out of the closet?", punch: "Supplies!" },
  { setup: "How do you organize a party in space?", punch: "You planet." },
  { setup: "What do you call an alligator in a vest?", punch: "An investigator." },
  { setup: "Why did the golfer bring two pairs of pants?", punch: "In case he got a hole in one." },
  { setup: "What is the best thing about Switzerland?", punch: "I don't know, but the flag is a big plus." },
  { setup: "Why can't your nose be twelve inches long?", punch: "Because then it would be a foot." },
  { setup: "What do you call a sleeping bull?", punch: "A bulldozer." },
  { setup: "What is an astronaut's favorite part of a computer?", punch: "The space bar." },
  { setup: "Why did the picture go to jail?", punch: "It was framed." },
  { setup: "What do you call a can opener that doesn't work?", punch: "A can't opener." },
  { setup: "Why did the student eat his homework?", punch: "The teacher said it was a piece of cake." },
  { setup: "What kind of shoes do ninjas wear?", punch: "Sneakers." },
  { setup: "What did the grape do when it got stepped on?", punch: "Nothing. It just let out a little wine." },
  { setup: "Why are elevator jokes so good?", punch: "They work on so many levels." },
  { setup: "What do you call a fish with no eyes?", punch: "A fsh." },
  { setup: "What did the buffalo say when his son left for school?", punch: "Bison." },
  { setup: "Why did the cookie go to the doctor?", punch: "It was feeling crummy." },
  { setup: "What do you call a train carrying bubble gum?", punch: "A chew-chew train." },
  { setup: "Why did the teddy bear say no to dessert?", punch: "It was already stuffed." },
  { setup: "What is a computer's favorite snack?", punch: "Microchips." },
  { setup: "Why did the tomato turn red?", punch: "It saw the salad dressing." },
  { setup: "How do trees get on the internet?", punch: "They log in." },
  { setup: "What did the paper say to the pencil?", punch: "You've got a good point." },
  { setup: "Why did the melon jump into the lake?", punch: "It wanted to be a watermelon." },
  { setup: "What do you call a pig that does karate?", punch: "A pork chop." },
  { setup: "Why couldn't the leopard play hide and seek?", punch: "He was always spotted." },
  { setup: "What do you call a magic dog that can also do math?", punch: "A labracadabracus." },
  { setup: "Why did the scarecrow become a teacher?", punch: "He was great at getting students to stand up straight." },
];

(function () {
  "use strict";

  let els = {};
  let lastIndex = -1;

  function unlocked() {
    return Boolean(window.Challenges && window.Challenges.allSolved());
  }

  // Never the same joke twice in a row, which is the one thing that
  // makes a random button feel broken.
  function nextJoke() {
    if (DAD_JOKES.length === 1) return DAD_JOKES[0];
    let i = lastIndex;
    while (i === lastIndex) i = Math.floor(Math.random() * DAD_JOKES.length);
    lastIndex = i;
    return DAD_JOKES[i];
  }

  function showJoke() {
    const joke = nextJoke();
    els.setup.textContent = joke.setup;
    els.punch.textContent = joke.punch;
    els.punch.hidden = true;
    els.reveal.hidden = false;
    els.button.textContent = "Another one";
  }

  function reveal() {
    els.punch.hidden = false;
    els.reveal.hidden = true;
  }

  // Called on load and again whenever a challenge is solved.
  function refresh() {
    if (!els.section) return;
    const open = unlocked();
    els.section.hidden = !open;
    if (open && !els.setup.textContent) {
      els.setup.textContent = `${DAD_JOKES.length} jokes. Zero of them good. Press the button.`;
    }
  }

  function init() {
    els = {
      section: document.getElementById("jokeSection"),
      setup: document.getElementById("jokeSetup"),
      punch: document.getElementById("jokePunch"),
      reveal: document.getElementById("jokeRevealBtn"),
      button: document.getElementById("jokeBtn"),
      count: document.getElementById("jokeCount"),
    };
    if (!els.section) return;
    if (els.count) els.count.textContent = DAD_JOKES.length;
    els.button.addEventListener("click", showJoke);
    els.reveal.addEventListener("click", reveal);
    refresh();
  }

  window.Jokes = { init: init, refresh: refresh };
})();
