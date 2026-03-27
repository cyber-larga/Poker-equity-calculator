// ============================================================
// config.js — Single source of truth for all constants
// ============================================================

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['♠', '♥', '♦', '♣'];
const SUIT_NAMES = ['spades', 'hearts', 'diamonds', 'clubs'];
const RANK_VALUES = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };

// Hands sorted by preflop EV (used for slider percentage)
const ALL_HANDS_SORTED = [
    'AA', 'KK', 'QQ', 'JJ', 'AKs', 'TT', 'AQs', 'AKo', '99', 'AJs',
    'ATs', 'AQo', 'KQs', '88', 'KJs', 'AJo', 'KTs', 'QJs', 'KQo', 'A9s',
    '77', 'JTs', 'ATo', 'KJo', 'A8s', 'QTs', 'K9s', 'A7s', 'QJo', 'KTo', 'A5s', '66', 'JTo', 'A6s',
    'Q9s', 'A4s', 'K8s', 'A3s', 'QTo', 'J9s', 'A9o', 'K7s', 'A2s', 'K9o', 'Q8s', 'J8s', '55', 'K6s', 'T9s',
    'A8o', 'Q9o', 'K5s', 'J9o', 'T8s', 'K4s', 'A7o', 'Q7s', 'K8o', '44', 'J7s', 'K3s', 'T9o', 'Q6s', 'A6o', 'K2s',
    'Q8o', 'J8o', 'T7s', '97s', 'A5o', 'J6s', 'K7o', 'Q5s', '33', 'T8o', 'J5s', 'Q7o', 'K6o', '86s', 'Q4s', 'A4o',
    'J7o', '98s', 'T6s', 'Q3s', 'K5o', 'J4s', 'Q6o', 'A3o', 'Q2s', '87s', 'T7o', '97o', 'J6o', 'K4o', 'T5s', '22',
    '96s', 'J3s', 'Q5o', 'A2o', '76s', '86o', '95s', 'J2s', 'T6o', 'K3o', 'T4s', 'J5o', 'Q4o', '87o', '98o', 'T3s',
    '85s', '65s', 'K2o', '94s', 'T2s', 'J4o', 'Q3o', '75s', '96o', 'T5o', '93s', 'Q2o', '86o', '84s', '76o', '54s',
    '95o', '92s', '74s', '65o', 'J3o', '85o', 'T4o', '64s', '83s', '53s', '73s', '94o', 'J2o', '84o', '93o', '43s',
    '75o', '82s', '54o', '63s', 'T3o', '92o', '52s', '74o', '72s', '62s', '64o', 'T2o', '53o', '83o', '42s', '73o',
    '43o', '63o', '52o', '32s', '62o', '42o', '72o', '82o', '32o'
];

// Stat colors — single definition used everywhere
const STAT_COLORS = {
    straightflush: 'rgba(255, 23, 68, 0.85)',
    quads: 'rgba(224, 64, 251, 0.85)',
    fullhouse: 'rgba(255, 111, 0, 0.85)',
    flush: 'rgba(0, 176, 255, 0.85)',
    straight: 'rgba(118, 255, 3, 0.85)',
    trips: 'rgba(255, 234, 0, 0.85)',
    twopair: 'rgba(255, 167, 38, 0.85)',
    overpair: 'rgba(156, 39, 176, 0.85)',
    toppair: 'rgba(255, 215, 0, 0.85)',
    middlepair: 'rgba(253, 180, 92, 0.85)',
    bottompair: 'rgba(221, 161, 94, 0.85)',
    weakpair: 'rgba(169, 169, 169, 0.85)',
    flushdraw: 'rgba(38, 198, 218, 0.85)',
    oesd: 'rgba(102, 187, 106, 0.85)',
    gutshot: 'rgba(139, 195, 74, 0.85)',
    nothing: 'rgba(189, 189, 189, 0.85)'
};

// Stat labels — French
const STAT_LABELS = {
    straightflush: 'Quinte Flush',
    quads: 'Carré',
    fullhouse: 'Full',
    flush: 'Couleur',
    straight: 'Suite',
    trips: 'Brelan',
    twopair: 'Deux Paires',
    overpair: 'Overpair',
    toppair: 'Top Pair',
    middlepair: 'Middle Pair',
    bottompair: 'Bottom Pair',
    weakpair: 'Weak Pair',
    flushdraw: 'Flush Draw (9 outs)',
    oesd: 'OESD (8 outs)',
    gutshot: 'Gutshot (4 outs)',
    nothing: 'Rien'
};

