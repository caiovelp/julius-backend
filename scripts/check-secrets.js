const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .filter((file) => /\.(js|jsx|ts|tsx|json|mjs|cjs|env)$/.test(file));

const patterns = [
    {
        regex: /AIza[0-9A-Za-z\-_]{20,}/,
        label: 'Firebase API key-like value',
    },
    {
        regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
        label: 'Private key block',
    },
    {
        regex: /"private_key"\s*:\s*"/,
        label: 'Service account private_key field',
    },
    {
        regex: /"client_email"\s*:\s*"/,
        label: 'Service account client_email field',
    },
    {
        regex: /apiKey\s*:\s*['"][^'"]+['"]/,
        label: 'Hardcoded apiKey property',
    },
];

const violations = [];

for (const file of trackedFiles) {
    const filePath = path.resolve(process.cwd(), file);
    const content = fs.readFileSync(filePath, 'utf8');

    for (const pattern of patterns) {
        if (pattern.regex.test(content)) {
            violations.push(`${file}: ${pattern.label}`);
        }
    }
}

if (violations.length > 0) {
    console.error('Potential secret exposure detected:');
    for (const violation of violations) {
        console.error(`- ${violation}`);
    }
    process.exit(1);
}

console.log('No obvious secret patterns found in tracked source files.');
