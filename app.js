// ============================================================
// app.js — Initialization, save/load, keyboard shortcuts
// ============================================================

// ── Save / Load ──────────────────────────────────────────────
function saveAnalysis() {
    const analysis = {
        heroRange: Array.from(heroRange),
        villainRange: Array.from(villainRange),
        boardCards: boardCards,
        deadCards: Array.from(deadCards),
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('pokerAnalysis', JSON.stringify(analysis));
    alert('✅ Analyse sauvegardée !');
}

function loadAnalysis() {
    const saved = localStorage.getItem('pokerAnalysis');
    if (!saved) { alert('Aucune analyse sauvegardée'); return; }

    const analysis = JSON.parse(saved);
    heroRange.clear();
    villainRange.clear();
    analysis.heroRange.forEach(h => heroRange.add(h));
    analysis.villainRange.forEach(h => villainRange.add(h));
    boardCards = analysis.boardCards || [];
    deadCards.clear();
    (analysis.deadCards || []).forEach(c => deadCards.add(c));

    // FIX: updateRangeDisplay is now defined in ui.js
    updateRangeDisplay('hero');
    updateRangeDisplay('villain');
    updateRangeInfo('hero');
    updateRangeInfo('villain');
    updateBoardDisplay();

    // Restore board card selections
    document.querySelectorAll('.card-btn').forEach(btn => {
        btn.classList.toggle('selected', boardCards.includes(btn.dataset.card));
    });

    // Restore dead card selections
    document.querySelectorAll('.dead-card-btn').forEach(btn => {
        btn.classList.toggle('selected', deadCards.has(btn.textContent));
    });

    analyzeRanges();
    alert('✅ Analyse restaurée !');
}

// ── Keyboard Shortcuts ───────────────────────────────────────
function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            if (heroRange.size > 0 || villainRange.size > 0) analyzeRanges();
        }
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            clearRange('hero');
            clearRange('villain');
        }
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            clearBoard();
        }
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            clearDeadCards();
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveAnalysis();
        }
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            loadAnalysis();
        }
        if (e.key === 'Escape') {
            clearAllHighlights('hero');
            clearAllHighlights('villain');
        }
    });
}

// ── Global Init ──────────────────────────────────────────────
window.onload = function () {
    loadTheme();
    initRangeMatrix('heroMatrix', 'hero');
    initRangeMatrix('villainMatrix', 'villain');
    initBoardSelector();
    initDeadCards();
    initKeyboardShortcuts();
    initEquityWorker();
    initSpecificHandSelector('hero');
    initSpecificHandSelector('villain');
    initMultiStreetFilters();
    updateBoardDisplay();
};
