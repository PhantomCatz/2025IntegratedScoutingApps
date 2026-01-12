import * as TbaApi from './tbaApi';

export type TbaData = {
	[event_key: string]: { [matchKey: TbaApi.MatchKey]: TbaApi.Match };
};
export type TbaTeams = {
	[event_key: string]: number[];
}
export type PlayoffAlliances = {
	[event_key: string]: TbaApi.Elimination_Alliance[] | null;
};
export type UpdateTimes = {
	[event_key: string]: string;
};
