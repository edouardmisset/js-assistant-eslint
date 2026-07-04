import { mkdir, writeFile } from "node:fs/promises";
import { ruleMatrix } from "../data/rule-matrix.mjs";

const docsDir = new URL("../docs/", import.meta.url);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderHtml() {
  // Extract unique milestone values, sorted
  const milestones = [...new Set(ruleMatrix.map((e) => e.milestone))].sort();

  const rows = ruleMatrix.map((entry) => `
          <tr data-milestone="${escapeHtml(entry.milestone)}">
            <td>${escapeHtml(entry.assist)}</td>
            <td>${escapeHtml(entry.categories.join(", "))}</td>
            <td>${escapeHtml(entry.ecosystem)}</td>
            <td><span class="badge">${escapeHtml(entry.milestone)}</span></td>
            <td>${escapeHtml(entry.plan)}</td>
          </tr>`).join("");

  const filterCheckboxes = milestones
    .map(
      (milestone) =>
        `<label class="filter-label"><input type="checkbox" class="filter-checkbox" value="${escapeHtml(milestone)}" checked> ${escapeHtml(milestone)}</label>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>P42 JS Assistant to ESLint Rule Matrix</title>
    <style>
      :root {
        color-scheme: light dark;
        --bg: #f7f8fb;
        --panel: #ffffff;
        --text: #171923;
        --muted: #526071;
        --border: #d9dee8;
        --accent: #4f46e5;
        --badge-bg: #eef2ff;
        --badge-text: #3730a3;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #0e1117;
          --panel: #151a23;
          --text: #e6edf3;
          --muted: #a6b3c3;
          --border: #2b3442;
          --accent: #8b9cff;
          --badge-bg: #202a44;
          --badge-text: #bcc7ff;
        }
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font: 15px/1.5 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      main {
        max-width: 1280px;
        margin: 0 auto;
        padding: 40px 20px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: clamp(28px, 4vw, 48px);
        line-height: 1.05;
      }

      p {
        color: var(--muted);
        margin: 0 0 24px;
      }

      .filter-section {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
      }

      .filter-title {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--muted);
        margin: 0 0 12px;
      }

      .filter-options {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .filter-label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
      }

      .filter-checkbox {
        cursor: pointer;
      }

      .table-wrap {
        overflow-x: auto;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: 0 16px 40px rgb(15 23 42 / 8%);
      }

      table {
        border-collapse: collapse;
        min-width: 1100px;
        width: 100%;
      }

      th,
      td {
        border-bottom: 1px solid var(--border);
        padding: 12px 14px;
        text-align: left;
        vertical-align: top;
      }

      th {
        background: color-mix(in srgb, var(--panel), var(--accent) 7%);
        color: var(--text);
        font-size: 12px;
        letter-spacing: 0.04em;
        position: sticky;
        text-transform: uppercase;
        top: 0;
      }

      tr:last-child td {
        border-bottom: 0;
      }

      tr.hidden {
        display: none;
      }

      .badge {
        background: var(--badge-bg);
        border: 1px solid color-mix(in srgb, var(--badge-bg), var(--badge-text) 22%);
        border-radius: 999px;
        color: var(--badge-text);
        display: inline-block;
        font-size: 12px;
        font-weight: 700;
        padding: 3px 8px;
        white-space: nowrap;
      }

      .no-results {
        padding: 40px 20px;
        text-align: center;
        color: var(--muted);
      }
    </style>
  </head>
  <body>
    <main>
      <h1>P42 JS Assistant to ESLint Rule Matrix</h1>
      <p>JavaScript and TypeScript only. Vue, React, and JSX-specific assists are excluded. Milestone 1 reuses existing ESLint ecosystem rules before custom ports.</p>
      
      <div class="filter-section">
        <div class="filter-title">Filter by Milestone 1 status</div>
        <div class="filter-options">
          ${filterCheckboxes}
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Assist</th>
              <th>Categories</th>
              <th>Existing ESLint ecosystem</th>
              <th>Milestone 1 status</th>
              <th>Port plan</th>
            </tr>
          </thead>
          <tbody>${rows}
          </tbody>
        </table>
        <div class="no-results" style="display: none;"></div>
      </div>
    </main>

    <script>
      const checkboxes = document.querySelectorAll(".filter-checkbox");
      const rows = document.querySelectorAll("tbody tr");
      const noResults = document.querySelector(".no-results");

      function updateFilter() {
        const selected = new Set(
          Array.from(checkboxes)
            .filter((cb) => cb.checked)
            .map((cb) => cb.value)
        );

        let visibleCount = 0;

        rows.forEach((row) => {
          const milestone = row.getAttribute("data-milestone");
          const isVisible = selected.has(milestone);
          row.classList.toggle("hidden", !isVisible);
          if (isVisible) visibleCount += 1;
        });

        if (visibleCount === 0) {
          noResults.style.display = "block";
          noResults.textContent = "No results match the selected filters.";
        } else {
          noResults.style.display = "none";
        }
      }

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", updateFilter);
      });
    </script>
  </body>
</html>
`;
}

await mkdir(docsDir, { recursive: true });
await writeFile(new URL("rule-matrix.html", docsDir), renderHtml());
