// ============================================================
// STINGRAY STORE — EASTER EGGS
// Secrets kids find by messing around. Triple-tap a section
// heading and its cards flip; quadruple-tap and the section does
// something of its own. Nothing here touches points, requests, or
// any student data — it is all animation, and every count lives
// only in that one browser.
// ============================================================

(function () {
  "use strict";

  // Per section: how its cards flip on a triple-tap, and the one-off
  // trick it does on a quadruple-tap. Add a category here to give it
  // its own pair; anything not listed falls back to DEFAULT_EGG.
  const EGGS = {
    "Dress Code Passes": { triple: "egg-flip-y", quad: "egg-costume" },
    Privileges: { triple: "egg-flip-x", quad: "egg-hallpass" },
    "Food & Social": { triple: "egg-flip-spin", quad: "egg-wiggle" },
    Recognition: { triple: "egg-flip-cascade", quad: "egg-spotlight" },
    "Big Ticket Events": { triple: "egg-flip-tumble", quad: "egg-disco" },
    Collectibles: { triple: "egg-flip-y", quad: "egg-foil" },
    "Donation Bin": { triple: "egg-flip-x", quad: "egg-coins" },
    Sammy: { triple: "egg-flip-spin", quad: "egg-school" },
  };

  const DEFAULT_EGG = { triple: "egg-flip-y", quad: "egg-wiggle" };

  // How long taps keep counting as one burst. Long enough for a kid
  // tapping with one finger, short enough that two separate taps a
  // second apart don't add up to a triple.
  const TAP_WINDOW_MS = 550;
  const EFFECT_MS = 2200;
  const STORAGE_KEY = "stingray.eggs.found";

  const registered = new Set(); // egg keys that exist on this page
  let found = loadFound();
  let counterEl = null;

  const reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loadFound() {
    // Private browsing and locked-down school devices can both throw
    // on localStorage, so a failure here just means no saved progress.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (err) {
      return new Set();
    }
  }

  function saveFound() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...found]));
    } catch (err) {
      /* nothing to do, the counter just won't survive a reload */
    }
  }

  function recordFind(key, kind) {
    const id = `${key}:${kind}`;
    const isNew = !found.has(id);
    found.add(id);
    saveFound();
    renderCounter(isNew);
    return isNew;
  }

  function renderCounter(celebrate) {
    if (!counterEl) return;
    // Only count secrets that actually exist on this page, so removing
    // a category never leaves the total unreachable.
    const total = registered.size * 2;
    const mine = [...found].filter((id) => registered.has(id.split(":")[0])).length;
    if (mine === 0) {
      counterEl.hidden = true;
      return;
    }
    counterEl.hidden = false;
    counterEl.textContent =
      mine >= total
        ? `You found every secret on this page. All ${total} of them.`
        : `Secrets found: ${mine} of ${total}`;
    if (celebrate) {
      counterEl.classList.remove("pop");
      void counterEl.offsetWidth; // restart the animation on back-to-back finds
      counterEl.classList.add("pop");
    }
  }

  function playEffect(targetEl, className) {
    if (!targetEl) return;
    if (reducedMotion) {
      // Still acknowledge the find, just without the motion.
      targetEl.classList.add("egg-quiet");
      setTimeout(() => targetEl.classList.remove("egg-quiet"), 600);
      return;
    }
    targetEl.classList.remove(className);
    void targetEl.offsetWidth;
    targetEl.classList.add(className);
    setTimeout(() => targetEl.classList.remove(className), EFFECT_MS);
  }

  // The quad effect for Sammy is the only one that needs more than a
  // class: a few little stingrays swimming across the page.
  function releaseTheSchool() {
    if (reducedMotion) return;
    const layer = document.createElement("div");
    layer.className = "egg-school-layer";
    for (let i = 0; i < 7; i++) {
      const ray = document.createElement("img");
      ray.src = "assets/sammy-monitor.png";
      ray.alt = "";
      ray.className = "egg-school-ray";
      ray.style.top = `${5 + Math.random() * 80}%`;
      ray.style.animationDelay = `${Math.random() * 1.2}s`;
      ray.style.width = `${50 + Math.random() * 70}px`;
      layer.appendChild(ray);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 5000);
  }

  function trigger(key, kind, targetEl) {
    const egg = EGGS[key] || DEFAULT_EGG;
    playEffect(targetEl, egg[kind]);
    if (egg[kind] === "egg-school") releaseTheSchool();
    recordFind(key, kind);
  }

  // Counts taps in a burst, then decides once the burst ends: exactly
  // three fires the triple, four or more fires the quad. Deciding at
  // the end is what keeps a quadruple-tap from firing the triple on
  // its way past three.
  function attach(triggerEl, key, targetEl) {
    let taps = 0;
    let timer = null;

    triggerEl.addEventListener("click", () => {
      taps += 1;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (taps === 3) trigger(key, "triple", targetEl);
        else if (taps >= 4) trigger(key, "quad", targetEl);
        taps = 0;
      }, TAP_WINDOW_MS);
    });
  }

  // Called by app.js as it renders each category, and once for Sammy.
  function bind(triggerEl, key, targetEl) {
    if (!triggerEl || !targetEl) return;
    registered.add(key);
    triggerEl.classList.add("egg-target");
    attach(triggerEl, key, targetEl);
    renderCounter(false);
  }

  function init() {
    counterEl = document.getElementById("eggCounter");
    const sammy = document.querySelector(".hero__sammy");
    if (sammy) bind(sammy, "Sammy", sammy);
    renderCounter(false);
  }

  window.Eggs = { bind: bind, init: init };
})();
