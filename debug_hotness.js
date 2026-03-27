const fs = require('fs');
const engineSrc = fs.readFileSync('engine.js', 'utf8');
const uiSrc = fs.readFileSync('ui.js', 'utf8');
const configSrc = fs.readFileSync('config.js', 'utf8');

eval(configSrc);
eval(engineSrc);

const r1CombosFuncStr = uiSrc.substring(uiSrc.indexOf('function quickEquity'), uiSrc.indexOf('function clearHotnessDisplay'));
eval(r1CombosFuncStr);

const heroRange = new Set(['66', 'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs']);
const villainRange = new Set();
const villainSpecific = ['8d', '7d'];
const board = ['Td', '4s', '6s'];

const effectiveDead = ['Td', '4s', '6s', '8d', '7d'];
const allDeadSet = new Set(effectiveDead);
const baseDeck = createDeck().filter(c => !allDeadSet.has(c));

const baseEq = quickEquity(heroRange, villainRange, board, baseDeck, effectiveDead, 10000, null, villainSpecific);
console.log('Base Equity:', baseEq);

const reducedRange = new Set(heroRange);
reducedRange.delete('66');
const reducedEq = quickEquity(reducedRange, villainRange, board, baseDeck, effectiveDead, 10000, null, villainSpecific);
console.log('Reduced Equity (without 66):', reducedEq);
console.log('Delta 66:', baseEq - reducedEq);

const reducedRangeBad = new Set(heroRange);
reducedRangeBad.delete('AKs');
const reducedEqBad = quickEquity(reducedRangeBad, villainRange, board, baseDeck, effectiveDead, 10000, null, villainSpecific);
console.log('Reduced Equity (without AKs):', reducedEqBad);
console.log('Delta AKs:', baseEq - reducedEqBad);