// Stat labels with emojis (for detail panel)
const STAT_LABELS_EMOJI = {
    straightflush: '🔥 Quinte Flush',
    quads: '🎰 Carré',
    fullhouse: '🏠 Full',
    flush: '💧 Couleur',
    straight: '📈 Suite',
    trips: '🎯 Brelan',
    twopair: '👥 Deux Paires',
    overpair: '👑 Overpair',
    toppair: '🥇 Top Pair',
    middlepair: '🥈 Middle Pair',
    bottompair: '🥉 Bottom Pair',
    weakpair: '⚡ Weak Pair',
    flushdraw: '🌊 Flush Draw (9 outs)',
    oesd: '➡️ OESD (8 outs)',
    gutshot: '🎲 Gutshot (4 outs)',
    nothing: '❌ Rien'
};

// Stat icons HTML
const STAT_ICONS = {
    straightflush: '<span class="stat-icon sf">♠♥</span>',
    quads: '<span class="stat-icon quads">4♣</span>',
    fullhouse: '<span class="stat-icon fh">⌂</span>',
    flush: '<span class="stat-icon fl">♠</span>',
    straight: '<span class="stat-icon st">↗</span>',
    trips: '<span class="stat-icon trips">3♦</span>',
    twopair: '<span class="stat-icon tp">2×</span>',
    overpair: '<span class="stat-icon op">AA</span>',
    toppair: '<span class="stat-icon toppair">1st</span>',
    middlepair: '<span class="stat-icon mp">2nd</span>',
    bottompair: '<span class="stat-icon bp">3rd</span>',
    weakpair: '<span class="stat-icon wp">P</span>',
    flushdraw: '<span class="stat-icon fd">4♠</span>',
    oesd: '<span class="stat-icon oesd">⇄</span>',
    gutshot: '<span class="stat-icon gs">→</span>',
    nothing: '<span class="stat-icon nothing">∅</span>'
};

// Preset ranges
const RANGE_PRESETS = {
    premium: ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    value: ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'AQs', 'AQo'],
    broadways: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo', 'KQs', 'KQo', 'KJs', 'KJo', 'KTs', 'QJs', 'QJo', 'QTs', 'JTs'],
    all: ALL_HANDS_SORTED,
    suited_connectors: ALL_HANDS_SORTED.filter(h => {
        if (!h.endsWith('s')) return false;
        const r1 = RANK_VALUES[h[0]];
        const r2 = RANK_VALUES[h[1]];
        return Math.abs(r1 - r2) === 1;
    }),
    pp: ALL_HANDS_SORTED.filter(h => h[0] === h[1])
};

// Position presets (6-max standard opening ranges)
const POSITION_PRESETS = {
    'UTG': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'AKo', 'AQo'],
    'MP': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'AKo', 'AQo', 'AJo'],
    'CO': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A5s', 'A4s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo'],
    'BTN': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'QJs', 'QTs', 'Q9s', 'Q8s', 'JTs', 'J9s', 'J8s', 'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '54s', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'KQo', 'KJo', 'KTo', 'QJo', 'QTo', 'JTo'],
    'SB': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s', '65s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo'],
    'BB': ALL_HANDS_SORTED // BB defends wide
};

// All valid hand notations (for import parsing)
const ALL_VALID_HANDS = new Set(ALL_HANDS_SORTED);

// ============================================================
// engine.js — Pure poker logic (no DOM dependencies)
// ============================================================

// ── Combo Cache ──────────────────────────────────────────────
const comboCache = new Map();
const CACHE_MAX = 10000;

function handToCombosOptimized(hand, deadCardsList = []) {
    const cacheKey = `${hand}-${[...deadCardsList].sort().join('')}`;
    if (comboCache.has(cacheKey)) {
        // Move to end for LRU behavior (Map preserves insertion order)
        const val = comboCache.get(cacheKey);
        comboCache.delete(cacheKey);
        comboCache.set(cacheKey, val);
        return val;
    }
    const combos = handToCombos(hand, deadCardsList);
    comboCache.set(cacheKey, combos);
    // Evict oldest entry if cache is full
    if (comboCache.size > CACHE_MAX) {
        const firstKey = comboCache.keys().next().value;
        comboCache.delete(firstKey);
    }
    return combos;
}

function clearComboCache() {
    comboCache.clear();
}

