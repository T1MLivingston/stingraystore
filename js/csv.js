// ============================================================
// STINGRAY STORE — CSV UTILITY
// A minimal CSV parser: handles quoted fields (Google Sheets quotes any
// field containing a comma) and blank lines. Shared by points.js and
// app.js. Not a general CSV library, just enough for a simple sheet.
// ============================================================

const CsvUtil = (function () {
  function parse(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += c;
      }
    }
    if (field !== "" || row.length) {
      row.push(field);
      rows.push(row);
    }
    return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
  }

  // Rows (including header) -> array of objects keyed by lowercased header.
  function toObjects(text) {
    const rows = parse(text);
    if (rows.length < 2) return [];
    const header = rows[0].map((h) => h.trim().toLowerCase());
    return rows.slice(1).map((r) => {
      const obj = {};
      header.forEach((h, idx) => {
        obj[h] = (r[idx] || "").trim();
      });
      return obj;
    });
  }

  return { parse, toObjects };
})();
