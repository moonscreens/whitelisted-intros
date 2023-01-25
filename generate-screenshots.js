// parses all the markdown files in `/intros` into a json file and writes them into `/build/index.json`

import captureWebsite from 'capture-website';
import fs from 'fs';
import fetch from 'node-fetch';

const intros = JSON.parse(fs.readFileSync('build/index.json', 'utf8')).sort((a, b) => Math.random() - 0.5);

async function takeScreenshots() {
	for (let index = 0; index < intros.length; index++) {
		const intro = intros[index];

		if (!fs.existsSync('build/screenshots/' + intro.slug + '.jpg')) {
			console.log(`Capturing screenshot for ${intro.metadata.name}...`);
			try {
				await captureWebsite.file(intro.metadata.src, `build/screenshots/${intro.slug}.jpg`, {
					width: 1280,
					height: 720,
					scaleFactor: 1,
					fullPage: false,
					delay: 10,
					timeout: 30,
					debug: true,
					type: 'jpeg',
				});

				console.log(`Captured screenshot for ${intro.metadata.name}`);
			} catch (error) {
				console.log(`Error capturing screenshot for ${intro.metadata.name}`);
				console.log(error);

				const response = await fetch(intro.metadata.src);
				const html = await response.text();
				console.log(html);
			}
		} else {
			console.log(`Screenshot for ${intro.metadata.name} already exists`);
		}
	}
}

takeScreenshots();