// ── Combo Generation ─────────────────────────────────────────
function handToCombos(hand, deadCardsList = []) {
    const combos = [];
    const dead = new Set(deadCardsList);

    if (hand.length === 2) {
        // Pocket pair
        const rank = hand[0];
        for (let i = 0; i < SUITS.length; i++) {
            for (let j = i + 1; j < SUITS.length; j++) {
                const c1 = rank + SUITS[i];
                const c2 = rank + SUITS[j];
                if (!dead.has(c1) && !dead.has(c2)) {
                    combos.push([c1, c2]);
                }
            }
        }
    } else if (hand.endsWith('s')) {
        // Suited
        const rank1 = hand[0], rank2 = hand[1];
        SUITS.forEach(suit => {
            const c1 = rank1 + suit, c2 = rank2 + suit;
            if (!dead.has(c1) && !dead.has(c2)) combos.push([c1, c2]);
        });
    } else if (hand.endsWith('o')) {
        // Offsuit
        const rank1 = hand[0], rank2 = hand[1];
        for (let i = 0; i < SUITS.length; i++) {
            for (let j = 0; j < SUITS.length; j++) {
                if (i !== j) {
                    const c1 = rank1 + SUITS[i], c2 = rank2 + SUITS[j];
                    if (!dead.has(c1) && !dead.has(c2)) combos.push([c1, c2]);
                }
            }
        }
    }
    return combos;
}

// ── Combo Count (lighter, no allocation) ─────────────────────
function getCombosCount(hand, deadCardsList = []) {
    const dead = new Set(deadCardsList);
    let count = 0;

    if (hand.length === 2) {
        const rank = hand[0];
        for (let i = 0; i < SUITS.length; i++) {
            for (let j = i + 1; j < SUITS.length; j++) {
                if (!dead.has(rank + SUITS[i]) && !dead.has(rank + SUITS[j])) count++;
            }
        }
    } else if (hand.endsWith('s')) {
        const r1 = hand[0], r2 = hand[1];
        SUITS.forEach(s => { if (!dead.has(r1 + s) && !dead.has(r2 + s)) count++; });
    } else if (hand.endsWith('o')) {
        const r1 = hand[0], r2 = hand[1];
        for (let i = 0; i < SUITS.length; i++) {
            for (let j = 0; j < SUITS.length; j++) {
                if (i !== j && !dead.has(r1 + SUITS[i]) && !dead.has(r2 + SUITS[j])) count++;
            }
        }
    }
    return count;
}

// ── Deck ─────────────────────────────────────────────────────
function createDeck() {
    const deck = [];
    RANKS.forEach(rank => SUITS.forEach(suit => deck.push(rank + suit)));
    return deck;
}

// ── Hand Evaluation ──────────────────────────────────────────
function evaluatePokerHand(cards) {
    if (cards.length !== 5) return { rank: 0, value: [] };

    const rankCounts = {};
    const suitCounts = {};
    const cardValues = [];

    cards.forEach(card => {
        const rank = card[0], suit = card[1];
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        suitCounts[suit] = (suitCounts[suit] || 0) + 1;
        cardValues.push(RANK_VALUES[rank]);
    });

    const counts = Object.entries(rankCounts)
        .map(([rank, count]) => ({ rank, count, value: RANK_VALUES[rank] }))
        .sort((a, b) => b.count !== a.count ? b.count - a.count : b.value - a.value);

    const sortedValues = cardValues.sort((a, b) => b - a);
    const isFlush = Math.max(...Object.values(suitCounts)) === 5;

    let isStraight = false;
    let straightHigh = 0;
    const uniqueValues = [...new Set(sortedValues)].sort((a, b) => b - a);

    if (uniqueValues.length >= 5) {
        for (let i = 0; i <= uniqueValues.length - 5; i++) {
            if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
                isStraight = true;
                straightHigh = uniqueValues[i];
                break;
            }
        }
    }

    // Wheel (A-2-3-4-5)
    if (!isStraight && uniqueValues.includes(14) && uniqueValues.includes(5) &&
        uniqueValues.includes(4) && uniqueValues.includes(3) && uniqueValues.includes(2)) {
        isStraight = true;
        straightHigh = 5;
    }

    const countPattern = counts.map(c => c.count).join('');
    const values = counts.map(c => c.value);

    if (isFlush && isStraight) return { rank: 9, value: [straightHigh] };
    if (countPattern.startsWith('4')) return { rank: 8, value: [values[0], values[1]] };
    if (countPattern === '32') return { rank: 7, value: [values[0], values[1]] };
    if (isFlush) return { rank: 6, value: sortedValues };
    if (isStraight) return { rank: 5, value: [straightHigh] };
    if (countPattern.startsWith('3')) return { rank: 4, value: values };
    if (countPattern.startsWith('22')) return { rank: 3, value: values };
    if (countPattern.startsWith('2')) return { rank: 2, value: values };
    return { rank: 1, value: sortedValues };
}

