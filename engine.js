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
    const draws = { flushDraw: false, oesd: false, gutshot: false, backdoorFlush: false, outs: 0 };

    // Flush Draw (exactly 4 of same suit) or Backdoor Flush Draw (exactly 3)
    const suitCounts = {};
    allCards.forEach(card => {
        const suit = card[1];
        suitCounts[suit] = (suitCounts[suit] || 0) + 1;
    });
    const maxSuit = Math.max(...Object.values(suitCounts));
    if (maxSuit === 4) {
        draws.flushDraw = true;
        draws.outs += 9;
    } else if (maxSuit === 3) {
        draws.backdoorFlush = true;
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

// Rank → hauteur key mapping
const RANK_TO_HAUTEUR = { A: 'hauteurA', K: 'hauteurK', Q: 'hauteurQ', J: 'hauteurJ', T: 'hauteurT', 9: 'hauteur9', 8: 'hauteur8', 7: 'hauteur7', 6: 'hauteur6', 5: 'hauteur5', 4: 'hauteur4', 3: 'hauteur3', 2: 'hauteur2' };

// ── Range Stats Calculation ──────────────────────────────────
function calculateRealRangeStats(range, board, deadCardsSet, specificCombo = null) {
    const allDeadCards = [...board, ...Array.from(deadCardsSet)];

    const stats = {};
    const statKeys = ['straightflush', 'quads', 'fullhouse', 'flush', 'straight', 'trips',
        'twopair', 'overpair', 'toppair', 'middlepair', 'bottompair', 'weakpair',
        'flushdraw', 'oesd', 'gutshot', 'backdoorflush', 'nothing',
        'hauteurA', 'hauteurK', 'hauteurQ', 'hauteurJ', 'hauteurT',
        'hauteur9', 'hauteur8', 'hauteur7', 'hauteur6', 'hauteur5', 'hauteur4', 'hauteur3', 'hauteur2'];
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
        if (draws.backdoorFlush) categories.push('backdoorflush');

        // Remove "nothing" if we have real draws (not just backdoor)
        const hasRealDraw = categories.some(c => c !== 'nothing' && c !== 'backdoorflush');
        if (categories.includes('nothing') && hasRealDraw) {
            categories.splice(categories.indexOf('nothing'), 1);
        }

        if (categories.length === 0) categories.push('nothing');

        // Hauteur: classify pure nothing hands by highest hole-card rank
        if (categories.length === 1 && categories[0] === 'nothing' && board.length >= 3) {
            const v1 = RANK_VALUES[combo[0][0]], v2 = RANK_VALUES[combo[1][0]];
            const topRank = v1 >= v2 ? combo[0][0] : combo[1][0];
            const hauteurKey = RANK_TO_HAUTEUR[topRank];
            if (hauteurKey) {
                // Replace 'nothing' with the hauteur category
                categories.splice(categories.indexOf('nothing'), 1);
                categories.push('nothing'); // keep nothing stat also for backward compat
                categories.push(hauteurKey);
            }
        }

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
