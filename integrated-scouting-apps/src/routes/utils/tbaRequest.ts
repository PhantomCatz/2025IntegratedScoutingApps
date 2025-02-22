const tbaData = require("./tbaData.json");

function isMatchVisible(matchLevel? : string) {
	return matchLevel !== "qm" ?
		true :
		false;
}

async function getTeamNumber(roundIsVisible : boolean,
							 matchLevel? : number,
							 matchNumber? : number,
							 roundNumber? : number,
							 robotPosition? : string) : Promise<number> {
	if (!matchLevel ||
			!matchNumber ||
			(roundIsVisible && !roundNumber) ||
			!robotPosition) {
		//console.log(roundIsVisible, matchLevel, matchNumber, roundNumber, robotPosition);
		return 0;
	}
	//console.log("requesting TBA");
	

	try {
		const matchId = getMatchId(roundIsVisible, matchLevel, matchNumber, roundNumber);

		const response = await request('match/' + matchId);

		const data = await response.json();
		const teamColor = robotPosition.substring(0, robotPosition.indexOf('_'));
		const teamNum = parseInt(robotPosition.substring(robotPosition.indexOf('_') + 1)) - 1;
		const fullTeam = data.alliances[teamColor].team_keys[teamNum];
		const teamNumber = parseInt(fullTeam.substring(3));

		return teamNumber;
	} catch (err) {
		console.log("caught err");
		return await getTeamNumberOffline(roundIsVisible, matchLevel, matchNumber, roundNumber || 0, robotPosition);
	}
}
async function getTeam(roundIsVisible : boolean,
					   matchLevel? : number,
					   matchNumber? : number,
					   roundNumber? : number,
					   alliance? : string) : Promise<string[]> {
	if (!matchLevel ||
			!matchNumber ||
			(roundIsVisible && !roundNumber) ||
			!alliance) {
		//console.log(matchLevel, matchNumber, roundIsVisible, roundNumber, alliance);
		return [];
	}
	//console.log("requesting TBA");

	try {
		const matchId = getMatchId(roundIsVisible, matchLevel, matchNumber, roundNumber);

		const response = await request('match/' + matchId);

		const data = await response.json();
		const fullTeam = data.alliances[alliance].team_keys.map((x : string) => x.substring(3));

		return fullTeam || [];
	} catch (err) {
		console.log("caught err");
		return await getTeamOffline(roundIsVisible, matchLevel, matchNumber, roundNumber || 0, alliance);
	}
}
async function getAllTeams() {
	try {
		const response = await request('event/' + process.env.REACT_APP_EVENTNAME + '/teams');
		const teams = await response.json();

		const numbers = teams.map((x : any) => x.team_number);

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
			return;
		}

		fetchLink += "reqType=teamsScouted";

		let teamsScouted : any = await(await fetch(fetchLink)).json();

		const allTeams = await getAllTeams();

		const all = new Set(allTeams);
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

function getMatchId(roundIsVisible : boolean,
					matchLevel? : number,
					matchNumber? : number,
					roundNumber? : number) : string {
	const eventName = process.env.REACT_APP_EVENTNAME;

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
	const allianceColor = robotPosition.substring(0, robotPosition.indexOf('_'));
	res += getAllianceOffset(allianceColor);
	
	const robotOffset = parseInt(robotPosition.substring(robotPosition.indexOf('_') + 1)) - 1;
	res += robotOffset;

	return res;
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

async function getTeamNumberOffline(roundIsVisible : boolean,
									matchLevel : number,
									matchNumber : number,
									roundNumber : number,
									robotPosition : string) {
	const matchId = getMatchId(roundIsVisible, matchLevel, matchNumber, roundNumber);
	const robotIndex = getIndexNumber(robotPosition);
	return tbaData[matchId][robotIndex];
}
async function getTeamOffline(roundIsVisible : boolean,
							  matchLevel : number,
							  matchNumber : number,
							  roundNumber : number,
							  alliance : string) {
	const matchId = getMatchId(roundIsVisible, matchLevel, matchNumber, roundNumber);
	const indexOffset = getAllianceOffset(alliance);
	const teams = tbaData[matchId];
	return [teams[indexOffset + 0], teams[indexOffset + 1], teams[indexOffset + 2], ];
}
async function getAllTeamsOffline() {
	const data = new Set();

	for(const [id, teams] of Object.entries(tbaData)) {
		(teams as any).forEach((x : any) => data.add(x));
	}

	return data;
}

export {getTeamNumber, isMatchVisible, getTeam, getAllTeams, getTeamsNotScouted};
