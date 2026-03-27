// ============================================================
// ui.js — DOM manipulation, charts, events, highlights
// ============================================================

// ── State ────────────────────────────────────────────────────
let heroRange = new Set();
let villainRange = new Set();
let boardCards = [];
let deadCards = new Set();
let isDragging = false;
let dragMode = null;
let currentPlayer = null;
let currentStats = { hero: null, villain: null };
let activeFilters = {
    hero: { flop: new Set(), turn: new Set(), river: new Set() },
    villain: { flop: new Set(), turn: new Set(), river: new Set() }
};
let activeHighlight = { hero: [], villain: [] };
let specificHand = { hero: null, villain: null };
let equityWorker = null;
// Chart instances — explicitly declared to avoid collision with id='heroChart' canvas element
let heroChart = null;
let villainChart = null;
// Blocker state: when active, the player's specific hand cards are excluded from the opponent's range
let blockerActive = { hero: false, villain: false };
// Chart sort mode per player: 'natural' or 'percent'
let chartSortMode = { hero: 'natural', villain: 'natural' };
// Collapsible section state for exact hand mode stats
let exactHandCollapsed = {
    hero: { preflop: false, postflop: false, blocker: false, outs: false },
    villain: { preflop: false, postflop: false, blocker: false, outs: false }
};

function getCurrentStreet() {
    if (boardCards.length <= 3) return 'flop';
    if (boardCards.length === 4) return 'turn';
    if (boardCards.length === 5) return 'river';
    return 'flop';
}

// ── Loading ──────────────────────────────────────────────────
function showLoading(text = "Calcul en cours...") {
    const overlay = document.getElementById('loadingOverlay');
    document.querySelector('.loading-text').textContent = text;
    overlay.classList.add('show');
}

function updateProgress(current, total) {
    document.getElementById('loadingProgress').textContent = `${current} / ${total}`;
    document.getElementById('progressBarFill').style.width = ((current / total) * 100) + '%';
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

// ── Range Matrix ─────────────────────────────────────────────
function initRangeMatrix(matrixId, player) {
    const matrix = document.getElementById(matrixId);
    matrix.innerHTML = '';

    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 13; j++) {
            const cell = document.createElement('div');
            cell.className = 'range-cell';

            let hand = '', type = '';
            if (i === j) {
                hand = RANKS[i] + RANKS[i];
                type = 'pair';
            } else if (j > i) {
                hand = RANKS[i] + RANKS[j] + 's';
                type = 'suited';
            } else {
                hand = RANKS[j] + RANKS[i] + 'o';
                type = 'offsuit';
            }

            cell.textContent = hand;
            cell.dataset.hand = hand;
            cell.dataset.player = player;
            cell.classList.add(type);

            cell.addEventListener('mousedown', () => {
                isDragging = true;
                currentPlayer = player;
                const range = player === 'hero' ? heroRange : villainRange;
                dragMode = range.has(hand) ? 'deselect' : 'select';
                toggleRangeCell(hand, cell, player);
            });

            cell.addEventListener('mouseenter', () => {
                if (isDragging && currentPlayer === player) {
                    const range = player === 'hero' ? heroRange : villainRange;
                    if (dragMode === 'select' && !range.has(hand)) toggleRangeCell(hand, cell, player);
                    else if (dragMode === 'deselect' && range.has(hand)) toggleRangeCell(hand, cell, player);
                }
            });

            matrix.appendChild(cell);
        }
    }
}

document.addEventListener('mouseup', () => {
    isDragging = false;
    currentPlayer = null;
    dragMode = null;
});

function toggleRangeCell(hand, cell, player) {
    const range = player === 'hero' ? heroRange : villainRange;
    if (range.has(hand)) {
        range.delete(hand);
        cell.classList.remove('selected');
    } else {
        range.add(hand);
        cell.classList.add('selected');
    }
    updateRangeInfo(player);
    updateSlider(player);
    updateRangeChart(player);
    analyzeRanges();
    refreshHotnessIfActive(player);
}

function updateRangeInfo(player) {
    // Use blocker-aware dead cards so the combo count reflects the opponent's blocker
    const effectiveDead = Array.from(getBlockerDeadCards(player));
    const totalCombos = getFilteredRangeCombos(player, effectiveDead).length;

    const percent = ((totalCombos / 1326) * 100).toFixed(1);
    document.getElementById(`${player}Combos`).textContent = totalCombos;
    document.getElementById(`${player}Percent`).textContent = percent + '%';
}

function updateSlider(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    const percent = (range.size / 169 * 100).toFixed(0);
    document.getElementById(`${player}Slider`).value = percent;
    document.getElementById(`${player}SliderValue`).textContent = percent + '%';
}

function updateRangeBySlider(player, value) {
    document.getElementById(`${player}SliderValue`).textContent = value + '%';
    const range = player === 'hero' ? heroRange : villainRange;
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';

    range.clear();

    // Strict 100% check to ensure all hands are included
    const isMax = parseInt(value) === 100;
    const targetCount = isMax ? ALL_HANDS_SORTED.length : Math.round((value / 100) * 169);

    for (let i = 0; i < targetCount && i < ALL_HANDS_SORTED.length; i++) {
        range.add(ALL_HANDS_SORTED[i]);
    }
    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        cell.classList.toggle('selected', range.has(cell.dataset.hand));
    });
    updateRangeInfo(player);
    updateRangeChart(player);
    analyzeRanges();
    refreshHotnessIfActive(player);
}


// ── Mode Selection ───────────────────────────────────────────
function setMode(player, mode) {
    const matrixSection = document.getElementById(`${player}MatrixSection`);
    const handSection = document.getElementById(`${player}SpecificHand`);
    const rangeBtn = document.getElementById(`${player}ModeRange`);
    const handBtn = document.getElementById(`${player}ModeHand`);
    const sliderContainer = document.querySelector(
        player === 'hero' ? '.hero-section .range-slider-container' : '.villain-section .range-slider-container'
    );

    if (mode === 'range') {
        matrixSection.style.display = 'block';
        handSection.style.display = 'none';
        rangeBtn.classList.add('active');
        handBtn.classList.remove('active');
        if (sliderContainer) sliderContainer.style.display = 'block';
        specificHand[player] = null;
        // Clear the specific hand selection visually
        const handGrid = document.getElementById(`${player}HandGrid`);
        if (handGrid) handGrid.querySelectorAll('.card-btn.selected').forEach(b => b.classList.remove('selected'));
        const handDisplay = document.getElementById(`${player}HandDisplay`);
        if (handDisplay) handDisplay.innerHTML = '<span style="color:var(--text-faint);">Sélectionnez 2 cartes</span>';
        analyzeRanges();
    } else { // mode === 'hand'
        matrixSection.style.display = 'none';
        handSection.style.display = 'block';
        rangeBtn.classList.remove('active');
        handBtn.classList.add('active');
        if (sliderContainer) sliderContainer.style.display = 'none';
    }
}

function selectPresetRange(player, preset) {
    const range = player === 'hero' ? heroRange : villainRange;
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
    const hands = RANGE_PRESETS[preset] || [];

    // Visual feedback for preset buttons
    // Find the button that triggered this (if possible) or just clear all others
    const buttons = document.querySelectorAll(player === 'hero' ? '.hero-section .range-controls .btn' : '.villain-section .range-controls .btn');
    let clickedBtn = null;

    // Attempt to find the clicked button by text content or onclick attribute if passed
    // Since we don't pass the event, we iterate to clear others.
    // We will assume the user wants to toggle: if all hands in preset are already in range, remove them. Else add them.

    // Check if preset is already fully in range
    const allIn = hands.every(h => range.has(h));

    if (allIn) {
        // Toggle OFF: remove hands
        hands.forEach(h => range.delete(h));
        // Remove active class from this preset button
        // (We can't easily identify the specific button without passing 'this' or event. 
        // For now, we'll clear all active states if we can't identify it, or we rely on the user re-clicking)
    } else {
        // Toggle ON: add hands
        hands.forEach(h => range.add(h));
    }

    // Refresh visual state of buttons based on range content
    // This is complex because multiple presets might overlap. 
    // We will just do a simple "Active" effect on the clicked button if we could identify it. 
    // better: Let's change the function signature in HTML to pass 'this'

    updateRangeDisplay(player); // This handles the matrix cells
    updateRangeInfo(player);
    updateSlider(player);
    updateRangeChart(player);
    analyzeRanges();
    refreshHotnessIfActive(player);
}


function selectPositionRange(player, position) {
    const range = player === 'hero' ? heroRange : villainRange;
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';

    // Check custom ranges first, then default presets
    let hands = [];
    if (customRanges[position]) {
        hands = customRanges[position];
    } else {
        hands = POSITION_PRESETS[position] || [];
    }

    // Clear and Set behavior for positions
    range.clear();
    hands.forEach(hand => range.add(hand));

    // Visual update
    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        cell.classList.toggle('selected', range.has(cell.dataset.hand));
    });

    updateRangeInfo(player);
    updateSlider(player);
    updateRangeChart(player);
    analyzeRanges();
    refreshHotnessIfActive(player);
}

function clearRange(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
    range.clear();
    document.querySelectorAll(`#${matrixId} .range-cell.selected`).forEach(cell => cell.classList.remove('selected'));

    // Clear active filters
    activeFilters[player].flop.clear();
    activeFilters[player].turn.clear();
    activeFilters[player].river.clear();

    // Clear active highlights
    activeHighlight[player] = [];

    // Clear Specific Hand if active
    specificHand[player] = null;
    const handGrid = document.getElementById(`${player}HandGrid`);
    if (handGrid) {
        handGrid.querySelectorAll('.card-btn.selected').forEach(btn => btn.classList.remove('selected'));
    }
    const handDisplay = document.getElementById(`${player}HandDisplay`);
    if (handDisplay) {
        handDisplay.innerHTML = '<span style="color:var(--text-faint);">Sélectionnez 2 cartes</span>';
    }

    updateRangeDisplay(player);
    updateRangeInfo(player);
    updateSlider(player);
    updateRangeChart(player);
    updateCombosDisplay(player);
    updateMultipleHighlights(player);
    analyzeRanges();
    refreshHotnessIfActive(player);
}

function clearAll() {
    clearRange('hero');
    clearRange('villain');
    clearBoard();
    clearDeadCards();

    // Reset charts if initialized
    if (heroChart) heroChart.destroy();
    if (villainChart) villainChart.destroy();
    heroChart = null;
    villainChart = null;

    // Refresh stats UI to clear existing numbers
    document.getElementById('heroStats').innerHTML = '<div style="padding: 10px; text-align: center; color: var(--text-faint);">Sélectionnez une range et un board</div>';
    document.getElementById('villainStats').innerHTML = '<div style="padding: 10px; text-align: center; color: var(--text-faint);">Sélectionnez une range et un board</div>';
    document.getElementById('heroEquity').textContent = '-%';
    document.getElementById('villainEquity').textContent = '-%';
    document.getElementById('heroEquityBar').style.width = '50%';
    document.getElementById('villainEquityBar').style.width = '50%';
}

// FIX: Added missing updateRangeDisplay function (was causing crash on load)
function updateRangeDisplay(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
    const globalBlockedArr = Array.from(getGlobalBlockedCards());

    let hasFilters = false;
    for (const st of ['flop', 'turn', 'river']) {
        if (activeFilters[player][st].size > 0) hasFilters = true;
    }

    const filteredHands = new Set();
    if (hasFilters) {
        range.forEach(hand => {
            const combos = handToCombosOptimized(hand, globalBlockedArr);
            const surviving = applyProgressiveFilters(player, combos);
            if (surviving.length > 0) filteredHands.add(hand);
        });
    }

    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        const hand = cell.dataset.hand;
        const isSelected = range.has(hand);
        const isFiltered = filteredHands.has(hand);

        cell.classList.toggle('selected', isSelected);

        const remainingCombos = getCombosCount(hand, globalBlockedArr);
        cell.classList.toggle('blocked-cell', remainingCombos === 0);

        // Visual feedback for filtering
        if (hasFilters) {
            if (isSelected && !isFiltered) {
                cell.classList.add('filtered-out');
            } else {
                cell.classList.remove('filtered-out');
            }
        } else {
            cell.classList.remove('filtered-out');
        }
    });
    updateSlider(player);
}

// ── Board Functions ──────────────────────────────────────────
function initBoardSelector() {
    SUIT_NAMES.forEach((suitName, suitIdx) => {
        const container = document.getElementById(suitName);
        container.innerHTML = '';
        RANKS.forEach(rank => {
            const card = rank + SUITS[suitIdx];
            const btn = document.createElement('button');
            btn.className = `card-btn ${suitName}`;
            btn.textContent = rank;
            btn.dataset.card = card;
            if (deadCards.has(card)) btn.classList.add('disabled');
            btn.onclick = () => {
                if (deadCards.has(card)) return;
                toggleBoardCard(card, btn);
            };
            container.appendChild(btn);
        });
    });
}

