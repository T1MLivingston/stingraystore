// ============================================================
// STINGRAY STORE — GROUPS & TIMER
// A teacher tool: paste or upload a class list, shuffle it into
// pairs or groups, and run a classroom timer next to a simplified
// CHAMPS board (task + voice level). Names live only in this tab's
// memory. Nothing is written to storage or sent anywhere.
// ============================================================

(function () {
  const $ = (id) => document.getElementById(id);

  const els = {
    logoImg: $("logoImg"),
    schoolNameLabel: $("schoolNameLabel"),
    rosterInput: $("rosterInput"),
    rosterFile: $("rosterFile"),
    clearRosterBtn: $("clearRosterBtn"),
    rosterCount: $("rosterCount"),
    rosterChips: $("rosterChips"),
    chipsTip: $("chipsTip"),
    sizeInput: $("sizeInput"),
    countInput: $("countInput"),
    makeGroupsBtn: $("makeGroupsBtn"),
    reshuffleBtn: $("reshuffleBtn"),
    copyGroupsBtn: $("copyGroupsBtn"),
    groupsGrid: $("groupsGrid"),
    groupsTip: $("groupsTip"),
    groupsStatus: $("groupsStatus"),
    voiceLevels: $("voiceLevels"),
    voiceName: $("voiceName"),
    timerCard: $("timerCard"),
    timerDisplay: $("timerDisplay"),
    timerPresets: $("timerPresets"),
    startBtn: $("startBtn"),
    resetBtn: $("resetBtn"),
    minusBtn: $("minusBtn"),
    plusBtn: $("plusBtn"),
    soundCheck: $("soundCheck"),
    presentBtn: $("presentBtn"),
  };

  // ---------- Config ----------
  if (typeof CONFIG !== "undefined") {
    els.schoolNameLabel.textContent = CONFIG.schoolName;
    if (CONFIG.logoPath) els.logoImg.src = CONFIG.logoPath;
    document.title = `Groups & Timer · ${CONFIG.schoolName}`;
  }

  // ---------- Roster ----------
  let roster = []; // unique names, in pasted order
  const absent = new Set();

  function parseNames(text) {
    // One name per line; a single pasted line is treated as a
    // comma-separated list ("Ava, Ben, Carlos").
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const names = lines.length === 1 ? lines[0].split(",") : lines;
    const seen = new Set();
    return names
      .map((n) => n.trim())
      .filter((n) => {
        const key = n.toLowerCase();
        if (!n || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function namesFromCsv(text) {
    const rows = CsvUtil.parse(text);
    const first = rows.map((r) => (r[0] || "").trim()).filter(Boolean);
    if (first.length && /^(student\s*)?(full\s*)?name$|^student$/i.test(first[0])) first.shift();
    return first.join("\n");
  }

  function updateRoster() {
    roster = parseNames(els.rosterInput.value);
    for (const name of [...absent]) if (!roster.includes(name)) absent.delete(name);
    renderChips();
  }

  function present() {
    return roster.filter((n) => !absent.has(n));
  }

  function renderChips() {
    els.rosterChips.innerHTML = "";
    roster.forEach((name) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "g-chip" + (absent.has(name) ? " is-absent" : "");
      chip.textContent = name;
      chip.setAttribute("aria-pressed", absent.has(name) ? "true" : "false");
      chip.title = absent.has(name) ? "Absent (tap to mark present)" : "Present (tap to mark absent)";
      chip.addEventListener("click", () => {
        absent.has(name) ? absent.delete(name) : absent.add(name);
        renderChips();
      });
      els.rosterChips.appendChild(chip);
    });
    const here = present().length;
    els.rosterCount.textContent =
      `${here} student${here === 1 ? "" : "s"}` + (absent.size ? ` (${absent.size} absent)` : "");
    els.chipsTip.hidden = roster.length === 0;
  }

  els.rosterInput.addEventListener("input", updateRoster);

  els.rosterFile.addEventListener("change", () => {
    const file = els.rosterFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      els.rosterInput.value = /\.csv$/i.test(file.name) || text.includes(",") ? namesFromCsv(text) : text;
      updateRoster();
      els.rosterFile.value = "";
    };
    reader.readAsText(file);
  });

  els.clearRosterBtn.addEventListener("click", () => {
    els.rosterInput.value = "";
    absent.clear();
    groups = [];
    updateRoster();
    renderGroups();
  });

  // ---------- Grouping ----------
  let groups = [];
  let selected = null; // { g, i } of the first name tapped for a swap

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function clampInt(input, min, max) {
    const v = Math.min(max, Math.max(min, parseInt(input.value, 10) || min));
    input.value = v;
    return v;
  }

  function makeGroups() {
    const names = shuffle(present());
    if (names.length === 0) return [];
    const mode = document.querySelector('input[name="mode"]:checked').value;

    let count;
    if (mode === "count") {
      count = Math.min(clampInt(els.countInput, 2, 30), names.length);
    } else {
      const size = mode === "pairs" ? 2 : clampInt(els.sizeInput, 2, 20);
      // A single leftover joins an existing group (5 in pairs -> a pair
      // and a trio); two or more get spread out as one more group
      // (10 in fours -> 4, 3, 3) rather than swelling the others.
      const rem = names.length % size;
      count = Math.max(1, Math.floor(names.length / size) + (rem >= 2 ? 1 : 0));
    }

    const out = Array.from({ length: count }, () => []);
    names.forEach((name, i) => out[i % count].push(name));
    return out;
  }

  function renderGroups() {
    els.groupsGrid.innerHTML = "";
    selected = null;
    const has = groups.length > 0;
    els.groupsTip.hidden = has;
    els.reshuffleBtn.disabled = !has;
    els.copyGroupsBtn.disabled = !has;
    if (has) els.groupsTip.textContent = "";

    groups.forEach((members, g) => {
      const card = document.createElement("div");
      card.className = "g-group";
      card.style.setProperty("--g-color", `var(--g-c${g % 8})`);
      const h = document.createElement("h3");
      h.textContent = `Group ${g + 1}`;
      card.appendChild(h);
      const ul = document.createElement("ul");
      members.forEach((name, i) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = name;
        btn.title = "Tap two names to swap them";
        btn.addEventListener("click", () => pickForSwap(g, i, btn));
        li.appendChild(btn);
        ul.appendChild(li);
      });
      card.appendChild(ul);
      els.groupsGrid.appendChild(card);
    });
  }

  function pickForSwap(g, i, btn) {
    if (!selected) {
      selected = { g, i };
      btn.classList.add("is-selected");
      return;
    }
    const a = selected;
    if (a.g !== g || a.i !== i) {
      [groups[a.g][a.i], groups[g][i]] = [groups[g][i], groups[a.g][a.i]];
    }
    renderGroups();
  }

  function shuffleIntoGroups() {
    updateRoster();
    groups = makeGroups();
    renderGroups();
    if (!groups.length) {
      els.groupsTip.hidden = false;
      els.groupsTip.textContent = "Add at least one student first.";
    } else {
      document.getElementById("board").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  els.makeGroupsBtn.addEventListener("click", shuffleIntoGroups);
  els.reshuffleBtn.addEventListener("click", () => {
    groups = makeGroups();
    renderGroups();
  });

  els.copyGroupsBtn.addEventListener("click", async () => {
    const text = groups.map((m, g) => `Group ${g + 1}: ${m.join(", ")}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      flash("Groups copied.", "ok");
    } catch (e) {
      flash("Couldn't copy. Select the groups and copy them by hand.", "err");
    }
  });

  function flash(msg, kind) {
    els.groupsStatus.textContent = msg;
    els.groupsStatus.className = `copy-status ${kind}`;
    setTimeout(() => (els.groupsStatus.textContent = ""), 2500);
  }

  // ---------- CHAMPS-lite: voice level ----------
  const VOICE = [
    "Silent",
    "Whisper",
    "Partner talk",
    "Table talk",
    "Presenter",
  ];
  let voice = 2;

  function renderVoice() {
    els.voiceLevels.innerHTML = "";
    VOICE.forEach((label, lvl) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "g-level" + (lvl === voice ? " is-on" : "");
      b.dataset.level = lvl;
      b.textContent = lvl;
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", lvl === voice ? "true" : "false");
      b.setAttribute("aria-label", `${lvl}: ${label}`);
      b.addEventListener("click", () => {
        voice = lvl;
        renderVoice();
      });
      els.voiceLevels.appendChild(b);
    });
    els.voiceName.textContent = VOICE[voice];
  }
  renderVoice();

  // ---------- Timer ----------
  const PRESETS = [1, 2, 3, 5, 10, 15];
  let total = 5 * 60; // seconds the timer was set to
  let remaining = total;
  let endAt = 0; // timestamp the running timer hits zero
  let tick = null;

  function fmt(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function paintTimer() {
    els.timerDisplay.textContent = fmt(remaining);
    els.timerCard.classList.toggle("is-low", tick !== null && remaining > 0 && remaining <= 30);
    els.timerCard.classList.toggle("is-done", remaining === 0 && total > 0);
    els.startBtn.textContent = tick ? "Pause" : remaining < total && remaining > 0 ? "Resume" : "Start";
    els.startBtn.disabled = remaining === 0 && !tick && total === 0;
  }

  function setTimer(seconds) {
    stop();
    total = Math.max(0, Math.min(seconds, 99 * 60 + 59));
    remaining = total;
    paintTimer();
  }

  function start() {
    if (remaining === 0) remaining = total;
    if (remaining === 0) return;
    endAt = Date.now() + remaining * 1000;
    tick = setInterval(step, 250);
    paintTimer();
  }

  function stop() {
    clearInterval(tick);
    tick = null;
  }

  function step() {
    // Recomputed from the clock, so a backgrounded tab doesn't drift.
    remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    if (remaining === 0) {
      stop();
      if (els.soundCheck.checked) chime();
    }
    paintTimer();
  }

  function adjust(deltaSec) {
    if (tick) {
      endAt = Math.max(Date.now(), endAt + deltaSec * 1000);
      total = Math.max(0, total + deltaSec);
      step();
    } else {
      remaining = Math.max(0, remaining + deltaSec);
      total = Math.max(remaining, total + deltaSec);
      paintTimer();
    }
  }

  function chime() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      [0, 0.35, 0.7].forEach((t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.32);
      });
      setTimeout(() => ctx.close(), 1500);
    } catch (e) {
      /* no audio available; the red flash still shows */
    }
  }

  PRESETS.forEach((min) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "g-btn g-btn--ghost";
    b.textContent = `${min} min`;
    b.addEventListener("click", () => setTimer(min * 60));
    els.timerPresets.appendChild(b);
  });

  els.startBtn.addEventListener("click", () => (tick ? (stop(), paintTimer()) : start()));
  els.resetBtn.addEventListener("click", () => setTimer(total));
  els.plusBtn.addEventListener("click", () => adjust(60));
  els.minusBtn.addEventListener("click", () => adjust(-60));

  // Spacebar starts/pauses, unless someone is typing.
  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "button") return;
    e.preventDefault();
    els.startBtn.click();
  });

  paintTimer();

  // ---------- Present mode ----------
  // Hides the setup card and blows the board up for the projector.
  els.presentBtn.addEventListener("click", () => {
    const on = document.body.classList.toggle("is-presenting");
    els.presentBtn.textContent = on ? "Exit present" : "Present";
    // Fullscreen is a bonus; if the browser refuses, the layout change
    // still applies.
    const req = on && !document.fullscreenElement && document.documentElement.requestFullscreen;
    const exit = !on && document.fullscreenElement && document.exitFullscreen;
    if (req) document.documentElement.requestFullscreen().catch(() => {});
    if (exit) document.exitFullscreen().catch(() => {});
  });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && document.body.classList.contains("is-presenting")) {
      document.body.classList.remove("is-presenting");
      els.presentBtn.textContent = "Present";
    }
  });
})();
