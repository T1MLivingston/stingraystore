// ============================================================
// STINGRAY STORE — GRADE-LEVEL MATH CHALLENGES
// A row of problems at the bottom of the page, one per grade.
// Solving ANY single one unlocks the same thing: the category
// named by CONFIG.challengeUnlocksCategory. A student only has to
// beat their own grade, not all six.
//
// To edit a problem, change the "q" and "a" below. Answers are
// compared as trimmed lowercase text, so "12" and " 12 " both
// pass, and an answer like "x = 4" should list its accepted forms
// in an array.
// ============================================================

const CHALLENGES = [
  {
    grade: "5th Grade",
    pool: [
      { q: "A student earns 14 commendation points a week. How many points is that in 6 weeks?", a: ["84"] },
      { q: "Three friends split 96 points evenly. How many points does each one get?", a: ["32"] },
      { q: "What is 3/4 of 60?", a: ["45"] },
    ],
  },
  {
    grade: "6th Grade",
    pool: [
      { q: "A reward costs 40 points. It is marked down 25%. What does it cost now?", a: ["30"] },
      { q: "The ratio of dress-code passes to privileges sold is 3:5. If 24 dress-code passes sold, how many privileges sold?", a: ["40"] },
      { q: "Evaluate: -7 + 12 - 5", a: ["0"] },
    ],
  },
  {
    grade: "7th Grade",
    pool: [
      { q: "8 points buy 2 passes. At the same rate, how many points buy 7 passes?", a: ["28"] },
      { q: "A 60 point item goes up 15%. What is the new price, in points?", a: ["69"] },
      { q: "Evaluate: (-4)(-6) + 3", a: ["27"] },
    ],
  },
  {
    grade: "8th Grade",
    pool: [
      { q: "Solve for x:  5x - 12 = 38", a: ["10", "x=10", "x = 10"] },
      { q: "A right triangle has legs 9 and 12. How long is the hypotenuse?", a: ["15"] },
      { q: "Simplify:  2^5 - 2^3", a: ["24"] },
    ],
  },
  {
    grade: "9th Grade",
    pool: [
      { q: "Solve for the positive value of x:  x^2 - 7x + 12 = 0. Give the larger root.", a: ["4", "x=4", "x = 4"] },
      { q: "A line passes through (2, 5) and (6, 17). What is its slope?", a: ["3"] },
      { q: "If f(x) = 3x^2 - 2x, what is f(4)?", a: ["40"] },
    ],
  },
  {
    grade: "10th Grade",
    pool: [
      { q: "A circle has radius 6. What is its area, in terms of pi? (Answer as a number times pi, e.g. '9pi')", a: ["36pi", "36 pi", "36π"] },
      { q: "Two similar triangles have a scale factor of 3. The smaller has area 7. What is the area of the larger?", a: ["63"] },
      { q: "In a right triangle, the hypotenuse is 25 and one leg is 7. How long is the other leg?", a: ["24"] },
    ],
  },
  {
    grade: "11th Grade",
    pool: [
      { q: "Solve for x:  log base 2 of x = 5", a: ["32", "x=32", "x = 32"] },
      { q: "What is the sum of the first 20 positive integers?", a: ["210"] },
      { q: "If f(x) = 2x + 1 and g(x) = x^2, what is f(g(3))?", a: ["19"] },
    ],
  },
  {
    grade: "12th Grade",
    pool: [
      { q: "What is the derivative of f(x) = 3x^2 + 5x? (Write it like '6x+5')", a: ["6x+5", "6x + 5"] },
      { q: "Evaluate:  sin(90 degrees) + cos(0 degrees)", a: ["2"] },
      { q: "What is the sum of the infinite series 8 + 4 + 2 + 1 + ... ?", a: ["16"] },
    ],
  },
];

// Triple-click a question and it turns into one of these instead. Answer
// a riddle and it counts exactly the same as the math did.
const RIDDLES = [
  {
    q: "I have keys but open no locks. I have space but no room. You can enter, but you cannot go outside. What am I?",
    a: ["keyboard", "a keyboard"],
  },
  {
    q: "What has hands but cannot clap?",
    a: ["clock", "a clock", "watch", "a watch"],
  },
  {
    q: "The more you take, the more you leave behind. What am I?",
    a: ["footsteps", "footprints", "steps"],
  },
];

