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
    commendationInput: document.getElementById("commendationInput"),
    conductInput: document.getElementById("conductInput"),
    lookupCode: document.getElementById("lookupCode"),
    lookupBtn: document.getElementById("lookupBtn"),
    lookupResult: document.getElementById("lookupResult"),
    manualEntry: document.getElementById("manualEntry"),
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
  };

  function applyConfig() {
    document.title = `${CONFIG.storeName} · ${CONFIG.schoolName}`;
    els.schoolNameLabel.textContent = CONFIG.schoolName;
    els.storeNameLabel.textContent = CONFIG.storeName;
    els.mottoText.textContent = CONFIG.motto;
    els.footMotto.textContent = `"${CONFIG.motto}"`;
    els.footSchoolName.textContent = CONFIG.schoolName;
    els.footWebsite.href = CONFIG.websiteUrl;
    if (CONFIG.logoPath) {
      els.logoImg.src = CONFIG.logoPath;
      els.logoImg.onerror = () => { els.logoImg.src = "assets/logo.svg"; };
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
    els.lookupResult.innerHTML = `<div class="lookup-msg">Checking…</div>`;
    const record = await PointsLookup.find(code);

    if (record) {
      clearVerification();
      setVerifiedInputs(record.commendations, record.conduct);
      const dressDown =
        record.conduct <= CONFIG.dressDownMaxConduct
          ? `<div class="dress-down-banner">🎉 ${CONFIG.dressDownNote}</div>`
          : "";
      els.lookupResult.innerHTML = `
        <div class="lookup-msg ok">
          ✓ Verified! You have <strong>${record.commendations} commendation pts</strong> and
          <strong>${record.conduct} conduct pts</strong> as of this month's upload.
          <button class="link-btn" id="clearLookupBtn">Not you? Clear</button>
        </div>
        ${dressDown}
      `;
      document.getElementById("clearLookupBtn").addEventListener("click", resetLookup);
    } else {
      clearVerification();
      els.lookupResult.innerHTML = `<div class="lookup-msg warn">We don't have this code in this month's upload yet. Enter your points manually below — staff will verify by hand.</div>`;
      els.commendationInput.focus();
    }
    renderAll();
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

  function renderCatalog() {
    const categories = [...new Set(ITEMS.map((i) => i.category))];
    els.catalog.innerHTML = "";

    categories.forEach((cat) => {
      const section = document.createElement("section");
      const title = document.createElement("h2");
      title.className = "category-title";
      title.textContent = cat;
      section.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "grid";

      ITEMS.filter((i) => i.category === cat).forEach((item) => {
        grid.appendChild(renderCard(item));
      });

      section.appendChild(grid);
      els.catalog.appendChild(section);
    });
  }

  function renderCard(item) {
    const card = document.createElement("div");
    const locked = isLocked(item);
    const inCart = state.cart.includes(item.id);
    card.className = "card" + (locked ? " locked" : "");

    card.innerHTML = `
      ${inCart ? '<div class="in-cart-badge">In cart</div>' : ""}
      <div class="icon">${item.icon}</div>
      <h3>${item.name}</h3>
      <p class="desc">${item.desc}</p>
      <div class="cost"><span class="icon-mini">🌟</span> ${item.cost} pts</div>
      ${locked ? `<div class="restriction">Unavailable — requires ${item.maxConduct} or fewer conduct points.</div>` : ""}
      <button class="add" ${locked || inCart ? "disabled" : ""}>${inCart ? "Added ✓" : locked ? "Locked" : "Add to Requests"}</button>
    `;

    const btn = card.querySelector("button.add");
    if (!locked && !inCart) {
      btn.addEventListener("click", () => addToCart(item.id));
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
          <div class="icon">${item.icon}</div>
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
      els.balanceMsg.innerHTML = `<div class="balance-warning">You've entered ${balance} commendation pts — that's ${total - balance} short of this request. You can still send it, but staff will need to confirm your real balance.</div>`;
      els.checkoutBtn.disabled = false;
    } else {
      els.balanceMsg.innerHTML = `<div class="balance-ok">You have enough commendation points for this request. ✓</div>`;
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
      return `  • ${item.name} — ${item.cost} pts`;
    });

    const verificationLine = state.verified
      ? `Verification: VERIFIED via store lookup against this month's points upload`
      : `Verification: SELF-REPORTED — not found in this month's upload, please verify manually`;

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
      <div class="line"><span>Your balance</span><span>${getCommendations()} pts ${state.verified ? "✓ verified" : "(self-reported)"}</span></div>
    `;
    els.copyStatus.textContent = "";
    els.modalWrap.classList.add("open");
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
    const subject = encodeURIComponent(`Stingray Store Request — Code ${els.studentCode.value.trim()}`);
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
    const text = buildRequestText();
    try {
      await navigator.clipboard.writeText(text);
      els.copyStatus.style.color = "#1c6b3a";
      els.copyStatus.textContent = "Copied! Paste it into an email to " + CONFIG.adminEmail;
    } catch (e) {
      els.copyStatus.style.color = "#c42836";
      els.copyStatus.textContent = "Couldn't copy automatically — please select and copy the text manually.";
    }
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

  applyConfig();
  renderAll();
})();
