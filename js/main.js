/* Belépési pont */
(function (App) {
  'use strict';

  function start() {
    App.loadQuestions();
    if (!App.loadState()) App.createFreshState();
    App.populateFilter();
    App.bindEvents();
    App.render();

    // a ragadós oldalsáv a fejléc tényleges magasságához igazodik
    window.addEventListener('resize', App.applyLayout);
    window.addEventListener('load', App.applyLayout);
  }

  start();
})((window.App = window.App || {}));
