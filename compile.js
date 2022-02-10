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

// save out our JSON file
fs.writeFileSync('build/index.json', JSON.stringify(output, null, 2));

const categories = {};
for (let index = 0; index < output.length; index++) {
	const element = output[index];
	if (!categories[element.metadata.category]) {
		categories[element.metadata.category] = [];
	}
	categories[element.metadata.category].push(element);
}

let categoriesString = '';
for (const category in categories) {
	if (Object.hasOwnProperty.call(categories, category)) {
		const element = categories[category];
		categoriesString += `<h2>${category}</h2>\n`;
		categoriesString += `<ul>\n`;
		for (let index = 0; index < element.length; index++) {
			const intro = element[index];
			categoriesString += `<li><a href="${intro.metadata.src}" target="_blank">${intro.metadata.name}</a><br />${intro.metadata.credits}</li>\n`;
		}
		categoriesString += `</ul>\n`;
	}
}


let HTMLOutput = `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Twitch Chat Intros</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
	<style>
		body {
			font-family: 'Roboto', sans-serif;
			background: #222;
			color: #fff;
		}
	</style>
</head>

<body>
	${categoriesString}
</body>

</html>`;

fs.writeFileSync('build/index.html', HTMLOutput);
