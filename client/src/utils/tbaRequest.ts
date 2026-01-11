import Constants from "./constants";

import * as TbaApi from '../types/tbaApi';
import { RequestTypes, ResultTypes, } from '../types/tbaRequest';
import * as TbaRequest from '../types/tbaRequest';
import * as LocalStorage from '../types/localStorage';

function isInPlayoffs(compLevel: TbaApi.Comp_Level | null): boolean {
	return compLevel ?
		true :
		false;
}
function isRoundNumberVisible(matchLevel: string): boolean {
	return matchLevel === "Playoffs" ?
		true :
		false;
}
function getOpposingAllianceColor(allianceName: TbaApi.AllianceColor): TbaApi.AllianceColor {
	const alliances = {
		red: "blue",
		blue: "red"
	} as const;

	return alliances[allianceName];
}

function teamKeysToNumbers(teamKeys: TbaApi.TeamKey[]): number[] {
	//eslint-disable-next-line @typescript-eslint/no-magic-numbers
	return teamKeys.map((team) => Number(team.substring(3)));
}
function teamsPlayingToTeamsList(teamsPlaying: ResultTypes.TeamsInMatch): number[] {
	return teamsPlaying.blue.concat(teamsPlaying.red);
}
function parseRobotPosition(robotPosition: TbaRequest.RobotPosition): [TbaApi.AllianceColor, number] {
	const allianceColors: { [colorString: string]: TbaApi.AllianceColor } = {
		"R": "red",
		"B": "blue",
	} as const;

	const colorString = robotPosition[0];
	const allianceColor = allianceColors[colorString];

	const positionNumber = Number(robotPosition.substring(1));

	return [allianceColor, positionNumber];
}

// abstracting this was too hard...
async function getAllTeams(eventKey: TbaApi.EventKey): Promise<ResultTypes.AllTeams | null> {
	try {
		const response = await request('event/' + eventKey + '/teams/simple');
		const teams: RequestTypes.Event_Teams_Simple  = await response.json() as RequestTypes.Event_Teams_Simple;

		const numbers = teams.map((x) => x.team_number);

		numbers.sort((a, b) => a - b);

		const tbaTeams = localStorage.getItem("tbaTeams") ?? "null";

		const data = (JSON.parse(tbaTeams) as LocalStorage.TbaTeams | null) ?? {};

		data[eventKey] = numbers;

		localStorage.setItem("tbaTeams", JSON.stringify(data));

		return numbers;
	} catch(_) {
		const tbaTeams = localStorage.getItem("tbaTeams");

		if(tbaTeams === null) {
			return null;
		}
		const data = JSON.parse(tbaTeams) as LocalStorage.TbaTeams | null;

		if(!data) {
			return null;
		}

		return data[eventKey] ?? null;
	}
}
async function getTeamsNotScouted(eventKey: TbaApi.EventKey): Promise<ResultTypes.TeamsNotScouted | null> {
	try {
		let fetchLink = Constants.SERVER_ADDRESS;

		if(!fetchLink) {
			console.error("Could not get fetch link. Check .env");
			return null;
		}

		fetchLink += "reqType=teamsScouted";

		const response = await fetch(fetchLink);
		const teamsScouted: ResultTypes.TeamsNotScouted = await response.json() as ResultTypes.TeamsNotScouted;

		const allTeams = await getAllTeams(eventKey);

		const all = new Set(allTeams);
		const scouted = new Set(teamsScouted);

		const diff = all.difference(scouted);

		const res: number[] = [];

		diff.forEach((x) => res.push(x));

		return res;
	} catch (err) {
		console.error(`An error occurred while trying to get teams not scouted: ${err}`);
		return null;
	}
}
async function getTeamsInMatch(eventKey: TbaApi.EventKey,
	compLevel: TbaApi.Comp_Level,
	matchNumber: number,
	blueAllianceNumber: number,
	redAllianceNumber: number): Promise<ResultTypes.TeamsInMatch | null> {
	async function normalFetch(): Promise<ResultTypes.TeamsInMatch | null> {
		const matchId = getMatchId(eventKey, compLevel, matchNumber);

		const response = await request('match/' + matchId);

		const match: RequestTypes.Match = await response.json() as RequestTypes.Match;

		const result: ResultTypes.TeamsInMatch = { blue: [], red: []};
		for(const color of ["red", "blue"] as TbaApi.AllianceColor[]) {
			match.alliances[color].team_keys.forEach((team) => result[color].push(Number(team.substring(3))));
		}
		const tbaData = localStorage.getItem("tbaData") ?? "null";

		const data = (JSON.parse(tbaData) as LocalStorage.TbaData | null) ?? { [eventKey]: {}};

		data[eventKey][matchId] = match;

		localStorage.setItem("tbaData", JSON.stringify(data));

		return result;
	}
	function fromLocalStorage(): ResultTypes.TeamsInMatch | null {
		const tbaData = localStorage.getItem("tbaData");

		if(tbaData === null) {
			return null;
		}
		const data = JSON.parse(tbaData) as LocalStorage.TbaData | null;

		if(!data) {
			return null;
		}
		const matchId = getMatchId(eventKey, compLevel, matchNumber);

		const alliances = data[eventKey][matchId].alliances;

		const result = {
			blue: teamKeysToNumbers(alliances.blue.team_keys),
			red: teamKeysToNumbers(alliances.red.team_keys),
		}

		return result;
	}
	function fromEliminationAllianceNumbers(): ResultTypes.TeamsInMatch | null {
		const playoffAlliances = localStorage.getItem("tbaPlayoffAlliances");

		if(playoffAlliances === null) {
			return null;
		}
		const data = JSON.parse(playoffAlliances) as LocalStorage.PlayoffAlliances | null;

		if(!data || !data[eventKey]) {
			return null;
		}

		const result = {
			//eslint-disable-next-line @typescript-eslint/no-magic-numbers
			blue: teamKeysToNumbers(data[eventKey][blueAllianceNumber].picks.slice(0,3)),
			//eslint-disable-next-line @typescript-eslint/no-magic-numbers
			red: teamKeysToNumbers(data[eventKey][redAllianceNumber].picks.slice(0,3)),
		}

		return result;
	}

	// idk...
	try {
		const result = await normalFetch();

		if(!result) {
			throw new Error();
		}

		return result;
	} catch (_) {
		try {
			const result = fromLocalStorage();

			if(!result) {
				throw new Error();
			}

			return result;
		} catch (_) {
			try {
				const result = fromEliminationAllianceNumbers();

				if(!result) {
					throw new Error();
				}

				return result;
			} catch (_) {
				return null;
			}
		}
	}
}

