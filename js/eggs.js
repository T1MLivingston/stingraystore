// ============================================================
// STINGRAY STORE — EASTER EGGS
// Secrets kids find by messing around. Tap a section heading twice
// for an emoji, three times to spin its cards, four times for that
// section's own trick. Nothing here touches points, requests, or
// any student data — it is all animation, and every count lives
// only in that one browser.
// ============================================================

(function () {
  "use strict";

  // Per section: how its cards flip on a triple-tap, and the one-off
  // trick it does on a quadruple-tap. Add a category here to give it
  // its own pair; anything not listed falls back to DEFAULT_EGG.
  // Per section: the emoji two taps pops, the spin three taps runs, and
  // the trick four taps sets off. Add a category here to give it its own
  // set; anything not listed falls back to DEFAULT_EGG.
  const EGGS = {
    "Dress Code Passes": { emote: "👕", triple: "egg-spin-y", quad: "egg-falloff" },
    Privileges: { emote: "🎟️", triple: "egg-spin-x", quad: "egg-trace" },
    "Food & Social": { emote: "🍕", triple: "egg-spin-flat", quad: "egg-wiggle" },
    Recognition: { emote: "🌟", triple: "egg-spin-cascade", quad: "egg-spotlight" },
    "Big Ticket Events": { emote: "🎉", triple: "egg-tumble", quad: "egg-streamers" },
    Collectibles: { emote: "💎", triple: "egg-spin-y", quad: "egg-trace" },
    "Donation Bin": { emote: "🫶", triple: "egg-spin-x", quad: "egg-drop" },
    Sammy: { emote: "🐟", triple: "egg-spin-flat", quad: "egg-school" },
  };

  const DEFAULT_EGG = { emote: "✨", triple: "egg-spin-y", quad: "egg-wiggle" };

  // The two quad effects that paint over the whole page rather than
  // animating the section's own cards.
  const OVERLAY_EFFECTS = {
    "egg-streamers": streamConfetti,
    "egg-school": releaseTheSchool,
  };

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
    const total = registered.size * 3;
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

  function overlay(lifetimeMs) {
    const layer = document.createElement("div");
    layer.className = "egg-overlay";
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), lifetimeMs);
    return layer;
  }

  // Confetti running the width of the screen. Flat colors, no gradients.
  function streamConfetti() {
    if (reducedMotion) return;
    const colors = ["#e63946", "#2d6cdf", "#f59f00", "#2f9e44", "#7048e8", "#0c8599"];
    const layer = overlay(3200);
    for (let i = 0; i < 45; i++) {
      const bit = document.createElement("div");
      bit.className = "egg-streamer";
      bit.style.top = `${Math.random() * 100}%`;
      bit.style.background = colors[Math.floor(Math.random() * colors.length)];
      bit.style.animationDelay = `${Math.random() * 1.1}s`;
      layer.appendChild(bit);
    }
  }

  // A few little stingrays swimming across the page.
  function releaseTheSchool() {
    if (reducedMotion) return;
    const layer = overlay(5000);
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
  }

  // Two taps: a couple of emoji drift up out of the heading.
  function popEmote(triggerEl, emoji) {
    if (reducedMotion) return;
    const box = triggerEl.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      const bit = document.createElement("span");
      bit.className = "egg-emote";
      bit.textContent = emoji;
      bit.style.left = `${box.left + box.width * (0.25 + Math.random() * 0.5)}px`;
      bit.style.top = `${box.top + window.scrollY}px`;
      bit.style.position = "absolute";
      bit.style.setProperty("--drift", `${(Math.random() - 0.5) * 70}px`);
      bit.style.animationDelay = `${i * 0.09}s`;
      document.body.appendChild(bit);
      setTimeout(() => bit.remove(), 1700);
    }
  }

  function trigger(key, kind, targetEl, triggerEl) {
    const egg = EGGS[key] || DEFAULT_EGG;
    if (kind === "emote") {
      popEmote(triggerEl, egg.emote || DEFAULT_EGG.emote);
    } else {
      const effect = egg[kind];
      const overlayFn = OVERLAY_EFFECTS[effect];
      if (overlayFn) overlayFn();
      else playEffect(targetEl, effect);
    }
    recordFind(key, kind);
  }

  // Counts taps in a burst, then decides once the burst ends: two fires
  // the emoji, three the spin, four or more the section's trick.
  // Deciding at the end is what keeps a longer burst from setting off
  // every smaller tier on its way past.
  function attach(triggerEl, key, targetEl) {
    let taps = 0;
    let timer = null;

    triggerEl.addEventListener("click", () => {
      taps += 1;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (taps === 2) trigger(key, "emote", targetEl, triggerEl);
        else if (taps === 3) trigger(key, "triple", targetEl, triggerEl);
        else if (taps >= 4) trigger(key, "quad", targetEl, triggerEl);
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
