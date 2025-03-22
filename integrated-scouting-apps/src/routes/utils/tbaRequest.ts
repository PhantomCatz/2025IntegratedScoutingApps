const tbaData = require("./tbaData.json");

function isInPlayoffs(matchLevel? : string) {
	return matchLevel !== "Qualifications" ?
		true :
		false;
}
function isRoundNumberVisible(matchLevel? : string) {
	return matchLevel === "Finals" ?
		true :
		false;
}

async function getAllTeams() {
	try {
		const response = await request('event/' + process.env.REACT_APP_EVENTNAME + '/teams');
		const teams = await response.json();

		const numbers = teams.map((x : any) => x.team_number);

		numbers.sort((a : any, b : any) => a - b);

		return numbers;
	} catch(err) {
		const response = await getAllTeamsOffline();

		return response;
	}
}
async function getTeamsNotScouted() {
	try {
		let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

		if(!fetchLink) {
			console.error("Could not get fetch link. Check .env");
			return null;
		}

		fetchLink += "reqType=teamsScouted";

		let teamsScouted : any = await(await fetch(fetchLink)).json();

		const allTeams = await getAllTeams();

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
async function getTeamsPlaying(matchLevel? : string,
					   matchNumber? : number,
					   roundNumber? : number,
					   allianceNumber1? : string,
					   allianceNumber2? : string) : Promise<string[]> {
	const roundIsVisible = isRoundNumberVisible(matchLevel);

	if(isInPlayoffs(matchLevel)) {
		return await getTeamsPlayingOffline(roundIsVisible, matchLevel || "", matchNumber || 0, roundNumber || 0,
			   allianceNumber1 || "", allianceNumber2 || "");
	}

	try {
		if (!matchLevel ||
			!matchNumber ||
			(roundIsVisible && !roundNumber)
		    ) {
			throw new Error();
		}

		const matchId = getMatchId(roundIsVisible, matchLevel, matchNumber, roundNumber);

		const response = await request('match/' + matchId);

		const data = await response.json();

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
		const returnVal = await getTeamsPlayingOffline(roundIsVisible, matchLevel || "", matchNumber || 0, roundNumber || 0,
			allianceNumber1 || "", allianceNumber2 || "");
		return returnVal || [];
	}
}

function getMatchId(roundIsVisible : boolean,
					matchLevel? : string,
					matchNumber? : number,
					roundNumber? : number) : string {
	const eventName = process.env.REACT_APP_EVENTNAME;

	if(!eventName) {
		console.error("Could not get event name. Check .env");
	}

	matchLevel = getMatchLevel(matchLevel);

	const matchId = roundIsVisible ?
		`${eventName}_${matchLevel}${matchNumber}m${roundNumber}` :
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
      "Quarter-Finals": "qf",
      "Semi-Finals": "sf",
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
function getTeamColor(team : any) {
	const teams : {[team : string] : string} = {
		"B" : "blue",
		"R" : "red",
	};

	return teams[team[0]];
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
	const data : Set<number> = new Set();

	for(const [id, teams] of Object.entries(tbaData)) {
		(teams as any).forEach((x : any) => data.add(x));
	}

	let res : number[] = [];

	data.forEach((x : number) => {
		res.push(x);
	});

	res.sort((a : number, b : number) => a - b);

	return res;
}
async function getTeamsPlayingOffline(roundIsVisible : boolean,
									  matchLevel : string,
									  matchNumber : number,
									  roundNumber : number,
									  allianceNumber1 : string,
									  allianceNumber2 : string) {
	if(allianceNumber1 || allianceNumber2) {
		const alliance1 = tbaData[allianceNumber1] || [0, 0, 0];
		const alliance2 = tbaData[allianceNumber2] || [0, 0, 0];

		return alliance1.concat(alliance2);
	}
	const matchId = getMatchId(roundIsVisible, matchLevel, matchNumber, roundNumber);
	const teams = tbaData[matchId];

	return teams;
}

export { isInPlayoffs, getAllTeams, getTeamsNotScouted, isRoundNumberVisible, getTeamsPlaying, getIndexNumber, getAllianceOffset };
