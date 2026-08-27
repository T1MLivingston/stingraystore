// ============================================================
// STINGRAY STORE — POINTS LOOKUP
// Loads data/points.json (code -> { commendations, conduct }) and looks
// up a single code. This file is never modified at runtime — students
// only ever read from it, never write to it.
// ============================================================

const PointsLookup = (function () {
  let cachePromise = null;

  function load() {
    if (!cachePromise) {
      cachePromise = fetch(CONFIG.pointsDataUrl)
        .then((res) => {
          if (!res.ok) throw new Error("points file not reachable");
          return res.json();
        })
        .then((data) => data.codes || {})
        .catch(() => ({}));
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