function getGlobalBlockedCards(excludeContext = null) {
    const blocked = new Set();
    if (excludeContext !== 'dead') {
        deadCards.forEach(c => blocked.add(c));
    }
    if (excludeContext !== 'board') {
        boardCards.forEach(c => blocked.add(c));
    }
    if (excludeContext !== 'hero' && specificHand['hero']) {
        specificHand['hero'].forEach(c => blocked.add(c));
    }
    if (excludeContext !== 'villain' && specificHand['villain']) {
        specificHand['villain'].forEach(c => blocked.add(c));
    }
    return blocked;
}

function updateSpecificHandSelectors() {
    ['hero', 'villain'].forEach(player => {
        const blocked = getGlobalBlockedCards(player);
        const grid = document.getElementById(`${player}HandGrid`);
        if (grid) {
            grid.querySelectorAll('.card-btn').forEach(btn => {
                if (btn.dataset.card) {
                    btn.classList.toggle('disabled', blocked.has(btn.dataset.card));
                }
            });
        }
    });
}

function toggleBoardCard(card, btn) {
    const index = boardCards.indexOf(card);
    if (index !== -1) {
        boardCards.splice(index, 1);
        btn.classList.remove('selected');
    } else if (boardCards.length < 5) {
        const globalBlocked = getGlobalBlockedCards('board');
        if (globalBlocked.has(card)) {
            alert('Cette carte est déjà utilisée (morte ou main spécifique) !');
            return;
        }
        boardCards.push(card);
        btn.classList.add('selected');
    }
    updateBoardDisplay();
    updateSpecificHandSelectors();
    updateRangeInfo('hero');
    updateRangeInfo('villain');
    analyzeRanges();
    refreshAllHotnessIfActive();
}

let boardHistory = []; // Tracks the maximum sequential board state for backward/forward navigation

function updateBoardDisplay() {
    const display = document.getElementById('boardDisplay');
    const boardBlocked = getGlobalBlockedCards('board');

    // Check if the current board Cards break from the history.
    // E.g. user manually adds a new card or clears the board.
    let isHistoryValid = true;
    for (let i = 0; i < boardCards.length; i++) {
        if (boardHistory[i] !== boardCards[i]) {
            isHistoryValid = false;
            break;
        }
    }

    if (!isHistoryValid || boardCards.length === 0) {
        // Only reset history if user deviates or clears board manually
        boardHistory = [...boardCards];
    } else if (boardCards.length > boardHistory.length) {
        boardHistory = [...boardCards];
    }

    if (boardCards.length === 0) {
        display.innerHTML = '<div style="color: #ccc; font-size: 14px;">Sélectionnez les cartes du board</div>';
        document.getElementById('boardTexture').style.display = 'none';

        document.querySelectorAll('.board-selector-organized .card-btn, .card-selector-organized .card-btn').forEach(btn => {
            if (btn.dataset.card) {
                btn.classList.toggle('disabled', boardBlocked.has(btn.dataset.card));
                btn.classList.toggle('selected', boardCards.includes(btn.dataset.card));
            }
        });
        return;
    }
    display.innerHTML = boardCards.map((card, index) => {
        const isRed = card.includes('♥') || card.includes('♦');
        return `<div class="board-card" style="color: ${isRed ? '#e57373' : '#333'}" onclick="removeBoardCard(${index})">${card}</div>`;
    }).join('');

    // Update selectors visual state
    document.querySelectorAll('.board-selector-organized .card-btn, .card-selector-organized .card-btn').forEach(btn => {
        if (btn.dataset.card) {
            btn.classList.toggle('disabled', boardBlocked.has(btn.dataset.card));
            btn.classList.toggle('selected', boardCards.includes(btn.dataset.card));
        }
    });

    if (boardCards.length >= 3) {
        const analysis = analyzeBoardTexture(boardCards);
        const textureDiv = document.getElementById('boardTexture');
        if (analysis && analysis.length > 0) {
            textureDiv.innerHTML = '<div style="font-weight: 600; margin-bottom: 4px; color: var(--text-secondary);">Texture:</div>' + analysis.join(' • ');
            textureDiv.style.display = 'block';
        } else {
            textureDiv.style.display = 'none';
        }
    } else {
        document.getElementById('boardTexture').style.display = 'none';
    }

    // Refresh Navigation Arrows
    const prevArrow = document.getElementById('boardArrowPrev');
    const nextArrow = document.getElementById('boardArrowNext');
    if (prevArrow && nextArrow) {
        if (boardCards.length >= 3) {
            prevArrow.classList.remove('disabled');
        } else {
            prevArrow.classList.add('disabled');
        }

        if (boardHistory.length > boardCards.length && boardCards.length >= 3) {
            nextArrow.classList.remove('disabled');
        } else {
            nextArrow.classList.add('disabled');
        }
    }

    updateMultiStreetUI();
}

function stepBackBoard() {
    if (boardCards.length <= 3) return; // Can't go back further than flop (or empty)

    if (boardCards.length === 4) {
        // Turn -> Flop
        boardCards = boardCards.slice(0, 3);
    } else if (boardCards.length === 5) {
        // River -> Turn
        boardCards = boardCards.slice(0, 4);
    }

    updateBoardDisplay();
    updateRangeInfo('hero');
    updateRangeInfo('villain');
    analyzeRanges();
    refreshAllHotnessIfActive();
}

function stepForwardBoard() {
    if (boardCards.length < 3 || boardCards.length >= 5) return;
    if (boardHistory.length <= boardCards.length) return; // No forward history

    if (boardCards.length === 3) {
        // Flop -> Turn
        boardCards = boardHistory.slice(0, 4);
    } else if (boardCards.length === 4) {
        // Turn -> River
        boardCards = boardHistory.slice(0, 5);
    }

    updateBoardDisplay();
    updateRangeInfo('hero');
    updateRangeInfo('villain');
    analyzeRanges();
    refreshAllHotnessIfActive();
}

function removeBoardCard(index) {
    const card = boardCards[index];
    boardCards.splice(index, 1);
    document.querySelectorAll('.card-btn').forEach(btn => {
        if (btn.dataset.card === card) btn.classList.remove('selected');
    });
    updateBoardDisplay();
    updateSpecificHandSelectors();
    updateRangeInfo('hero');
    updateRangeInfo('villain');
    analyzeRanges();
    refreshAllHotnessIfActive();
}

function clearBoard() {
    boardCards = [];
    document.querySelectorAll('.card-btn.selected').forEach(btn => {
        // Only untoggle board selector cards here; leave dead/specific ones alone if present in other grids
        // A safer way is specifically the board selector:
        if (btn.closest('.card-selector-organized')) btn.classList.remove('selected');
    });
    updateBoardDisplay();
    updateSpecificHandSelectors();
    updateRangeInfo('hero');
    updateRangeInfo('villain');
    analyzeRanges();
    refreshAllHotnessIfActive();
}

// ── Dead Cards ───────────────────────────────────────────────
// ── Unified Card Selector Helper ─────────────────────────────
function createCardSelector(containerId, onClickCallback, selectedCheckCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    container.className = 'unified-card-selector'; // Use unified class defined in CSS

    SUIT_NAMES.forEach((suitName, suitIdx) => {
        const group = document.createElement('div');
        group.className = 'suit-group';

        const title = document.createElement('div');
        title.className = `suit-title ${suitName}`;
        title.textContent = SUITS[suitIdx];
        group.appendChild(title);

        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'suit-cards';

        RANKS.forEach(rank => {
            const card = rank + SUITS[suitIdx];
            const btn = document.createElement('button');
            btn.className = `card-btn ${suitName}`;
            btn.textContent = rank;
            btn.dataset.card = card;

            // Check selection state
            if (selectedCheckCallback && selectedCheckCallback(card)) {
                btn.classList.add('selected');
            }

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                onClickCallback(card, btn);
            };
            cardsDiv.appendChild(btn);
        });

        group.appendChild(cardsDiv);
        container.appendChild(group);
    });
}

function initDeadCards() {
    createCardSelector('deadCardsGrid', toggleDeadCard, (card) => deadCards.has(card));
}

function toggleDeadCard(card, btn) {
    if (deadCards.has(card)) {
        deadCards.delete(card);
        btn.classList.remove('selected');
    } else {
        const globalBlocked = getGlobalBlockedCards('dead');
        if (globalBlocked.has(card)) {
            alert('Cette carte est déjà utilisée (board ou main spécifique) !');
            return;
        }
        deadCards.add(card);
        btn.classList.add('selected');
    }
    updateDeadCardsCount();
    updateBoardDisplay(); // Refresh selectors to grey out cards
    updateSpecificHandSelectors();
    updateRangeInfo('hero');
    updateRangeInfo('villain');
    analyzeRanges();
}

function clearDeadCards() {
    deadCards.clear();
    // Clear selections in the grid
    const grid = document.getElementById('deadCardsGrid');
    if (grid) {
        grid.querySelectorAll('.card-btn.selected').forEach(btn => btn.classList.remove('selected'));
    }
    updateDeadCardsCount();
    updateBoardDisplay(); // Refresh selector
    updateRangeInfo('hero');
    updateRangeInfo('villain');
    analyzeRanges();
}

function updateDeadCardsCount() {
    const el = document.getElementById('deadCardsCount');
    if (el) {
        if (deadCards.size > 0) {
            const cardsStr = Array.from(deadCards).join(', ');
            el.textContent = `${deadCards.size}: ${cardsStr}`;
        } else {
            el.textContent = '0';
        }
    }
}

function addHandToDeadCards(player) {
    const cards = specificHand[player];
    if (!cards || cards.length !== 2) {
        alert('Veuillez d\'abord sélectionner 2 cartes.');
        return;
    }

    let addedCount = 0;
    cards.forEach(card => {
        if (boardCards.includes(card)) {
            console.warn(`La carte ${card} est déjà sur le board.`);
            return;
        }
        if (!deadCards.has(card)) {
            deadCards.add(card);
            addedCount++;
        }
    });

    if (addedCount > 0) {
        // Update dead cards grid UI if it exists
        const grid = document.getElementById('deadCardsGrid');
        if (grid) {
            grid.querySelectorAll('.card-btn').forEach(btn => {
                if (deadCards.has(btn.dataset.card)) {
                    btn.classList.add('selected');
                }
            });
        }

        updateDeadCardsCount();
        updateRangeInfo('hero');
        updateRangeInfo('villain');
        analyzeRanges();
    } else {
        alert('Ces cartes sont déjà dans les cartes mortes ou sur le board.');
    }
}

// ── Blocker System ───────────────────────────────────────────
// Returns a dead-card Set for player's range calculation:
// includes standard dead cards + opponent's specific hand IF their blocker is active.
function getBlockerDeadCards(player) {
    const opponent = player === 'hero' ? 'villain' : 'hero';
    const effective = new Set([...boardCards, ...deadCards]);
    if (blockerActive[opponent] && specificHand[opponent] && specificHand[opponent].length === 2) {
        specificHand[opponent].forEach(c => effective.add(c));
    }
    return effective;
}

// Toggle the blocker on/off for a player and recalculate
function toggleBlocker(player) {
    blockerActive[player] = !blockerActive[player];

    const checkbox = document.getElementById(`${player}BlockerCheckbox`);
    if (checkbox) checkbox.checked = blockerActive[player];

    const label = document.getElementById(`${player}BlockerLabel`);
    if (label) {
        label.style.color = blockerActive[player] ? 'var(--hero-color)' : 'var(--text-secondary)';
        label.style.fontWeight = blockerActive[player] ? '700' : '400';
    }

    // Recalculate everything with the new blocker state
    analyzeRanges();
}

// ── Statistics ───────────────────────────────────────────────
function analyzeRanges() {
    analyzeRange('hero');
    analyzeRange('villain');
    calculateEquity();
}

function analyzeRange(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    if (boardCards.length < 3) clearHighlight(player);
    const isSpecific = specificHand[player] && specificHand[player].length === 2;
    const specificCombo = isSpecific ? specificHand[player] : null;

    // Build dead cards set for this player's stats:
    // include opponent's blocker cards so their combos are excluded from this player's range stats
    const effectiveDead = getBlockerDeadCards(player);
    const stats = calculateRealRangeStats(range, boardCards, effectiveDead, specificCombo);
    currentStats[player] = stats;
    displayStats(player, stats);
    updateRangeChart(player);
    if (activeHighlight[player] && activeHighlight[player].length > 0) refreshHighlight(player);
}


