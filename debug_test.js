const fs = require('fs');
let code = fs.readFileSync('config.js', 'utf8') + '\n' + fs.readFileSync('engine.js', 'utf8') + '\n' + fs.readFileSync('ui.js', 'utf8');
code = code.replace(/document\.addEventListener.*?\);/gs, '');
fs.writeFileSync('merged.js', code);