(function () {
  "use strict";

  const STORAGE_KEY = "stingray.challenge.solved";

  const state = {
    solved: load(), // Set of grade names this browser has beaten
    picked: [], // the problem chosen for each grade this page load
  };

  let els = {};
  let onUnlock = null;

  function load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      // Earlier versions stored a single grade name. Keep that unlock.
      if (raw.charAt(0) !== "[") return new Set([raw]);
      return new Set(JSON.parse(raw));
    } catch (err) {
      return new Set();
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.solved]));
    } catch (err) {
      /* the unlock just won't survive a reload */
    }
  }

  // One solved challenge opens the gated store category.
  function isUnlocked() {
    return state.solved.size > 0;
  }

  // Every challenge solved is what opens the dad joke generator.
  function allSolved() {
    return state.solved.size >= CHALLENGES.length;
  }

  function solvedCount() {
    return state.solved.size;
  }

  function totalCount() {
    return CHALLENGES.length;
  }

  // "36 PI" and " 36pi " should both beat "36pi".
  function normalize(value) {
    return String(value).trim().toLowerCase().replace(/\s+/g, "");
  }

  function accepts(problem, value) {
    const given = normalize(value);
    return problem.a.some((ok) => normalize(ok) === given);
  }

  function pickProblems() {
    // A fresh problem per grade on every load, so the answer going
    // around the lunch table stops working tomorrow.
    state.picked = CHALLENGES.map((c) => c.pool[Math.floor(Math.random() * c.pool.length)]);
  }

  function renderStatus() {
    if (!els.status) return;
    if (!isUnlocked()) {
      els.status.hidden = true;
      return;
    }
    const category = CONFIG.challengeUnlocksCategory;
    els.status.hidden = false;
    els.status.className = "challenges__status unlocked";
    els.status.textContent = allSolved()
      ? `All ${totalCount()} solved. The ${category} is open, and so is the joke generator below.`
      : `The ${category} is open, scroll up to see it. ` +
        `Solved ${solvedCount()} of ${totalCount()} — beat them all to unlock one more thing.`;
  }

  function renderCard(challenge, index) {
    // Swappable: a triple-click on the question replaces it with a
    // riddle, and everything below reads whichever one is live.
    let problem = state.picked[index];
    const card = document.createElement("form");
    card.className = "challenge-card";
    card.innerHTML = `
      <div class="challenge-card__grade">${challenge.grade}</div>
      <p class="challenge-card__q"></p>
      <div class="challenge-card__row">
        <input type="text" inputmode="text" autocomplete="off" aria-label="Your answer" placeholder="Answer" />
        <button type="submit">Check</button>
      </div>
      <div class="challenge-card__msg" aria-live="polite"></div>
    `;
    const question = card.querySelector(".challenge-card__q");
    question.textContent = problem.q;
    question.classList.add("is-swappable");

    const input = card.querySelector("input");
    const msg = card.querySelector(".challenge-card__msg");

    if (state.solved.has(challenge.grade)) {
      card.classList.add("solved");
      msg.className = "challenge-card__msg ok";
      msg.textContent = "Already solved.";
    }

    // Two hidden shortcuts, both on a triple-click. On the answer box it
    // fills the answer in. On the question it swaps the math for a
    // riddle, which counts the same.
    function onTripleClick(el, handler) {
      let clicks = 0;
      let timer = null;
      el.addEventListener("click", () => {
        clicks += 1;
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (clicks >= 3) handler();
          clicks = 0;
        }, 500);
      });
    }

    onTripleClick(input, () => {
      input.value = problem.a[0];
      input.focus();
    });

    onTripleClick(question, () => {
      if (card.classList.contains("solved")) return;
      problem = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
      question.textContent = problem.q;
      card.classList.add("riddle");
      input.value = "";
      msg.className = "challenge-card__msg";
      msg.textContent = "";
    });

    card.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!input.value.trim()) return;
      if (accepts(problem, input.value)) {
        const isNew = !state.solved.has(challenge.grade);
        card.classList.add("solved");
        card.classList.remove("wrong");
        msg.className = "challenge-card__msg ok";
        msg.textContent = allSolved() && !isNew ? "Already solved." : "Correct.";
        if (isNew) {
          state.solved.add(challenge.grade);
          save();
          msg.textContent = allSolved() ? "Correct. That's all of them." : "Correct. Unlocked.";
          renderStatus();
          if (onUnlock) onUnlock();
        }
      } else {
        card.classList.remove("solved");
        card.classList.remove("wrong");
        void card.offsetWidth; // restart the shake on a second wrong answer
        card.classList.add("wrong");
        msg.className = "challenge-card__msg err";
        msg.textContent = "Not quite. Try again.";
      }
    });

    return card;
  }

  function render() {
    if (!els.grid) return;
    els.grid.innerHTML = "";
    CHALLENGES.forEach((challenge, i) => els.grid.appendChild(renderCard(challenge, i)));
    els.lead.textContent = `Solve the problem for any grade and the ${CONFIG.challengeUnlocksCategory} unlocks in the store above. You only need one.`;
    renderStatus();
  }

  // app.js hands over a callback so it can re-render the catalog the
  // moment a challenge is solved, without this file knowing how the
  // catalog works.
  function init(unlockCallback) {
    onUnlock = unlockCallback;
    els = {
      section: document.getElementById("challengeSection"),
      grid: document.getElementById("challengeGrid"),
      lead: document.getElementById("challengeLead"),
      status: document.getElementById("challengeStatus"),
    };
    if (!CONFIG.challengeUnlocksCategory) {
      if (els.section) els.section.hidden = true;
      return;
    }
    pickProblems();
    render();
  }

  window.Challenges = {
    init: init,
    isUnlocked: isUnlocked,
    allSolved: allSolved,
    solvedCount: solvedCount,
    totalCount: totalCount,
  };
})();