function displayStats(player, stats) {
    const statsDiv = document.getElementById(`${player}Stats`);
    if (!stats) return;

    const isExactHand = specificHand[player] && specificHand[player].length === 2;

    if (isExactHand) {
        // ── Exact Hand Mode: collapsible layout ──────────────────
        const collapsed = exactHandCollapsed[player];
        let html = '';

        // ── AVANT LE FLOP (collapsible) ───────────────────────────
        const pfArrow = collapsed.preflop ? '▶' : '▼';
        html += `<div class="exact-hand-section-header preflop collapsible-header" onclick="toggleExactHandSection('${player}','preflop')">🃏 AVANT LE FLOP <span class="collapse-arrow">${pfArrow}</span></div>`;
        if (!collapsed.preflop) {
            const preflop = calcPreflopProbabilities(specificHand[player]);
            const preflopKeys = ['pair', 'twopair', 'trips', 'fullhouse', 'straight', 'flush', 'flushdraw', 'oesd', 'gutshot', 'nothing'];
            const preflopLabels = {
                pair: '🥇 Paire',
                twopair: '👥 Deux Paires',
                trips: '🎯 Brelan',
                fullhouse: '🏠 Full',
                straight: '📈 Suite',
                flush: '💧 Couleur',
                flushdraw: '🌊 Tirage Couleur',
                oesd: '➡️ Tirage OESD',
                gutshot: '🎲 Gutshot',
                nothing: '❌ Rien'
            };
            const preflopColors = {
                pair: STAT_COLORS.toppair,
                twopair: STAT_COLORS.twopair,
                trips: STAT_COLORS.trips,
                fullhouse: STAT_COLORS.fullhouse,
                straight: STAT_COLORS.straight,
                flush: STAT_COLORS.flush,
                flushdraw: STAT_COLORS.flushdraw,
                oesd: STAT_COLORS.oesd,
                gutshot: STAT_COLORS.gutshot,
                nothing: STAT_COLORS.nothing
            };
            preflopKeys.forEach(key => {
                const pct = preflop[key] || 0;
                if (pct <= 0) return;
                const color = preflopColors[key];
                html += `<div class="stat-row" data-statkey="${key}">`;
                html += `<div class="stat-cell stat-label" style="padding-left:8px">${preflopLabels[key]}</div>`;
                html += `<div class="stat-cell">`;
                html += `  <div class="stat-bar-container">`;
                html += `    <div class="stat-bar">`;
                html += `      <div class="stat-bar-fill" style="width: ${pct}%; background-color: ${color};"></div>`;
                html += `    </div>`;
                html += `    <span class="stat-percent-text">${pct}%</span>`;
                html += `  </div>`;
                html += `</div>`;
                html += '</div>';
            });
        }

        // ── APRÈS LE FLOP (collapsible) ───────────────────────────
        if (boardCards.length >= 3) {
            const pfArrow2 = collapsed.postflop ? '▶' : '▼';
            html += `<div class="exact-hand-section-header postflop collapsible-header" onclick="toggleExactHandSection('${player}','postflop')">🎯 APRÈS LE FLOP <span class="collapse-arrow">${pfArrow2}</span></div>`;
            if (!collapsed.postflop) {
                const statKeys = ['straightflush', 'quads', 'fullhouse', 'flush', 'straight', 'trips',
                    'twopair', 'overpair', 'toppair', 'middlepair', 'bottompair', 'weakpair',
                    'flushdraw', 'oesd', 'gutshot', 'backdoorflush', 'nothing',
                    'hauteurA', 'hauteurK', 'hauteurQ', 'hauteurJ', 'hauteurT',
                    'hauteur9', 'hauteur8', 'hauteur7', 'hauteur6', 'hauteur5', 'hauteur4', 'hauteur3', 'hauteur2'];
                const street = getCurrentStreet();
                let hauteurSeparatorAdded = false;
                statKeys.forEach(key => {
                    const value = stats[key];
                    if (!value) return;
                    const pct = parseFloat(value.percent);
                    if (pct <= 0) return;
                    const color = STAT_COLORS[key];
                    const isFiltered = activeFilters[player][street].has(key);
                    // Add separator before first hauteur row
                    if (key.startsWith('hauteur') && !hauteurSeparatorAdded) {
                        hauteurSeparatorAdded = true;
                        html += `<div style="font-size:10px;color:var(--text-secondary);padding:4px 8px 2px;opacity:0.7;letter-spacing:0.5px;border-top:1px solid var(--border-color,#2a3a4a);margin-top:4px;">── HAUTEURS ──</div>`;
                    }
                    html += `<div class="stat-row" data-statkey="${key}">`;
                    html += `<div class="stat-cell filter-cell" style="width:30px;border-right:none;" onclick="event.stopPropagation();toggleFilter('${player}','${key}')" title="Filtrer">`;
                    html += `<span class="filter-icon ${isFiltered ? 'active' : ''}">⚡</span>`;
                    html += `</div>`;
                    html += `<div class="stat-cell stat-label" onclick="showCombos('${player}','${key}','${STAT_LABELS[key]}')">${STAT_ICONS[key]} ${STAT_LABELS[key]}</div>`;
                    html += `<div class="stat-cell">`;
                    html += `  <div class="stat-bar-container">`;
                    html += `    <div class="stat-bar">`;
                    html += `      <div class="stat-bar-fill" style="width:${pct}%;background-color:${color};"></div>`;
                    html += `    </div>`;
                    html += `    <span class="stat-percent-text">${pct}%</span>`;
                    html += `  </div>`;
                    html += `</div>`;
                    html += '</div>';
                });
            }

            // ── OUTS SECTION (collapsible) ──────────────────────
            if (boardCards.length >= 5) {
                // River — no more cards to come
                html += `<div class="exact-hand-section-header outs">🎯 OUTS — <span style="font-weight:400;font-size:10px;opacity:0.75;">River posée, aucune carte à venir</span></div>`;
            } else {
                const outsArrow = collapsed.outs ? '▶' : '▼';
                const outs = calculateHandOuts(specificHand[player], boardCards);
                const streetNext = boardCards.length === 3 ? 'turn' : 'river';
                const outsLabel = outs.length > 0 ? `(${outs.length} outs vers ${streetNext})` : '(aucun out)';
                html += `<div class="exact-hand-section-header outs collapsible-header" onclick="toggleExactHandSection('${player}','outs')">🎯 OUTS ${outsLabel} <span class="collapse-arrow">${outsArrow}</span></div>`;
                if (!collapsed.outs) {
                    if (outs.length === 0) {
                        html += `<div style="padding:8px 12px;font-size:12px;color:var(--text-secondary);">Aucun out détecté — la main est déjà au maximum ou ne peut pas s'améliorer à la ${streetNext}.</div>`;
                    } else {
                        html += `<div class="outs-panel">`;
                        // Group by improvement category
                        const byCategory = {};
                        outs.forEach(out => {
                            if (!byCategory[out.newCategory]) byCategory[out.newCategory] = [];
                            byCategory[out.newCategory].push(out);
                        });
                        // Display best categories first
                        const catOrder = ['straightflush', 'quads', 'fullhouse', 'flush', 'straight', 'trips', 'twopair', 'overpair', 'toppair', 'middlepair', 'bottompair', 'weakpair', 'flushdraw', 'oesd', 'gutshot'];
                        catOrder.forEach(cat => {
                            if (!byCategory[cat]) return;
                            const catOuts = byCategory[cat];
                            const color = STAT_COLORS[cat] || '#888';
                            html += `<div style="margin-bottom:6px;">`;
                            html += `<div style="font-size:10px;font-weight:700;color:${color};margin-bottom:3px;letter-spacing:0.5px;">${STAT_ICONS[cat] || ''} ${STAT_LABELS[cat] || cat} (${catOuts.length})</div>`;
                            html += `<div style="display:flex;flex-wrap:wrap;gap:3px;">`;
                            catOuts.forEach(out => {
                                const isRed = out.card.includes('♥') || out.card.includes('♦');
                                html += `<span class="mini-card-inline ${isRed ? 'red' : 'black'}" style="border:1px solid ${color};">${out.card}</span>`;
                            });
                            html += `</div></div>`;
                        });
                        html += `</div>`;
                    }
                }
            }
        }

        // ── SECTION BLOQUEUR (collapsible) ───────────────────────
        html += displayBlockerSection(player, collapsed.blocker);

        statsDiv.innerHTML = html;
        updateStatRowStyles(player);
        return;
    }

    // ── Normal Range Mode ─────────────────────────────────────────
    let html = '<div class="stat-row stat-header">';
    html += '<div class="stat-cell" style="width: 30px; border-right: none;"></div>'; // Filter column
    html += '<div class="stat-cell">Main</div>';
    html += '<div class="stat-cell">Combos</div>';
    html += '<div class="stat-cell">%</div>';
    html += '</div>';

    const statKeys = ['straightflush', 'quads', 'fullhouse', 'flush', 'straight', 'trips',
        'twopair', 'overpair', 'toppair', 'middlepair', 'bottompair', 'weakpair',
        'flushdraw', 'oesd', 'gutshot', 'backdoorflush', 'nothing',
        'hauteurA', 'hauteurK', 'hauteurQ', 'hauteurJ', 'hauteurT',
        'hauteur9', 'hauteur8', 'hauteur7', 'hauteur6', 'hauteur5', 'hauteur4', 'hauteur3', 'hauteur2'];

    let sortedStats = statKeys.map(k => [k, stats[k]]).filter(([, v]) => v && v.combos > 0);

    if (chartSortMode[player] === 'percent') {
        sortedStats.sort((a, b) => parseFloat(b[1].percent) - parseFloat(a[1].percent));
    }


    let hauteurSepAddedRange = false;
    sortedStats.forEach(([key, value]) => {
        if (!value) return;
        const color = STAT_COLORS[key];
        const isFiltered = activeFilters[player][getCurrentStreet()].has(key);
        // Add visual separator before first hauteur key (robust against any sort order)
        if (key.startsWith('hauteur') && !hauteurSepAddedRange) {
            hauteurSepAddedRange = true;
            html += `<div style="font-size:10px;color:var(--text-secondary);padding:4px 8px 2px;opacity:0.7;letter-spacing:0.5px;border-top:1px solid var(--border-color,#2a3a4a);margin-top:4px;">── HAUTEURS ──</div>`;
        }
        html += `<div class="stat-row" data-statkey="${key}">`;

        // Filter Icon
        html += `<div class="stat-cell filter-cell" style="width: 30px; border-right: none;" onclick="event.stopPropagation(); toggleFilter('${player}', '${key}')" title="Filtrer la range">`;
        html += `<span class="filter-icon ${isFiltered ? 'active' : ''}">⚡</span>`;
        html += `</div>`;

        html += `<div class="stat-cell stat-label" onclick="showCombos('${player}', '${key}', '${STAT_LABELS[key]}')"> ${STAT_ICONS[key]} ${STAT_LABELS[key]}</div>`;
        html += `<div class="stat-cell stat-value" onclick="showCombos('${player}', '${key}', '${STAT_LABELS[key]}')"> ${value.combos}</div>`;
        html += `<div class="stat-cell">`;
        html += `  <div class="stat-bar-container">`;
        html += `    <div class="stat-bar">`;
        html += `      <div class="stat-bar-fill" style="width: ${value.percent}%; background-color: ${color};"></div>`;
        html += `    </div>`;
        html += `    <span class="stat-percent-text">${value.percent}%</span>`;
        html += `  </div>`;
        html += `</div>`;
        html += '</div>';
    });

    statsDiv.innerHTML = html;
    updateStatRowStyles(player);
}

// ── Hand Outs Calculator ─────────────────────────────────────
// Returns category rank for sorting (higher = better)
const CATEGORY_RANK = {
    nothing: 0, gutshot: 1, oesd: 2, flushdraw: 3,
    weakpair: 4, bottompair: 5, middlepair: 6, toppair: 7,
    overpair: 8, twopair: 9, trips: 10, straight: 11,
    flush: 12, fullhouse: 13, quads: 14, straightflush: 15
};

function getCatRank(cat) {
    return CATEGORY_RANK[cat] || 0;
}

function calculateHandOuts(holeCards, board) {
    // Only makes sense on flop (3) or turn (4) — no more cards come on river
    if (!holeCards || holeCards.length !== 2 || board.length < 3 || board.length >= 5) return [];

    const allDead = new Set([...board, ...Array.from(deadCards)]);
    holeCards.forEach(c => allDead.add(c));

    // Determine current hand category
    const currentBest = getBestHand([...holeCards, ...board]);
    const currentCat = getCategoryFromHand(holeCards, board, currentBest);
    const currentRank = getCatRank(currentCat);

    const remainingDeck = createDeck().filter(c => !allDead.has(c));
    const outs = [];

    for (const card of remainingDeck) {
        // Add one more card (turn or river)
        const newBoard = [...board, card];
        const newBest = getBestHand([...holeCards, ...newBoard]);
        const newCat = getCategoryFromHand(holeCards, newBoard, newBest);
        const newRank = getCatRank(newCat);

        if (newRank > currentRank) {
            outs.push({
                card,
                newCategory: newCat,
                improvement: newRank - currentRank
            });
        }
    }

    // Sort by improvement (best first), then by card rank
    outs.sort((a, b) =>
        b.improvement !== a.improvement
            ? b.improvement - a.improvement
            : (RANK_VALUES[b.card[0]] || 0) - (RANK_VALUES[a.card[0]] || 0)
    );
    return outs;
}

