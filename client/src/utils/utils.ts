const NUM_ALLIANCES = 2;
const TEAMS_PER_ALLIANCE = 3;

function round(num : number, prec : number = 3) {
	if(prec === undefined) {
		prec = 3;
	}
	return Math.round(num * 10 ** prec) / 10 ** prec;
}
function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function mapInPlace(arr, func) {
	arr.forEach(function(element, index) {
		arr[index] = func(element);
	});
}
async function readImage(blob : any) : Promise<string> {
	return new Promise(function(resolve, reject) {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onload = () => {
			const base64Image : string = reader.result as string;

			resolve(base64Image);
		};
		reader.onerror = () => {
			reject("Could not read image");
		}
	});
}
function splitString(str, size) {
	const numChunks = Math.ceil(str.length / size);
	const chunks = new Array(numChunks);

	for (let i = 0, o = 0; i < numChunks; i++, o += size) {
		chunks[i] = str.substr(o, size);
	}

	return chunks;
}
function getRandomHex() {
	const vals = "0123456789ABCDEF";
	const randVal = Math.floor(Math.random() * vals.length);

	return vals[randVal];
}
function escapeUnicode(str: string) : string {
	return [...(str as any)]
		.map(
			c => /^[\x00-\x7F]$/
				.test(c) ?
				c :
				c
					.split("")
					.map((a: any) =>
						"\\u" + a
							.charCodeAt()
							.toString(16)
							.padStart(4, "0")
					).join("")
		)
		.join("");
}

export {
	NUM_ALLIANCES,
	TEAMS_PER_ALLIANCE,
	round,
	sleep,
	mapInPlace,
	readImage,
	splitString,
	getRandomHex,
	escapeUnicode,
};
