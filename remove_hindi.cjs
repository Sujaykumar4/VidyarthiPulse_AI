const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove language state
code = code.replace(/const \[language, setLanguage\] = useState\<'HI' \| 'EN'\>\('HI'\);\n/, '');

// Remove language toggles
code = code.replace(/\{language === 'HI' \? ([^:]*) : ([^\}]*)\}/g, (match, hi, en) => {
    // en might have surrounding quotes if it's a string literal like 'English'
    return '{' + en.trim() + '}';
});

// For instances where it's not wrapped in {} but inside an expression
code = code.replace(/language === 'HI' \? ([^:]*) : ([^;,\n]*)/g, (match, hi, en) => {
    return en.trim();
});

// Remove Language button
code = code.replace(/<button[^>]*onClick=\{\(\) => setLanguage\([^>]*\}[^>]*>[\s\S]*?<\/button>/, '');

// Update state init for explanation
code = code.replace(/explanationHindi/g, 'explanationEnglish');

fs.writeFileSync('src/App.tsx', code);
