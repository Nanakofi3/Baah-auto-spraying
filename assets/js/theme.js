/* ==========================================================================
   Applies the saved colour theme before the page paints.
   Loaded in <head> on every page so moving between pages doesn't flash.
   ========================================================================== */

(function () {
  var saved = null;
  try { saved = localStorage.getItem('bas-theme'); } catch (e) {}

  var prefersDark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  if ((saved || (prefersDark ? 'dark' : 'light')) === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
