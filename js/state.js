/* Állapotkezelés: kérdések, pakli, eredmények, localStorage */
(function (App) {
  'use strict';

  // FIGYELEM: a kulcsot ne változtasd, különben mindenki haladása elvész.
  const STORAGE_KEY = 'python_canvas_quizlet_state_v1';
  const STATE_VERSION = 3;

  App.quizzes = [];
  App.questions = [];
  App.questionsById = {};
  App.state = null;

  /** A js/data/quizN.js fájlok által regisztrált kvízekből felépíti a kérdéslistát. */
  App.loadQuestions = function () {
    App.quizzes = (window.QUIZZES || []).slice().sort((a, b) => a.id - b.id);
    App.questions = [];
    App.questionsById = {};
    App.quizzes.forEach((quiz) => {
      quiz.questions.forEach((q) => {
        App.questions.push(q);
        App.questionsById[q.id] = q;
      });
    });
  };

  /*
   * Az állapot alakja (v3):
   *   filter        "all" | kvíz száma (szövegként) – melyik kvíz(ek)ből áll a pakli
   *   round         hányadik kör (a hibásak ismétlése új kör)
   *   deck          az aktuális kör kérdés-azonosítói; az értékeltek mindig az elején vannak
   *   currentIndex  az aktuális kártya helye a paklin belül (== deck.length -> összesítő)
   *   results       id -> { ok, prior, graded, sel? , typed? }   (KVÍZEK KÖZT IS MEGMARAD)
   *                   ok     – a legutolsó értékelés helyes volt-e
   *                   prior  – volt-e korábban hibás próbálkozás
   *                   graded – az aktuális körben már értékelve van-e
   *                   sel    – rádiós kérdésnél a kiválasztott válasz indexe
   *                   typed  – beírós kérdésnél a beírt szöveg
   *   drafts        id -> félig beírt, még nem értékelt szöveg
   *   selectedOption, typedAnswer, step – az aktuális kártya megjelenítési állapota
   */
  function emptyState(filter) {
    return {
      version: STATE_VERSION,
      filter: filter,
      round: 1,
      deck: [],
      currentIndex: 0,
      results: {},
      drafts: {},
      selectedOption: null,
      typedAnswer: '',
      step: 'question', // "question" | "evaluated"
    };
  }

  App.saveState = function () {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(App.state));
    } catch (e) {
      /* privát mód / tele a tár – a kvíz mentés nélkül is működik */
    }
  };

  App.getFilteredIds = function (filterVal) {
    if (filterVal === 'all') return App.questions.map((q) => q.id);
    const quizNum = parseInt(filterVal, 10);
    return App.questions.filter((q) => q.quiz === quizNum).map((q) => q.id);
  };

  function gradedIn(results, id) {
    const r = results[id];
    return !!r && r.graded === true;
  }

  /** Az értékelt kérdések kerülnek előre (eredeti sorrendben), utánuk a még nem megválaszoltak. */
  function orderDeck(ids, results) {
    const done = [];
    const todo = [];
    ids.forEach((id) => (gradedIn(results, id) ? done : todo).push(id));
    return done.concat(todo);
  }

  App.buildDeck = function (filterVal, results) {
    return orderDeck(App.getFilteredIds(filterVal), results);
  };

  function firstUngradedIndex(deck, results) {
    const i = deck.findIndex((id) => !gradedIn(results, id));
    return i === -1 ? deck.length : i;
  }

  // ---------- lekérdezések ----------

  App.getCurrentQuestion = function () {
    return App.questionsById[App.state.deck[App.state.currentIndex]];
  };

  App.result = function (id) {
    return App.state.results[id];
  };

  /** Igaz, ha a kérdést az aktuális körben már értékeltük. */
  App.isGraded = function (id) {
    return gradedIn(App.state.results, id);
  };

  App.inScope = function (id) {
    const f = App.state.filter;
    const q = App.questionsById[id];
    return !!q && (f === 'all' || String(q.quiz) === String(f));
  };

  function countResults(questions, results) {
    let answered = 0;
    let correct = 0;
    let wrong = 0;
    questions.forEach((q) => {
      const r = results[q.id];
      if (!r) return;
      answered++;
      if (r.ok) correct++;
      else wrong++;
    });
    return {
      total: questions.length,
      answered: answered,
      correct: correct,
      wrong: wrong,
      percent: answered > 0 ? Math.round((correct / answered) * 100) : null,
    };
  }

  /** Összesített számlálók az összes kérdésre. */
  App.getStats = function () {
    return countResults(App.questions, App.state.results);
  };

  App.quizStats = function (quizId) {
    const quiz = App.quizzes.find((z) => z.id === quizId);
    return countResults(quiz ? quiz.questions : [], App.state.results);
  };

  // ---------- az aktuális kártya állapota ----------

  /** Az aktuális kártya megjelenítési állapotát az eredményekből / piszkozatból állítja vissza. */
  App.syncCardState = function (st) {
    const s = st || App.state;
    s.selectedOption = null;
    s.typedAnswer = '';
    s.step = 'question';
    const q = App.questionsById[s.deck[s.currentIndex]];
    if (!q) return;
    const r = s.results[q.id];
    if (r && r.graded) {
      s.step = 'evaluated';
      if (q.type === 'radio') s.selectedOption = Number.isInteger(r.sel) ? r.sel : null;
      else s.typedAnswer = r.typed || '';
    } else if (q.type === 'text') {
      s.typedAnswer = s.drafts[q.id] || '';
    }
  };

  /** A félig beírt (még nem értékelt) választ eltesszük, hogy kártyaváltásnál ne vesszen el. */
  App.stashDraft = function () {
    const s = App.state;
    const q = App.getCurrentQuestion();
    if (!q || q.type !== 'text' || App.isGraded(q.id)) return;
    if (s.typedAnswer) s.drafts[q.id] = s.typedAnswer;
    else delete s.drafts[q.id];
  };

  // ---------- eredmények rögzítése ----------

  /** Első értékelés vagy (visszanézéskor) az értékelés átírása. */
  App.record = function (id, ok, extra) {
    const s = App.state;
    const q = App.questionsById[id];
    const prev = s.results[id];
    const prior = prev ? (prev.graded ? !!prev.prior : !!prev.prior || prev.ok === false) : false;
    const rec = { ok: ok, prior: prior, graded: true };
    if (q.type === 'radio') {
      let sel;
      if (extra && Number.isInteger(extra.sel)) sel = extra.sel;
      else if (prev && prev.graded) sel = prev.sel;
      if (sel !== undefined) rec.sel = sel;
    } else if (extra && typeof extra.typed === 'string') {
      rec.typed = extra.typed;
    } else {
      rec.typed = prev && prev.graded && prev.typed ? prev.typed : '';
    }
    s.results[id] = rec;
    delete s.drafts[id];
  };

  /** Egy már értékelt kérdés eredményének átírása (a „volt hibás próbálkozás” jelzés nem változik). */
  App.setVerdict = function (id, ok) {
    const r = App.state.results[id];
    if (!r || !r.graded) return;
    r.ok = ok;
  };

  // ---------- pakli-műveletek ----------

  function rebuildDeck(round) {
    const s = App.state;
    s.round = round;
    s.deck = App.buildDeck(s.filter, s.results);
    s.currentIndex = firstUngradedIndex(s.deck, s.results);
    App.syncCardState();
    App.saveState();
    App.render();
  }

  /** Szűrőváltás: az eredmények megmaradnak, az új pakli ott folytatódik, ahol abbahagytad. */
  App.switchFilter = function (filterVal) {
    App.stashDraft();
    App.state.filter = String(filterVal);
    rebuildDeck(1);
  };

  /** Az aktuális szűrő (vagy az összes) eredményeinek törlése. */
  App.restartScope = function (shuffle) {
    const s = App.state;
    App.getFilteredIds(s.filter).forEach((id) => {
      delete s.results[id];
      delete s.drafts[id];
    });
    s.round = 1;
    let deck = App.buildDeck(s.filter, s.results);
    if (shuffle) deck = App.shuffleArray(deck);
    s.deck = deck;
    s.currentIndex = 0;
    App.syncCardState();
    App.saveState();
    App.render();
  };

  /** Új kör a pakli hibásan megválaszolt kérdéseiből. */
  App.retryRound = function () {
    const s = App.state;
    const ids = s.deck.filter((id) => s.results[id] && s.results[id].ok === false);
    if (ids.length === 0) return;
    ids.forEach((id) => {
      s.results[id].graded = false;
    });
    s.round++;
    s.deck = ids;
    s.currentIndex = 0;
    App.syncCardState();
    App.saveState();
    App.render();
  };

  /**
   * Egy még nem értékelt kérdés lesz a következő kártya. A „frontvonalba” kerül
   * (az értékeltek után), a korábbi következő kártya egyet hátrébb csúszik –
   * így semmi nem marad ki a körből. Ha másik kvízből való, átvált arra a kvízre.
   */
  App.jumpTo = function (id) {
    const q = App.questionsById[id];
    if (!q) return;
    const cur = App.getCurrentQuestion();
    if (cur && cur.id === id) return;
    App.stashDraft();
    if (!App.inScope(id)) App.state.filter = String(q.quiz);
    const s = App.state;
    if (s.filter !== String(q.quiz) && s.filter !== 'all') s.filter = String(q.quiz);

    // ha váltottunk szűrőt, a pakli újra kell építeni
    const wasInDeck = s.deck.includes(id);
    if (!wasInDeck && s.deck.length > 0 && !s.deck.every((x) => App.inScope(x))) {
      s.deck = App.buildDeck(s.filter, s.results);
      s.round = 1;
    }
    const at = s.deck.indexOf(id);
    if (at !== -1) s.deck.splice(at, 1);
    const frontier = firstUngradedIndex(s.deck, s.results);
    s.deck.splice(frontier, 0, id);
    s.currentIndex = frontier;
    App.syncCardState();
    App.saveState();
    App.render();
  };

  // ---------- mentés betöltése / migrálása ----------

  function sanitizeResults(raw) {
    const out = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.keys(raw).forEach((id) => {
      const q = App.questionsById[id];
      const r = raw[id];
      if (!q || !r || typeof r !== 'object' || typeof r.ok !== 'boolean') return;
      const rec = { ok: r.ok, prior: !!r.prior, graded: r.graded === true };
      if (q.type === 'radio') {
        if (Number.isInteger(r.sel) && r.sel >= 0 && r.sel < q.options.length) rec.sel = r.sel;
      } else if (typeof r.typed === 'string') {
        rec.typed = r.typed;
      }
      out[id] = rec;
    });
    return out;
  }

  function sanitizeDrafts(raw) {
    const out = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.keys(raw).forEach((id) => {
      const q = App.questionsById[id];
      if (q && q.type === 'text' && typeof raw[id] === 'string' && raw[id]) out[id] = raw[id];
    });
    return out;
  }

  /** v1/v2 mentés (knownIds / unknownIds / answers) átalakítása eredményekké. */
  function migrateLegacy(saved, deck) {
    const exists = (id) => typeof id === 'string' && !!App.questionsById[id];
    const answers = saved.answers && typeof saved.answers === 'object' ? saved.answers : {};
    const clean = (list) => (Array.isArray(list) ? list : []).filter(exists);
    const known = clean(saved.knownIds);
    const unknown = clean(saved.unknownIds).filter((id) => !known.includes(id));
    const results = {};
    const drafts = {};

    const add = (id, ok) => {
      const q = App.questionsById[id];
      const a = answers[id] && typeof answers[id] === 'object' ? answers[id] : {};
      const rec = { ok: ok, prior: false, graded: true };
      if (q.type === 'radio') {
        if (Number.isInteger(a.selected) && a.selected >= 0 && a.selected < q.options.length) rec.sel = a.selected;
      } else {
        rec.typed = typeof a.typed === 'string' ? a.typed : '';
      }
      results[id] = rec;
    };
    known.forEach((id) => add(id, true));
    unknown.forEach((id) => add(id, false));

    // régi 2+. körben a pakliban lévő, még nem újra megoldott kérdések korábban hibásak voltak
    if (Number.isInteger(saved.round) && saved.round > 1) {
      deck.forEach((id) => {
        if (!results[id]) results[id] = { ok: false, prior: true, graded: false };
      });
    }
    Object.keys(answers).forEach((id) => {
      const q = App.questionsById[id];
      const a = answers[id];
      if (q && q.type === 'text' && !results[id] && a && typeof a.typed === 'string' && a.typed) drafts[id] = a.typed;
    });
    return { results: results, drafts: drafts };
  }

  /**
   * Egy korábbi (akár régebbi verziójú) mentést összeilleszt a jelenlegi kérdésekkel.
   * A haladás kérdés-azonosítók alapján él tovább:
   *  - ami már nem létezik, kiesik,
   *  - ami új, a pakli végére kerül,
   *  - minden más (eredmények, válaszok, pozíció) megmarad.
   * Csak teljesen használhatatlan mentésnél ad vissza null-t.
   */
  function reconcile(saved) {
    if (!saved || typeof saved !== 'object' || !Array.isArray(saved.deck)) return null;

    const exists = (id) => typeof id === 'string' && !!App.questionsById[id];
    const filter = String(saved.filter);
    if (filter !== 'all' && !App.quizzes.some((z) => String(z.id) === filter)) return null;

    // pakli: törölt / duplikált kérdések kiszűrése, a pozíció korrigálása
    let idx = Number.isInteger(saved.currentIndex) ? Math.max(0, saved.currentIndex) : 0;
    let deck = [];
    let droppedBeforeCurrent = 0;
    saved.deck.forEach((id, i) => {
      if (exists(id) && !deck.includes(id)) deck.push(id);
      else if (i < idx) droppedBeforeCurrent++;
    });
    idx = Math.min(Math.max(0, idx - droppedBeforeCurrent), deck.length);

    let results;
    let drafts;
    if (saved.version === STATE_VERSION) {
      results = sanitizeResults(saved.results);
      drafts = sanitizeDrafts(saved.drafts);
    } else {
      const m = migrateLegacy(saved, deck);
      results = m.results;
      drafts = m.drafts;
    }

    // új kérdések (amikről a mentés még nem tud) a pakli végére
    App.getFilteredIds(filter).forEach((id) => {
      if (!deck.includes(id) && !results[id]) deck.push(id);
    });
    if (deck.length === 0) {
      deck = App.buildDeck(filter, results);
      idx = firstUngradedIndex(deck, results);
    }

    // az értékeltek előre, a pozíció ugyanarra a kártyára mutat
    const curId = deck[idx];
    const ordered = orderDeck(deck, results);
    idx = curId ? ordered.indexOf(curId) : ordered.length;

    const state = Object.assign(emptyState(filter), {
      round: Number.isInteger(saved.round) && saved.round >= 1 ? saved.round : 1,
      deck: ordered,
      currentIndex: idx,
      results: results,
      drafts: drafts,
    });
    App.syncCardState(state);

    // a még nem értékelt aktuális kártya félbehagyott állapota
    const cur = App.questionsById[ordered[idx]];
    if (cur && !gradedIn(results, cur.id)) {
      if (cur.type === 'radio') {
        const sel = saved.selectedOption;
        if (Number.isInteger(sel) && sel >= 0 && sel < cur.options.length) state.selectedOption = sel;
      } else {
        if (typeof saved.typedAnswer === 'string' && saved.typedAnswer) state.typedAnswer = saved.typedAnswer;
        if (saved.step === 'evaluated') state.step = 'evaluated';
      }
    }
    return state;
  }

  /** Visszaadja, hogy sikerült-e használható mentett állapotot betölteni. */
  App.loadState = function () {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const state = reconcile(JSON.parse(raw));
      if (!state) return false;
      App.state = state;
      App.saveState(); // a frissített (migrált) alakot is elmentjük
      return true;
    } catch (e) {
      console.error('Mentett állapot betöltési hiba:', e);
      return false;
    }
  };

  /** Tiszta indulás (nincs vagy használhatatlan a mentés). */
  App.createFreshState = function () {
    App.state = emptyState('all');
    App.state.deck = App.buildDeck('all', App.state.results);
    App.saveState();
  };
})((window.App = window.App || {}));
