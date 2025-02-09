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
			roundIsVisible && !roundNumber ||
			!robotPosition) {
		return 0;
	}

	const matchId = getMatchId(roundIsVisible, matchLevel, matchNumber, roundNumber);

	const response = await request(matchId);

	const data = await response.json();
	const teamColor = robotPosition.substring(0, robotPosition.indexOf('_'));
	const teamNum = parseInt(robotPosition.substring(robotPosition.indexOf('_') + 1)) - 1;
	const fullTeam = data.alliances[teamColor].team_keys[teamNum];
	const teamNumber = parseInt(fullTeam.substring(3));
	console.log("Reading team " + Number(fullTeam.substring(3)))

	return teamNumber;
}
async function getTeam(roundIsVisible : boolean,
					   matchLevel? : number,
					   matchNumber? : number,
					   roundNumber? : number,
					   alliance? : string) {
	if (!matchLevel ||
			!matchNumber ||
			roundIsVisible && !roundNumber ||
			!alliance) {
		return 0;
	}

	const matchId = getMatchId(roundIsVisible, matchLevel, matchNumber, roundNumber);

	const response = await request(matchId);

	const data = await response.json();
	const fullTeam = data.alliances[alliance].team_keys.forEach((x : string) => x.substring(3));
	console.log(fullTeam);

	return fullTeam;
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
function request(matchId : string) {
	const response = fetch('https://www.thebluealliance.com/api/v3/match/' + matchId, {
		method: "GET",
		headers: {
			'X-TBA-Auth-Key': process.env.REACT_APP_TBA_AUTH_KEY as string,
		}
	});
	return response;
}

export {getTeamNumber, isMatchVisible};
