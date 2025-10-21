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


export {
  NUM_ALLIANCES,
  TEAMS_PER_ALLIANCE,
  round,
  sleep,
	mapInPlace,
	readImage,
	splitString,
	wrapString,
};