// ── Pre-flop probability calculator for exact hand mode ─────────
// Simulates all possible flop combinations for a given 2-card hand
function calcPreflopProbabilities(holeCards) {
    const [c1, c2] = holeCards;
    const deck = createDeck().filter(c => c !== c1 && c !== c2);
    const result = { pair: 0, twopair: 0, trips: 0, fullhouse: 0, straight: 0, flush: 0, flushdraw: 0, oesd: 0, gutshot: 0, nothing: 0 };
    let total = 0;

    // Iterate over all C(50, 3) = 19,600 flop combinations
    for (let i = 0; i < deck.length - 2; i++) {
        for (let j = i + 1; j < deck.length - 1; j++) {
            for (let k = j + 1; k < deck.length; k++) {
                const board = [deck[i], deck[j], deck[k]];
                const allCards = [c1, c2, ...board];
                const best = getBestHand(allCards);
                const draws = analyzeDraws([c1, c2], board);
                total++;

                // Primary category (rank 9=SF, 8=Quads, 7=FH, 6=Flush, 5=Straight, 4=Trips, 3=TwoPair, 2=Pair, 1=Nothing)
                let primary = 'nothing';
                switch (best.rank) {
                    case 9: primary = 'straight'; break;  // SF: use straight bucket (ultra-rare on flop)
                    case 8: primary = 'trips'; break;     // Quads: use trips bucket (ultra-rare on flop)
                    case 7: primary = 'fullhouse'; break; // Full house
                    case 6: primary = 'flush'; break;
                    case 5: primary = 'straight'; break;
                    case 4: primary = 'trips'; break;
                    case 3: primary = 'twopair'; break;
                    case 2: primary = 'pair'; break;
                    case 1: primary = 'nothing'; break;
                }

                if (primary !== 'nothing') {
                    result[primary]++;
                } else if (draws.flushDraw) {
                    result.flushdraw++;
                } else if (draws.oesd) {
                    result.oesd++;
                } else if (draws.gutshot) {
                    result.gutshot++;
                } else {
                    result.nothing++;
                }
            }
        }
    }

    // Convert to percentages
    const out = {};
    for (const k of Object.keys(result)) {
        out[k] = total > 0 ? parseFloat(((result[k] / total) * 100).toFixed(1)) : 0;
    }
    return out;
}

// ── Blocker Section HTML builder ──────────────────────────────────
function displayBlockerSection(player, isCollapsed) {
    const myCards = specificHand[player];
    if (!myCards || myCards.length !== 2) return '';

    const opponent = player === 'hero' ? 'villain' : 'hero';
    const oppRange = opponent === 'hero' ? heroRange : villainRange;
    if (oppRange.size === 0) return '';

    const [card1, card2] = myCards;
    const allDead = [...boardCards, ...Array.from(deadCards)];

    // Find blocked combos in opponent's range
    const blockedHands = [];
    let totalBlockedCombos = 0;
    let totalOppCombos = 0;

    oppRange.forEach(hand => {
        const allCombos = handToCombos(hand, []);
        const availCombos = handToCombos(hand, allDead);
        const blockedCombos = availCombos.filter(combo =>
            combo.includes(card1) || combo.includes(card2)
        );
        totalOppCombos += availCombos.length;
        if (blockedCombos.length > 0) {
            totalBlockedCombos += blockedCombos.length;
            blockedHands.push({ hand, blocked: blockedCombos.length, total: allCombos.length });
        }
    });

    if (blockedHands.length === 0) return '';

    const blockPct = totalOppCombos > 0 ? ((totalBlockedCombos / totalOppCombos) * 100).toFixed(1) : 0;
    const arrow = isCollapsed ? '▶' : '▼';

    let html = `<div class="exact-hand-section-header blocker collapsible-header" onclick="toggleExactHandSection('${player}','blocker')">🔒 BLOQUEUR <span class="collapse-arrow">${arrow}</span></div>`;
    if (!isCollapsed) {
        html += `<div class="blocker-summary">`;
        html += `  <span>Tu bloques <strong>${totalBlockedCombos}</strong> combos`;
        html += `  (<strong>${blockPct}%</strong> de la range adverse)</span>`;
        html += `  <br><small style="opacity:0.7">Cartes bloquantes : `;
        const isRed1 = card1.includes('♥') || card1.includes('♦');
        const isRed2 = card2.includes('♥') || card2.includes('♦');
        html += `<span class="mini-card-inline ${isRed1 ? 'red' : 'black'}">${card1}</span> `;
        html += `<span class="mini-card-inline ${isRed2 ? 'red' : 'black'}">${card2}</span></small>`;
        html += `</div>`;

        html += '<div class="blocker-hands-grid">';
        // Sort by most blocked combos first
        blockedHands.sort((a, b) => b.blocked - a.blocked);
        blockedHands.forEach(({ hand, blocked, total }) => {
            html += `<span class="blocker-hand-badge" title="${blocked}/${total} combos bloqués">`;
            html += `${hand} <small>(${blocked})</small>`;
            html += `</span>`;
        });
        html += '</div>';
    }

    return html;
}

// ── Toggle collapsible sections in exact hand mode ────────────────
function toggleExactHandSection(player, section) {
    exactHandCollapsed[player][section] = !exactHandCollapsed[player][section];
    if (currentStats[player]) displayStats(player, currentStats[player]);
}

function showCombos(player, statKey, statLabel) {
    const stats = currentStats[player];
    if (!stats || boardCards.length < 3) { alert('Ajoutez un board pour voir les combos'); return; }
    const hands = stats[statKey].hands;
    if (hands.length === 0) { alert('Aucun combo pour cette main'); return; }

    const activeStats = activeHighlight[player];
    const existingIndex = activeStats.findIndex(s => s.statKey === statKey);
    if (existingIndex !== -1) { activeStats.splice(existingIndex, 1); }
    else { activeStats.push({ statKey, statLabel, hands }); }

    updateMultipleHighlights(player);
    updateCombosDisplay(player);
    updateStatRowStyles(player);
}

function updateStatRowStyles(player) {
    const statsDiv = document.getElementById(`${player}Stats`);
    const activeKeys = new Set(activeHighlight[player].map(s => s.statKey));
    const street = getCurrentStreet();
    statsDiv.querySelectorAll('.stat-row:not(.stat-header)').forEach(row => {
        row.classList.toggle('active', activeKeys.has(row.getAttribute('data-statkey')));
        const filterIcon = row.querySelector('.filter-icon');
        if (filterIcon) {
            filterIcon.classList.toggle('active', activeFilters[player][street].has(row.getAttribute('data-statkey')));
        }
    });
}

function toggleFilter(player, statKey) {
    if (boardCards.length < 3) return; // Prevent filters when no board

    const street = getCurrentStreet();
    if (activeFilters[player][street].has(statKey)) {
        activeFilters[player][street].delete(statKey);
    } else {
        activeFilters[player][street].add(statKey);
    }
    updateStatRowStyles(player);
    updateCombosDisplay(player);
    updateRangeInfo(player);
    updateRangeDisplay(player);
    calculateEquity();
    refreshHotnessIfActive(player);
}

function clearFilters(player) {
    activeFilters[player].flop.clear();
    activeFilters[player].turn.clear();
    activeFilters[player].river.clear();
    updateStatRowStyles(player);
    updateCombosDisplay(player);
    updateRangeInfo(player);
    updateRangeDisplay(player);
    calculateEquity();
    refreshHotnessIfActive(player);
}

function applyFilters(player) {
}

function getFilteredRangeHands(player) {
    let hasAnyFilter = false;
    for (const st of ['flop', 'turn', 'river']) {
        if (activeFilters[player][st].size > 0) hasAnyFilter = true;
    }

    // We do not evaluate FilteredRangeHands strings. Flopzilla natively maps
    // exact combos. String mapping is dead under progressive rendering.
    return [];
}

function evaluateComboCategories(combo, boardSubset) {
    const allCards = [...combo, ...boardSubset];
    const bestHand = getBestHand(allCards);
    const categories = [];

    switch (bestHand.rank) {
        case 9: categories.push('straightflush'); break;
        case 8: categories.push('quads'); break;
        case 7: categories.push('fullhouse'); break;
        case 6: categories.push('flush'); break;
        case 5: categories.push('straight'); break;
        case 4: categories.push('trips'); break;
        case 3: categories.push('twopair'); break;
        case 2: categories.push(classifyPairType(combo, boardSubset) || 'weakpair'); break;
        case 1: categories.push('nothing'); break;
    }

    const draws = analyzeDraws(combo, boardSubset);
    if (draws.flushDraw) categories.push('flushdraw');
    if (draws.oesd) categories.push('oesd');
    if (draws.gutshot) categories.push('gutshot');
    if (draws.backdoorFlush) categories.push('backdoorflush');

    // Remove "nothing" if we have real draws (not just backdoor)
    const hasRealDraw = categories.some(c => c !== 'nothing' && c !== 'backdoorflush');
    if (categories.includes('nothing') && hasRealDraw) {
        categories.splice(categories.indexOf('nothing'), 1);
    }
    if (categories.length === 0) categories.push('nothing');

    // Hauteur: classify pure nothing hands by highest hole card rank
    if (categories.length === 1 && categories[0] === 'nothing' && boardSubset.length >= 3) {
        const v1 = RANK_VALUES[combo[0][0]], v2 = RANK_VALUES[combo[1][0]];
        const topRank = v1 >= v2 ? combo[0][0] : combo[1][0];
        const hauteurKey = RANK_TO_HAUTEUR[topRank];
        if (hauteurKey) categories.push(hauteurKey);
    }

    return categories;
}

function applyProgressiveFilters(player, initialCombos) {
    let combos = [...initialCombos];
    if (boardCards.length < 3) return combos;

    const filters = activeFilters[player];

    // 1. FLOP (0..3)
    if (filters.flop.size > 0) {
        const flopBoard = boardCards.slice(0, 3);
        combos = combos.filter(c => {
            const cats = evaluateComboCategories(c, flopBoard);
            return cats.some(cat => filters.flop.has(cat));
        });
    }

    // 2. TURN (0..4)
    if (filters.turn.size > 0 && boardCards.length >= 4) {
        const turnBoard = boardCards.slice(0, 4);
        combos = combos.filter(c => {
            const cats = evaluateComboCategories(c, turnBoard);
            return cats.some(cat => filters.turn.has(cat));
        });
    }

    // 3. RIVER (0..5)
    if (filters.river.size > 0 && boardCards.length === 5) {
        const riverBoard = boardCards.slice(0, 5);
        combos = combos.filter(c => {
            const cats = evaluateComboCategories(c, riverBoard);
            return cats.some(cat => filters.river.has(cat));
        });
    }

    return combos;
}

function getFilteredRangeCombos(player, deadCardsList = []) {
    const baseRange = player === 'hero' ? heroRange : villainRange;
    const isSpecific = specificHand[player] && specificHand[player].length === 2;

    let baseCombos = [];

    if (isSpecific) {
        const combo = specificHand[player];
        if (!deadCardsList.includes(combo[0]) && !deadCardsList.includes(combo[1])) {
            baseCombos = [combo];
        }
    } else {
        baseRange.forEach(hand => baseCombos.push(...handToCombos(hand, deadCardsList)));
    }

    return applyProgressiveFilters(player, baseCombos);
}

function updateMultipleHighlights(player) {
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
    const activeStats = activeHighlight[player];

    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        cell.className = cell.className.split(' ').filter(c => !c.startsWith('highlight-') && !c.startsWith('color-')).join(' ');
        cell.style.background = '';
        cell.style.color = '';
        cell.style.fontWeight = '';
        cell.style.zIndex = '';
        cell.style.boxShadow = '';
        cell.style.textShadow = '';
    });

    if (activeStats.length === 0) return;

    const handToStats = new Map();
    activeStats.forEach(({ statKey, hands }) => {
        hands.forEach(hand => {
            if (!handToStats.has(hand)) handToStats.set(hand, []);
            handToStats.get(hand).push(statKey);
        });
    });

    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        const stats = handToStats.get(cell.dataset.hand);
        if (!stats || stats.length === 0) return;
        const colors = stats.map(s => STAT_COLORS[s]);
        let gradient;
        if (colors.length === 1) gradient = colors[0];
        else if (colors.length === 2) gradient = `linear-gradient(90deg, ${colors[0]} 50%, ${colors[1]} 50%)`;
        else if (colors.length === 3) gradient = `linear-gradient(90deg, ${colors[0]} 33.33%, ${colors[1]} 33.33% 66.66%, ${colors[2]} 66.66%)`;
        else {
            const pct = 100 / colors.length;
            const stops = colors.map((c, i) => `${c} ${i * pct}% ${(i + 1) * pct}%`).join(', ');
            gradient = `linear-gradient(90deg, ${stops})`;
        }
        cell.style.background = gradient;
        cell.style.color = 'white';
        cell.style.fontWeight = '700';
        cell.style.zIndex = '10';
        cell.style.textShadow = '0 1px 2px rgba(0,0,0,0.6)';
    });
}

