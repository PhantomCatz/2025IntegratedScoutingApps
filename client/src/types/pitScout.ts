import * as TbaApi from './tbaApi';

export type Pit = {
	scouter_initials: string;
	team_number: number;
	drive_train_type: string;
	robot_weight: number;
	motor_type: string;
	number_of_motors: number;
	wheel_type: string;
	intake_width: string;
	coral_intake_capability: string;
	coral_scoring_l1: boolean;
	coral_scoring_l2: boolean;
	coral_scoring_l3: boolean;
	coral_scoring_l4: boolean;
	can_remove_algae: boolean;
	algae_intake_capability: string;
	algae_scoring_capability: string;
	score_aiming_coral: string,
	score_aiming_algae: string,
	aiming_description: string,
	climbing_capability: string;
	pit_organization: number;
	team_safety: number;
	team_workmanship: number;
	gracious_professionalism: number;
	robot_images: string;
	comments: string;
};

export type SubmitBody = {
			"match_event": TbaApi.EventKey;
			"team_number": number;
			"scouter_initials": string;
			"robot_weight": number;
			"drive_train_type": string;
			"motor_type": string;
			"number_of_motors": number;
			"wheel_type": string;
			"intake_width": string;
			"coral_intake_capability": string;
			"coral_scoring_l1": boolean;
			"coral_scoring_l2": boolean;
			"coral_scoring_l3": boolean;
			"coral_scoring_l4": boolean;
			"can_remove_algae": boolean;
			"algae_intake_capability": string;
			"algae_scoring_capability": string;
			"score_aiming_coral": string;
			"score_aiming_algae": string;
			"aiming_description": string;
			"climbing_capability": string;
			"pit_organization": number;
			"team_safety": number;
			"team_workmanship": number;
			"gracious_professionalism": number;
			"comments": string;
};
