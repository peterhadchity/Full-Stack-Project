/* =====================================================================
   modal.js — Detail Modal  (Peter Hadchity's custom UI requirement)

   A hand-built modal popup that shows the full detail of a coffee when a
   card is clicked. Intentionally NOT Bootstrap's modal component — the
   open/close, keyboard, and focus logic are written here so the behaviour
   is fully owned and explainable.

   How it works:
     - open(data): fills the modal body from the clicked item, then adds
       the `.open` class on the backdrop (CSS handles the fade/scale).
     - It records the element that had focus before opening, moves focus
       into the modal, and TRAPS Tab within the modal while it's open
       (so keyboard users can't tab out to the page behind it).
     - close(): hides the modal and returns focus to where it was.
     - Closes on: the × button, a click on the backdrop (outside the
       dialog), or the Escape key.
   ===================================================================== */
class Modal {
  constructor() {
    this.backdrop = document.querySelector("#modal-backdrop");
    this.dialog = this.backdrop?.querySelector(".modal");
    this.bodyEl = this.backdrop?.querySelector("#modal-body");
    this.lastFocused = null;

    if (!this.backdrop) return;
    this.wire();
  }

  wire() {
    // Close when clicking the backdrop itself (not the dialog inside it)
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) this.close();
    });
    // Close on the × button (delegated, since body is re-rendered)
    this.backdrop.addEventListener("click", (e) => {
      if (e.target.closest(".modal-close")) this.close();
    });
    // Escape closes; Tab is trapped inside the dialog
    document.addEventListener("keydown", (e) => {
      if (!this.isOpen()) return;
      if (e.key === "Escape") this.close();
      if (e.key === "Tab") this.trapTab(e);
    });
  }

  isOpen() {
    return this.backdrop.classList.contains("open");
  }

  open(data) {
    this.lastFocused = document.activeElement;
    this.bodyEl.innerHTML = this.template(data);
    this.backdrop.classList.add("open");
    this.backdrop.setAttribute("aria-hidden", "false");
    // Move focus into the modal (the close button)
    this.backdrop.querySelector(".modal-close")?.focus();
  }

  close() {
    this.backdrop.classList.remove("open");
    this.backdrop.setAttribute("aria-hidden", "true");
    // Return focus to the card that opened it
    this.lastFocused?.focus();
  }

  trapTab(e) {
    const focusables = this.dialog.querySelectorAll(
      'button, a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  template(c) {
    return `
      <button class="modal-close" aria-label="Close detail">&times;</button>
      <p class="roast">${c.roast} roast</p>
      <h2>${c.name}</h2>
      <p class="origin">${c.origin}</p>
      <dl>
        <dt>Tasting notes</dt><dd>${c.notes}</dd>
        <dt>Best brewed as</dt><dd>${c.brew}</dd>
        <dt>Process</dt><dd>${c.process}</dd>
        <dt>Why it's worth it</dt><dd>${c.why}</dd>
      </dl>`;
  }
}
