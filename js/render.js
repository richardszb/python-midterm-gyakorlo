/* Megjelenítés: fejléc, kérdéskártyák, összesítő képernyő */
(function (App) {
  'use strict';

  const esc = App.escapeHtml;

  /** A legördülő szűrő feltöltése a kvízadatokból (a darabszámok mindig pontosak). */
  App.populateFilter = function () {
    const select = document.getElementById('quizFilter');
    const options = [`<option value="all">Összes kvíz (${App.questions.length} kérdés)</option>`];
    App.quizzes.forEach((quiz) => {
      options.push(
        `<option value="${quiz.id}">${quiz.id}. Kvíz – ${esc(quiz.title)} (${quiz.questions.length})</option>`
      );
    });
    select.innerHTML = options.join('');
    select.value = App.state ? App.state.filter : 'all';
  };

  function updateHeaderStats() {
    const s = App.state;
    const st = App.deckStats();
    const total = st.total;
    const current = Math.min(s.currentIndex + 1, total);
    document.getElementById('roundIndicator').textContent = `${s.round}. Kör`;
    document.getElementById('progressCounter').textContent = `${current} / ${total} kérdés`;
    document.getElementById('knownCount').textContent = st.correct;
    document.getElementById('unknownCount').textContent = st.wrong;
    document.getElementById('progressBar').style.width = `${st.percent}%`;
    document.getElementById('quizFilter').value = s.filter;
  }

  const BTN_SECONDARY =
    'px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium transition';

  function backButton() {
    if (App.state.currentIndex <= 0) return '';
    return `<button data-action="back" title="Előző kártya (←)" class="${BTN_SECONDARY}">← Előző</button>`;
  }

  function tip(text) {
    return `<span class="text-xs text-slate-500 hidden sm:inline">${text}</span>`;
  }

  function renderCode(q) {
    if (!q.code) return '';
    return `
      <div class="mb-6 rounded-lg overflow-hidden border border-slate-700/80 bg-[#0d1322] shadow-inner">
        <div class="bg-slate-800/80 px-3.5 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-700/70 flex items-center justify-between">
          <span>python</span>
          <span>Kvíz #${q.quiz}</span>
        </div>
        <pre class="p-4 text-sm sm:text-[15px] text-emerald-300 overflow-x-auto leading-relaxed"><code>${esc(q.code)}</code></pre>
      </div>
    `;
  }

  function renderRadioBody(q, isEval) {
    const s = App.state;
    const res = App.result(q.id);
    // Régebbi mentésben nincs eltárolva, mit jelöltél: a helyes eredményhez a helyes választ mutatjuk.
    const shown = s.selectedOption !== null ? s.selectedOption : isEval && res && res.graded && res.ok ? q.correct : null;
    let html = '<div class="divide-y divide-slate-800 border-t border-b border-slate-800 my-4">';

    q.options.forEach((opt, idx) => {
      const isSelected = shown === idx;
      const isCorrect = q.correct === idx;

      let rowClass = 'option-row py-3.5 px-4 flex items-center justify-between gap-4 cursor-pointer ';
      let badgeHtml = '';

      if (isEval) {
        rowClass += 'disabled cursor-default ';
        if (isSelected && isCorrect) {
          rowClass += 'bg-emerald-950/30 border-l-4 border-emerald-500 ';
          badgeHtml = '<span class="canvas-badge canvas-badge-green">Helyes!</span>';
        } else if (isSelected && !isCorrect) {
          rowClass += 'bg-rose-950/35 border-l-4 border-rose-500 ';
          badgeHtml = '<span class="canvas-badge canvas-badge-red">Megadott válasz</span>';
        } else if (!isSelected && isCorrect) {
          rowClass += 'bg-slate-800/60 border-l-4 border-slate-300 ';
          badgeHtml = '<span class="canvas-badge canvas-badge-gray">Helyes válasz</span>';
        } else {
          rowClass += 'opacity-55 ';
        }
      } else if (isSelected) {
        rowClass += 'bg-indigo-950/40 border-l-4 border-indigo-500 ';
      }

      const action = isEval ? '' : `data-action="select" data-index="${idx}"`;

      html += `
        <div ${action} class="${rowClass}">
          <div class="flex items-start gap-3.5 min-w-0">
            <input type="radio" name="q_option" ${isSelected ? 'checked' : ''} ${isEval ? 'disabled' : ''}
              class="mt-1 w-4 h-4 text-indigo-500 bg-slate-800 border-slate-600 focus:ring-indigo-500 cursor-pointer" />
            <span class="mono text-sm sm:text-base text-slate-200 whitespace-pre-line break-words">${esc(opt)}</span>
          </div>
          <div class="shrink-0">${badgeHtml}</div>
        </div>
      `;
    });
    html += '</div>';

    if (isEval && q.explanation) {
      html += `
        <div class="mt-4 p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm leading-relaxed">
          <strong class="text-indigo-300">💡 Magyarázat:</strong> ${esc(q.explanation)}
        </div>
      `;
    }

    if (!isEval) {
      const disabled = s.selectedOption === null;
      html += `
        <div class="mt-6 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            ${backButton()}
            ${tip('1–4: válasz · Enter: ellenőrzés · ←: előző')}
          </div>
          <button data-action="evaluate" ${disabled ? 'disabled' : ''}
            class="shrink-0 px-6 py-2.5 rounded-lg font-semibold text-sm transition shadow-lg ${
              disabled
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }">
            Ellenőrzés
          </button>
        </div>
      `;
    } else {
      const ok = res && res.graded ? res.ok : shown === q.correct;
      html += `
        <div class="mt-6 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            ${backButton()}
            <span class="text-xs font-medium ${ok ? 'text-emerald-400' : 'text-rose-400'}">
              ${ok ? '✓ Helyes válasz!' : '✕ Hibás válasz! Újra előjön a következő körben.'}
            </span>
          </div>
          <button data-action="next" id="nextBtn"
            class="shrink-0 px-6 py-2.5 rounded-lg font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20">
            Következő →
          </button>
        </div>
      `;
    }
    return html;
  }

  function renderTextBody(q, isEval) {
    const s = App.state;
    let html = '';

    if (!isEval) {
      if (q.multiline) {
        html += `
          <textarea id="textInput" rows="4" placeholder="Írd be ide a megoldást / kódot..."
            class="w-full p-3.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">${esc(s.typedAnswer)}</textarea>
        `;
      } else {
        html += `
          <input id="textInput" type="text" placeholder="Írd be a választ..." value="${esc(s.typedAnswer)}"
            class="w-full p-3.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        `;
      }
      html += `
        <div class="mt-6 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            ${backButton()}
            ${tip(q.multiline ? 'Ctrl+Enter: megoldás' : 'Enter: megoldás')}
          </div>
          <button data-action="reveal"
            class="shrink-0 px-6 py-2.5 rounded-lg font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20">
            Tovább / Megoldás mutatása
          </button>
        </div>
      `;
      return html;
    }

    const reviewing = App.isGraded(q.id);
    const wasCorrect = reviewing && App.result(q.id).ok === true;

    html += `
      <div class="space-y-4 mt-4">
        <div class="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">A te általad beírt válasz:</div>
          <pre class="mono text-sm text-slate-200 whitespace-pre-wrap break-words">${esc(s.typedAnswer.trim() || '(Üresen hagyva)')}</pre>
        </div>

        <div class="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
          <div class="flex items-center justify-between mb-2">
            <span class="canvas-badge canvas-badge-green">Helyes válaszok</span>
          </div>
          <pre class="mono text-sm sm:text-base text-emerald-300 font-medium whitespace-pre-wrap break-words">${esc(q.answer)}</pre>
          ${q.explanation ? `<p class="mt-2 text-xs text-slate-300 border-t border-emerald-800/40 pt-2">💡 ${esc(q.explanation)}</p>` : ''}
        </div>
    `;

    if (!reviewing) {
      // első értékelés
      html += `
        <div class="pt-3 border-t border-slate-800 space-y-3">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span class="text-sm font-semibold text-slate-200">Helyes volt a válaszod?</span>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button data-action="grade" data-correct="false"
                class="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg font-semibold text-sm bg-rose-600/90 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/20">
                ✕ Nem <span class="hidden sm:inline opacity-70 font-normal">(Backspace)</span>
              </button>
              <button data-action="grade" data-correct="true"
                class="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20">
                ✓ Igen <span class="hidden sm:inline opacity-70 font-normal">(Enter)</span>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-3">
            ${backButton()}
            ${tip('Enter: helyes · Backspace: hibás · ←: előző')}
          </div>
        </div>
      </div>
      `;
    } else {
      // visszanézés: az értékelés megtartható vagy átírható
      html += `
        <div class="pt-3 border-t border-slate-800 space-y-3">
          <div class="text-sm text-slate-300">
            Eddigi értékelésed:
            <strong class="${wasCorrect ? 'text-emerald-400' : 'text-rose-400'}">${wasCorrect ? '✓ helyes' : '✕ hibás'}</strong>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              ${backButton()}
              <button data-action="grade" data-correct="false"
                class="px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  wasCorrect
                    ? 'border-rose-800/60 text-rose-300 hover:bg-rose-950/40'
                    : 'border-rose-500 bg-rose-950/50 text-rose-200'
                }">
                ✕ Hibás volt <span class="hidden sm:inline opacity-70 font-normal">(N)</span>
              </button>
              <button data-action="grade" data-correct="true"
                class="px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  wasCorrect
                    ? 'border-emerald-500 bg-emerald-950/50 text-emerald-200'
                    : 'border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/40'
                }">
                ✓ Helyes volt <span class="hidden sm:inline opacity-70 font-normal">(I)</span>
              </button>
            </div>
            <button data-action="next"
              class="px-6 py-2.5 rounded-lg font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20">
              Következő → <span class="hidden sm:inline opacity-70 font-normal">(Enter)</span>
            </button>
          </div>
        </div>
      </div>
      `;
    }
    return html;
  }

  function renderSummary(container) {
    const s = App.state;
    const st = App.deckStats();
    const hasErrors = st.wrong > 0;
    const totalKnown = st.correct;
    const currentErrors = st.wrong;

    container.innerHTML = `
      <div class="rounded-xl border border-slate-700/80 bg-slate-900/90 shadow-2xl p-6 sm:p-10 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl ${
          hasErrors
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }">
          ${hasErrors ? '🎯' : '🏆'}
        </div>

        <h2 class="text-2xl font-bold text-white mb-2">
          ${hasErrors ? `Vége a(z) ${s.round}. körnek!` : 'Gratulálok! Minden kérdést hibátlanul tudsz!'}
        </h2>
        <p class="text-slate-400 text-sm sm:text-base mb-6">
          ${
            hasErrors
              ? `Ebben a körben ${currentErrors} kérdést rontottál el. Indíts egy új kört csak a hibásakból, amíg mindegyik zöld nem lesz!`
              : 'Sikeresen végigmentél az összes kérdésen, és mindegyik a „Tudom” pakliba került.'
          }
        </p>

        <div class="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
            <div class="text-2xl font-bold text-emerald-400">${totalKnown}</div>
            <div class="text-xs text-slate-400 mt-1">Megtanult (Helyes)</div>
          </div>
          <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50">
            <div class="text-2xl font-bold text-rose-400">${currentErrors}</div>
            <div class="text-xs text-slate-400 mt-1">Javításra vár (Hibás)</div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3">
          ${
            hasErrors
              ? `<button data-action="retry"
                  class="px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30">
                  🔄 Új kör a hibásakból (${currentErrors} db) <span class="hidden sm:inline opacity-70 font-normal">(Enter)</span>
                </button>`
              : ''
          }
          <button data-action="restart-shuffled"
            class="px-5 py-3 rounded-xl font-semibold text-sm border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
            🔀 Teljes újrakezdés (Keverve)
          </button>
          ${
            s.deck.length > 0
              ? `<button data-action="back" class="px-5 py-3 rounded-xl font-semibold text-sm border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition">
                  ← Vissza az utolsó kérdéshez
                </button>`
              : ''
          }
        </div>
      </div>
    `;
  }

  App.render = function () {
    const s = App.state;
    updateHeaderStats();
    App.renderSidebar();
    App.applyLayout();
    const container = document.getElementById('quizContainer');

    // Ha vége az adott körnek -> összesítő képernyő
    if (s.currentIndex >= s.deck.length) {
      renderSummary(container);
      return;
    }

    const q = App.getCurrentQuestion();
    if (!q) return;

    const isEval = s.step === 'evaluated';

    let scoreText = 'Önellenőrzős';
    if (q.type === 'radio') {
      const r = App.result(q.id);
      const good = r && r.graded ? r.ok : s.selectedOption === q.correct;
      scoreText = isEval ? (good ? '1 / 1 pont' : '0 / 1 pont') : '1 pont';
    } else if (App.isGraded(q.id)) {
      scoreText = App.result(q.id).ok ? 'Önellenőrzős · ✓' : 'Önellenőrzős · ✕';
    }

    const body =
      `<div class="text-slate-100 text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line mb-4">${esc(q.prompt)}</div>` +
      renderCode(q) +
      (q.type === 'radio' ? renderRadioBody(q, isEval) : renderTextBody(q, isEval));

    container.innerHTML = `
      <div class="rounded-xl border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden">
        <!-- Canvas szürke fejléc -->
        <div class="bg-slate-800/90 border-b border-slate-700/80 px-5 py-3.5 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="font-bold text-slate-100 text-base">${q.num}. kérdés</span>
            <span class="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-medium">${q.quiz}. Kvíz</span>
          </div>
          <span class="text-xs sm:text-sm font-bold text-slate-300">${scoreText}</span>
        </div>

        <!-- Kártya belső tartalom -->
        <div class="p-5 sm:p-7">${body}</div>
      </div>
    `;

    // Fókusz a szövegmezőre beírós kérdéseknél
    if (q.type === 'text' && !isEval) {
      const inputEl = document.getElementById('textInput');
      if (inputEl) {
        inputEl.focus();
        // a kurzor a már beírt szöveg végére kerüljön
        const len = inputEl.value.length;
        inputEl.setSelectionRange(len, len);
      }
    }
  };
})((window.App = window.App || {}));
