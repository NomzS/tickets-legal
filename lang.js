/* Language toggle for the legal pages.
   Progressive enhancement: the stylesheet only hides a language block once
   <html> carries the `js` class (set inline in <head>), so with JS disabled or
   broken BOTH languages render in full. A store reviewer must never be able to
   land on a blank policy page. */
(function () {
  "use strict";

  var STORAGE_KEY = "mt-legal-lang";
  var buttons = Array.prototype.slice.call(
    document.querySelectorAll("[data-set-lang]")
  );
  var blocks = Array.prototype.slice.call(document.querySelectorAll("[data-lang]"));
  if (!buttons.length || !blocks.length) return;

  var available = blocks.map(function (b) {
    return b.getAttribute("data-lang");
  });

  // Chrome-outside-the-blocks bits (page title, "last updated" line) carry their
  // own per-language strings so the heading doesn't stay English over Polish body
  // text. Attribute form keeps the English copy in the HTML as the no-JS default.
  var swappable = Array.prototype.slice.call(document.querySelectorAll("[data-t-en]"));

  function apply(lang) {
    if (available.indexOf(lang) === -1) lang = available[0];

    blocks.forEach(function (block) {
      block.classList.toggle("is-active", block.getAttribute("data-lang") === lang);
    });
    swappable.forEach(function (el) {
      var text = el.getAttribute("data-t-" + lang);
      if (text) el.textContent = text;
    });
    var heading = document.querySelector("h1[data-t-" + lang + "]");
    if (heading) document.title = heading.textContent + " — Memory Tickets";
    buttons.forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        button.getAttribute("data-set-lang") === lang ? "true" : "false"
      );
    });
    // Keep the document language honest for screen readers and translation tools.
    document.documentElement.setAttribute("lang", lang);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* Private browsing / blocked storage: the toggle still works for this
         visit, it just won't be remembered. Never let this break the page. */
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      apply(button.getAttribute("data-set-lang"));
    });
  });

  // Preference order: an explicit ?lang= (so the store listing can deep-link a
  // Polish reviewer straight to Polish), then a remembered choice, then the
  // browser's own language, then the page default.
  var initial = null;

  var fromQuery = /[?&]lang=([a-zA-Z-]+)/.exec(window.location.search);
  if (fromQuery) initial = fromQuery[1].slice(0, 2).toLowerCase();

  if (!initial) {
    try {
      initial = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      initial = null;
    }
  }

  if (!initial && navigator.language) {
    initial = navigator.language.slice(0, 2).toLowerCase();
  }

  apply(initial || available[0]);
})();
