(function () {
  "use strict";

  const els = {
    schoolNameLabel: document.getElementById("schoolNameLabel"),
    gateSection: document.getElementById("gateSection"),
    gateForm: document.getElementById("gateForm"),
    gateInput: document.getElementById("gateInput"),
    gateMsg: document.getElementById("gateMsg"),
    toolSection: document.getElementById("toolSection"),
    rowsInput: document.getElementById("rowsInput"),
    generateBtn: document.getElementById("generateBtn"),
    generateMsg: document.getElementById("generateMsg"),
    resultSection: document.getElementById("resultSection"),
    jsonOutput: document.getElementById("jsonOutput"),
    copyJsonBtn: document.getElementById("copyJsonBtn"),
    downloadBtn: document.getElementById("downloadBtn"),
    editLink: document.getElementById("editLink"),
    pointsSheetEditLink: document.getElementById("pointsSheetEditLink"),
    rosterLinkWrap: document.getElementById("rosterLinkWrap"),
    rosterLink: document.getElementById("rosterLink"),
    noSheetMsg: document.getElementById("noSheetMsg"),
    requestsNotConfigured: document.getElementById("requestsNotConfigured"),
    requestsConfigured: document.getElementById("requestsConfigured"),
    requestsMsg: document.getElementById("requestsMsg"),
    requestsTableWrap: document.getElementById("requestsTableWrap"),
    refreshRequestsBtn: document.getElementById("refreshRequestsBtn"),
    downloadRequestsBtn: document.getElementById("downloadRequestsBtn"),
    wallOfFameEditLink: document.getElementById("wallOfFameEditLink"),
    noWallOfFameMsg: document.getElementById("noWallOfFameMsg"),
  };

  els.schoolNameLabel.textContent = CONFIG.schoolName;
  els.editLink.href = CONFIG.pointsFileEditUrl;

  if (CONFIG.pointsSheetEditUrl) {
    els.pointsSheetEditLink.href = CONFIG.pointsSheetEditUrl;
  } else {
    els.pointsSheetEditLink.hidden = true;
    els.noSheetMsg.hidden = false;
  }
  if (CONFIG.rosterSheetUrl) {
    els.rosterLink.href = CONFIG.rosterSheetUrl;
    els.rosterLinkWrap.hidden = false;
  }

  if (CONFIG.wallOfFameSheetEditUrl) {
    els.wallOfFameEditLink.href = CONFIG.wallOfFameSheetEditUrl;
  } else {
    els.wallOfFameEditLink.hidden = true;
    els.noWallOfFameMsg.hidden = false;
  }

  let lastRequestsCsv = "";

  function renderRequestsTable(csvText) {
    lastRequestsCsv = csvText;
    const rows = CsvUtil.parse(csvText);
    if (rows.length < 2) {
      els.requestsTableWrap.innerHTML = "<p>No requests yet.</p>";
      return;
    }
    const header = rows[0];
    const body = rows.slice(1).reverse(); // newest first
    const thead = `<tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr>`;
    const tbody = body
      .map((r) => `<tr>${header.map((_, i) => `<td>${r[i] || ""}</td>`).join("")}</tr>`)
      .join("");
    els.requestsTableWrap.innerHTML = `<div class="requests-table-scroll"><table class="requests-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
  }

  function loadRequests() {
    if (!CONFIG.requestsSheetCsvUrl) return;
    els.requestsMsg.textContent = "Loading.";
    els.requestsMsg.className = "admin-msg";
    fetch(CONFIG.requestsSheetCsvUrl)
      .then((res) => {
        if (!res.ok) throw new Error("not reachable");
        return res.text();
      })
      .then((text) => {
        renderRequestsTable(text);
        els.requestsMsg.textContent = "";
      })
      .catch(() => {
        els.requestsMsg.textContent = "Could not load the requests sheet. Check that it's shared as \"Anyone with the link\" can view.";
        els.requestsMsg.className = "admin-msg error";
      });
  }

  if (CONFIG.requestsSheetCsvUrl) {
    els.requestsNotConfigured.hidden = true;
    els.requestsConfigured.hidden = false;
    loadRequests();
    els.refreshRequestsBtn.addEventListener("click", loadRequests);
    els.downloadRequestsBtn.addEventListener("click", () => {
      const blob = new Blob([lastRequestsCsv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "stingray-requests.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  const SESSION_KEY = "stingray-admin-unlocked";

  function unlock() {
    els.gateSection.hidden = true;
    els.toolSection.hidden = false;
  }

  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    unlock();
  }

  els.gateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (els.gateInput.value === CONFIG.adminAccessPhrase) {
      sessionStorage.setItem(SESSION_KEY, "1");
      unlock();
    } else {
      els.gateMsg.textContent = "That is not the right phrase.";
      els.gateMsg.className = "admin-msg error";
    }
  });

  function parseRows(text) {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const codes = {};
    const errors = [];

    lines.forEach((line, idx) => {
      const parts = line.split(/[,\t]/).map((p) => p.trim());
      if (parts.length !== 3) {
        errors.push(`Line ${idx + 1}: expected code, commendations, conduct`);
        return;
      }
      const [code, commendationsRaw, conductRaw] = parts;
      const commendations = Number(commendationsRaw);
      const conduct = Number(conductRaw);
      if (!code) {
        errors.push(`Line ${idx + 1}: missing code`);
        return;
      }
      if (!Number.isFinite(commendations) || commendations < 0) {
        errors.push(`Line ${idx + 1}: commendations must be a number`);
        return;
      }
      if (!Number.isFinite(conduct) || conduct < 0) {
        errors.push(`Line ${idx + 1}: conduct must be a number`);
        return;
      }
      codes[code] = { commendations, conduct };
    });

    return { codes, errors };
  }

  els.generateBtn.addEventListener("click", () => {
    const { codes, errors } = parseRows(els.rowsInput.value);

    if (errors.length) {
      els.generateMsg.textContent = errors.join(". ");
      els.generateMsg.className = "admin-msg error";
      els.resultSection.hidden = true;
      return;
    }

    const count = Object.keys(codes).length;
    if (count === 0) {
      els.generateMsg.textContent = "Paste at least one row first.";
      els.generateMsg.className = "admin-msg error";
      els.resultSection.hidden = true;
      return;
    }

    const json = JSON.stringify({ codes }, null, 2);
    els.jsonOutput.value = json;
    els.generateMsg.textContent = `Generated ${count} student ${count === 1 ? "record" : "records"}.`;
    els.generateMsg.className = "admin-msg ok";
    els.resultSection.hidden = false;
  });

  els.copyJsonBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(els.jsonOutput.value);
      els.generateMsg.textContent = "Copied to clipboard.";
      els.generateMsg.className = "admin-msg ok";
    } catch (e) {
      els.jsonOutput.select();
      els.generateMsg.textContent = "Could not copy automatically. Text is selected, copy it manually.";
      els.generateMsg.className = "admin-msg error";
    }
  });

  els.downloadBtn.addEventListener("click", () => {
    const blob = new Blob([els.jsonOutput.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "points.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
})();
