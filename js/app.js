(function () {
  "use strict";

  const state = {
    cart: [], // array of item ids
    verified: false, // true once a code has resolved against data/points.json
    lookupOnScreen: true, // is the lookup card currently in view
  };

  const els = {
    logoImg: document.getElementById("logoImg"),
    schoolNameLabel: document.getElementById("schoolNameLabel"),
    storeNameLabel: document.getElementById("storeNameLabel"),
    mottoText: document.getElementById("mottoText"),
    heroTitle: document.getElementById("heroTitle"),
    themeToggle: document.getElementById("themeToggle"),
    footMotto: document.getElementById("footMotto"),
    footSchoolName: document.getElementById("footSchoolName"),
    footWebsite: document.getElementById("footWebsite"),
    footCodeOfConduct: document.getElementById("footCodeOfConduct"),
    footUniformPolicy: document.getElementById("footUniformPolicy"),
    commendationInput: document.getElementById("commendationInput"),
    conductInput: document.getElementById("conductInput"),
    lookupCode: document.getElementById("lookupCode"),
    lookupBtn: document.getElementById("lookupBtn"),
    lookupBtnLabel: document.getElementById("lookupBtnLabel"),
    lookupCartCount: document.getElementById("lookupCartCount"),
    lookupSection: document.querySelector(".lookup-section"),
    lookupResult: document.getElementById("lookupResult"),
    miniBalance: document.getElementById("miniBalance"),
    miniBalanceValue: document.getElementById("miniBalanceValue"),
    catalog: document.getElementById("catalog"),
    openCartBtn: document.getElementById("openCartBtn"),
    closeCartBtn: document.getElementById("closeCartBtn"),
    cartDrawer: document.getElementById("cartDrawer"),
    overlay: document.getElementById("overlay"),
    cartCount: document.getElementById("cartCount"),
    cartBody: document.getElementById("cartBody"),
    summaryItems: document.getElementById("summaryItems"),
    summaryTotal: document.getElementById("summaryTotal"),
    balanceMsg: document.getElementById("balanceMsg"),
    checkoutBtn: document.getElementById("checkoutBtn"),
    modalWrap: document.getElementById("modalWrap"),
    modalSummary: document.getElementById("modalSummary"),
    studentCode: document.getElementById("studentCode"),
    studentNote: document.getElementById("studentNote"),
    studentNoteLabel: document.getElementById("studentNoteLabel"),
    notePrompts: document.getElementById("notePrompts"),
    sendRequestBtn: document.getElementById("sendRequestBtn"),
    copyStatus: document.getElementById("copyStatus"),
    hiddenFormFrame: document.getElementById("hiddenFormFrame"),
    requestSubmitForm: document.getElementById("requestSubmitForm"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    falseClaimField: document.getElementById("falseClaimField"),
    falseClaimCheck: document.getElementById("falseClaimCheck"),
    falseClaimPenaltyText: document.getElementById("falseClaimPenaltyText"),
    pointsModalWrap: document.getElementById("pointsModalWrap"),
    pointsModalBody: document.getElementById("pointsModalBody"),
    pointsModalCloseBtn: document.getElementById("pointsModalCloseBtn"),
    confettiLayer: document.getElementById("confettiLayer"),
    detailModalWrap: document.getElementById("detailModalWrap"),
    detailModalTitle: document.getElementById("detailModalTitle"),
    detailModalText: document.getElementById("detailModalText"),
    detailModalCloseBtn: document.getElementById("detailModalCloseBtn"),
    wallOfFameSection: document.getElementById("wallOfFameSection"),
    wallOfFameGrid: document.getElementById("wallOfFameGrid"),
    wallOfFameSubmit: document.getElementById("wallOfFameSubmit"),
    wallOfFamePolicy: document.getElementById("wallOfFamePolicy"),
    quoteCode: document.getElementById("quoteCode"),
    quoteText: document.getElementById("quoteText"),
    quoteSubmitBtn: document.getElementById("quoteSubmitBtn"),
    quoteStatus: document.getElementById("quoteStatus"),
  };

  function applyConfig() {
    document.title = `${CONFIG.storeName} · ${CONFIG.schoolName}`;
    els.schoolNameLabel.textContent = CONFIG.schoolName;
    els.storeNameLabel.textContent = CONFIG.storeName;
    els.mottoText.textContent = CONFIG.motto;
    renderHeroTitle();
    els.footMotto.textContent = `"${CONFIG.motto}"`;
    els.footSchoolName.textContent = CONFIG.schoolName;
    els.footWebsite.href = CONFIG.websiteUrl;
    els.footCodeOfConduct.href = CONFIG.codeOfConductUrl;
    els.footUniformPolicy.href = CONFIG.uniformPolicyUrl;
    els.falseClaimPenaltyText.textContent = CONFIG.falseClaimPenalty;
    els.requestSubmitForm.action = CONFIG.requestsFormUrl.replace(/\/viewform.*$/, "/formResponse");
    if (CONFIG.logoPath) {
      els.logoImg.src = CONFIG.logoPath;
    }
  }

  // "Stingray Commendation Store" renders with the first word accented
  // and the rest in the heading color, so the store name stays a single
  // config value instead of being split across the markup.
  function renderHeroTitle() {
    const words = CONFIG.storeName.trim().split(/\s+/);
    const first = words.shift() || "";
    const rest = words.join(" ");
    const sammy = els.heroTitle.querySelector(".hero__sammy");
    els.heroTitle.textContent = "";
    const accent = document.createElement("span");
    accent.textContent = first;
    els.heroTitle.appendChild(accent);
    if (rest) els.heroTitle.appendChild(document.createTextNode(` ${rest}`));
    if (sammy) els.heroTitle.appendChild(sammy);
  }

  // ---- Theme ----
  // The stored choice is applied by an inline script in index.html before
  // first paint; this only keeps the button in sync and handles clicks.
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem("stingray.theme", theme);
    } catch (err) {
      /* the choice just won't survive a reload */
    }
    els.themeToggle.setAttribute("aria-checked", theme === "dark" ? "true" : "false");
  }

  function toggleTheme() {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  }

  function getConduct() {
    const v = parseInt(els.conductInput.value, 10);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  }

  function getCommendations() {
    const v = parseInt(els.commendationInput.value, 10);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  }

  function itemById(id) {
    return ITEMS.find((i) => i.id === id);
  }

  function setVerifiedInputs(commendations, conduct) {
    els.commendationInput.value = commendations;
    els.conductInput.value = conduct;
    els.commendationInput.readOnly = true;
    els.conductInput.readOnly = true;
    state.verified = true;
  }

  function clearVerification() {
    els.commendationInput.readOnly = false;
    els.conductInput.readOnly = false;
    state.verified = false;
  }

  async function performLookup() {
    const code = els.lookupCode.value.trim();
    if (!code) {
      els.lookupResult.innerHTML = `<div class="lookup-msg warn">Type your code first.</div>`;
      return;
    }
    els.lookupResult.innerHTML = `<div class="lookup-msg">Checking.</div>`;
    const record = await PointsLookup.find(code);

    if (record) {
      clearVerification();
      setVerifiedInputs(record.commendations, record.conduct);
      els.lookupResult.innerHTML = `
        <div class="lookup-msg ok">
          Verified. You have <strong>${record.commendations} commendation pts</strong> and
          <strong>${record.conduct} conduct pts</strong> this month.
          <button class="link-btn" id="clearLookupBtn">Not you? Clear</button>
        </div>
      `;
      document.getElementById("clearLookupBtn").addEventListener("click", resetLookup);
      openPointsModal(record);
    } else {
      clearVerification();
      els.lookupResult.innerHTML = `<div class="lookup-msg warn">This code is not in this month's upload. This code is not recognized.</div>`;
    }
    renderAll();
  }

  function launchConfetti() {
    const colors = ["#e63946", "#2d6cdf", "#f59f00", "#2f9e44", "#7048e8", "#0c8599"];
    els.confettiLayer.innerHTML = "";
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.3}s`;
      els.confettiLayer.appendChild(piece);
    }
    setTimeout(() => {
      els.confettiLayer.innerHTML = "";
    }, 2200);
  }

  function openPointsModal(record) {
    const dressDown =
      record.conduct <= CONFIG.dressDownMaxConduct
        ? `<div class="dress-down-banner">${CONFIG.dressDownNote}</div>`
        : "";
    els.pointsModalBody.innerHTML = `
      <h2>You're verified!</h2>
      <div class="points-modal__stats">
        <div class="points-modal__stat"><span class="num">${record.commendations}</span><span class="label">Commendations</span></div>
        <div class="points-modal__stat"><span class="num">${record.conduct}</span><span class="label">Conduct</span></div>
      </div>
      ${dressDown}
    `;
    els.pointsModalWrap.classList.add("open");
    launchConfetti();
  }

  function closePointsModal() {
    els.pointsModalWrap.classList.remove("open");
  }

  function openDetailModal(item) {
    els.detailModalTitle.textContent = item.name;
    els.detailModalText.textContent = item.approval
      ? `${item.detail}\n\nPending approval: ${item.approval}.`
      : item.detail;
    els.detailModalWrap.classList.add("open");
  }

  function closeDetailModal() {
    els.detailModalWrap.classList.remove("open");
  }

  function resetLookup() {
    els.lookupCode.value = "";
    els.lookupResult.innerHTML = "";
    els.commendationInput.value = "";
    els.conductInput.value = "";
    clearVerification();
    renderAll();
  }

  // Once a code checks out, the lookup card's own button becomes the way
  // to open the cart, so the call to action sits where the student is
  // already looking instead of up in the corner.
  function lookupButtonIsRequest() {
    return state.verified;
  }

  function updateLookupButton() {
    const asRequest = lookupButtonIsRequest();
    els.lookupBtnLabel.textContent = asRequest ? "Make a Request" : "Check";
    els.lookupBtn.classList.toggle("as-request", asRequest);
    els.lookupCartCount.hidden = !asRequest;
    els.lookupCartCount.textContent = state.cart.length;
    updateTopCartButton();
  }

  // The top-bar button is the fallback: it hides only while the lookup
  // card's own request button is on screen, so there is never a moment
  // with no way to reach the cart.
  function updateTopCartButton() {
    const duplicated = lookupButtonIsRequest() && state.lookupOnScreen;
    els.openCartBtn.classList.toggle("is-hidden", duplicated);
  }

  function watchLookupVisibility() {
    if (!els.lookupSection || !("IntersectionObserver" in window)) {
      state.lookupOnScreen = false;
      updateTopCartButton();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        state.lookupOnScreen = entries[0].isIntersecting;
        updateTopCartButton();
      },
      { threshold: 0.35 }
    );
    observer.observe(els.lookupSection);
  }

  function updateMiniBalance() {
    const hasValue = els.commendationInput.value !== "";
    els.miniBalance.hidden = !hasValue;
    if (hasValue) {
      els.miniBalanceValue.textContent = getCommendations();
      els.miniBalance.classList.toggle("verified", state.verified);
    }
  }

  function isLocked(item) {
    return typeof item.maxConduct === "number" && getConduct() > item.maxConduct;
  }

  // Items that can't be acted on unless the student writes something
  // specific in the note (which teacher agreed, what the act is, and so on).
  function cartItemsNeedingNote() {
    return state.cart.map(itemById).filter((item) => item && item.notePrompt);
  }

  function cartTotal() {
    return state.cart.reduce((sum, id) => sum + (itemById(id)?.cost || 0), 0);
  }

  function renderCategorySection(cat) {
    const section = document.createElement("section");
    const title = document.createElement("h2");
    title.className = "category-title";
    title.textContent = cat;
    title.style.borderLeftColor = CATEGORY_COLORS[cat] || "var(--red)";
    section.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "grid";

    visibleItems().filter((i) => i.category === cat).forEach((item) => {
      grid.appendChild(renderCard(item));
    });

    section.appendChild(grid);
    if (window.Eggs) window.Eggs.bind(title, cat, grid);
    return section;
  }

  // A category named by CONFIG.challengeUnlocksCategory stays out of the
  // catalog until a student solves one of the grade-level problems.
  function categoryIsLocked(cat) {
    if (!CONFIG.challengeUnlocksCategory) return false;
    if (cat !== CONFIG.challengeUnlocksCategory) return false;
    return !(window.Challenges && window.Challenges.isUnlocked());
  }

  function visibleItems() {
    return ITEMS.filter((item) => !categoryIsLocked(item.category));
  }

  function renderCatalog() {
    const categories = [...new Set(visibleItems().map((i) => i.category))];
    els.catalog.innerHTML = "";

    // Categories with only one or two items are paired side by side to
    // save vertical space; larger categories always get their own row.
    let i = 0;
    while (i < categories.length) {
      const cat = categories[i];
      const isSmall = (c) => visibleItems().filter((item) => item.category === c).length <= 2;

      if (isSmall(cat) && i + 1 < categories.length && isSmall(categories[i + 1])) {
        const row = document.createElement("div");
        row.className = "category-row";
        row.appendChild(renderCategorySection(cat));
        row.appendChild(renderCategorySection(categories[i + 1]));
        els.catalog.appendChild(row);
        i += 2;
      } else {
        els.catalog.appendChild(renderCategorySection(cat));
        i += 1;
      }
    }
  }

  function renderCard(item) {
    const card = document.createElement("div");
    const locked = isLocked(item);
    const inCart = state.cart.includes(item.id);
    card.className = "card" + (locked ? " locked" : "") + (inCart ? " in-cart" : "");

    card.innerHTML = `
      <h3>${item.name}</h3>
      <p class="desc">${item.desc}</p>
      ${item.approval ? `<div class="approval-badge" title="${escapeAttr(item.approval)}">Pending approval</div>` : ""}
      ${item.detail ? `<button class="detail-link">Learn more</button>` : ""}
      <div class="cost">${item.cost} pts</div>
      ${locked ? `<div class="restriction">Unavailable. Requires ${item.maxConduct} or fewer conduct points.</div>` : ""}
      <button class="add${inCart ? " added" : ""}" ${locked ? "disabled" : ""}>${inCart ? "Added" : locked ? "Locked" : "Add to Requests"}</button>
    `;

    const btn = card.querySelector("button.add");
    if (!locked) {
      btn.addEventListener("click", () => (inCart ? removeFromCart(item.id) : addToCart(item.id)));
    }

    const detailBtn = card.querySelector(".detail-link");
    if (detailBtn) {
      detailBtn.addEventListener("click", () => openDetailModal(item));
    }

    return card;
  }

  function addToCart(id) {
    if (!state.cart.includes(id)) {
      state.cart.push(id);
      renderAll();
      bumpCartButton();
    }
  }

  function bumpCartButton() {
    els.openCartBtn.classList.remove("bump");
    // force reflow so the animation can restart on rapid adds
    void els.openCartBtn.offsetWidth;
    els.openCartBtn.classList.add("bump");
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter((x) => x !== id);
    renderAll();
  }

  function renderCart() {
    els.cartCount.textContent = state.cart.length;

    if (state.cart.length === 0) {
      els.cartBody.innerHTML = '<p class="cart-empty">Your cart is empty. Add a reward to get started!</p>';
    } else {
      els.cartBody.innerHTML = "";
      state.cart.forEach((id) => {
        const item = itemById(id);
        if (!item) return;
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <div class="info">
            <div class="name">${item.name}</div>
            <div class="cost">${item.cost} pts</div>
          </div>
          <button class="remove">Remove</button>
        `;
        row.querySelector("button.remove").addEventListener("click", () => removeFromCart(id));
        els.cartBody.appendChild(row);
      });
    }

    const total = cartTotal();
    const balance = getCommendations();
    els.summaryItems.textContent = state.cart.length;
    els.summaryTotal.textContent = `${total} pts`;

    if (state.cart.length === 0) {
      els.balanceMsg.innerHTML = "";
      els.checkoutBtn.disabled = true;
    } else if (total > balance) {
      els.balanceMsg.innerHTML = `<div class="balance-warning">Your balance is ${balance} pts. That is ${total - balance} short of this request. You can still send it, but staff will need to confirm your real balance.</div>`;
      els.checkoutBtn.disabled = false;
    } else {
      els.balanceMsg.innerHTML = `<div class="balance-ok">You have enough points for this request.</div>`;
      els.checkoutBtn.disabled = false;
    }
  }

  function renderAll() {
    renderCatalog();
    renderCart();
    updateMiniBalance();
    updateLookupButton();
  }

  function openCart() {
    els.cartDrawer.classList.add("open");
    els.overlay.classList.add("open");
  }
  function closeCart() {
    els.cartDrawer.classList.remove("open");
    els.overlay.classList.remove("open");
  }

  // Every piece of a request, as its own string. Each key here lines up
  // with a key in CONFIG.requestsFormFields, so a request can be posted
  // as separate Form questions (one column per piece in the response
  // sheet) instead of one wall of text.
  function buildRequestValues() {
    const total = cartTotal();
    const balance = getCommendations();
    const conduct = getConduct();
    const code = els.studentCode.value.trim() || "(no code entered)";
    const note = els.studentNote.value.trim();
    const items = state.cart.map((id) => {
      const item = itemById(id);
      const flag = item.approval ? ` [PENDING APPROVAL: ${item.approval}]` : "";
      return `${item.name} (${item.cost} pts)${flag}`;
    });

    return {
      code: code,
      pointsUsed: String(total),
      items: items.join("\n"),
      balance: String(balance),
      conduct: String(conduct),
      verified: state.verified ? "Verified" : "Not checked",
      note: note,
      details: "", // filled in below, once the rest is known
    };
  }

  function buildRequestText(v) {
    const verificationLine = state.verified
      ? `Verification: VERIFIED via store lookup against this month's points upload`
      : `Verification: NOT CHECKED, please confirm this code and balance before fulfilling`;

    return [
      `STINGRAY STORE REDEMPTION REQUEST`,
      `School: ${CONFIG.schoolName}`,
      `Submitted: ${new Date().toLocaleString()}`,
      ``,
      `Redemption Code: ${v.code}`,
      verificationLine,
      `Commendation points on request: ${v.balance}`,
      `Conduct points on request: ${v.conduct}`,
      ``,
      `Requested rewards (total ${v.pointsUsed} pts):`,
      ...v.items.split("\n").filter(Boolean).map((line) => `  - ${line}`),
      ``,
      v.note ? `Note from student: ${v.note}` : ``,
      ``,
      `-- Staff: please confirm this code and balance in the roster before fulfilling. --`,
    ].join("\n");
  }

  // Which Form question each piece of the request goes to. Falls back to
  // the old single-question setup (whole request as one blob of text)
  // when requestsFormFields has nothing filled in yet, so an existing
  // Form keeps working until the new one is wired up.
  function requestFieldMap() {
    const named = CONFIG.requestsFormFields || {};
    const configured = {};
    Object.keys(named).forEach((key) => {
      const entryId = String(named[key] || "").trim();
      if (entryId) configured[key] = entryId;
    });
    if (Object.keys(configured).length > 0) return configured;

    const legacy = String(CONFIG.requestsFormFieldId || "").trim();
    return legacy ? { details: legacy } : {};
  }

  function openModal() {
    const total = cartTotal();
    if (els.lookupCode.value.trim() && !els.studentCode.value.trim()) {
      els.studentCode.value = els.lookupCode.value.trim();
    }
    els.modalSummary.innerHTML = `
      <div class="line"><span>Items requested</span><span>${state.cart.length}</span></div>
      <div class="line"><span>Total cost</span><span>${total} pts</span></div>
      <div class="line"><span>Your balance</span><span>${getCommendations()} pts ${state.verified ? "(verified)" : "(not checked)"}</span></div>
    `;
    const needNote = cartItemsNeedingNote();
    els.notePrompts.hidden = needNote.length === 0;
    els.notePrompts.innerHTML = needNote
      .map((item) => `<li><strong>${escapeHtml(item.name)}:</strong> ${escapeHtml(item.notePrompt)}</li>`)
      .join("");
    els.studentNoteLabel.textContent = needNote.length
      ? "Note to staff (required for what you picked)"
      : "Note to staff (optional)";

    els.falseClaimField.hidden = total <= getCommendations();
    els.falseClaimCheck.checked = false;
    els.copyStatus.textContent = "";
    els.modalWrap.classList.add("open");
  }

  function requiresFalseClaimAck() {
    return cartTotal() > getCommendations() && !els.falseClaimCheck.checked;
  }
  function closeModal() {
    els.modalWrap.classList.remove("open");
  }

  // Set while a hidden-iframe form submission is in flight, so the
  // iframe's "load" event (which also fires once harmlessly on page
  // load) only triggers the success message during an actual submit.
  let awaitingSubmitConfirmation = false;

  function confirmSubmitted() {
    if (!awaitingSubmitConfirmation) return;
    awaitingSubmitConfirmation = false;
    setStatusTone(els.copyStatus, "ok");
    els.copyStatus.textContent = "Request submitted! Staff will review it soon.";
    els.sendRequestBtn.disabled = false;
    state.cart = [];
    renderAll();
    setTimeout(closeModal, 1800);
  }

  function sendRequest() {
    if (!els.studentCode.value.trim()) {
      els.studentCode.focus();
      els.copyStatus.textContent = "Please enter your redemption code first.";
      setStatusTone(els.copyStatus, "err");
      return;
    }
    if (cartItemsNeedingNote().length > 0 && !els.studentNote.value.trim()) {
      els.studentNote.focus();
      els.copyStatus.textContent =
        "One of your rewards needs details in the note. See the list above it.";
      setStatusTone(els.copyStatus, "err");
      return;
    }
    if (requiresFalseClaimAck()) {
      els.copyStatus.textContent = "Please confirm your points balance is accurate first.";
      setStatusTone(els.copyStatus, "err");
      return;
    }

    const fields = requestFieldMap();
    if (Object.keys(fields).length === 0) {
      els.copyStatus.textContent =
        "This store isn't set up to receive requests yet. Please tell a staff member.";
      setStatusTone(els.copyStatus, "err");
      return;
    }

    const values = buildRequestValues();
    values.details = buildRequestText(values);

    // One hidden input per configured question, rebuilt each submit so a
    // second request never carries over the first one's values.
    els.requestSubmitForm.innerHTML = "";
    Object.keys(fields).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = fields[key];
      input.value = values[key] || "";
      els.requestSubmitForm.appendChild(input);
    });

    els.sendRequestBtn.disabled = true;
    setStatusTone(els.copyStatus, "ok");
    els.copyStatus.textContent = "Submitting...";
    awaitingSubmitConfirmation = true;
    els.requestSubmitForm.submit();
    // Cross-origin iframe content can't be read to confirm success, so
    // fall back to an optimistic confirmation if "load" never fires.
    setTimeout(confirmSubmitted, 4000);
  }

  // Status lines read as green or red, but the exact shade has to come
  // from the active theme, so it is a class rather than an inline color.
  function setStatusTone(el, tone) {
    el.classList.remove("ok", "err");
    el.classList.add(tone);
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, "&quot;");
  }

  function renderWallOfFame(rows) {
    const approved = rows.filter((r) => (r.status || "").trim().toLowerCase() === "approved");
    if (approved.length === 0) {
      els.wallOfFameGrid.innerHTML = `<p class="wall-of-fame__intro">No quotes yet. Be the first to share one.</p>`;
      return;
    }
    els.wallOfFameGrid.innerHTML = approved
      .map((r) => `<div class="quote-card">"${escapeHtml(r.quote)}"</div>`)
      .join("");
  }

  function loadWallOfFame() {
    if (!CONFIG.wallOfFameSheetCsvUrl) return;
    fetch(CONFIG.wallOfFameSheetCsvUrl)
      .then((res) => {
        if (!res.ok) throw new Error("not reachable");
        return res.text();
      })
      .then((text) => {
        renderWallOfFame(CsvUtil.toObjects(text));
        els.wallOfFameSection.hidden = false;
      })
      .catch(() => {
        // Sheet not reachable or not shared yet: quietly leave the
        // section hidden rather than showing a broken wall.
      });
  }

  function submitQuote() {
    const code = els.quoteCode.value.trim();
    const quote = els.quoteText.value.trim();
    if (!code || !quote) {
      setStatusTone(els.quoteStatus, "err");
      els.quoteStatus.textContent = "Enter your code and a quote first.";
      return;
    }
    const text = [
      `STINGRAY STORE WALL OF FAME SUBMISSION`,
      `Code: ${code}`,
      `Quote: ${quote}`,
      `Submitted: ${new Date().toLocaleString()}`,
      ``,
      `-- Staff: review before approving. Offensive content will not be approved. --`,
    ].join("\n");

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setStatusTone(els.quoteStatus, "ok");
        els.quoteStatus.textContent = "Copied. Paste it into the form that just opened, then submit there.";
      })
      .catch(() => {
        setStatusTone(els.quoteStatus, "err");
        els.quoteStatus.textContent = "Could not copy automatically. Copy your quote and code, then paste them into the form that just opened.";
      });
    window.open(CONFIG.wallOfFameFormUrl, "_blank", "noopener");
  }

  // Wiring
  els.commendationInput.addEventListener("input", renderAll);
  els.conductInput.addEventListener("input", renderAll);
  els.lookupBtn.addEventListener("click", () => {
    if (lookupButtonIsRequest()) openCart();
    else performLookup();
  });
  els.lookupCode.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performLookup();
    }
  });
  els.openCartBtn.addEventListener("click", openCart);
  els.closeCartBtn.addEventListener("click", closeCart);
  els.overlay.addEventListener("click", closeCart);
  els.checkoutBtn.addEventListener("click", () => {
    closeCart();
    openModal();
  });
  els.closeModalBtn.addEventListener("click", closeModal);
  els.sendRequestBtn.addEventListener("click", sendRequest);
  els.hiddenFormFrame.addEventListener("load", confirmSubmitted);
  els.pointsModalCloseBtn.addEventListener("click", closePointsModal);
  els.detailModalCloseBtn.addEventListener("click", closeDetailModal);
  els.quoteSubmitBtn.addEventListener("click", submitQuote);
  els.themeToggle.addEventListener("click", toggleTheme);

  applyConfig();
  applyTheme(currentTheme());
  if (window.Challenges) window.Challenges.init(renderAll);
  renderAll();
  if (window.Eggs) window.Eggs.init();
  watchLookupVisibility();
  els.wallOfFamePolicy.textContent = CONFIG.wallOfFamePolicyNote;
  els.wallOfFameSubmit.hidden = !CONFIG.wallOfFameFormUrl;
  loadWallOfFame();
})();
