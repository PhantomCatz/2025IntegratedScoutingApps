import type * as TbaApi from './tbaApi';
import type * as TbaRequest from './tbaRequest';
import type * as Database from './database';

export type PreMatch = {
	scouter_initials: string,
	comp_level: TbaApi.Comp_Level,
	match_number: number,
	robot_position: TbaRequest.RobotPosition,
	red_alliance: string,
	blue_alliance: string,
	team_override: number | null,
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

export type SubmitBody = {
	event_key: string,
	team_number: number,
	scouter_initials: string,
	comp_level: string,
	match_number: number,
	robot_position: string,
	auton_leave_starting_line: Database.Tinyint,
	auton_coral_scored_l4: number,
	auton_coral_missed_l4: number,
	auton_coral_scored_l3: number,
	auton_coral_missed_l3: number,
	auton_coral_scored_l2: number,
	auton_coral_missed_l2: number,
	auton_coral_scored_l1: number,
	auton_coral_missed_l1: number,
	auton_algae_scored_net: number,
	auton_algae_missed_net: number,
	auton_algae_scored_processor: number,
	teleop_coral_scored_l4: number,
	teleop_coral_missed_l4: number,
	teleop_coral_scored_l3: number,
	teleop_coral_missed_l3: number,
	teleop_coral_scored_l2: number,
	teleop_coral_missed_l2: number,
	teleop_coral_scored_l1: number,
	teleop_coral_missed_l1: number,
	teleop_algae_missed_net: number,
	teleop_algae_scored_net: number,
	teleop_algae_scored_processor: number,
	endgame_coral_intake_capability: string,
	endgame_algae_intake_capability: string,
	endgame_climb_successful: Database.Tinyint,
	endgame_climb_type: string,
	endgame_climb_time: number,
	overall_robot_died: Database.Tinyint,
	overall_defended_others: Database.Tinyint,
	overall_was_defended: Database.Tinyint,
	overall_defended: string,
	overall_defended_by: string,
	overall_pushing: number,
	overall_defense_quality: number,
	overall_counter_defense: number,
	overall_driver_skill: number,
	overall_major_penalties: number,
	overall_minor_penalties: number,
	overall_penalties_incurred: string,
	overall_comments: string,
	robot_appeared: Database.Tinyint,
}
