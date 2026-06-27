/* =====================================================================
   app.js — CoffeeApp (shared site behaviour)
   ES6 class. Runs on every page. No jQuery.

   Handles the responsive top-nav: the mobile burger toggle and marking
   the current page in the menu. Kept deliberately small — the heavier
   logic lives in the page-specific classes (Modal, Collection,
   NutritionAPI, Lookup).
   ===================================================================== */
class CoffeeApp {
  constructor() {
    this.burger = document.querySelector(".burger");
    this.menu = document.querySelector(".menu");
    this.markCurrent();
    this.wireBurger();
  }

  wireBurger() {
    if (!this.burger || !this.menu) return;
    this.burger.addEventListener("click", () => {
      const open = this.menu.classList.toggle("show");
      this.burger.classList.toggle("show", open);
      this.burger.setAttribute("aria-expanded", String(open));
    });
  }

  markCurrent() {
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".menu a").forEach((a) => {
      if (a.getAttribute("href") === here) {
        a.setAttribute("aria-current", "page");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new CoffeeApp());
