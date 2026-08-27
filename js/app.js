(function () {
  "use strict";

  const state = {
    cart: [], // array of item ids
    verified: false, // true once a code has resolved against data/points.json
  };

  const els = {
    logoImg: document.getElementById("logoImg"),
    schoolNameLabel: document.getElementById("schoolNameLabel"),
    storeNameLabel: document.getElementById("storeNameLabel"),
    mottoText: document.getElementById("mottoText"),
    footMotto: document.getElementById("footMotto"),
    footSchoolName: document.getElementById("footSchoolName"),
    footWebsite: document.getElementById("footWebsite"),
    footCodeOfConduct: document.getElementById("footCodeOfConduct"),
    footUniformPolicy: document.getElementById("footUniformPolicy"),
    commendationInput: document.getElementById("commendationInput"),
    conductInput: document.getElementById("conductInput"),
    lookupCode: document.getElementById("lookupCode"),
    lookupBtn: document.getElementById("lookupBtn"),
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
    sendRequestBtn: document.getElementById("sendRequestBtn"),
    copyRequestBtn: document.getElementById("copyRequestBtn"),
    copyStatus: document.getElementById("copyStatus"),
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
    els.footMotto.textContent = `"${CONFIG.motto}"`;
    els.footSchoolName.textContent = CONFIG.schoolName;
    els.footWebsite.href = CONFIG.websiteUrl;
    els.footCodeOfConduct.href = CONFIG.codeOfConductUrl;
    els.footUniformPolicy.href = CONFIG.uniformPolicyUrl;
    els.falseClaimPenaltyText.textContent = CONFIG.falseClaimPenalty;
    els.sendRequestBtn.textContent = CONFIG.requestsFormUrl ? "Submit Request" : "Send Request by Email";
    if (CONFIG.logoPath) {
      els.logoImg.src = CONFIG.logoPath;
    }
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
    els.detailModalText.textContent = item.detail;
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

    ITEMS.filter((i) => i.category === cat).forEach((item) => {
      grid.appendChild(renderCard(item));
    });

    section.appendChild(grid);
    return section;
  }

  function renderCatalog() {
    const categories = [...new Set(ITEMS.map((i) => i.category))];
    els.catalog.innerHTML = "";

    // Categories with only one or two items are paired side by side to
    // save vertical space; larger categories always get their own row.
    let i = 0;
    while (i < categories.length) {
      const cat = categories[i];
      const isSmall = (c) => ITEMS.filter((item) => item.category === c).length <= 2;

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
  }

  function openCart() {
    els.cartDrawer.classList.add("open");
    els.overlay.classList.add("open");
  }
  function closeCart() {
    els.cartDrawer.classList.remove("open");
    els.overlay.classList.remove("open");
  }

  function buildRequestText() {
    const total = cartTotal();
    const balance = getCommendations();
    const conduct = getConduct();
    const code = els.studentCode.value.trim() || "(no code entered)";
    const note = els.studentNote.value.trim();
    const lines = state.cart.map((id) => {
      const item = itemById(id);
      return `  - ${item.name}, ${item.cost} pts`;
    });

    const verificationLine = state.verified
      ? `Verification: VERIFIED via store lookup against this month's points upload`
      : `Verification: NOT CHECKED, please confirm this code and balance before fulfilling`;

    return [
      `STINGRAY STORE REDEMPTION REQUEST`,
      `School: ${CONFIG.schoolName}`,
      `Submitted: ${new Date().toLocaleString()}`,
      ``,
      `Redemption Code: ${code}`,
      verificationLine,
      `Commendation points on request: ${balance}`,
      `Conduct points on request: ${conduct}`,
      ``,
      `Requested rewards (total ${total} pts):`,
      ...lines,
      ``,
      note ? `Note from student: ${note}` : ``,
      ``,
      `-- Staff: please confirm this code and balance in the roster before fulfilling. --`,
    ]
      .filter((l) => l !== undefined)
      .join("\n");
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

  function sendRequest() {
    if (!els.studentCode.value.trim()) {
      els.studentCode.focus();
      els.copyStatus.textContent = "Please enter your redemption code first.";
      els.copyStatus.style.color = "#c42836";
      return;
    }
    if (requiresFalseClaimAck()) {
      els.copyStatus.textContent = "Please confirm your points balance is accurate first.";
      els.copyStatus.style.color = "#c42836";
      return;
    }

    if (CONFIG.requestsFormUrl) {
      const text = buildRequestText();
      navigator.clipboard
        .writeText(text)
        .then(() => {
          els.copyStatus.style.color = "#1c6b3a";
          els.copyStatus.textContent = "Copied. Paste it into the form that just opened, then submit there.";
        })
        .catch(() => {
          els.copyStatus.style.color = "#c42836";
          els.copyStatus.textContent = "Could not copy automatically. Use Copy Request Details, then paste it into the form that just opened.";
        });
      window.open(CONFIG.requestsFormUrl, "_blank", "noopener");
      return;
    }

    const subject = encodeURIComponent(`Stingray Store Request, Code ${els.studentCode.value.trim()}`);
    const body = encodeURIComponent(buildRequestText());
    window.location.href = `mailto:${CONFIG.adminEmail}?subject=${subject}&body=${body}`;
  }

  async function copyRequest() {
    if (!els.studentCode.value.trim()) {
      els.studentCode.focus();
      els.copyStatus.textContent = "Please enter your redemption code first.";
      els.copyStatus.style.color = "#c42836";
      return;
    }
    if (requiresFalseClaimAck()) {
      els.copyStatus.textContent = "Please confirm your points balance is accurate first.";
      els.copyStatus.style.color = "#c42836";
      return;
    }
    const text = buildRequestText();
    try {
      await navigator.clipboard.writeText(text);
      els.copyStatus.style.color = "#1c6b3a";
      els.copyStatus.textContent = CONFIG.requestsFormUrl
        ? "Copied. Paste it into the request form."
        : "Copied! Paste it into an email to " + CONFIG.adminEmail;
    } catch (e) {
      els.copyStatus.style.color = "#c42836";
      els.copyStatus.textContent = "Could not copy automatically. Please select and copy the text manually.";
    }
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
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
      els.quoteStatus.style.color = "#c42836";
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
        els.quoteStatus.style.color = "#1c6b3a";
        els.quoteStatus.textContent = "Copied. Paste it into the form that just opened, then submit there.";
      })
      .catch(() => {
        els.quoteStatus.style.color = "#c42836";
        els.quoteStatus.textContent = "Could not copy automatically. Copy your quote and code, then paste them into the form that just opened.";
      });
    window.open(CONFIG.wallOfFameFormUrl, "_blank", "noopener");
  }

  // Wiring
  els.commendationInput.addEventListener("input", renderAll);
  els.conductInput.addEventListener("input", renderAll);
  els.lookupBtn.addEventListener("click", performLookup);
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
  els.copyRequestBtn.addEventListener("click", copyRequest);
  els.pointsModalCloseBtn.addEventListener("click", closePointsModal);
  els.detailModalCloseBtn.addEventListener("click", closeDetailModal);
  els.quoteSubmitBtn.addEventListener("click", submitQuote);

  applyConfig();
  renderAll();
  els.wallOfFamePolicy.textContent = CONFIG.wallOfFamePolicyNote;
  els.wallOfFameSubmit.hidden = !CONFIG.wallOfFameFormUrl;
  loadWallOfFame();
})();
