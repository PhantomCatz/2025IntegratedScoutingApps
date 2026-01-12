import * as TbaApi from './tbaApi';
import * as TbaRequest from './tbaRequest';

export type PreMatch = {
	match_event: TbaApi.EventKey;
	scouter_initials: string;
	comp_level: TbaApi.Comp_Level;
	match_number: number;
	robot_position: TbaRequest.RobotPosition;
	red_alliance: TbaApi.AllianceColor;
	blue_alliance: TbaApi.AllianceColor;
};

export type Comment = {
	comments: string;
};

export type All = PreMatch & Comment;

export type SubmitBody = {
	match_event: TbaApi.EventKey;
	team_number: number;
	scouter_initials: string;
	comp_level: TbaApi.Comp_Level;
	match_number: number;
	robot_position: TbaRequest.RobotPosition;
	red_alliance: TbaApi.AllianceColor;
	blue_alliance: TbaApi.AllianceColor;
	comments: string;
};

