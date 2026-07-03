const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/explanationHindi/g, 'explanationEnglish');
code = code.replace(/in Hindi/g, 'in English');
fs.writeFileSync('server.ts', code);