function updateCombosDisplay(player) {
    const displayDiv = document.getElementById(`${player}CombosDisplay`);
    const activeStats = activeHighlight[player];

    let hasAnyFilter = false;
    for (const st of ['flop', 'turn', 'river']) {
        if (activeFilters[player][st].size > 0) hasAnyFilter = true;
    }

    if (activeStats.length === 0 && !hasAnyFilter) {
        displayDiv.classList.remove('show');
        displayDiv.dataset.currentStat = '';
        return;
    }

    let html = '<div class="selected-stats-menu">';
    html += '<div class="selected-stats-header">';

    let filterCount = activeFilters[player].flop.size + activeFilters[player].turn.size + activeFilters[player].river.size;
    const totalActive = activeStats.length + filterCount;

    html += `<div class="selected-stats-title">${totalActive} élément(s) actif(s)</div>`;

    html += '<div style="display:flex; gap:8px;">';
    if (hasAnyFilter) {
        html += `<button class="combos-close" style="background:#666;" onclick="clearFilters('${player}')">Effacer filtres</button>`;
    }
    if (activeStats.length > 0) {
        html += `<button class="combos-close" onclick="clearAllHighlights('${player}')">Tout effacer</button>`;
    }
    html += '</div>';
    html += '</div>';

    if (hasAnyFilter) {
        let activeLabels = [];
        for (const st of ['flop', 'turn', 'river']) {
            activeFilters[player][st].forEach(f => activeLabels.push(`${st.toUpperCase()}:${STAT_LABELS[f]}`));
        }

        html += '<div class="filter-summary" style="margin-bottom: 12px; font-size: 11px; color: var(--text-secondary); line-height: 1.4;">';
        html += '<strong>Filtres:</strong> ' + activeLabels.join(', ');
        html += '</div>';
    }

    activeStats.forEach(({ statKey, statLabel, hands }) => {
        const stats = currentStats[player];
        const color = STAT_COLORS[statKey];
        html += `<div class="stat-item-card" onclick="expandStatDetail('${player}', '${statKey}')" style="border-left: 4px solid ${color};">`;
        html += `<div class="stat-item-header">`;
        html += `  <div class="stat-item-label">${statLabel}</div>`;
        html += `  <div class="stat-item-info">${hands.length} mains, ${stats[statKey].combos} combos</div>`;
        html += `</div></div>`;
    });
    html += '</div>';
    html += `<div id="${player}StatDetail" class="combos-display" style="margin-top: 10px;"></div>`;

    displayDiv.innerHTML = html;
    displayDiv.classList.add('show');
}

function expandStatDetail(player, statKey) {
    const detailDiv = document.getElementById(player + 'StatDetail');
    const stats = currentStats[player];
    const activeStat = activeHighlight[player].find(s => s.statKey === statKey);
    if (!activeStat) return;

    if (detailDiv.dataset.currentStat === statKey && detailDiv.classList.contains('show')) {
        detailDiv.classList.remove('show');
        detailDiv.dataset.currentStat = '';
        return;
    }

    let html = '<div class="combos-header">';
    html += `<div class="combos-title">${STAT_LABELS_EMOJI[statKey]}</div>`;
    html += `<button class="combos-close" onclick="closeStatDetail('${player}')">Fermer</button>`;
    html += '</div>';

    html += '<div class="stat-detail-tabs">';
    html += `<button class="stat-detail-tab active" onclick="switchDetailTab('${player}', 'combos')">Combos</button>`;
    if (['flushdraw', 'oesd', 'gutshot'].includes(statKey)) {
        html += `<button class="stat-detail-tab" onclick="switchDetailTab('${player}', 'outs')">Outs</button>`;
    }
    html += '</div>';

    html += `<div class="stat-detail-content active" id="${player}DetailCombos">`;
    html += '<div class="combos-grid">';
    activeStat.hands.forEach(hand => {
        const combos = handToCombosOptimized(hand, boardCards);
        combos.forEach(combo => {
            const allCards = [...combo, ...boardCards];
            const bestHand = getBestHand(allCards);
            if (getCategoryFromHand(combo, boardCards, bestHand) === statKey) {
                html += '<div class="combo-card-item">';
                html += `<div class="combo-hand-label">${hand}</div>`;
                html += '<div class="combo-cards">';
                combo.forEach(card => {
                    const isRed = card.includes('♥') || card.includes('♦');
                    html += `<div class="mini-card ${isRed ? 'red' : 'black'}">${card}</div>`;
                });
                html += '</div></div>';
            }
        });
    });
    html += '</div></div>';

    if (['flushdraw', 'oesd', 'gutshot'].includes(statKey)) {
        html += `<div class="stat-detail-content" id="${player}DetailOuts">`;
        html += generateOutsDisplay(statKey, boardCards);
        html += '</div>';
    }

    detailDiv.innerHTML = html;
    detailDiv.classList.add('show');
    detailDiv.dataset.currentStat = statKey;
}

function generateOutsDisplay(statKey, board) {
    const allDead = new Set([...board, ...Array.from(deadCards)]);

    if (statKey === 'flushdraw') {
        const suitCounts = {};
        board.forEach(card => { const suit = card[1]; suitCounts[suit] = (suitCounts[suit] || 0) + 1; });
        let maxCount = 0, drawSuit = null;
        Object.entries(suitCounts).forEach(([suit, count]) => { if (count > maxCount) { maxCount = count; drawSuit = suit; } });

        if (drawSuit && maxCount >= 2) {
            const outs = createDeck().filter(c => c[1] === drawSuit && !allDead.has(c));
            if (outs.length === 0) return '<div style="padding: 15px; text-align: center; color: var(--text-muted);">Aucun out détecté pour ce tirage couleur.</div>';
            let html = '<div style="padding: 10px;">';
            html += `<div style="font-weight: 600; margin-bottom: 10px; font-size: 12px;">Cartes qui améliorent (${outs.length} outs) :</div>`;
            html += '<div class="outs-container">';
            outs.forEach(card => {
                const isRed = card.includes('♥') || card.includes('♦');
                html += `<div class="out-card ${isRed ? 'red' : 'black'}">${card}</div>`;
            });
            html += '</div></div>';
            return html;
        }
        return '<div style="padding: 15px; text-align: center; color: var(--text-muted);">Aucun out détecté pour ce tirage couleur.</div>';
    } else if (statKey === 'oesd') {
        return '<div style="padding: 15px; text-align: center; color: var(--text-muted);">Les outs varient selon la main (généralement 8 outs). Consultez les combos pour voir les détails.</div>';
    } else if (statKey === 'gutshot') {
        return '<div style="padding: 15px; text-align: center; color: var(--text-muted);">Les outs varient selon la main (généralement 4 outs). Consultez les combos pour voir les détails.</div>';
    }
    return '<div style="padding: 15px; text-align: center; color: var(--text-muted);">Pas d\'outs pour cette statistique.</div>';
}

function switchDetailTab(player, tab) {
    const combosTab = document.querySelector(`#${player}StatDetail .stat-detail-tab:nth-child(1)`);
    const outsTab = document.querySelector(`#${player}StatDetail .stat-detail-tab:nth-child(2)`);
    const combosContent = document.getElementById(player + 'DetailCombos');
    const outsContent = document.getElementById(player + 'DetailOuts');

    if (tab === 'combos') {
        combosTab.classList.add('active');
        if (outsTab) outsTab.classList.remove('active');
        combosContent.classList.add('active');
        if (outsContent) outsContent.classList.remove('active');
    } else {
        if (combosTab) combosTab.classList.remove('active');
        if (outsTab) outsTab.classList.add('active');
        if (combosContent) combosContent.classList.remove('active');
        if (outsContent) outsContent.classList.add('active');
    }
}

function closeStatDetail(player) {
    const detailDiv = document.getElementById(player + 'StatDetail');
    detailDiv.classList.remove('show');
    detailDiv.dataset.currentStat = '';
}

function clearAllHighlights(player) {
    activeHighlight[player] = [];
    updateMultipleHighlights(player);
    updateCombosDisplay(player);
    updateStatRowStyles(player);
}

function refreshHighlight(player) {
    const activeStats = activeHighlight[player];
    if (!activeStats || activeStats.length === 0) return;
    const stats = currentStats[player];
    if (!stats) return;
    activeStats.forEach(active => {
        if (stats[active.statKey]) active.hands = stats[active.statKey].hands;
    });
    updateMultipleHighlights(player);
    updateCombosDisplay(player);
}

function clearHighlight(player) {
    activeHighlight[player] = [];
    updateMultipleHighlights(player);
    updateCombosDisplay(player);
    updateStatRowStyles(player);
}

function closeCombosDisplay(player) { clearHighlight(player); }

function closeModal(event) {
    if (!event || event.target.id === 'comboModal') {
        document.getElementById('comboModal').style.display = 'none';
    }
}

// ── Chart ────────────────────────────────────────────────────
function toggleChartSort(player) {
    chartSortMode[player] = chartSortMode[player] === 'natural' ? 'percent' : 'natural';
    const btn = document.getElementById(`${player}ChartSortBtn`);
    if (btn) {
        btn.classList.toggle('active', chartSortMode[player] === 'percent');
    }
    // Only re-render the stats list — chart order is irrelevant for a doughnut
    if (currentStats[player]) displayStats(player, currentStats[player]);
}

// Update chart data in-place when sort mode changes (avoids destroy+recreate crash)
function refreshChartSort(player) {
    const stats = currentStats[player];
    if (!stats) return;

    const existingChart = player === 'hero' ? heroChart : villainChart;
    if (!existingChart) return; // No chart to update yet

    const naturalOrder = ['gutshot', 'oesd', 'flushdraw', 'nothing',
        'weakpair', 'bottompair', 'middlepair', 'toppair', 'overpair',
        'twopair', 'trips', 'straight', 'flush', 'fullhouse', 'quads', 'straightflush'];

    let activeStats = naturalOrder
        .map(k => [k, stats[k]])
        .filter(([, v]) => v && v.combos > 0);

    if (chartSortMode[player] === 'percent') {
        activeStats.sort((a, b) => b[1].combos - a[1].combos);
    }

    if (activeStats.length === 0) return;

    // Mutate the existing chart data instead of recreating
    existingChart.data.labels = activeStats.map(([key]) => STAT_LABELS[key]);
    existingChart.data.datasets[0].data = activeStats.map(([, v]) => v.combos);
    existingChart.data.datasets[0].backgroundColor = activeStats.map(([key]) => STAT_COLORS[key]);
    existingChart.update('none'); // 'none' = no animation for instant update
}

function updateRangeChart(player) {
    const stats = currentStats[player];
    if (!stats) return;

    // Natural order keys (from draws to strongest hands)
    const naturalOrder = ['gutshot', 'oesd', 'flushdraw', 'nothing',
        'weakpair', 'bottompair', 'middlepair', 'toppair', 'overpair',
        'twopair', 'trips', 'straight', 'flush', 'fullhouse', 'quads', 'straightflush'];

    let activeStats = naturalOrder
        .map(k => [k, stats[k]])
        .filter(([, v]) => v && v.combos > 0);

    if (chartSortMode[player] === 'percent') {
        activeStats.sort((a, b) => b[1].combos - a[1].combos);
    }

    if (activeStats.length === 0) return;

    const ctx = document.getElementById(`${player}Chart`);
    if (player === 'hero' && heroChart instanceof Chart) heroChart.destroy();
    if (player === 'villain' && villainChart instanceof Chart) villainChart.destroy();

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: activeStats.map(([key]) => STAT_LABELS[key]),
            datasets: [{
                data: activeStats.map(([, v]) => v.combos),
                backgroundColor: activeStats.map(([key]) => STAT_COLORS[key])
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 10 }, padding: 8, color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() } },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            return `${context.label}: ${context.parsed} combos (${((context.parsed / total) * 100).toFixed(1)}%)`;
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    const statKey = activeStats[idx][0];
                    showCombos(player, statKey, STAT_LABELS[statKey]);
                }
            }
        }
    });

    if (player === 'hero') heroChart = chart;
    else villainChart = chart;
}

// FIX: switchStatsTab now receives event explicitly
function switchStatsTab(evt, player, tab) {
    const section = player === 'hero' ? '.hero-section' : '.villain-section';
    document.querySelectorAll(`${section} .stats-tab`).forEach(t => t.classList.remove('active'));
    document.querySelectorAll(`${section} .stats-content`).forEach(c => c.classList.remove('active'));
    evt.target.classList.add('active');
    document.getElementById(`${player}${tab === 'stats' ? 'Stats' : 'Graph'}Content`).classList.add('active');
}

// ── Equity Calculation ───────────────────────────────────────
let useWorker = false;
let equityCalcId = 0; // to cancel outdated calculations

