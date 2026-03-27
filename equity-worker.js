// ============================================================
// equity-worker.js — Web Worker for Monte Carlo equity calc
// ============================================================

// We need to duplicate the minimal logic needed here since 
// Web Workers can't access the main thread's scope.

const RANKS_W = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS_W = ['♠', '♥', '♦', '♣'];
const RANK_VALUES_W = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };

function createDeckW() {
    const deck = [];
    RANKS_W.forEach(r => SUITS_W.forEach(s => deck.push(r + s)));
    return deck;
}

function handToCombosW(hand, deadCardsList = []) {
    const combos = [];
    const dead = new Set(deadCardsList);
    if (hand.length === 2) {
        const rank = hand[0];
        for (let i = 0; i < SUITS_W.length; i++)
            for (let j = i + 1; j < SUITS_W.length; j++) {
                const c1 = rank + SUITS_W[i], c2 = rank + SUITS_W[j];
                if (!dead.has(c1) && !dead.has(c2)) combos.push([c1, c2]);
            }
    } else if (hand.endsWith('s')) {
        const r1 = hand[0], r2 = hand[1];
        SUITS_W.forEach(s => {
            const c1 = r1 + s, c2 = r2 + s;
            if (!dead.has(c1) && !dead.has(c2)) combos.push([c1, c2]);
        });
    } else if (hand.endsWith('o')) {
        const r1 = hand[0], r2 = hand[1];
        for (let i = 0; i < SUITS_W.length; i++)
            for (let j = 0; j < SUITS_W.length; j++) {
                if (i !== j) {
                    const c1 = r1 + SUITS_W[i], c2 = r2 + SUITS_W[j];
                    if (!dead.has(c1) && !dead.has(c2)) combos.push([c1, c2]);
                }
            }
    }
    return combos;
}

function evaluatePokerHandW(cards) {
    if (cards.length !== 5) return { rank: 0, value: [] };
    const rankCounts = {}, suitCounts = {}, cardValues = [];
    cards.forEach(card => {
        const r = card[0], s = card[1];
        rankCounts[r] = (rankCounts[r] || 0) + 1;
        suitCounts[s] = (suitCounts[s] || 0) + 1;
        cardValues.push(RANK_VALUES_W[r]);
    });
    const counts = Object.entries(rankCounts)
        .map(([r, c]) => ({ rank: r, count: c, value: RANK_VALUES_W[r] }))
        .sort((a, b) => b.count !== a.count ? b.count - a.count : b.value - a.value);
    const sortedValues = cardValues.sort((a, b) => b - a);
    const isFlush = Math.max(...Object.values(suitCounts)) === 5;
    let isStraight = false, straightHigh = 0;
    const uniqueValues = [...new Set(sortedValues)].sort((a, b) => b - a);
    if (uniqueValues.length >= 5) {
        for (let i = 0; i <= uniqueValues.length - 5; i++) {
            if (uniqueValues[i] - uniqueValues[i + 4] === 4) { isStraight = true; straightHigh = uniqueValues[i]; break; }
        }
    }
    if (!isStraight && uniqueValues.includes(14) && uniqueValues.includes(5) &&
        uniqueValues.includes(4) && uniqueValues.includes(3) && uniqueValues.includes(2)) {
        isStraight = true; straightHigh = 5;
    }
    const cp = counts.map(c => c.count).join('');
    const vals = counts.map(c => c.value);
    if (isFlush && isStraight) return { rank: 9, value: [straightHigh] };
    if (cp.startsWith('4')) return { rank: 8, value: [vals[0], vals[1]] };
    if (cp === '32') return { rank: 7, value: [vals[0], vals[1]] };
    if (isFlush) return { rank: 6, value: sortedValues };
    if (isStraight) return { rank: 5, value: [straightHigh] };
    if (cp.startsWith('3')) return { rank: 4, value: vals };
    if (cp.startsWith('22')) return { rank: 3, value: vals };
    if (cp.startsWith('2')) return { rank: 2, value: vals };
    return { rank: 1, value: sortedValues };
}

