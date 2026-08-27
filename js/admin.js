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
  };

  els.schoolNameLabel.textContent = CONFIG.schoolName;
  els.editLink.href = CONFIG.pointsFileEditUrl;

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