function getBestHand(sevenCards) {
    let bestHand = { rank: 0, value: [] };

    for (let i = 0; i < sevenCards.length; i++) {
        for (let j = i + 1; j < sevenCards.length; j++) {
            for (let k = j + 1; k < sevenCards.length; k++) {
                for (let l = k + 1; l < sevenCards.length; l++) {
                    for (let m = l + 1; m < sevenCards.length; m++) {
                        const fiveCards = [sevenCards[i], sevenCards[j], sevenCards[k], sevenCards[l], sevenCards[m]];
                        const hand = evaluatePokerHand(fiveCards);
                        if (hand.rank > bestHand.rank) {
                            bestHand = hand;
                        } else if (hand.rank === bestHand.rank) {
                            for (let n = 0; n < hand.value.length; n++) {
                                if (hand.value[n] > bestHand.value[n]) { bestHand = hand; break; }
                                else if (hand.value[n] < bestHand.value[n]) { break; }
                            }
                        }
                    }
                }
            }
        }
    }
    return bestHand;
}

function compareHands(hand1, hand2) {
    if (hand1.rank > hand2.rank) return 1;
    if (hand1.rank < hand2.rank) return -1;
    for (let i = 0; i < Math.max(hand1.value.length, hand2.value.length); i++) {
        const v1 = hand1.value[i] || 0, v2 = hand2.value[i] || 0;
        if (v1 > v2) return 1;
        if (v1 < v2) return -1;
    }
    return 0;
}

// ── Pair Classification ──────────────────────────────────────
function classifyPairType(hand, board) {
    const boardRanksArr = board.map(c => c[0]);
    const boardValues = board.map(c => RANK_VALUES[c[0]]).sort((a, b) => b - a);

    const handRank1 = hand[0][0], handRank2 = hand[1][0];
    const handValue1 = RANK_VALUES[handRank1], handValue2 = RANK_VALUES[handRank2];

    // Pocket pair
    if (handRank1 === handRank2) {
        return handValue1 > boardValues[0] ? 'overpair' : 'weakpair';
    }

    const hand1PairsBoard = boardRanksArr.includes(handRank1);
    const hand2PairsBoard = boardRanksArr.includes(handRank2);

    if (!hand1PairsBoard && !hand2PairsBoard) return 'weakpair';

    const pairedCardValue = hand1PairsBoard ? handValue1 : handValue2;
    const topBoardValue = boardValues[0];
    const bottomBoardValue = boardValues[boardValues.length - 1];

    if (pairedCardValue === topBoardValue) return 'toppair';
    if (pairedCardValue === bottomBoardValue) return 'bottompair';
    if (pairedCardValue < topBoardValue && pairedCardValue > bottomBoardValue) return 'middlepair';
    return 'weakpair';
}

