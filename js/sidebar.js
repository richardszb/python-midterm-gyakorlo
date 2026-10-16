/* Oldalsáv: számláló + kérdésrács (kvízenként csoportosítva, lenyitható) */
(function (App) {
  'use strict';

  const esc = App.escapeHtml;

  const HIDE_KEY = 'python_ui_sidebar_hidden';

  function readHidden() {
    try {
      return localStorage.getItem(HIDE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  // collapsed: lenyitott/becsukott kvízcsoportok, mobileOpen: mobilos lista,
  // hidden: a lista elrejtése széles képernyőn (ez megmarad a böngészőben).
  App.ui = { collapsed: {}, mobileOpen: false, hidden: readHidden() };

  App.setSidebarHidden = function (hidden) {
    App.ui.hidden = !!hidden;
    try {
      localStorage.setItem(HIDE_KEY, App.ui.hidden ? '1' : '0');
    } catch (e) {
      /* nem kritikus */
    }
    App.applyLayout();
  };

  /** A cella állapota a kérdés eredményéből: "known" | "unknown" | "none". */
  function cellStatus(id) {
    const r = App.result(id);
    if (!r) return 'none';
    return r.ok ? 'known' : 'unknown';
  }

  function statusLabel(id) {
    const r = App.result(id);
    if (!r) return 'még nincs válasz';
    if (r.ok) return 'helyes';
    return r.graded ? 'hibás' : 'hibás – ebben a körben újra jön';
  }

  function shortPrompt(q) {
    const line = String(q.prompt || '').split('\n')[0];
    return line.length > 70 ? line.slice(0, 67) + '…' : line;
  }

  function cellHtml(q, isCurrent) {
    const r = App.result(q.id);
    const pending = !!r && !r.graded; // újrapróbálásra váró (korábban hibás) kérdés
    const label = `${q.num}. kérdés – ${statusLabel(q.id)}`;
    return (
      `<button type="button" data-action="jump" data-id="${esc(q.id)}"` +
      ` class="qcell qcell-${cellStatus(q.id)}${pending ? ' qcell-pending' : ''}${isCurrent ? ' qcell-current' : ''}"` +
      ` title="${esc(label + ' · ' + shortPrompt(q))}" aria-label="${esc(label)}"` +
      `${isCurrent ? ' aria-current="true"' : ''}>${q.num}</button>`
    );
  }

  function counterHtml(st) {
    const pct = (n) => (st.total ? (n / st.total) * 100 : 0).toFixed(2);
    return `
      <div class="mb-4">
        <div class="flex items-baseline justify-between">
          <div>
            <span class="text-3xl font-bold text-white leading-none">${st.answered}</span>
            <span class="text-slate-400 text-sm"> / ${st.total} megválaszolva</span>
          </div>
          <span class="text-sm font-bold text-indigo-300">${st.percent}%</span>
        </div>
        <div class="mt-2.5 h-2 rounded-full bg-slate-800 overflow-hidden flex" role="img"
          aria-label="${st.correct} helyes, ${st.wrong} hibás, ${st.remaining} hátralévő">
          <div class="bg-emerald-500 transition-all duration-300" style="width:${pct(st.correct)}%"></div>
          <div class="bg-rose-500 transition-all duration-300" style="width:${pct(st.wrong)}%"></div>
        </div>
        <div class="mt-3 grid grid-cols-3 gap-2 text-center">
          <div class="rounded-lg bg-emerald-950/40 border border-emerald-800/50 py-1.5">
            <div class="text-lg font-bold text-emerald-400 leading-tight">${st.correct}</div>
            <div class="text-[11px] text-slate-400">Helyes</div>
          </div>
          <div class="rounded-lg bg-rose-950/40 border border-rose-800/50 py-1.5">
            <div class="text-lg font-bold text-rose-400 leading-tight">${st.wrong}</div>
            <div class="text-[11px] text-slate-400">Hibás</div>
          </div>
          <div class="rounded-lg bg-slate-800/60 border border-slate-700/70 py-1.5">
            <div class="text-lg font-bold text-slate-300 leading-tight">${st.remaining}</div>
            <div class="text-[11px] text-slate-400">Hátralévő</div>
          </div>
        </div>
      </div>
    `;
  }

  function groupHtml(quizId, questions, st, currentId) {
    const quiz = App.quizzes.find((z) => z.id === quizId);
    const g = st.byQuiz[quizId];
    const collapsed = !!App.ui.collapsed[quizId];
    const cells = questions.map((q) => cellHtml(q, q.id === currentId)).join('');

    return `
      <div class="border-t border-slate-800 pt-3 mt-3">
        <button type="button" data-action="toggle-group" data-quiz="${quizId}" aria-expanded="${!collapsed}"
          class="group-head w-full flex items-center justify-between gap-2 text-left rounded-md px-1 py-1">
          <span class="min-w-0">
            <span class="block text-sm font-semibold text-slate-200">${collapsed ? '▸' : '▾'} ${quizId}. kvíz</span>
            <span class="block text-[11px] text-slate-500 truncate">${esc(quiz ? quiz.title : '')}</span>
          </span>
          <span class="shrink-0 text-right mono leading-tight">
            <span class="block text-xs text-slate-300">${g.answered}/${g.total}</span>
            <span class="block text-[11px]"><span class="text-emerald-400">✓${g.correct}</span> <span class="text-rose-400">✕${g.wrong}</span></span>
          </span>
        </button>
        ${collapsed ? '' : `<div class="qgrid mt-2">${cells}</div>`}
      </div>
    `;
  }

  App.renderSidebar = function () {
    const el = document.getElementById('sidebar');
    if (!el || !App.state) return;
    const s = App.state;
    const st = App.deckStats();
    const cur = App.getCurrentQuestion();
    const currentId = cur ? cur.id : null;
    const prevScroll = el.scrollTop;

    // A rács kvíz szerint csoportosít, a csoporton belül kérdésszám szerint rendez
    // (stabil marad, akkor is, ha a pakli sorrendje a válaszadással változik).
    const groups = {};
    s.deck.forEach((id) => {
      const q = App.questionsById[id];
      if (q) (groups[q.quiz] = groups[q.quiz] || []).push(q);
    });

    let html = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">${s.round}. kör · kérdések</span>
        <button type="button" data-action="toggle-desktop-sidebar" title="Lista elrejtése" aria-label="Kérdéslista elrejtése"
          class="hidden lg:inline-flex items-center justify-center w-7 h-7 -mr-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/70 transition">✕</button>
      </div>`;
    html += counterHtml(st);
    Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((quizId) => {
        const list = groups[quizId].slice().sort((a, b) => a.num - b.num);
        html += groupHtml(quizId, list, st, currentId);
      });

    const atSummary = s.currentIndex >= s.deck.length;
    const canSummary = st.remaining === 0 && st.total > 0;
    html += `
      <div class="border-t border-slate-800 pt-3 mt-3">
        <button type="button" data-action="jump-summary" ${canSummary ? '' : 'disabled'}
          title="${canSummary ? 'Kör összesítője' : 'Az összesítő a kör végén nyílik meg'}"
          class="w-full px-3 py-2 rounded-lg border text-sm font-medium transition ${
            !canSummary
              ? 'border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed'
              : atSummary
              ? 'border-indigo-400 bg-indigo-950/50 text-indigo-200'
              : 'border-slate-700 bg-slate-800/70 hover:bg-slate-700 text-slate-300'
          }">
          🏁 Összesítő
        </button>
        <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span class="flex items-center gap-1"><i class="legend-dot qcell-known"></i>helyes</span>
          <span class="flex items-center gap-1"><i class="legend-dot qcell-unknown"></i>hibás</span>
          <span class="flex items-center gap-1"><i class="legend-dot qcell-none"></i>nincs válasz</span>
        </div>
      </div>
    `;

    el.innerHTML = html;
    el.scrollTop = prevScroll;

    // Az aktuális kérdés mindig látszódjon az oldalsáv görgethető részében.
    const curEl = el.querySelector('.qcell-current');
    if (curEl && el.scrollHeight > el.clientHeight) {
      const er = el.getBoundingClientRect();
      const cr = curEl.getBoundingClientRect();
      if (cr.top < er.top + 8) el.scrollTop += cr.top - er.top - 8;
      else if (cr.bottom > er.bottom - 8) el.scrollTop += cr.bottom - er.bottom + 8;
    }

    // Mobilon a kinyitó gomb összefoglalja az állást.
    const tg = document.getElementById('sidebarToggle');
    if (tg) {
      tg.setAttribute('aria-expanded', String(App.ui.mobileOpen));
      tg.innerHTML =
        '<span class="font-semibold">☰ Kérdések</span>' +
        `<span class="mono text-xs text-slate-300">${st.answered} / ${st.total} · ` +
        `<span class="text-emerald-400">✓${st.correct}</span> <span class="text-rose-400">✕${st.wrong}</span> ` +
        `${App.ui.mobileOpen ? '▴' : '▾'}</span>`;
    }
  };

  /** Fejléc-magasság (a ragadós oldalsávhoz) és a mobilos kinyitás beállítása. */
  App.applyLayout = function () {
    const header = document.querySelector('header');
    if (header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    const aside = document.getElementById('sidebar');
    if (aside) aside.classList.toggle('hidden', !App.ui.mobileOpen);

    // széles képernyőn az elrejtés a rács osztályán keresztül működik (lásd style.css)
    const layout = document.querySelector('.app-layout');
    if (layout) layout.classList.toggle('sidebar-hidden', App.ui.hidden);
    const btn = document.getElementById('sidebarHide');
    if (btn) {
      btn.setAttribute('aria-pressed', String(!App.ui.hidden));
      btn.classList.toggle('border-indigo-500/60', !App.ui.hidden);
      btn.classList.toggle('text-indigo-200', !App.ui.hidden);
    }
  };
})((window.App = window.App || {}));
