// parses all the markdown files in `/intros` into a json file and writes them into `/build/index.json`

import fs from 'fs';
import parseMD from 'parse-md';

const output = [];

fs.readdirSync('intros').forEach(file => {
    const filePath = `intros/${file}`;
    console.log(`parsing ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parseMD.default(content);
    output.push(parsed);
});

// check if `build` directory exists and if not, create it
if (!fs.existsSync('build')) {
    console.log(`Creating build directory...`);
    fs.mkdirSync('build');
}

console.log(`exporting ${output.length} intros`);

// alphabetically sort the output array
output.sort((a, b) => {
    if (a.metadata.name.toLowerCase() < b.metadata.name.toLowerCase()) return -1;
    if (a.metadata.name.toLowerCase() > b.metadata.name.toLowerCase()) return 1;
    return 0;
});

fs.writeFileSync('build/index.json', JSON.stringify(output, null, 2));