// ── Draw Analysis ────────────────────────────────────────────
function analyzeDraws(hand, board) {
    const allCards = [...hand, ...board];
    const draws = { flushDraw: false, oesd: false, gutshot: false, outs: 0 };

    // Flush Draw (exactly 4 of same suit)
    const suitCounts = {};
    allCards.forEach(card => {
        const suit = card[1];
        suitCounts[suit] = (suitCounts[suit] || 0) + 1;
    });
    if (Math.max(...Object.values(suitCounts)) === 4) {
        draws.flushDraw = true;
        draws.outs += 9;
    }

    // Straight draws
    const rankSetNormal = new Set(allCards.map(c => RANK_VALUES[c[0]]));
    const hasAce = rankSetNormal.has(14);
    const rankSetWheel = new Set(rankSetNormal);
    if (hasAce) { rankSetWheel.delete(14); rankSetWheel.add(1); }

    const ranksToCheck = [
        [...rankSetNormal].sort((a, b) => b - a),
        hasAce ? [...rankSetWheel].sort((a, b) => b - a) : null
    ].filter(Boolean);

    for (const uniqueRanks of ranksToCheck) {
        if (draws.oesd) break;

        // OESD: 4 consecutive ranks
        for (let i = 0; i <= uniqueRanks.length - 4; i++) {
            const s = uniqueRanks.slice(i, i + 4);
            if (s[0] - s[1] === 1 && s[1] - s[2] === 1 && s[2] - s[3] === 1) {
                draws.oesd = true;
                break;
            }
        }

        // Gutshot: 4 ranks spanning 5 with exactly 1 gap of 2
        if (!draws.oesd && !draws.gutshot) {
            for (let i = 0; i <= uniqueRanks.length - 4; i++) {
                const s = uniqueRanks.slice(i, i + 4);
                if (s[0] - s[3] === 4) {
                    const gaps = [s[0] - s[1], s[1] - s[2], s[2] - s[3]];
                    if (gaps.filter(g => g === 2).length === 1 && gaps.filter(g => g === 1).length === 2) {
                        draws.gutshot = true;
                        break;
                    }
                }
            }

            // Double belly buster
            if (!draws.gutshot && uniqueRanks.length >= 5) {
                for (let i = 0; i <= uniqueRanks.length - 5; i++) {
                    const s = uniqueRanks.slice(i, i + 5);
                    if (s[0] - s[4] === 6) {
                        const gaps = [s[0] - s[1], s[1] - s[2], s[2] - s[3], s[3] - s[4]];
                        if (gaps.filter(g => g === 2).length === 2 && gaps.filter(g => g === 1).length === 2) {
                            draws.oesd = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    // Outs for combo draws
    if (draws.flushDraw && draws.oesd) draws.outs = 15;
    else if (draws.flushDraw && draws.gutshot) draws.outs = 12;
    else if (draws.flushDraw) draws.outs = 9;
    else if (draws.oesd) draws.outs = 8;
    else if (draws.gutshot) draws.outs = 4;
    else draws.outs = 0;

    return draws;
}

// ── Category Helper ──────────────────────────────────────────
function getCategoryFromHand(combo, board, bestHand) {
    switch (bestHand.rank) {
        case 9: return 'straightflush';
        case 8: return 'quads';
        case 7: return 'fullhouse';
        case 6: return 'flush';
        case 5: return 'straight';
        case 4: return 'trips';
        case 3: return 'twopair';
        case 2: return classifyPairType(combo, board) || 'weakpair';
        case 1: {
            const draws = analyzeDraws(combo, board);
            if (draws.flushDraw) return 'flushdraw';
            if (draws.oesd) return 'oesd';
            if (draws.gutshot) return 'gutshot';
            return 'nothing';
        }
        default: return 'nothing';
    }
}

// ── Range Stats Calculation ──────────────────────────────────
function calculateRealRangeStats(range, board, deadCardsSet, specificCombo = null) {
    const allDeadCards = [...board, ...Array.from(deadCardsSet)];

    const stats = {};
    const statKeys = ['straightflush', 'quads', 'fullhouse', 'flush', 'straight', 'trips',
        'twopair', 'overpair', 'toppair', 'middlepair', 'bottompair', 'weakpair',
        'flushdraw', 'oesd', 'gutshot', 'nothing'];
    statKeys.forEach(k => {
        stats[k] = { combos: 0, percent: 0, hands: [] };
    });

    let combosToEvaluate = [];
    if (specificCombo && specificCombo.length === 2) {
        if (!allDeadCards.includes(specificCombo[0]) && !allDeadCards.includes(specificCombo[1])) {
            combosToEvaluate.push({ handStr: specificCombo.join(''), combo: specificCombo });
        }
    } else {
        range.forEach(hand => {
            handToCombosOptimized(hand, allDeadCards).forEach(combo => {
                combosToEvaluate.push({ handStr: hand, combo: combo });
            });
        });
    }

    combosToEvaluate.forEach(({ handStr, combo }) => {
        const allCards = [...combo, ...board];
        const bestHand = getBestHand(allCards);
        const categories = [];

        // Primary category
        switch (bestHand.rank) {
            case 9: categories.push('straightflush'); break;
            case 8: categories.push('quads'); break;
            case 7: categories.push('fullhouse'); break;
            case 6: categories.push('flush'); break;
            case 5: categories.push('straight'); break;
            case 4: categories.push('trips'); break;
            case 3: categories.push('twopair'); break;
            case 2: categories.push(classifyPairType(combo, board) || 'weakpair'); break;
            case 1: categories.push('nothing'); break;
        }

        // Add draws on top of made hands
        const draws = analyzeDraws(combo, board);
        if (draws.flushDraw) categories.push('flushdraw');
        if (draws.oesd) categories.push('oesd');
        if (draws.gutshot) categories.push('gutshot');

        // Remove "nothing" if we have draws
        if (categories.includes('nothing') && categories.length > 1) {
            categories.splice(categories.indexOf('nothing'), 1);
        }

        if (categories.length === 0) categories.push('nothing');

        categories.forEach(cat => {
            stats[cat].combos++;
            if (!stats[cat].hands.includes(handStr)) stats[cat].hands.push(handStr);
            if (!stats[cat].comboList) stats[cat].comboList = [];
            stats[cat].comboList.push(combo);
        });
    });

    // Percentages based on total base combos
    let totalBaseCombos = combosToEvaluate.length;

    Object.keys(stats).forEach(key => {
        stats[key].percent = totalBaseCombos > 0
            ? ((stats[key].combos / totalBaseCombos) * 100).toFixed(1)
            : 0;
    });

    return stats;
}

// ── Board Texture Analysis ───────────────────────────────────
// FIX: renamed local vars to avoid shadowing global RANKS/SUITS
function analyzeBoardTexture(boardCards) {
    if (boardCards.length < 3) return null;

    const boardRanks = boardCards.map(c => c[0]);
    const boardSuits = boardCards.map(c => c[1]);
    const boardValues = boardRanks.map(r => RANK_VALUES[r]).sort((a, b) => b - a);

    const analysis = [];

    // Pairs on the board
    const rankCounts = {};
    boardRanks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);
    const pairs = Object.values(rankCounts).filter(c => c >= 2).length;
    if (pairs > 0) analysis.push('⚠️ <strong>Paired</strong>');

    // Flush draw possible
    const suitCounts = {};
    boardSuits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
    const maxSuit = Math.max(...Object.values(suitCounts));
    if (maxSuit >= 3) analysis.push('💧 <strong>Flush Draw</strong>');
    else if (maxSuit === 2) analysis.push('💦 <strong>Backdoor Flush</strong>');

    // Connectivity
    const gaps = [];
    for (let i = 0; i < boardValues.length - 1; i++) {
        gaps.push(boardValues[i] - boardValues[i + 1]);
    }
    const connected = gaps.filter(g => g === 1).length;
    const maxGap = Math.max(...gaps);

    if (connected >= 2) analysis.push('📈 <strong>Highly Connected</strong>');
    else if (connected === 1) analysis.push('➡️ <strong>Connected</strong>');
    else if (maxGap >= 4) analysis.push('🏝️ <strong>Rainbow</strong>');

    // Board height
    const topCard = Math.max(...boardValues);
    if (topCard >= 12) analysis.push('👑 <strong>High Card</strong>');
    else if (topCard <= 9) analysis.push('📉 <strong>Low Card</strong>');

    // Wet vs Dry
    const wetness = (maxSuit >= 2 ? 1 : 0) + (connected >= 1 ? 1 : 0) + (pairs > 0 ? 1 : 0);
    if (wetness >= 2) analysis.push('🌊 <span style="color: #2196F3; font-weight: 600;">WET BOARD</span>');
    else if (wetness === 0) analysis.push('🏜️ <span style="color: #FF9800; font-weight: 600;">DRY BOARD</span>');

    return analysis;
}

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
let equityWorker = null;

function getCurrentStreet() {
    if (boardCards.length < 3) return 'flop';
    if (boardCards.length === 3) return 'flop';
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
}

function updateRangeInfo(player) {
    let totalCombos = 0;
    const allDeadCards = [...boardCards, ...Array.from(deadCards)];
    const isSpecific = specificHand[player] && specificHand[player].length === 2;

    if (isSpecific) {
        const combo = specificHand[player];
        if (!allDeadCards.includes(combo[0]) && !allDeadCards.includes(combo[1])) {
            totalCombos = 1;
        } else {
            totalCombos = 0;
        }
    } else if (activeFilters[player] && activeFilters[player].size > 0) {
        totalCombos = getFilteredRangeCombos(player, allDeadCards).length;
    } else {
        const handsToCount = getFilteredRangeHands(player);
        handsToCount.forEach(hand => {
            totalCombos += getCombosCount(hand, allDeadCards);
        });
    }

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
}


// ── Mode Selection ───────────────────────────────────────────
function setMode(player, mode) {
    const matrixSection = document.getElementById(`${player}MatrixSection`);
    const handSection = document.getElementById(`${player}SpecificHand`);
    const rangeBtn = document.getElementById(`${player}ModeRange`);
    const handBtn = document.getElementById(`${player}ModeHand`);

    let hasAnyFilter = false;
    for (const st of ['flop', 'turn', 'river']) {
        if (activeFilters[player][st].size > 0) hasAnyFilter = true;
    }

    if (activeHighlight[player].length > 0) {
        document.getElementById(`${player}ModeHighlight`).style.display = 'block';
        document.querySelector(`.hero-section #heroModeHighlight`).classList.add('active');
        document.querySelector(`.villain-section #villainModeHighlight`).classList.add('active');
    } else if (hasAnyFilter) {
        matrixSection.style.display = 'none';
        handSection.style.display = 'block';
        rangeBtn.classList.remove('active');
        handBtn.classList.add('active');
    } else if (mode === 'range') {
        matrixSection.style.display = 'block';
        handSection.style.display = 'none';
        rangeBtn.classList.add('active');
        handBtn.classList.remove('active');
        specificHand[player] = null;
    } else { // mode === 'hand'
        matrixSection.style.display = 'none';
        handSection.style.display = 'block';
        rangeBtn.classList.remove('active');
        handBtn.classList.add('active');
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
}

function clearRange(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
    range.clear();
    document.querySelectorAll(`#${matrixId} .range-cell.selected`).forEach(cell => cell.classList.remove('selected'));

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

    updateRangeInfo(player);
    updateSlider(player);
    updateRangeChart(player);
    analyzeRanges();
}

// FIX: Added missing updateRangeDisplay function (was causing crash on load)
function updateRangeDisplay(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
    const filteredHands = new Set(getFilteredRangeHands(player));
    const hasFilters = activeFilters[player].size > 0;

    const globalBlockedArr = Array.from(globalBlocked);

    let hasAnyFilter = false;
    for (const st of ['flop', 'turn', 'river']) {
        if (activeFilters[player][st].size > 0) hasAnyFilter = true;
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

// ── Statistics ───────────────────────────────────────────────
function analyzeRanges() {
    analyzeRange('hero');
    analyzeRange('villain');
    calculateEquity();
}

function analyzeRange(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    // Allow stats even if range.size is 0 if a specific hand is selected
    const isSpecific = specificHand[player] && specificHand[player].length === 2;
    if ((range.size === 0 && !isSpecific) || boardCards.length < 3) {
        displayStats(player, null);
        currentStats[player] = null;
        if (boardCards.length < 3) clearHighlight(player);
        return;
    }
    const specificCombo = isSpecific ? specificHand[player] : null;
    const stats = calculateRealRangeStats(range, boardCards, deadCards, specificCombo);
    currentStats[player] = stats;
    displayStats(player, stats);
    updateRangeChart(player);
    if (activeHighlight[player] && activeHighlight[player].length > 0) refreshHighlight(player);
}

function displayStats(player, stats) {
    const statsDiv = document.getElementById(`${player}Stats`);
    if (!stats) {
        statsDiv.innerHTML = '<div style="padding: 10px; text-align: center; color: var(--text-faint);">Sélectionnez une range et un board</div>';
        return;
    }

    let html = '<div class="stat-row stat-header">';
    html += '<div class="stat-cell" style="width: 30px; border-right: none;"></div>'; // Filter column
    html += '<div class="stat-cell">Main</div>';
    html += '<div class="stat-cell">Combos</div>';
    html += '<div class="stat-cell">%</div>';
    html += '</div>';

    const statKeys = ['straightflush', 'quads', 'fullhouse', 'flush', 'straight', 'trips',
        'twopair', 'overpair', 'toppair', 'middlepair', 'bottompair', 'weakpair',
        'flushdraw', 'oesd', 'gutshot', 'nothing'];

    const sortedStats = statKeys.map(k => [k, stats[k]]);

    sortedStats.forEach(([key, value]) => {
        if (!value) return;
        const color = STAT_COLORS[key];
        const isFiltered = activeFilters[player][getCurrentStreet()].has(key);
        html += `<div class="stat-row" data-statkey="${key}">`;

        // Filter Icon
        html += `<div class="stat-cell filter-cell" style="width: 30px; border-right: none;" onclick="event.stopPropagation(); toggleFilter('${player}', '${key}')" title="Filtrer la range">`;
        html += `<span class="filter-icon ${isFiltered ? 'active' : ''}">⚡</span>`;
        html += `</div>`;

        html += `<div class="stat-cell stat-label" onclick="showCombos('${player}', '${key}', '${STAT_LABELS[key]}')">${STAT_ICONS[key]} ${STAT_LABELS[key]}</div>`;
        html += `<div class="stat-cell stat-value" onclick="showCombos('${player}', '${key}', '${STAT_LABELS[key]}')">${value.combos}</div>`;
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

    if (categories.includes('nothing') && categories.length > 1) {
        categories.splice(categories.indexOf('nothing'), 1);
    }
    if (categories.length === 0) categories.push('nothing');

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
function updateRangeChart(player) {
    const stats = currentStats[player];
    if (!stats) return;

    const activeStats = Object.entries(stats).filter(([, v]) => v.combos > 0);
    if (activeStats.length === 0) return;

    const ctx = document.getElementById(`${player}Chart`);
    if (player === 'hero' && heroChart) heroChart.destroy();
    if (player === 'villain' && villainChart) villainChart.destroy();

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
    try {
        equityWorker = new Worker('equity-worker.js');
        equityWorker.onerror = function (err) {
            console.warn('Worker error, falling back to main thread', err);
            equityWorker = null;
            useWorker = false;
        };
        equityWorker.onmessage = function (e) {
            const data = e.data;
            if (data.type === 'progress') return;
            if (data.type === 'result') displayEquityResult(data.range1, data.range2);
        };
        useWorker = true;
        console.log('Equity: using Web Worker');
    } catch (e) {
        console.warn('Cannot create Worker (file:// protocol?), using main thread', e);
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
    if (heroRange.size === 0 || villainRange.size === 0) {
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

    const allDeadInfo = [...boardCards, ...Array.from(deadCards)];
    if (useWorker && equityWorker) {
        equityWorker.postMessage({
            heroCombos: getFilteredRangeCombos('hero', allDeadInfo),
            villainCombos: getFilteredRangeCombos('villain', allDeadInfo),
            board: boardCards,
            deadCards: Array.from(deadCards),
            iterations: iterations
        });
    } else {
        calculateEquityMainThread(iterations);
    }
}

// ── Main-thread fallback (async chunked to keep UI responsive) ──
function calculateEquityMainThread(iterations) {
    equityCalcId++;
    const calcId = equityCalcId;

    const allDead = [...boardCards, ...Array.from(deadCards)];
    const allDeadSet = new Set(allDead);

    const range1Combos = getFilteredRangeCombos('hero', allDead);
    const range2Combos = getFilteredRangeCombos('villain', allDead);

    if (range1Combos.length === 0 || range2Combos.length === 0) {
        const eq1 = range1Combos.length > 0 ? 100 : 0;
        const eq2 = range2Combos.length > 0 ? 100 : 0;
        displayEquityResult(eq1, eq2);
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
let specificHand = { hero: null, villain: null };

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

        // Update matrix visual to match
        const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
        document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
            cell.classList.toggle('selected', range.has(cell.dataset.hand));
        });
    } else {
        // If < 2 cards, hand is incomplete -> Clear range
        specificHand[player] = null;
        range.clear();

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

function calculateHotness(player) {
    const range = player === 'hero' ? heroRange : villainRange;
    const opponent = player === 'hero' ? villainRange : heroRange;

    if (range.size === 0 || opponent.size === 0) {
        alert('Les deux ranges doivent être sélectionnées');
        hotnessActive[player] = false;
        return;
    }

    const matrixId = player === 'hero' ? 'heroMatrix' : 'villainMatrix';
    const allDead = [...boardCards, ...Array.from(deadCards)];
    const allDeadSet = new Set(allDead);
    const baseDeck = createDeck().filter(c => !allDeadSet.has(c));
    const iterations = 300;

    // Calculate base equity
    const baseEquity = quickEquity(range, opponent, boardCards, baseDeck, allDead, iterations);

    // Calculate equity without each hand (removal effect)
    const hotnessMap = new Map();
    let maxDelta = 0;

    range.forEach(hand => {
        const reducedRange = new Set(range);
        reducedRange.delete(hand);
        if (reducedRange.size === 0) {
            hotnessMap.set(hand, 0);
            return;
        }
        const reducedEquity = quickEquity(reducedRange, opponent, boardCards, baseDeck, allDead, iterations);
        const delta = Math.abs(baseEquity - reducedEquity);
        hotnessMap.set(hand, delta);
        if (delta > maxDelta) maxDelta = delta;
    });

    // Display heatmap
    document.querySelectorAll(`#${matrixId} .range-cell`).forEach(cell => {
        const hand = cell.dataset.hand;
        if (!range.has(hand)) return;
        const delta = hotnessMap.get(hand) || 0;
        const intensity = maxDelta > 0 ? delta / maxDelta : 0;

        // Color from cold (blue) to hot (red)
        const r = Math.round(255 * intensity);
        const g = Math.round(100 * (1 - intensity));
        const b = Math.round(255 * (1 - intensity));
        cell.style.background = `rgba(${r}, ${g}, ${b}, 0.85)`;
        cell.style.color = 'white';
        cell.style.fontWeight = '700';
        cell.style.textShadow = '0 1px 2px rgba(0,0,0,0.5)';
        cell.title = `Removal: ${(delta).toFixed(1)}%`;
    });
}

function quickEquity(range1Set, range2Set, board, baseDeck, allDead, iterations) {
    const r1Combos = [];
    range1Set.forEach(h => r1Combos.push(...handToCombos(h, allDead)));
    const r2Combos = [];
    range2Set.forEach(h => r2Combos.push(...handToCombos(h, allDead)));

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