function initEquityWorker() {
    // Web Workers cannot load scripts from file:// URLs (browser security restriction).
    // Detect this upfront so we never attempt the Worker on local file protocol.
    if (window.location.protocol === 'file:') {
        console.warn('Equity: file:// protocol detected — using main thread (no Web Worker).');
        equityWorker = null;
        useWorker = false;
        return;
    }
    try {
        equityWorker = new Worker('equity-worker.js');
        equityWorker.onerror = function (err) {
            console.warn('Worker error, falling back to main thread', err);
            equityWorker = null;
            useWorker = false;
            // Retry the calculation on the main thread now that the Worker has failed
            const iters = (heroRange.size === 1 && villainRange.size === 1) ? 5000 : 2000;
            calculateEquityMainThread(iters);
        };
        equityWorker.onmessage = function (e) {
            const data = e.data;
            if (data.type === 'progress') return;
            // Only display result if it matches the latest calculation request
            if (data.type === 'result' && data.calcId === equityCalcId) {
                displayEquityResult(data.range1, data.range2);
            }
        };
        useWorker = true;
        console.log('Equity: using Web Worker');
    } catch (e) {
        console.warn('Cannot create Worker, using main thread', e);
        equityWorker = null;
        useWorker = false;
    }
}


function displayEquityResult(eq1, eq2) {
    document.getElementById('heroEquity').textContent = eq1.toFixed(1) + '%';
    document.getElementById('villainEquity').textContent = eq2.toFixed(1) + '%';
    document.getElementById('heroEquityBar').style.width = eq1 + '%';
    document.getElementById('heroEquityBar').textContent = eq1.toFixed(1) + '%';
    document.getElementById('villainEquityBar').style.width = eq2 + '%';
    document.getElementById('villainEquityBar').textContent = eq2.toFixed(1) + '%';
    suggestAction(eq1);
}

function calculateEquity() {
    const heroSpecific = specificHand['hero'] && specificHand['hero'].length === 2;
    const villainSpecific = specificHand['villain'] && specificHand['villain'].length === 2;

    if ((heroRange.size === 0 && !heroSpecific) || (villainRange.size === 0 && !villainSpecific)) {
        document.getElementById('heroEquity').textContent = '-%';
        document.getElementById('villainEquity').textContent = '-%';
        document.getElementById('heroEquityBar').style.width = '50%';
        document.getElementById('heroEquityBar').textContent = '50%';
        document.getElementById('villainEquityBar').style.width = '50%';
        document.getElementById('villainEquityBar').textContent = '50%';
        document.getElementById('actionSuggestion').style.display = 'none';
        return;
    }

    const iterations = heroRange.size === 1 && villainRange.size === 1 ? 5000 : 2000;

    // Build per-player dead card lists that include the opponent's blocker cards
    const heroDeadInfo = Array.from(getBlockerDeadCards('hero'));
    const villainDeadInfo = Array.from(getBlockerDeadCards('villain'));

    if (useWorker && equityWorker) {
        equityCalcId++; // Increment before posting so onmessage can match it
        equityWorker.postMessage({
            heroCombos: getFilteredRangeCombos('hero', heroDeadInfo),
            villainCombos: getFilteredRangeCombos('villain', villainDeadInfo),
            board: boardCards,
            deadCards: Array.from(deadCards),
            iterations: iterations,
            calcId: equityCalcId
        });
    } else {
        calculateEquityMainThread(iterations);
    }
}

// ── Main-thread fallback (async chunked to keep UI responsive) ──
function calculateEquityMainThread(iterations) {
    equityCalcId++;
    const calcId = equityCalcId;

    // Use blocker-aware dead cards for each player's combo pool
    const heroDeadArr = Array.from(getBlockerDeadCards('hero'));
    const villainDeadArr = Array.from(getBlockerDeadCards('villain'));
    // Build base deck from the union of all dead cards (board + global dead)
    const allDeadSet = new Set([...boardCards, ...deadCards]);

    const range1Combos = getFilteredRangeCombos('hero', heroDeadArr);
    const range2Combos = getFilteredRangeCombos('villain', villainDeadArr);

    if (range1Combos.length === 0 || range2Combos.length === 0) {
        // Reset equity display — don't show 0% vs 100%, show --%
        document.getElementById('heroEquity').textContent = '-%';
        document.getElementById('villainEquity').textContent = '-%';
        document.getElementById('heroEquityBar').style.width = '50%';
        document.getElementById('heroEquityBar').textContent = '50%';
        document.getElementById('villainEquityBar').style.width = '50%';
        document.getElementById('villainEquityBar').textContent = '50%';
        document.getElementById('actionSuggestion').style.display = 'none';
        return;
    }

    const baseDeck = createDeck().filter(c => !allDeadSet.has(c));
    let wins1 = 0, wins2 = 0, ties = 0, valid = 0;
    let attempt = 0;
    const maxAttempts = iterations * 2;
    const chunkSize = 200; // iterations per setTimeout chunk

    function runChunk() {
        if (calcId !== equityCalcId) return; // cancelled by newer calc

        const chunkEnd = Math.min(attempt + chunkSize * 2, maxAttempts);

        while (attempt < chunkEnd && valid < iterations) {
            attempt++;
            const combo1 = range1Combos[Math.floor(Math.random() * range1Combos.length)];
            const combo2 = range2Combos[Math.floor(Math.random() * range2Combos.length)];

            const usedCards = new Set([...combo1, ...combo2]);
            if (usedCards.size !== combo1.length + combo2.length) continue;

            valid++;
            const deck = baseDeck.filter(c => !usedCards.has(c));
            const finalBoard = [...boardCards];

            while (finalBoard.length < 5 && deck.length > 0) {
                const idx = Math.floor(Math.random() * deck.length);
                finalBoard.push(deck[idx]);
                deck.splice(idx, 1);
            }
            if (finalBoard.length < 5) continue;

            const h1 = getBestHand([...combo1, ...finalBoard]);
            const h2 = getBestHand([...combo2, ...finalBoard]);
            const result = compareHands(h1, h2);
            if (result > 0) wins1++;
            else if (result < 0) wins2++;
            else ties++;
        }

        // Update UI with partial results (real-time updates!)
        const total = wins1 + wins2 + ties;
        if (total > 0) {
            const eq1 = (wins1 + ties * 0.5) / total * 100;
            const eq2 = (wins2 + ties * 0.5) / total * 100;
            displayEquityResult(eq1, eq2);
        }

        if (valid < iterations && attempt < maxAttempts) {
            setTimeout(runChunk, 0); // yield to event loop
        }
    }

    runChunk();
}

function suggestAction(heroEquity) {
    const suggestionDiv = document.getElementById('actionSuggestion');
    if (boardCards.length < 3) { suggestionDiv.style.display = 'none'; return; }

    const heroStats = currentStats['hero'];
    const villainStats = currentStats['villain'];
    let tacticalAdvice = '';

    if (heroStats && villainStats) {
        const heroMade = ['straightflush', 'quads', 'fullhouse', 'flush', 'straight', 'trips', 'twopair']
            .reduce((s, k) => s + (heroStats[k]?.combos || 0), 0);
        const villainMade = ['straightflush', 'quads', 'fullhouse', 'flush', 'straight', 'trips', 'twopair']
            .reduce((s, k) => s + (villainStats[k]?.combos || 0), 0);
        const heroDraws = (heroStats.flushdraw?.combos || 0) + (heroStats.oesd?.combos || 0);
        const villainDraws = (villainStats.flushdraw?.combos || 0) + (villainStats.oesd?.combos || 0);

        if (heroMade > villainMade * 1.3)
            tacticalAdvice = ' <strong>Avantage range:</strong> Plus de mains faites que Villain.';
        else if (villainMade > heroMade * 1.3)
            tacticalAdvice = ' <strong>Désavantage range:</strong> Villain a plus de mains faites.';
        if (heroDraws > villainDraws * 1.5 && heroMade < villainMade)
            tacticalAdvice += ' <em>Beaucoup de tirages → Semi-bluff possible.</em>';
    }

    let suggestion = '', icon = '', color = '';
    if (heroEquity >= 65) {
        icon = '💰'; color = '#4CAF50';
        suggestion = '<strong>VALUE BET:</strong> Forte equity (65%+). Misez 65-75% pot pour value.' + tacticalAdvice;
    } else if (heroEquity >= 55) {
        icon = '📊'; color = '#2196F3';
        suggestion = '<strong>BET/CALL:</strong> Equity favorable (55-65%). Misez 55-65% pot ou call.' + tacticalAdvice;
    } else if (heroEquity >= 45) {
        icon = '⚖️'; color = '#FF9800';
        suggestion = '<strong>CHECK/CALL:</strong> Equity équilibrée (45-55%). Pot control recommandé.' + tacticalAdvice;
    } else if (heroEquity >= 30) {
        icon = '🎲'; color = '#FF5722';
        suggestion = '<strong>BLUFF/FOLD:</strong> Equity faible (30-45%). Bluff si fold equity, sinon fold.' + tacticalAdvice;
    } else {
        icon = '🚫'; color = '#F44336';
        suggestion = '<strong>FOLD:</strong> Equity très faible (<30%). Fold sauf cote pot énorme.' + tacticalAdvice;
    }

    suggestionDiv.innerHTML = `<div style="display: flex; align-items: flex-start; gap: 8px;"><span style="font-size: 16px; line-height: 1.4;">${icon}</span><span style="color: ${color}; line-height: 1.4;">${suggestion}</span></div>`;
    suggestionDiv.style.display = 'block';
    suggestionDiv.style.borderLeftColor = color;
}

// ── Theme Toggle ─────────────────────────────────────────────
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('pokerTheme', next);

    const btn = document.getElementById('themeToggle');
    btn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';

    // Refresh charts if they exist
    if (currentStats.hero) updateRangeChart('hero');
    if (currentStats.villain) updateRangeChart('villain');
}

function loadTheme() {
    const saved = localStorage.getItem('pokerTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = saved === 'dark' ? '☀️ Light' : '🌙 Dark';
}

// ══════════════════════════════════════════════════════════════
// NEW FEATURES
// ══════════════════════════════════════════════════════════════

// ── 1. Range Import / Export ─────────────────────────────────

function parseRangeString(str) {
    const hands = [];
    const parts = str.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean);

    parts.forEach(part => {
        // Handle "+" notation: "QQ+" → QQ, KK, AA
        if (part.endsWith('+')) {
            const base = part.slice(0, -1);
            if (base.length === 2 && base[0] === base[1]) {
                // Pair+: e.g. "TT+"
                const startIdx = RANKS.indexOf(base[0]);
                for (let i = startIdx; i >= 0; i--) {
                    hands.push(RANKS[i] + RANKS[i]);
                }
            } else if (base.length === 3 && (base[2] === 's' || base[2] === 'o')) {
                // Suited/offsuit+: e.g. "ATs+"
                const r1 = base[0], suffix = base[2];
                const r2idx = RANKS.indexOf(base[1]);
                const r1idx = RANKS.indexOf(r1);
                for (let i = r2idx; i > r1idx; i--) {
                    hands.push(r1 + RANKS[i] + suffix);
                }
            }
        }
        // Handle "AK" (no suffix) → both AKs and AKo
        else if (part.length === 2 && part[0] !== part[1]) {
            const h1 = part + 's', h2 = part + 'o';
            if (ALL_VALID_HANDS.has(h1)) hands.push(h1);
            if (ALL_VALID_HANDS.has(h2)) hands.push(h2);
        }
        // Handle range notation "77-TT"
        else if (part.includes('-')) {
            const [low, high] = part.split('-');
            if (low.length === 2 && low[0] === low[1] && high.length === 2 && high[0] === high[1]) {
                const lowIdx = RANKS.indexOf(low[0]);
                const highIdx = RANKS.indexOf(high[0]);
                const start = Math.min(lowIdx, highIdx);
                const end = Math.max(lowIdx, highIdx);
                for (let i = start; i <= end; i++) {
                    hands.push(RANKS[i] + RANKS[i]);
                }
            }
        }
        // Direct hand notation
        else if (ALL_VALID_HANDS.has(part)) {
            hands.push(part);
        }
    });

    return [...new Set(hands)];
}

function exportRange(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    if (range.size === 0) return '';
    return Array.from(range).join(', ');
}

function importRange(player) {
    const input = document.getElementById(`${player}RangeImport`);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const hands = parseRangeString(text);
    if (hands.length === 0) {
        alert('Aucune main valide trouvée. Format: AA, KK, AKs, QQ+, 88-TT');
        return;
    }

    const range = player === 'hero' ? heroRange : villainRange;
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';

    range.clear();
    hands.forEach(h => range.add(h));
    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        cell.classList.toggle('selected', range.has(cell.dataset.hand));
    });

    updateRangeInfo(player);
    updateSlider(player);
    updateRangeChart(player);
    analyzeRanges();
    input.value = exportRange(player); // normalize
    refreshHotnessIfActive(player);
}