function getMatchId(eventKey: TbaApi.EventKey,
	compLevel: TbaApi.Comp_Level,
	matchNumber: number): TbaApi.MatchKey {
	const roundIsVisible = isRoundNumberVisible(compLevel);
	// TODO: make proper match id
	const matchId: TbaApi.MatchKey = roundIsVisible ?
		`${eventKey}_${compLevel}${matchNumber}m1` :
		compLevel === "f" ?
		`${eventKey}_${compLevel}1m${matchNumber}` :
		`${eventKey}_${compLevel}${matchNumber}`;
	return matchId;
}
function getMatchLevel(name: string): TbaApi.Comp_Level {
	const levels: {[matchLevel: string]: TbaApi.Comp_Level} = {
		"Qualifications": "qm",
		"Playoffs": "sf",
		"Finals": "f",
	};

	return levels[name];
}

async function request(query: string): Promise<Response> {
	const response = await fetch('https://www.thebluealliance.com/api/v3/' + query, {
		method: "GET",
		headers: {
			'X-TBA-Auth-Key': Constants.TBA_AUTH_KEY,
		}
	});

	if(response.ok) {
		return response;
	}
	throw new Error(`Could not fetch to ${query}:\nResponse code: ${response.status}\nError message: ${await response.text()}`);
}

function getAllianceTags(eventKey: TbaApi.EventKey): { label: string, value: string }[] {
	function fromLocalStorage(): { label: string, value: string }[] | null {
		const playoffAlliances = localStorage.getItem("tbaPlayoffAlliances");

		if(playoffAlliances === null) {
			return null;
		}
		const data = JSON.parse(playoffAlliances) as LocalStorage.PlayoffAlliances | null;

		if(!data || !data[eventKey]) {
			return null;
		}

		const allianceTeamNumbers = data[eventKey].map((alliance) => {
			//eslint-disable-next-line @typescript-eslint/no-magic-numbers
			return teamKeysToNumbers(alliance.picks.slice(0,3)).map(x => x.toString());
		});

		const result = allianceTeamNumbers.map((teams, index) => ({ label: teams.join(', '), value: index.toString() }));

		return result;
	}
	try {
		const result = fromLocalStorage();

		if(!result) {
			throw new Error();
		}

		return result;
	} catch (_) {
		const names = [
			"Alliance 1",
			"Alliance 2",
			"Alliance 3",
			"Alliance 4",
			"Alliance 5",
			"Alliance 6",
			"Alliance 7",
			"Alliance 8",
		] as const;

		const result = names.map((x, index) => ({ label: x, value: index.toString() }));

		return result;
	}
}

export {
	teamsPlayingToTeamsList,
	isInPlayoffs,
	isRoundNumberVisible,
	parseRobotPosition,
	getOpposingAllianceColor,
	getAllTeams,
	getTeamsNotScouted,
	getTeamsInMatch,
	getMatchId,
	getMatchLevel,
	request,
	getAllianceTags,
};
