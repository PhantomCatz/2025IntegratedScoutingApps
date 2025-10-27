import tbaData from "./tbaData.json";
import tbaTeams from "./tbaTeams.json";

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
		"Archimedes": "2025arc",
		"Curie": "2025cur",
		"Daly": "2025dal",
		"Galileo": "2025gal",
		"Hopper": "2025hop",
		"Johnson": "2025joh",
		"Milstein": "2025mil",
		"Newton": "2025new",
		"Einstein": "2025cmptx",
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
		const response = await getAllTeamsOffline(matchEvent);

		return response;
	}
}
async function getTeamsNotScouted(eventName : string) {
	try {
		let fetchLink = SERVER_ADDRESS;

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
							   allianceNumber1 : string,
							   allianceNumber2 : string) : Promise<string[]> {
	matchNumber = Number(matchNumber);
	console.log("aorisetnoairsnt");

	if(isInPlayoffs(matchLevel)) {
		console.log("oaiersntoiaenrst");
		const res =  await getTeamsPlayingPlayoffs(eventName, matchLevel, matchNumber, allianceNumber1, allianceNumber2);

		return res;
	}


	try {
		if (!matchLevel ||
			!matchNumber
		    ) {
			console.log(`matchLevel=`, matchLevel);
			console.log(`matchNumber=`, matchNumber);
			throw new Error();
		}
		console.log("134");

		const matchId = getMatchId(eventName, matchLevel, matchNumber);

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

		const returnVal = await getTeamsPlayingOffline(eventName, matchLevel, matchNumber, allianceNumber1, allianceNumber2);
		return returnVal;
	}
}
async function getTeamsPlayingPlayoffs(eventName : string,
									   matchLevel : string,
									   matchNumber : number,
									   allianceNumber1 : string,
									   allianceNumber2 : string) {
	try {
		if (!matchLevel ||
			!matchNumber
		    ) {
			throw new Error();
		}

		const matchId = getMatchId(eventName, matchLevel, matchNumber);

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
		try {
			const response = await request(`event/${eventName}/alliances`);

			const data = await response.json();
			if(data.Error) {
				throw new Error(`Received error ${data.Error}`);
			}

			const alliances : any = {};

			data.forEach((x : any) => {
				const teams = x.picks.slice(0,3).map((team : any) => team.substring(3));

				alliances[x.name] = teams;
			});

			const alliance1 = alliances[allianceNumber1];
			const alliance2 = alliances[allianceNumber2];

			const res : any = alliance1.concat(alliance2);

			return res;
		} catch (err : any) {
			console.log(`err=`, err);
		}

		const res = await getTeamsPlayingPlayoffsOffline(eventName, matchLevel, matchNumber, allianceNumber1, allianceNumber2);

		return res;
	}
}

async function getTeamsPlayingPlayoffsOffline(eventName : string,
											  matchLevel : string,
											  matchNumber : number,
											  allianceNumber1 : string,
											  allianceNumber2 : string) {
	try {
		const alliance1 = tbaData[allianceNumber1];
		const alliance2 = tbaData[allianceNumber2];

		const res : any = alliance1.concat(alliance2);

		return res;
	} catch (err) {
		const res : any = [];

		return res;
	}
}

function getMatchId(eventName : string,
					matchLevel : string,
					matchNumber : number) : string {
	const roundIsVisible = isRoundNumberVisible(matchLevel);
	matchLevel = getMatchLevel(matchLevel);

	const matchId = roundIsVisible ?
		`${eventName}_${matchLevel}${matchNumber}m1` :
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
			'X-TBA-Auth-Key': TBA_AUTH_KEY as string,
		}
	});
	return response;
}

async function getAllTeamsOffline(eventName : string) {
	const res = [...tbaTeams][eventName as any];

	return res;
}
async function getTeamsPlayingOffline(eventName : string,
									  matchLevel : string,
									  matchNumber : number,
									  allianceNumber1 : string,
									  allianceNumber2 : string) {
	const matchId = getMatchId(eventName, matchLevel, matchNumber);
	const teams = tbaData[eventName][matchId];

	return teams;
}
function getAllianceTags(eventName : string) {
	try {
		const match : any = tbaData[eventName as any];

		const alliances = Object.entries(match)
			.filter((x : any) => !x[0].startsWith(eventName))
			.map((x : any) => x[0]);

		const res =  alliances.map((x : any) => ({ label: x, value : x }));

		if(!res?.length) {
			throw new Error();
		}

		return res;
	} catch (err : any) {

		const names = [
			"Alliance 1",
			"Alliance 2",
			"Alliance 3",
			"Alliance 4",
			"Alliance 5",
			"Alliance 6",
			"Alliance 7",
			"Alliance 8",
		];

		const res = names.map((x : any) => ({ label: x, value : x }));

		return res;
	}
}

export {
	isInPlayoffs,
	getAllTeams,
	getTeamsNotScouted,
	isRoundNumberVisible,
	getTeamsPlaying,
	getIndexNumber,
	getAllianceOffset,
	getDivisionsList,
	getAllianceTags,
	request,
};