function exportRangeToClipboard(player) {
    const text = exportRange(player);
    if (!text) { alert('Range vide'); return; }
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById(`${player}ExportBtn`);
        const orig = btn.textContent;
        btn.textContent = '✅ Copié !';
        setTimeout(() => btn.textContent = orig, 1500);
    }).catch(() => {
        // Fallback for file:// protocol
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        alert('Range copiée : ' + text);
    });
}

function showExportInInput(player) {
    const input = document.getElementById(`${player}RangeImport`);
    if (input) input.value = exportRange(player);
}

// ── 2. Specific Hand Mode ────────────────────────────────────

function toggleSpecificHandMode(player) {
    const panel = document.getElementById(`${player}SpecificHand`);
    const matrixSection = document.getElementById(`${player}MatrixSection`);

    if (panel.style.display === 'block') {
        panel.style.display = 'none';
        matrixSection.style.display = 'block';
        specificHand[player] = null;
        document.getElementById(`${player}ModeLabel`).textContent = 'Range';
    } else {
        panel.style.display = 'block';
        matrixSection.style.display = 'none';
        document.getElementById(`${player}ModeLabel`).textContent = 'Main exacte';
    }
}

function initSpecificHandSelector(player) {
    createCardSelector(`${player}HandGrid`, (card, btn) => selectSpecificCard(player, card, btn));
}

function selectSpecificCard(player, card, btn) {
    const grid = document.getElementById(`${player}HandGrid`);
    if (!grid || !grid.contains(btn)) return; // Safety check

    // Strict match check (prevents phantom clicks if layout shifts)
    if (btn.dataset.card !== card) return;

    // Toggle selection
    if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
    } else {
        const selected = grid.querySelectorAll('.card-btn.selected');
        if (selected.length >= 2) {
            // Remove the first selected card (FIFO) to allow selecting a new pair easily
            selected[0].classList.remove('selected');
        }
        btn.classList.add('selected');
    }

    // Update state and UI based on current selection
    const selectedCards = Array.from(grid.querySelectorAll('.card-btn.selected')).map(b => b.dataset.card);
    const display = document.getElementById(`${player}HandDisplay`);
    const range = player === 'hero' ? heroRange : villainRange;

    // 1. Update Display (Immediate Feedback)
    if (selectedCards.length === 0) {
        display.innerHTML = '<span style="color:var(--text-faint);">Sélectionnez 2 cartes</span>';
    } else {
        let html = '';
        selectedCards.forEach(c => {
            const isRed = c.includes('♥') || c.includes('♦');
            // Added onclick to deselect
            html += `<div class="mini-card ${isRed ? 'red' : 'black'}" 
                          onclick="deselectSpecificCard('${player}', '${c}')"
                          style="width:45px;height:63px;font-size:20px;cursor:pointer;" 
                          title="Retirer">
                          ${c}
                     </div>`;
        });
        // Add placeholder if only 1 card selected
        if (selectedCards.length === 1) {
            html += `<div class="mini-card" style="width:45px;height:63px;font-size:20px; border-style:dashed; opacity:0.5;">?</div>`;
        }
        display.innerHTML = html;
    }

    // 2. Update Range Logic
    if (selectedCards.length === 2) {
        specificHand[player] = selectedCards;
        const hand = cardsToHandNotation(selectedCards[0], selectedCards[1]);

        range.clear();
        if (hand) range.add(hand);

        // Auto-enable blocker when hand is complete
        blockerActive[player] = true;
        const checkbox = document.getElementById(`${player}BlockerCheckbox`);
        if (checkbox) checkbox.checked = true;
        const label = document.getElementById(`${player}BlockerLabel`);
        if (label) { label.style.color = 'var(--hero-color)'; label.style.fontWeight = '700'; }

        // Update matrix visual to match
        const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
        document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
            cell.classList.toggle('selected', range.has(cell.dataset.hand));
        });
    } else {
        // If < 2 cards, hand is incomplete -> Clear range + disable blocker
        specificHand[player] = null;
        range.clear();
        blockerActive[player] = false;
        const checkbox = document.getElementById(`${player}BlockerCheckbox`);
        if (checkbox) checkbox.checked = false;
        const label = document.getElementById(`${player}BlockerLabel`);
        if (label) { label.style.color = ''; label.style.fontWeight = ''; }

        // Clear matrix visual
        const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
        document.querySelectorAll(`#${matrixId} .range-cell.selected`).forEach(cell => cell.classList.remove('selected'));
    }

    // Refresh cross-blocking systems
    updateBoardDisplay();
    updateSpecificHandSelectors();
    updateRangeInfo('hero');
    updateRangeInfo('villain');
    analyzeRanges();
}

function deselectSpecificCard(player, card) {
    const grid = document.getElementById(`${player}HandGrid`);
    if (!grid) return;

    // Find the button in the grid
    const btn = Array.from(grid.querySelectorAll('.card-btn')).find(b => b.dataset.card === card);

    // If found, simulate a click or call logic to toggle it off
    if (btn) {
        // Since it's currently selected (it's in the display), clicking it will toggle it OFF.
        selectSpecificCard(player, card, btn);
    }
}

function cardsToHandNotation(c1, c2) {
    const r1 = c1[0], s1 = c1[1], r2 = c2[0], s2 = c2[1];
    const v1 = RANK_VALUES[r1], v2 = RANK_VALUES[r2];

    if (r1 === r2) return r1 + r2; // Pair
    const high = v1 > v2 ? r1 : r2;
    const low = v1 > v2 ? r2 : r1;
    const suited = s1 === s2 ? 's' : 'o';
    return high + low + suited;
}

// ── 3. Hotness / Removal Effect ──────────────────────────────
let hotnessActive = { hero: false, villain: false };

function toggleHotness(player) {
    hotnessActive[player] = !hotnessActive[player];
    const btn = document.getElementById(`${player}HotnessBtn`);

    if (hotnessActive[player]) {
        btn.classList.add('active');
        btn.style.background = 'linear-gradient(135deg, #ff6b35, #f7c948)';
        btn.style.color = 'white';
        calculateHotness(player);
    } else {
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.color = '';
        clearHotnessDisplay(player);
    }
}

// ── Auto-refresh hotness when active (debounced) ─────────────
let hotnessRefreshTimers = { hero: null, villain: null };

function refreshHotnessIfActive(player) {
    if (!hotnessActive[player]) return;
    // Debounce: wait 700ms after last change before recalculating
    if (hotnessRefreshTimers[player]) clearTimeout(hotnessRefreshTimers[player]);
    hotnessRefreshTimers[player] = setTimeout(() => {
        if (hotnessActive[player]) calculateHotness(player);
    }, 700);
}

function refreshAllHotnessIfActive() {
    refreshHotnessIfActive('hero');
    refreshHotnessIfActive('villain');
}

function calculateHotness(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    const opponentPlayer = player === 'hero' ? 'villain' : 'hero';
    const opponentRange = opponentPlayer === 'hero' ? heroRange : villainRange;

    const isOpponentSpecific = specificHand[opponentPlayer] && specificHand[opponentPlayer].length === 2;
    const opponentSpecific = isOpponentSpecific ? specificHand[opponentPlayer] : null;

    if (range.size === 0 || (!isOpponentSpecific && opponentRange.size === 0)) {
        alert('Les deux ranges (ou main spécifique) doivent être sélectionnées');
        hotnessActive[player] = false;
        return;
    }

    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';

    // Use blocker-aware dead cards for Hero
    const effectiveDead = Array.from(getBlockerDeadCards(player));
    const allDeadSet = new Set(effectiveDead);

    // We also need to correctly tell quickEquity what the global deck is.
    // The baseDeck is all cards NOT in the board or explicitly dead.
    const baseDeck = createDeck().filter(c => !allDeadSet.has(c));
    const iterations = 300;

    // Calculate base equity
    const baseEquity = quickEquity(range, opponentRange, boardCards, baseDeck, effectiveDead, iterations, null, opponentSpecific);

    // Calculate equity delta for each hand (signed: positive = hand raises range equity)
    const hotnessMap = new Map();
    let maxAbsDelta = 0;

    range.forEach(hand => {
        const reducedRange = new Set(range);
        reducedRange.delete(hand);
        if (reducedRange.size === 0) {
            hotnessMap.set(hand, 0);
            return;
        }
        const reducedEquity = quickEquity(reducedRange, opponentRange, boardCards, baseDeck, effectiveDead, iterations, null, opponentSpecific);
        // Signed delta: if removing this hand lowers equity, the hand was positive for the range
        const delta = baseEquity - reducedEquity;
        hotnessMap.set(hand, delta);
        if (Math.abs(delta) > maxAbsDelta) maxAbsDelta = Math.abs(delta);
    });

    // Display heatmap on matrix
    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        const hand = cell.dataset.hand;
        if (!range.has(hand)) return;
        const delta = hotnessMap.get(hand) || 0;
        const absDelta = Math.abs(delta);
        const intensity = maxAbsDelta > 0 ? absDelta / maxAbsDelta : 0;

        // Positive delta (hand helps equity) → green. Negative → red. Neutral → blue.
        let r, g, b;
        if (delta > 0) {
            r = Math.round(30 * (1 - intensity));
            g = Math.round(200 * intensity + 80 * (1 - intensity));
            b = Math.round(80 * (1 - intensity));
        } else if (delta < 0) {
            r = Math.round(220 * intensity + 80 * (1 - intensity));
            g = Math.round(30 * (1 - intensity));
            b = Math.round(30 * (1 - intensity));
        } else {
            r = 80; g = 80; b = 150;
        }
        cell.style.background = `rgba(${r}, ${g}, ${b}, 0.85)`;
        cell.style.color = 'white';
        cell.style.fontWeight = '700';
        cell.style.textShadow = '0 1px 2px rgba(0,0,0,0.5)';
        const sign = delta > 0 ? '+' : '';
        cell.title = `Impact équité: ${sign}${delta.toFixed(1)}%`;
    });

    // Build sorted combo list and display mini-table
    const sorted = Array.from(hotnessMap.entries())
        .sort((a, b) => b[1] - a[1]);
    showHotnessTable(player, sorted, baseEquity);
}

