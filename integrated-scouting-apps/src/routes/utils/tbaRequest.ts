const tbaData = require("./tbaData.json");
const tbaTeams = require("./tbaTeams.json");

function isInPlayoffs(matchLevel? : string) {
	return matchLevel !== "Qualifications" && matchLevel ?
		true :
		false;
}
function isRoundNumberVisible(matchLevel? : string) {
	return matchLevel === "Playoffs" && matchLevel ?
		true :
		false;
}

function getDivisionsList() {
	return {
		"Archimedes": "2024arc",
		"Curie": "2024cur",
		"Daly": "2024dal",
		"Galileo": "2024gal",
		"Hopper": "2024hop",
		"Johnson": "2024joh",
		"Milstein": "2024mil",
		"Newton": "2024new",
		"Einstein": "2024cmptx",
	};
}

async function getAllTeams(matchEvent : string) {
	try {
		const response = await request('event/' + matchEvent + '/teams');
		const teams = await response.json();

		const numbers = teams.map((x : any) => x.team_number);

		numbers.sort((a : any, b : any) => a - b);

		return numbers;
	} catch(err) {
		const response = await getAllTeamsOffline();

		return response;
	}
}
async function getTeamsNotScouted(eventName : string) {
	try {
		let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

		if(!fetchLink) {
			console.error("Could not get fetch link. Check .env");
			return null;
		}

		fetchLink += "reqType=teamsScouted";

		let teamsScouted : any = await(await fetch(fetchLink)).json();

		const allTeams = await getAllTeams(eventName);

		const all : any = new Set(allTeams);
		const scouted = new Set(teamsScouted);

		const diff = all.difference(scouted);

		const res : any[] = [];

		diff.forEach((x : any) => res.push(x));

		return res;
	} catch(err) {
		console.log(err);
		return null;
	}
}
async function getTeamsPlaying(eventName : string,
							   matchLevel : string,
							   matchNumber : number,
							   roundNumber : number,
							   allianceNumber1 : string,
							   allianceNumber2 : string) : Promise<string[]> {
	const roundIsVisible = isRoundNumberVisible(matchLevel);
	matchNumber = Number(matchNumber);
	roundNumber = Number(roundNumber);


	try {
		if (!matchLevel ||
			!matchNumber ||
			(roundIsVisible && !roundNumber)
		    ) {
			throw new Error();
		}

		const matchId = getMatchId(eventName, roundIsVisible, matchLevel, matchNumber, roundNumber);

		const response = await request('match/' + matchId);

		const data = await response.json();
		if(data.Error) {
			throw new Error(`Received error ${data.Error}`);
		}

		const fullTeams : string[] = [];
		for(const color of ["red", "blue"]) {
			if(!data?.alliances[color]?.team_keys?.forEach) {
				return [];
			}
			data.alliances[color].team_keys.forEach((team : any) => fullTeams.push(team.substring(3)));
		}

		return fullTeams;
	} catch (err : any) {
		if(err.message) {
			console.log("err=", err);
		}

		const returnVal = await getTeamsPlayingOffline(eventName, roundIsVisible, matchLevel, matchNumber, roundNumber, allianceNumber1, allianceNumber2);
		return returnVal;
	}
}

function getMatchId(eventName : string,
					roundIsVisible : boolean,
					matchLevel : string,
					matchNumber : number,
					roundNumber : number) : string {
	matchLevel = getMatchLevel(matchLevel);

	const matchId = roundIsVisible ?
		`${eventName}_${matchLevel}${matchNumber}m${roundNumber}` :
		matchLevel === "f" ?
			`${eventName}_${matchLevel}1m${matchNumber}` :
			`${eventName}_${matchLevel}${matchNumber}`;
	return matchId;
}
function getAllianceOffset(color : string) {
	switch(color) {
	case "red":
		return 0;
	case "blue":
		return 3;
	default:
		throw new Error("Invalid alliance color");
	}
}
function getIndexNumber(robotPosition : string) {
	let res = 0;

	const data = getRobotPosition(robotPosition);

	const allianceColor = data[0] as string;
	res += getAllianceOffset(allianceColor);
	
	const robotOffset = data[1] as number;
	res += robotOffset;

	return res;
}
function getMatchLevel(name : any) {
	const levels : {[matchLevel : string] : string} = {
      "Qualifications": "qm",
      "Playoffs": "sf",
      "Finals": "f",
	};

	return levels[name];
}
function getRobotPosition(name : any) {
	const positions : {[position : string] : (string | number)[]} = {
      "R1": ["red", 0],
      "R2": ["red", 1],
      "R3": ["red", 2],
      "B1": ["blue", 0],
      "B2": ["blue", 1],
      "B3": ["blue", 2],
	};

	return positions[name]
}

function request(query : string) {
	const response = fetch('https://www.thebluealliance.com/api/v3/' + query, {
		method: "GET",
		headers: {
			'X-TBA-Auth-Key': process.env.REACT_APP_TBA_AUTH_KEY as string,
		}
	});
	return response;
}

async function getAllTeamsOffline() {
	const res = [...tbaTeams];

	return res;
}
async function getTeamsPlayingOffline(eventName : string,
									  roundIsVisible : boolean,
									  matchLevel : string,
									  matchNumber : number,
									  roundNumber : number,
									  allianceNumber1 : string,
									  allianceNumber2 : string) {
	if(isInPlayoffs(matchLevel)) {
		try {
			const alliance1 = tbaData[allianceNumber1];
			const alliance2 = tbaData[allianceNumber2];

			const res : any = alliance1.concat(alliance2);

			res.shouldShowAlliances = true;

			return res;
		} catch (err) {
			const res : any = [];

			res.shouldShowAlliances = true;

			return res;
		}
	}
	const matchId = getMatchId(eventName, roundIsVisible, matchLevel, matchNumber, roundNumber);
	const teams = tbaData[matchId];

	return teams;
}

export { isInPlayoffs, getAllTeams, getTeamsNotScouted, isRoundNumberVisible, getTeamsPlaying, getIndexNumber, getAllianceOffset, getDivisionsList };
