import * as TbaApi from './tbaApi';
import * as TbaRequest from './tbaRequest';

export type PreMatch = {
	scouter_initials: string,
	comp_level: TbaApi.Comp_Level,
	match_number: number,
	robot_position: TbaRequest.RobotPosition,
	red_alliance: number,
	blue_alliance: number,
	team_override: number,
};

export type AutonMatch = {
	auton_coral_scored_l4: number,
	auton_coral_scored_l3: number,
	auton_coral_scored_l2: number,
	auton_coral_scored_l1: number,
	auton_coral_missed_l4: number,
	auton_coral_missed_l3: number,
	auton_coral_missed_l2: number,
	auton_coral_missed_l1: number,
	auton_algae_scored_net: number,
	auton_algae_missed_net: number,
	auton_algae_scored_processor: number,
	auton_leave_starting_line: boolean,
};

export type TeleopMatch = {
	teleop_coral_scored_l4: number,
	teleop_coral_missed_l4: number,
	teleop_coral_scored_l3: number,
	teleop_coral_missed_l3: number,
	teleop_coral_scored_l2: number,
	teleop_coral_missed_l2: number,
	teleop_coral_scored_l1: number,
	teleop_coral_missed_l1: number,
	teleop_algae_scored_net: number,
	teleop_algae_missed_net: number,
	teleop_algae_scored_processor: number,
};

export type EndgameMatch = {
	endgame_coral_intake_capability: string,
	endgame_algae_intake_capability: string,
	endgame_climb_successful: boolean,
	endgame_climb_type: string,
	endgame_climb_time: number,
};

export type OverallMatch = {
	overall_robot_died: boolean;
	overall_defended_others: boolean;
	overall_defended: number[];
	overall_was_defended: boolean;
	overall_defended_by: number[];
	overall_match_penalty: string;
	overall_tech_penalty: string;
	overall_penalties_incurred: string;
	overall_pushing: number;
	overall_driver_skill: number;
	overall_major_penalties: number;
	overall_minor_penalties: number;
	overall_counter_defense: number;
	overall_defense_quality: number;
	overall_comments: string;
}

export type All = PreMatch & AutonMatch & TeleopMatch & EndgameMatch & OverallMatch;

// TODO: write
export type SubmitBody = {
	overall_defended: string;
	overall_defended_by: string;
	event_key: string;
	teleop_coral_scored_l4: number;
}
