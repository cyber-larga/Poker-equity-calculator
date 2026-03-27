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
    backdoorflush: 'rgba(30, 140, 160, 0.70)',
    nothing: 'rgba(189, 189, 189, 0.85)',
    // Hauteurs (high card hands grouped by top card)
    hauteurA: 'rgba(220, 53, 69, 0.70)',
    hauteurK: 'rgba(108, 117, 125, 0.75)',
    hauteurQ: 'rgba(90, 105, 120, 0.70)',
    hauteurJ: 'rgba(75, 90, 110, 0.68)',
    hauteurT: 'rgba(60, 80, 100, 0.66)',
    hauteur9: 'rgba(50, 70, 90, 0.64)',
    hauteur8: 'rgba(45, 65, 85, 0.62)',
    hauteur7: 'rgba(40, 60, 80, 0.60)',
    hauteur6: 'rgba(35, 55, 75, 0.58)',
    hauteur5: 'rgba(30, 50, 70, 0.56)',
    hauteur4: 'rgba(25, 45, 65, 0.54)',
    hauteur3: 'rgba(20, 40, 60, 0.52)',
    hauteur2: 'rgba(15, 35, 55, 0.50)'
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
    backdoorflush: 'Backdoor Flush',
    nothing: 'Rien',
    hauteurA: 'Hauteur Ax',
    hauteurK: 'Hauteur Kx',
    hauteurQ: 'Hauteur Qx',
    hauteurJ: 'Hauteur Jx',
    hauteurT: 'Hauteur Tx',
    hauteur9: 'Hauteur 9x',
    hauteur8: 'Hauteur 8x',
    hauteur7: 'Hauteur 7x',
    hauteur6: 'Hauteur 6x',
    hauteur5: 'Hauteur 5x',
    hauteur4: 'Hauteur 4x',
    hauteur3: 'Hauteur 3x',
    hauteur2: 'Hauteur 2x'
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
    backdoorflush: '💧 Backdoor Flush',
    nothing: '❌ Rien',
    hauteurA: '🅰 Hauteur Ax',
    hauteurK: '🎴 Hauteur Kx',
    hauteurQ: '🎴 Hauteur Qx',
    hauteurJ: '🎴 Hauteur Jx',
    hauteurT: '🎴 Hauteur Tx',
    hauteur9: '🎴 Hauteur 9x',
    hauteur8: '🎴 Hauteur 8x',
    hauteur7: '🎴 Hauteur 7x',
    hauteur6: '🎴 Hauteur 6x',
    hauteur5: '🎴 Hauteur 5x',
    hauteur4: '🎴 Hauteur 4x',
    hauteur3: '🎴 Hauteur 3x',
    hauteur2: '🎴 Hauteur 2x'
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
    backdoorflush: '<span class="stat-icon bdfd">bd♠</span>',
    nothing: '<span class="stat-icon nothing">∅</span>',
    hauteurA: '<span class="stat-icon hc">A</span>',
    hauteurK: '<span class="stat-icon hc">K</span>',
    hauteurQ: '<span class="stat-icon hc">Q</span>',
    hauteurJ: '<span class="stat-icon hc">J</span>',
    hauteurT: '<span class="stat-icon hc">T</span>',
    hauteur9: '<span class="stat-icon hc">9</span>',
    hauteur8: '<span class="stat-icon hc">8</span>',
    hauteur7: '<span class="stat-icon hc">7</span>',
    hauteur6: '<span class="stat-icon hc">6</span>',
    hauteur5: '<span class="stat-icon hc">5</span>',
    hauteur4: '<span class="stat-icon hc">4</span>',
    hauteur3: '<span class="stat-icon hc">3</span>',
    hauteur2: '<span class="stat-icon hc">2</span>'
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
