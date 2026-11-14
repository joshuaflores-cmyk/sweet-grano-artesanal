'use strict';
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncMotion() {
    document.querySelectorAll('.product-model, .dialog-model').forEach(model => {
      if (preference.matches) model.removeAttribute('auto-rotate');
      else {model.setAttribute('auto-rotate','');model.setAttribute('rotation-per-second','12deg');model.setAttribute('auto-rotate-delay','2500');}
    });
  }
  syncMotion();
  preference.addEventListener?.('change',syncMotion);
})();
