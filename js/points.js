// ============================================================
// STINGRAY STORE — POINTS LOOKUP
// Loads student point data (a live Google Sheet if CONFIG.pointsSheetCsvUrl
// is set, otherwise data/points.json) and looks up a single code. This
// data is never modified at runtime — students only ever read from it.
// ============================================================

const PointsLookup = (function () {
  let cachePromise = null;

  function codesFromCsv(text) {
    const codes = {};
    CsvUtil.toObjects(text).forEach((row) => {
      const code = row.code;
      const commendations = Number(row.commendations);
      const conduct = Number(row.conduct);
      if (code && Number.isFinite(commendations) && Number.isFinite(conduct)) {
        codes[code] = { commendations, conduct };
      }
    });
    return codes;
  }

  function loadFromSheet() {
    return fetch(CONFIG.pointsSheetCsvUrl)
      .then((res) => {
        if (!res.ok) throw new Error("sheet not reachable");
        return res.text();
      })
      .then((text) => codesFromCsv(text));
  }

  function loadFromJsonFile() {
    return fetch(CONFIG.pointsDataUrl)
      .then((res) => {
        if (!res.ok) throw new Error("points file not reachable");
        return res.json();
      })
      .then((data) => data.codes || {});
  }

  function load() {
    if (!cachePromise) {
      cachePromise = CONFIG.pointsSheetCsvUrl
        ? loadFromSheet().catch(() => loadFromJsonFile().catch(() => ({})))
        : loadFromJsonFile().catch(() => ({}));
    }
    return cachePromise;
  }

  async function find(code) {
    const data = await load();
    const key = (code || "").trim().toUpperCase();
    if (!key) return null;
    const match = Object.keys(data).find((k) => k.toUpperCase() === key);
    return match ? data[match] : null;
  }

  return { find };
})();
