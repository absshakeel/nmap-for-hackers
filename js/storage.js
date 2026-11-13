(function () {
  const KEYS = {
    progress: 'zta_nmap_progress',
    bookmarks: 'zta_nmap_bookmarks',
    quiz: 'zta_nmap_quiz',
    history: 'zta_nmap_history',
    theme: 'zta_nmap_theme'
  };

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function getBookmarks() { return load(KEYS.bookmarks, []); }
  function addBookmark(cmd) {
    const list = getBookmarks();
    if (!list.includes(cmd)) { list.unshift(cmd); save(KEYS.bookmarks, list.slice(0, 50)); }
    return getBookmarks();
  }
  function removeBookmark(cmd) {
    const list = getBookmarks().filter(c => c !== cmd);
    save(KEYS.bookmarks, list); return list;
  }

  function getHistory() { return load(KEYS.history, []); }
  function addHistory(cmd) {
    if (!cmd || cmd === 'nmap') return getHistory();
    let list = getHistory().filter(c => c !== cmd);
    list.unshift(cmd);
    list = list.slice(0, 15);
    save(KEYS.history, list);
    return list;
  }

  function getQuiz() { return load(KEYS.quiz, { answers: {}, score: 0, completed: {} }); }
  function saveQuiz(data) { save(KEYS.quiz, data); }

  function getProgress() { return load(KEYS.progress, { stages: [], labs: [], quizzes: 0 }); }
  function setProgress(data) { save(KEYS.progress, data); updateGlobalProgress(); }

  function markStage(id) {
    const p = getProgress();
    if (!p.stages.includes(id)) { p.stages.push(id); setProgress(p); }
  }
  function markLab(id) {
    const p = getProgress();
    if (!p.labs.includes(id)) { p.labs.push(id); setProgress(p); }
  }
  function setQuizProgress(count) {
    const p = getProgress();
    p.quizzes = count;
    setProgress(p);
  }

  function computeProgressPercent() {
    const p = getProgress();
    const total = 8 + 18 + 30; // stages + labs + quiz questions (approx tracking by answered)
    const done = (p.stages?.length || 0) + (p.labs?.length || 0) + (p.quizzes || 0);
    return Math.min(100, Math.round((done / total) * 100));
  }

  function updateGlobalProgress() {
    const pct = computeProgressPercent();
    const bar = document.getElementById('global-progress-bar');
    const text = document.getElementById('global-progress-text');
    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = pct + '%';
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard');
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('Copied to clipboard'); } catch (err) { toast('Copy failed'); }
      document.body.removeChild(ta);
      return false;
    }
  }

  function toast(msg) {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.remove(); }, 2500);
  }

  window.StorageAPI = {
    KEYS, load, save,
    getBookmarks, addBookmark, removeBookmark,
    getHistory, addHistory,
    getQuiz, saveQuiz,
    getProgress, setProgress, markStage, markLab, setQuizProgress,
    computeProgressPercent, updateGlobalProgress,
    copyText, toast
  };
})();