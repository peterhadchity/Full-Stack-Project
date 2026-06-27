/* =====================================================================
   collection.js — Collection page controller (ES6 class)

   Renders the curated coffees as clickable cards. Clicking a card opens
   the detail Modal (the custom requirement). Also provides a simple
   client-side filter box over the curated list.
   ===================================================================== */
class Collection {
  constructor(data) {
    this.data = data || [];
    this.grid = document.querySelector("#bean-grid");
    this.filterEl = document.querySelector("#bean-filter");
    this.modal = new Modal();

    if (!this.grid) return;
    this.render(this.data);
    this.wireFilter();
  }

  cardHTML(c, index) {
    return `
      <button class="bean-card" data-index="${index}">
        <span class="roast">${c.roast} roast</span>
        <h3>${c.name}</h3>
        <p class="origin">${c.origin}</p>
        <p class="teaser">${c.notes}</p>
        <span class="more">View detail →</span>
      </button>`;
  }

  render(list) {
    // Keep a parallel reference so click handlers map to the right object
    this.current = list;
    this.grid.innerHTML = list.map((c, i) => this.cardHTML(c, i)).join("");
    this.grid.querySelectorAll(".bean-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = this.current[Number(btn.dataset.index)];
        this.modal.open(item);
      });
    });
  }

  wireFilter() {
    if (!this.filterEl) return;
    this.filterEl.addEventListener("input", () => {
      const q = this.filterEl.value.trim().toLowerCase();
      const filtered = !q
        ? this.data
        : this.data.filter((c) =>
            (c.name + c.origin + c.roast + c.notes).toLowerCase().includes(q)
          );
      this.render(filtered);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new Collection(COFFEES));
