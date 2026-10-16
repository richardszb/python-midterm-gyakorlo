/* Interakciók: kattintások, billentyűparancsok, körök kezelése */
(function (App) {
  'use strict';

  function refresh() {
    App.syncCardState();
    App.saveState();
    App.render();
  }

  function goToNext() {
    const s = App.state;
    App.stashDraft();
    s.currentIndex++;
    refresh();
  }

  /** Mobilon az oldalsáv becsukódik, és a kártya tetejére ugrunk. */
  function closeMobileSidebar() {
    if (!App.ui.mobileOpen) return;
    App.ui.mobileOpen = false;
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      /* nem kritikus */
    }
  }

  const actions = {
    select(el) {
      const s = App.state;
      if (s.step === 'evaluated') return;
      s.selectedOption = parseInt(el.dataset.index, 10);
      App.saveState();
      App.render();
    },

    evaluate() {
      const s = App.state;
      const q = App.getCurrentQuestion();
      if (!q || s.selectedOption === null || s.step === 'evaluated') return;
      App.record(q.id, s.selectedOption === q.correct, { sel: s.selectedOption });
      s.step = 'evaluated';
      App.saveState();
      App.render();
    },

    next() {
      goToNext();
    },

    back() {
      const s = App.state;
      if (s.currentIndex <= 0) return;
      App.stashDraft();
      s.currentIndex = Math.min(s.currentIndex, s.deck.length) - 1;
      refresh();
    },

    reveal() {
      App.state.step = 'evaluated';
      App.saveState();
      App.render();
    },

    /** Beírós kérdés önértékelése (visszanézéskor át is írható), majd tovább. */
    grade(el) {
      const s = App.state;
      const q = App.getCurrentQuestion();
      if (!q) return;
      const ok = el.dataset.correct === 'true';
      if (App.isGraded(q.id)) App.setVerdict(q.id, ok);
      else App.record(q.id, ok, { typed: s.typedAnswer });
      goToNext();
    },

    /** Ugrás egy kérdésre az oldalsávból; a kérdés lesz a következő kártya. */
    jump(el) {
      closeMobileSidebar();
      App.jumpTo(el.dataset.id);
      App.renderSidebar();
      App.applyLayout();
    },

    'jump-summary'() {
      const s = App.state;
      if (App.deckStats().remaining > 0) return;
      closeMobileSidebar();
      App.stashDraft();
      s.currentIndex = s.deck.length;
      refresh();
    },

    'toggle-group'(el) {
      const id = el.dataset.quiz;
      App.ui.collapsed[id] = !App.ui.collapsed[id];
      App.renderSidebar();
    },

    'toggle-desktop-sidebar'() {
      App.setSidebarHidden(!App.ui.hidden);
    },

    'toggle-sidebar'() {
      App.ui.mobileOpen = !App.ui.mobileOpen;
      App.renderSidebar();
      App.applyLayout();
    },

    retry() {
      App.retryRound();
    },

    /**
     * A még nem értékelt kérdések sorrendjét keveri. Az értékeltek és a félig
     * kitöltött aktuális kártya a helyén marad.
     */
    shuffle() {
      const s = App.state;
      let start = s.deck.findIndex((id) => !App.isGraded(id));
      if (start === -1) return; // minden értékelt, nincs mit keverni
      const cur = App.getCurrentQuestion();
      const curPending = !!cur && !App.isGraded(cur.id);
      const inProgress = curPending && (s.selectedOption !== null || s.typedAnswer !== '' || s.step === 'evaluated');
      if (inProgress && s.deck[start] === cur.id) start++;
      s.deck = s.deck.slice(0, start).concat(App.shuffleArray(s.deck.slice(start)));
      if (curPending && !inProgress) {
        refresh(); // az aktuális helyre új kártya került
      } else {
        App.saveState();
        App.render();
      }
    },

    'restart-shuffled'() {
      App.restartScope(true);
    },

    reset() {
      const f = App.state.filter;
      const what = f === 'all' ? 'az összes kvíz haladását' : `a(z) ${f}. kvíz haladását`;
      if (confirm(`Biztosan törlöd ${what}, és elölről kezded?`)) {
        App.restartScope(false);
      }
    },
  };

  /** Billentyűparancsok – a teljes kvíz végigvihető egérhasználat nélkül. */
  function onKeyDown(e) {
    const s = App.state;
    if (!s) return;
    const tag = e.target.tagName;
    if (tag === 'BUTTON' || tag === 'SELECT') return; // a gombok saját Enter/Space kezelését nem duplázzuk
    if (e.altKey || e.metaKey) return;
    const typing = tag === 'TEXTAREA' || (tag === 'INPUT' && e.target.type === 'text');

    // Összesítő képernyő
    if (s.currentIndex >= s.deck.length) {
      if (e.repeat || e.ctrlKey) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        actions.back();
      } else if (e.key === 'Enter' && App.deckStats().wrong > 0) {
        e.preventDefault();
        actions.retry();
      }
      return;
    }

    const q = App.getCurrentQuestion();
    if (!q) return;

    // Beírás közben: Enter (soros) / Ctrl+Enter (többsoros) mutatja a megoldást,
    // üres mezőben a ← az előző kártyára lép.
    if (typing) {
      if (s.step !== 'question') return;
      if (e.key === 'Enter' && (tag === 'INPUT' || e.ctrlKey)) {
        e.preventDefault();
        if (!e.repeat) actions.reveal();
      } else if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.shiftKey && e.target.value === '') {
        e.preventDefault();
        if (!e.repeat) actions.back();
      }
      return;
    }

    if (e.ctrlKey) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (!e.repeat) actions.back();
      return;
    }
    if (e.repeat) return; // a lenyomva tartott billentyű ne pörgesse végig a kártyákat

    if (q.type === 'radio') {
      if (s.step === 'question') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx < q.options.length) actions.select({ dataset: { index: String(idx) } });
        } else if (e.key === 'Enter' && s.selectedOption !== null) {
          e.preventDefault();
          actions.evaluate();
        }
      } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
      return;
    }

    // Beírós kérdés, megoldás felfedve
    if (q.type === 'text' && s.step === 'evaluated') {
      const reviewing = App.isGraded(q.id);
      const key = e.key.toLowerCase();
      if (!reviewing) {
        // első értékelés: Enter = helyes, Backspace = hibás
        if (e.key === 'Enter') {
          e.preventDefault();
          actions.grade({ dataset: { correct: 'true' } });
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          actions.grade({ dataset: { correct: 'false' } });
        }
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        // visszanézés: Enter csak továbblép, az értékelés nem változik
        e.preventDefault();
        goToNext();
      } else if (key === 'i') {
        actions.grade({ dataset: { correct: 'true' } });
      } else if (key === 'n') {
        actions.grade({ dataset: { correct: 'false' } });
      }
    }
  }

  App.bindEvents = function () {
    // Kattintások (data-action alapú delegálás)
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el || el.disabled) return;
      const handler = actions[el.dataset.action];
      if (handler) handler(el);
      // a fejléc gombjai ne tartsák meg a fókuszt, különben a billentyűparancsok elnémulnak
      if (el.closest('header') || el.id === 'sidebarToggle') el.blur();
    });

    // Szövegmező tartalmának követése
    document.addEventListener('input', (e) => {
      if (e.target.id === 'textInput') {
        App.state.typedAnswer = e.target.value;
      }
    });

    // Szűrő váltása (az eredmények megmaradnak)
    document.getElementById('quizFilter').addEventListener('change', (e) => {
      App.switchFilter(e.target.value);
      e.target.blur(); // hogy a billentyűparancsok újra működjenek
    });

    window.addEventListener('keydown', onKeyDown);
  };
})((window.App = window.App || {}));