function showHotnessTable(player, sorted, baseEquity) {
    // Remove existing table if any
    const existingTable = document.getElementById(`${player}HotnessTable`);
    if (existingTable) existingTable.remove();

    if (sorted.length === 0) return;

    // Build mini table HTML
    const top = sorted.slice(0, 5);
    const bottom = sorted.slice(-5).reverse();

    function rowHTML(hand, delta) {
        const sign = delta >= 0 ? '+' : '';
        const color = delta > 0.3 ? '#4caf50' : delta < -0.3 ? '#ef5350' : '#90a4ae';
        return `<tr>
            <td style="padding:2px 6px;font-weight:700;font-size:12px;">${hand}</td>
            <td style="padding:2px 6px;font-size:12px;color:${color};font-weight:600;text-align:right;">${sign}${delta.toFixed(1)}%</td>
        </tr>`;
    }

    const tableDiv = document.createElement('div');
    tableDiv.id = `${player}HotnessTable`;
    tableDiv.style.cssText = `
        margin-top: 8px;
        background: var(--bg-card, #1e2a3a);
        border: 1px solid var(--border-color, #2a3a4a);
        border-radius: 8px;
        padding: 8px;
        font-family: monospace;
        font-size: 12px;
        animation: fadeIn 0.2s ease;
        max-height: 260px;
        overflow-y: auto;
    `;

    tableDiv.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-size:11px;font-weight:700;color:var(--text-secondary,#aaa);letter-spacing:0.5px;">📊 IMPACT ÉQUITÉ (base: ${baseEquity.toFixed(1)}%)</span>
            <button onclick="document.getElementById('${player}HotnessTable').remove()" style="background:none;border:none;color:var(--text-secondary,#aaa);cursor:pointer;font-size:14px;line-height:1;padding:0 2px;">✕</button>
        </div>
        <div style="display:flex;gap:10px;">
            <div style="flex:1;">
                <div style="font-size:10px;color:#4caf50;font-weight:700;margin-bottom:3px;">▲ AIDE LA RANGE</div>
                <table style="width:100%;border-collapse:collapse;">
                    <tbody>${top.map(([h, d]) => rowHTML(h, d)).join('')}</tbody>
                </table>
            </div>
            <div style="width:1px;background:var(--border-color,#2a3a4a);"></div>
            <div style="flex:1;">
                <div style="font-size:10px;color:#ef5350;font-weight:700;margin-bottom:3px;">▼ TIRE LA RANGE</div>
                <table style="width:100%;border-collapse:collapse;">
                    <tbody>${bottom.map(([h, d]) => rowHTML(h, d)).join('')}</tbody>
                </table>
            </div>
        </div>
        ${sorted.length > 10 ? `<details style="margin-top:6px;">
                <summary style="font-size:10px;color:var(--text-secondary,#aaa);cursor:pointer;">Voir toutes les ${sorted.length} mains</summary>
                <table style="width:100%;border-collapse:collapse;margin-top:4px;">
                    <tbody>${sorted.map(([h, d]) => rowHTML(h, d)).join('')}</tbody>
                </table>
            </details>` : ''
        }
    `;

    // Insert after the hotness button (find the player's range controls area)
    const btn = document.getElementById(`${player}HotnessBtn`);
    if (btn && btn.parentNode) {
        btn.parentNode.insertAdjacentElement('afterend', tableDiv);
    }
}

function quickEquity(range1Set, range2Set, board, baseDeck, allDead, iterations, spec1 = null, spec2 = null) {
    const r1Combos = spec1 ? [spec1] : [];
    if (!spec1) range1Set.forEach(h => r1Combos.push(...handToCombos(h, allDead)));

    const r2Combos = spec2 ? [spec2] : [];
    if (!spec2) range2Set.forEach(h => r2Combos.push(...handToCombos(h, allDead)));

    if (r1Combos.length === 0 || r2Combos.length === 0) return 50;

    let wins = 0, total = 0;
    for (let i = 0; i < iterations * 2 && total < iterations; i++) {
        const c1 = r1Combos[Math.floor(Math.random() * r1Combos.length)];
        const c2 = r2Combos[Math.floor(Math.random() * r2Combos.length)];
        const used = new Set([...c1, ...c2]);
        if (used.size !== c1.length + c2.length) continue;

        total++;
        const deck = baseDeck.filter(c => !used.has(c));
        const fb = [...board];
        while (fb.length < 5 && deck.length > 0) {
            const idx = Math.floor(Math.random() * deck.length);
            fb.push(deck[idx]);
            deck.splice(idx, 1);
        }
        if (fb.length < 5) continue;

        const h1 = getBestHand([...c1, ...fb]);
        const h2 = getBestHand([...c2, ...fb]);
        const res = compareHands(h1, h2);
        if (res > 0) wins++;
        else if (res === 0) wins += 0.5;
    }
    return total > 0 ? (wins / total) * 100 : 50;
}

function clearHotnessDisplay(player) {
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        cell.style.background = '';
        cell.style.color = '';
        cell.style.fontWeight = '';
        cell.style.textShadow = '';
        cell.title = '';
    });
    // Re-apply selections
    const range = player === 'hero' ? heroRange : villainRange;
    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        cell.classList.toggle('selected', range.has(cell.dataset.hand));
    });
    // Remove hotness table if present
    const table = document.getElementById(`${player}HotnessTable`);
    if (table) table.remove();
}

// ── 4. Turn & River equity evolution ─────────────────────────
let equityEvolution = [];
let equityEvoChart = null;

function runEquityEvolution() {
    if (heroRange.size === 0 || villainRange.size === 0) {
        alert('Sélectionnez les ranges Hero et Villain');
        return;
    }
    if (boardCards.length < 3) {
        alert('Sélectionnez au moins le flop (3 cartes)');
        return;
    }

    const allDead = [...boardCards, ...Array.from(deadCards)];
    const allDeadSet = new Set(allDead);
    const baseDeck = createDeck().filter(c => !allDeadSet.has(c));
    const iterations = 500;

    equityEvolution = [];

    // Flop equity
    const flopEq = quickEquity(heroRange, villainRange, boardCards.slice(0, 3), baseDeck, allDead, iterations);
    equityEvolution.push({ street: 'Flop', equity: flopEq });

    if (boardCards.length >= 4) {
        // Turn equity (with actual turn card)
        const turnEq = quickEquity(heroRange, villainRange, boardCards.slice(0, 4), baseDeck, allDead, iterations);
        equityEvolution.push({ street: 'Turn', equity: turnEq });
    } else {
        // Simulate average turn equity
        const turnCards = baseDeck.filter(c => !boardCards.includes(c));
        let turnSum = 0, turnCount = 0;
        const sampleSize = Math.min(turnCards.length, 15);
        for (let i = 0; i < sampleSize; i++) {
            const tc = turnCards[Math.floor(Math.random() * turnCards.length)];
            const turnBoard = [...boardCards.slice(0, 3), tc];
            const turnDead = [...allDead, tc];
            const turnDeck = baseDeck.filter(c => c !== tc);
            turnSum += quickEquity(heroRange, villainRange, turnBoard, turnDeck, turnDead, 200);
            turnCount++;
        }
        equityEvolution.push({ street: 'Turn (avg)', equity: turnCount > 0 ? turnSum / turnCount : 50 });
    }

    if (boardCards.length >= 5) {
        // River equity (with actual river card)
        const riverEq = quickEquity(heroRange, villainRange, boardCards, baseDeck, allDead, iterations);
        equityEvolution.push({ street: 'River', equity: riverEq });
    } else {
        equityEvolution.push({ street: 'River (avg)', equity: flopEq }); // approximate
    }

    displayEquityEvolution();
}

function displayEquityEvolution() {
    const container = document.getElementById('equityEvoContainer');
    if (!container) return;
    container.style.display = 'block';

    const ctx = document.getElementById('equityEvoChart');
    if (equityEvoChart) equityEvoChart.destroy();

    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();

    equityEvoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: equityEvolution.map(e => e.street),
            datasets: [{
                label: 'Hero Equity %',
                data: equityEvolution.map(e => e.equity.toFixed(1)),
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.15)',
                fill: true,
                tension: 0.3,
                pointRadius: 6,
                pointBackgroundColor: '#2196F3',
                borderWidth: 3
            }, {
                label: 'Villain Equity %',
                data: equityEvolution.map(e => (100 - e.equity).toFixed(1)),
                borderColor: '#E53935',
                backgroundColor: 'rgba(229, 57, 53, 0.15)',
                fill: true,
                tension: 0.3,
                pointRadius: 6,
                pointBackgroundColor: '#E53935',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 100, ticks: { callback: v => v + '%', color: textColor }, grid: { color: 'rgba(128,128,128,0.2)' } },
                x: { ticks: { color: textColor }, grid: { color: 'rgba(128,128,128,0.2)' } }
            },
            plugins: {
                legend: { labels: { color: textColor } },
                tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%` } }
            }
        }
    });
}

// ── Custom Range Editor ──────────────────────────────────────
let customRanges = {};
let editorCurrentPlayer = null;

function initCustomRanges() {
    const saved = localStorage.getItem('poker_custom_ranges');
    if (saved) {
        try {
            customRanges = JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse custom ranges", e);
            customRanges = {};
        }
    }
    renderPositionButtons('hero');
    renderPositionButtons('villain');
}

function renderPositionButtons(player) {
    const container = document.getElementById(`${player}PositionContainer`);
    if (!container) return;

    container.innerHTML = `<span style="font-size:11px; color:var(--text-secondary); margin-right:4px;">📍</span>`;

    // Default positions
    Object.keys(POSITION_PRESETS).forEach(pos => {
        const btn = document.createElement('button');
        btn.className = 'btn small position-btn';
        btn.textContent = pos;
        btn.onclick = () => selectPositionRange(player, pos);
        container.appendChild(btn);
    });

    // Custom positions (only if keys don't exist in defaults, OR we render them as overrides?)
    // User wants to "modifier les ranges proposer de base".
    // My logic in selectPositionRange prefers customRanges.
    // So if I have "UTG" in customRanges, clicking "UTG" button (generated above) will use custom range.
    // PERFECT. I don't need to render duplicate buttons.
    // I only render NEW buttons for keys that are NOT in POSITION_PRESETS.

    Object.keys(customRanges).forEach(name => {
        if (POSITION_PRESETS[name]) return; // Already rendered as default button (but logic uses custom)
        const btn = document.createElement('button');
        btn.className = 'btn small position-btn custom-range-btn';
        btn.textContent = name;
        btn.onclick = () => selectPositionRange(player, name);
        container.appendChild(btn);
    });

    // Add (+) button
    const addBtn = document.createElement('button');
    addBtn.className = 'add-range-btn';
    addBtn.textContent = '+';
    addBtn.title = "Gérer les ranges";
    addBtn.onclick = () => openRangeEditor(player);
    container.appendChild(addBtn);
}

function openRangeEditor(player) {
    editorCurrentPlayer = player;
    // Customize editor
    const select = document.getElementById('rangeEditorSelect');
    renderRangeEditorSelect();
    select.value = "";

    document.getElementById('rangeEditorModal').style.display = 'flex';
    document.getElementById('rangeEditorName').value = '';
    document.getElementById('rangeEditorContent').value = '';
    document.getElementById('deleteRangeBtn').style.display = 'block';
}

function renderRangeEditorSelect() {
    const select = document.getElementById('rangeEditorSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Sélectionner une range...</option>';

    // Add Defaults
    const defaultsGroup = document.createElement('optgroup');
    defaultsGroup.label = "Défaut";
    Object.keys(POSITION_PRESETS).forEach(pos => {
        const opt = document.createElement('option');
        opt.value = "DEF:" + pos;
        opt.textContent = pos;
        defaultsGroup.appendChild(opt);
    });
    select.appendChild(defaultsGroup);

    // Add Custom
    const customGroup = document.createElement('optgroup');
    customGroup.label = "Personnalisé";
    Object.keys(customRanges).forEach(name => {
        const opt = document.createElement('option');
        opt.value = "CUST:" + name;
        opt.textContent = name;
        customGroup.appendChild(opt);
    });
    select.appendChild(customGroup);
}

function loadRangeToEditor() {
    const select = document.getElementById('rangeEditorSelect');
    const val = select.value;
    if (!val) return;

    const [type, name] = val.split(':');
    let hands = [];

    if (type === 'DEF') {
        hands = POSITION_PRESETS[name] || [];
        document.getElementById('rangeEditorName').value = name; // User can overwrite default by using same name
    } else if (type === 'CUST') {
        hands = customRanges[name] || [];
        document.getElementById('rangeEditorName').value = name;
    }

    document.getElementById('rangeEditorContent').value = hands.join(', ');
}

function saveCustomRange() {
    const name = document.getElementById('rangeEditorName').value.trim();
    const content = document.getElementById('rangeEditorContent').value.trim();

    if (!name) { alert('Veuillez donner un nom à la range'); return; }
    if (!content) { alert('La range ne peut pas être vide'); return; }

    // Parse content to array
    const hands = content.split(/[,\s]+/).map(h => h.trim()).filter(h => ALL_VALID_HANDS.has(h));

    if (hands.length === 0) { alert('Aucune main valide détectée'); return; }

    customRanges[name] = hands;
    localStorage.setItem('poker_custom_ranges', JSON.stringify(customRanges));

    renderPositionButtons('hero');
    renderPositionButtons('villain');

    // Refresh modal dropdown to include new/updated range
    renderRangeEditorSelect();

    document.getElementById('rangeEditorModal').style.display = 'none';
}

function deleteCustomRange() {
    const name = document.getElementById('rangeEditorName').value.trim();
    if (!name) return;

    if (customRanges[name]) {
        if (confirm(`Supprimer la range personnalisée "${name}" ?`)) {
            delete customRanges[name];
            localStorage.setItem('poker_custom_ranges', JSON.stringify(customRanges));
            renderPositionButtons('hero');
            renderPositionButtons('villain');
            document.getElementById('rangeEditorModal').style.display = 'none';
        }
    } else {
        alert("Cette range n'existe pas dans vos personnalisations.");
    }
}

function copyCurrentRangeToEditor() {
    if (!editorCurrentPlayer) return;
    const range = editorCurrentPlayer === 'hero' ? heroRange : villainRange;
    const hands = Array.from(range).join(', ');
    document.getElementById('rangeEditorContent').value = hands;
}

function closeRangeEditor(event) {
    if (event.target.id === 'rangeEditorModal') {
        document.getElementById('rangeEditorModal').style.display = 'none';
    }
}

// Ensure init is called
document.addEventListener('DOMContentLoaded', () => {
    initCustomRanges();
});

// ── 5. Multi-Street Dynamic Filtering ─────────────────────────
function initMultiStreetFilters() {
    const selects = ['msfFlopHero', 'msfFlopVillain', 'msfTurnHero', 'msfTurnVillain', 'msfRiverHero', 'msfRiverVillain'];

    const MSF_FILTERS = {
        'tp_plus': 'Top Pair + (et mieux)',
        'any_pair_plus': 'Any Pair + (et mieux)',
        'draws': 'Tirages uniquement',
        'tp_plus_draws': 'Top Pair+ OU Tirages',
        'any_pair_plus_draws': 'Any Pair+ OU Tirages'
    };

    selects.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        Object.entries(MSF_FILTERS).forEach(([key, label]) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = label;
            el.appendChild(opt);
        });
    });
}

function updateMultiStreetUI() {
    const turnBox = document.getElementById('msfTurn');
    const riverBox = document.getElementById('msfRiver');
    if (!turnBox || !riverBox) return;

    if (boardCards.length >= 4) turnBox.classList.remove('disabled');
    else turnBox.classList.add('disabled');

    if (boardCards.length >= 5) riverBox.classList.remove('disabled');
    else riverBox.classList.add('disabled');
}

// Multi-Street dynamic macro controls have been natively integrated.
