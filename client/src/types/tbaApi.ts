// just get these from https://www.thebluealliance.com/apidocs/v4
export type Comp_Level = "ef" | "f" | "sf" | "qf" | "qm";
export type AllianceColor = "blue" | "red";
export type EventKey = `${number}${string}`;
export type MatchKey = `${EventKey}_${Comp_Level}m${number}`;

/******* /match/{match_key} **********/
export type Match = {
	key: MatchKey,
	comp_level: Comp_Level,
	set_number: number,
	match_number: number,
	alliances: {
		blue: MatchAlliance,
		red: MatchAlliance,
	},
	winning_alliance: AllianceColor | "",
	event_key: string,
	time: number | null,
	actual_time: number | null,
	predicted_time: number | null,
	post_result_time: number | null,
	score_breakdown: Match_Score_Breakdown_2025,
	videos: {
		type: "youtube" | "tba",
		key: string,
	}[],
};

// TODO: change per year according to TBA "/match/{match_key}"
export type Match_Score_Breakdown_2025 = {
	blue: Match_Score_Breakdown_2025_Alliance,
	red: Match_Score_Breakdown_2025_Alliance,
}
export type Match_Score_Breakdown_2025_Alliance = {
	adjustPoints: number,
	algaePoints: number,
	autoBonusAchieved: boolean,
	autoCoralCount: number,
	autoCoralPoints: number,
	autoLineRobot1: string,
	autoLineRobot2: string,
	autoLineRobot3: string,
	autoMobilityPoints: number,
	autoPoints: number,
	autoReef: ReefFill,
	bargeBonusAchieved: boolean,
	coopertitionCriteriaMet: boolean,
	coralBonusAchieved: boolean,
	endGameBargePoints: number,
	endGameRobot1: CageType,
	endGameRobot2: CageType,
	endGameRobot3: CageType,
	foulCount: number,
	foulPoints: number,
	g206Penalty: boolean,
	g410Penalty: boolean,
	g418Penalty: boolean,
	g428Penalty: boolean,
	netAlgaeCount: number,
	rp: number,
	techFoulCount: number,
	teleopCoralCount: number,
	teleopCoralPoints: number,
	teleopPoints: number
	teleopReef: ReefFill,
	totalPoints: number,
	wallAlgaeCount: number,
};
export type CageType = "DeepCage" | "None" | "Parked" | "ShallowCage";
export type ReefFill = {
	botRow: ReefNodes,
	midRow: ReefNodes,
	topRow: ReefNodes,
	trough: number,
	tba_botRowCount: number,
	tba_midRowCount: number,
	tba_topRowCount: number,
};
export type ReefNodes = {
	nodeA: boolean,
	nodeB: boolean,
	nodeC: boolean,
	nodeD: boolean,
	nodeE: boolean,
	nodeF: boolean,
	nodeG: boolean,
	nodeH: boolean,
	nodeI: boolean,
	nodeJ: boolean,
	nodeK: boolean,
	nodeL: boolean,
};
export type MatchAlliance = {
	score: number,
	team_keys: TeamKey[],
	surrogate_team_keys: TeamKey[],
	dq_team_keys: TeamKey[],
};
export type TeamKey = `frc${number}`;
/******* end /match/{match_key} **********/

/******* /event/{event_key}/teams/simple ***********/
export type TeamsSimple = {
	key: TeamKey,
	team_number: number,
	nickname: string,
	name: string,
	city: string | null,
	state_prov: string | null,
	country: string | null,
}[];

export type Elimination_Alliance = {
	name: string,
	backup: null | {
		in: string,
		out: string,
	},
	declines: TeamKey[],
	picks: TeamKey[],
	status: {
		playoff_average: null | number,
		playoff_type: null | number,
		level: Comp_Level,
		record: OutcomeRecord,
		current_level_record: OutcomeRecord,
		status: "eliminated" | "playing" | "won",
		advanced_to_round_robin_finals: boolean,
		double_elim_round: DoubleElimRound,
		round_robin_rank: number,
	}
};
export type OutcomeRecord = {
	losses: number,
	ties: number,
	wins: number,
};
export type DoubleElimRound = "Finals" | "Round 1" | "Round 2" | "Round 3" | "Round 4" | "Round 5";
