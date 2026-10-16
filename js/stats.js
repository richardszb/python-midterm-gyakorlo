/* Számlálók az aktuális paklira (fejléc, oldalsáv, összesítő ebből dolgozik) */
(function (App) {
  'use strict';

  /**
   * total      a pakli mérete
   * correct    ebben a körben értékelt és helyes
   * wrong      ebben a körben értékelt és hibás
   * remaining  ebben a körben még nem értékelt
   * answered   correct + wrong, percent ennek aránya a paklihoz
   * byQuiz     ugyanez kvízenként
   */
  App.deckStats = function () {
    const s = App.state;
    const st = { total: s.deck.length, correct: 0, wrong: 0, remaining: 0, byQuiz: {} };

    s.deck.forEach((id) => {
      const q = App.questionsById[id];
      if (!q) return;
      const g =
        st.byQuiz[q.quiz] || (st.byQuiz[q.quiz] = { total: 0, correct: 0, wrong: 0, remaining: 0, answered: 0 });
      const r = s.results[id];
      g.total++;
      if (r && r.graded) {
        g.answered++;
        if (r.ok) {
          st.correct++;
          g.correct++;
        } else {
          st.wrong++;
          g.wrong++;
        }
      } else {
        st.remaining++;
        g.remaining++;
      }
    });

    st.answered = st.correct + st.wrong;
    st.percent = st.total ? Math.round((st.answered / st.total) * 100) : 0;
    return st;
  };
})((window.App = window.App || {}));