function getBestHandW(sevenCards) {
    let best = { rank: 0, value: [] };
    for (let i = 0; i < sevenCards.length; i++)
        for (let j = i + 1; j < sevenCards.length; j++)
            for (let k = j + 1; k < sevenCards.length; k++)
                for (let l = k + 1; l < sevenCards.length; l++)
                    for (let m = l + 1; m < sevenCards.length; m++) {
                        const h = evaluatePokerHandW([sevenCards[i], sevenCards[j], sevenCards[k], sevenCards[l], sevenCards[m]]);
                        if (h.rank > best.rank) best = h;
                        else if (h.rank === best.rank) {
                            for (let n = 0; n < h.value.length; n++) {
                                if (h.value[n] > best.value[n]) { best = h; break; }
                                else if (h.value[n] < best.value[n]) break;
                            }
                        }
                    }
    return best;
}

function compareHandsW(h1, h2) {
    if (h1.rank > h2.rank) return 1;
    if (h1.rank < h2.rank) return -1;
    for (let i = 0; i < Math.max(h1.value.length, h2.value.length); i++) {
        const v1 = h1.value[i] || 0, v2 = h2.value[i] || 0;
        if (v1 > v2) return 1;
        if (v1 < v2) return -1;
    }
    return 0;
}

// ── Main Monte Carlo ─────────────────────────────────────────
self.onmessage = function (e) {
    const { heroRange, villainRange, heroCombos, villainCombos, board, deadCards, iterations, calcId } = e.data;

    // FIX: Include dead cards when building combos
    const allDead = [...board, ...deadCards];

    const range1Combos = heroCombos ? [...heroCombos] : [];
    if (!heroCombos && heroRange) {
        heroRange.forEach(hand => range1Combos.push(...handToCombosW(hand, allDead)));
    }
    const range2Combos = villainCombos ? [...villainCombos] : [];
    if (!villainCombos && villainRange) {
        villainRange.forEach(hand => range2Combos.push(...handToCombosW(hand, allDead)));
    }

    if (range1Combos.length === 0 || range2Combos.length === 0) {
        const eq1 = range1Combos.length > 0 ? 100 : 0;
        const eq2 = range2Combos.length > 0 ? 100 : 0;
        self.postMessage({ type: 'result', range1: eq1, range2: eq2, calcId });
        return;
    }

    // FIX: Build base deck once excluding board and dead cards
    const allDeadSet = new Set(allDead);
    const baseDeck = createDeckW().filter(c => !allDeadSet.has(c));

    let wins1 = 0, wins2 = 0, ties = 0, valid = 0;

    for (let i = 0; i < iterations * 2 && valid < iterations; i++) {
        const combo1 = range1Combos[Math.floor(Math.random() * range1Combos.length)];
        const combo2 = range2Combos[Math.floor(Math.random() * range2Combos.length)];

        // Check for card conflicts between the two combos
        const usedCards = new Set([...combo1, ...combo2]);
        if (usedCards.size !== combo1.length + combo2.length) continue;

        valid++;

        // Build available deck (base deck minus the two hands)
        const deck = baseDeck.filter(c => !usedCards.has(c));
        const finalBoard = [...board];

        while (finalBoard.length < 5 && deck.length > 0) {
            const idx = Math.floor(Math.random() * deck.length);
            finalBoard.push(deck[idx]);
            deck.splice(idx, 1);
        }

        if (finalBoard.length < 5) continue;

        const h1 = getBestHandW([...combo1, ...finalBoard]);
        const h2 = getBestHandW([...combo2, ...finalBoard]);
        const result = compareHandsW(h1, h2);
        if (result > 0) wins1++;
        else if (result < 0) wins2++;
        else ties++;

        // Progress update every 10%
        if (valid % Math.max(1, Math.floor(iterations / 10)) === 0) {
            self.postMessage({
                type: 'progress',
                current: valid,
                total: iterations
            });
        }
    }

    const total = wins1 + wins2 + ties;
    if (total === 0) {
        self.postMessage({ type: 'result', range1: 50, range2: 50, calcId });
        return;
    }

    self.postMessage({
        type: 'result',
        range1: (wins1 + ties * 0.5) / total * 100,
        range2: (wins2 + ties * 0.5) / total * 100,
        calcId
    });
};
