/* =====================================================================
   lookup.js — Nutrition Lookup page controller (ES6 class)

   On load, fetches nutrition data for a set of common coffee drinks from
   API Ninjas (one API call). Then provides a CLIENT-SIDE SEARCH box that
   filters over the FETCHED results — satisfying the course requirement of
   "client-side search over the fetched data."

   Handles all three states: LOADING, ERROR, EMPTY.
   ===================================================================== */
class Lookup {
  constructor() {
    this.api = new NutritionAPI(CONFIG.NINJAS_KEY);
    this.all = [];   // fetched drinks
    this.grid = document.querySelector("#nutri-grid");
    this.state = document.querySelector("#lookup-state");
    this.search = document.querySelector("#nutri-search");

    // The coffee drinks we ask the API about (one combined query)
    this.drinks =
      "espresso, latte, cappuccino, americano, mocha, macchiato, " +
      "cold brew coffee, flat white, cortado, iced coffee";

    this.init();
  }

  setState(msg) {
    this.state.textContent = msg || "";
    this.state.style.display = msg ? "block" : "none";
  }

  async init() {
    if (this.search) {
      this.search.addEventListener("input", () => this.renderFiltered());
    }
    await this.load();
  }

  async load() {
    this.setState("Looking up nutrition data…");          // LOADING
    this.grid.innerHTML = "";
    try {
      const items = await this.api.lookup(this.drinks);
      if (!items.length) {                                 // EMPTY (API)
        this.setState("No nutrition data came back. Try refreshing.");
        return;
      }
      this.all = items;
      this.setState("");
      this.renderFiltered();
    } catch (err) {                                        // ERROR
      this.setState(
        "Couldn't reach the nutrition service. Check your API key in " +
        "config.js or your connection, then refresh."
      );
      console.error(err);
    }
  }

  renderFiltered() {
    const q = (this.search?.value || "").trim().toLowerCase();
    const list = !q
      ? this.all
      : this.all.filter((d) => (d.name || "").toLowerCase().includes(q));

    if (!list.length) {                                    // EMPTY (search)
      this.grid.innerHTML = "";
      this.setState("No drinks match that search.");
      return;
    }
    this.setState("");

    const head = `
      <div class="nutri-row nutri-head">
        <span>Drink</span><span>Calories</span><span>Protein</span><span>Fat</span>
      </div>`;
    const rows = list.map((d) => `
      <div class="nutri-row">
        <span class="name">${d.name || "—"}</span>
        <span class="metric"><b>${this.num(d.calories)}</b> kcal</span>
        <span class="metric"><b>${this.num(d.protein_g)}</b> g</span>
        <span class="metric"><b>${this.num(d.fat_total_g)}</b> g</span>
      </div>`).join("");

    this.grid.innerHTML = head + rows;
  }

  num(v) {
    return (v === undefined || v === null || v === "") ? "—" : v;
  }
}

document.addEventListener("DOMContentLoaded", () => new Lookup());
