import '../public/stylesheets/matchScout.css';
import { useEffect, useState } from 'react';
import { useLocalStorage, } from 'react-use';
import Header from '../parts/header';
import QrCode from '../parts/qrCodeViewer';
import { isInPlayoffs, getTeamsInMatch, getAllianceTags,
	getOpposingAllianceColor, parseRobotPosition } from '../utils/tbaRequest.ts';
import { escapeUnicode } from "../utils/utils";
import Form, { NumberInput, Select, Checkbox, Input, TextArea } from '../parts/formItems';
import { getFieldAccessor, } from '../parts/formItems';
import { Tabs, } from "../parts/tabs";
import Constants from '../utils/constants';

import type * as TbaApi from '../types/tbaApi';
import type { ResultTypes } from '../types/tbaRequest';
import type * as TbaRequest from '../types/tbaRequest';
import type * as MatchScoutTypes from '../types/matchScout';
import type { TabItems } from '../parts/tabs';

type Props = {
	title: string,
};

const formDefaultValues: MatchScoutTypes.All = {
	// Pre-match
	"scouter_initials": "",
	//"match_level": "",
	//"match_number": 0,
	"robot_position": "B1",
	// Auton
	"auton_leave_starting_line": false,
	"auton_coral_scored_l4": 0,
	"auton_coral_missed_l4": 0,
	"auton_coral_scored_l3": 0,
	"auton_coral_missed_l3": 0,
	"auton_coral_scored_l2": 0,
	"auton_coral_missed_l2": 0,
	"auton_coral_scored_l1": 0,
	"auton_coral_missed_l1": 0,
	"auton_algae_scored_net": 0,
	"auton_algae_missed_net": 0,
	"auton_algae_scored_processor": 0,
	// Teleop
	"teleop_coral_scored_l4": 0,
	"teleop_coral_missed_l4": 0,
	"teleop_coral_scored_l3": 0,
	"teleop_coral_missed_l3": 0,
	"teleop_coral_scored_l2": 0,
	"teleop_coral_missed_l2": 0,
	"teleop_coral_scored_l1": 0,
	"teleop_coral_missed_l1": 0,
	"teleop_algae_scored_net": 0,
	"teleop_algae_missed_net": 0,
	"teleop_algae_scored_processor": 0,
	// Endgame
	"endgame_coral_intake_capability": "",
	"endgame_algae_intake_capability": "",
	"endgame_climb_successful": false,
	"endgame_climb_type": "",
	"endgame_climb_time": 0,
	// Overall
	"overall_robot_died": false,
	"overall_defended_others": false,
	"overall_was_defended": false,
	"overall_defended": [],
	"overall_defended_by": [],
	"overall_pushing": 0,
	"overall_defense_quality": 0,
	"overall_counter_defense": 0,
	"overall_driver_skill": 0,
	"overall_major_penalties": 0,
	"overall_minor_penalties": 0,
	"overall_penalties_incurred": "",
	"overall_comments": "",

	// Playoffs
	"red_alliance": 0,
	"blue_alliance": 0,
} as const;
const noShowValues: MatchScoutTypes.All = {
	// Pre-match
	//"match_event": "",
	//"team_number": 0,
	//"scouter_initials": "",
	//"match_level": "",
	//"match_number": 0,
	//"robot_position": "",
	// Auton
	"auton_leave_starting_line": false,
	"auton_coral_scored_l4": 0,
	"auton_coral_missed_l4": 0,
	"auton_coral_scored_l3": 0,
	"auton_coral_missed_l3": 0,
	"auton_coral_scored_l2": 0,
	"auton_coral_missed_l2": 0,
	"auton_coral_scored_l1": 0,
	"auton_coral_missed_l1": 0,
	"auton_algae_scored_net": 0,
	"auton_algae_missed_net": 0,
	"auton_algae_scored_processor": 0,
	// Teleop
	"teleop_coral_scored_l4": 0,
	"teleop_coral_missed_l4": 0,
	"teleop_coral_scored_l3": 0,
	"teleop_coral_missed_l3": 0,
	"teleop_coral_scored_l2": 0,
	"teleop_coral_missed_l2": 0,
	"teleop_coral_scored_l1": 0,
	"teleop_coral_missed_l1": 0,
	"teleop_algae_scored_net": 0,
	"teleop_algae_missed_net": 0,
	"teleop_algae_scored_processor": 0,
	// Endgame
	"endgame_coral_intake_capability": "Neither",
	"endgame_algae_intake_capability": "Neither",
	"endgame_climb_successful": false,
	"endgame_climb_type": "Neither",
	"endgame_climb_time": 0,
	// Overall
	"overall_robot_died": false,
	"overall_defended_others": false,
	"overall_was_defended": false,
	"overall_defended": [],
	"overall_defended_by": [],
	"overall_pushing": 0,
	"overall_defense_quality": 0,
	"overall_counter_defense": 0,
	"overall_driver_skill": 0,
	"overall_major_penalties": 0,
	"overall_minor_penalties": 0,
	"overall_penalties_incurred": "",
	"overall_comments": "Robot did not appear",
	// Playoffs
	//"red_alliance": "",
	//"blue_alliance": "",
} as const;

function MatchScout(props: Props): React.ReactElement {
	const [isLoading, setLoading] = useState(false);
	const [tabNum, setTabNum] = useState("1");
	const [team_number, setTeamNumber] = useState(0);
	const [teamsInMatch, setTeamsInMatch] = useState<ResultTypes.TeamsInMatch | null>(null);
	const [qrValue, setQrValue] = useState<unknown>();
	const [defendedIsVisible, setDefendedIsVisible] = useState(false);
	const [wasDefendedIsVisible, setWasDefendedIsVisible] = useState(false);
	const [penaltiesIsVisible, setPenaltiesIsVisible] = useState(false);
	const [opposingTeamNum, setOpposingTeamNum] = useState<number[]>([]);
	const [inPlayoffs, setInPlayoffs] = useState(false);
	const [robot_appeared, setRobot_appeared] = useState(true);
	const [climb_successful, setClimbSuccessful] = useState(false);
	const [_eventKey, _setEventKey] = useLocalStorage<TbaApi.EventKey>('eventKey', Constants.EVENT_KEY);

	if(!_eventKey) {
		throw new Error("Could not get event key");
	}

	const eventKey = _eventKey;

	const accessor = getFieldAccessor<MatchScoutTypes.All>();

	useEffect(() => {
		document.title = props.title;
	}, [props.title]);

	let currentRobotPosition: TbaRequest.RobotPosition | null = null;
	try {
		currentRobotPosition = accessor.getFieldValue('robot_position');
	} catch (err) {
		void err;
	}
	useEffect(() => {
		if(!teamsInMatch) {
			return;
		}

		if(!currentRobotPosition) {
			return;

		}

		const [currentColor, _] = parseRobotPosition(currentRobotPosition);
		const color = getOpposingAllianceColor(currentColor);

		const team = teamsInMatch[color];

		setOpposingTeamNum(team);
	}, [teamsInMatch, currentRobotPosition]);

	function setNewMatchScout(event: MatchScoutTypes.All): void {

		if (team_number === 0) {
			window.alert("Team number is 0, please check in Pre.");
			return;
		}
		// TODO: write SubmitBody
		const body: MatchScoutTypes.SubmitBody = {
			// Pre-match
			"event_key": eventKey,
			"team_number": team_number,
			"scouter_initials": event.scouter_initials.toLowerCase(),
			"comp_level": event.comp_level,
			"match_number": event.match_number,
			"robot_position": event.robot_position,
			// Auton
			"auton_leave_starting_line": event.auton_leave_starting_line,
			"auton_coral_scored_l4": event.auton_coral_scored_l4,
			"auton_coral_missed_l4": event.auton_coral_missed_l4,
			"auton_coral_scored_l3": event.auton_coral_scored_l3,
			"auton_coral_missed_l3": event.auton_coral_missed_l3,
			"auton_coral_scored_l2": event.auton_coral_scored_l2,
			"auton_coral_missed_l2": event.auton_coral_missed_l2,
			"auton_coral_scored_l1": event.auton_coral_scored_l1,
			"auton_coral_missed_l1": event.auton_coral_missed_l1,
			"auton_algae_scored_net": event.auton_algae_scored_net,
			"auton_algae_missed_net": event.auton_algae_missed_net,
			"auton_algae_scored_processor": event.auton_algae_scored_processor,
			// Teleop
			"teleop_coral_scored_l4": event.teleop_coral_scored_l4,
			"teleop_coral_missed_l4": event.teleop_coral_missed_l4,
			"teleop_coral_scored_l3": event.teleop_coral_scored_l3,
			"teleop_coral_missed_l3": event.teleop_coral_missed_l3,
			"teleop_coral_scored_l2": event.teleop_coral_scored_l2,
			"teleop_coral_missed_l2": event.teleop_coral_missed_l2,
			"teleop_coral_scored_l1": event.teleop_coral_scored_l1,
			"teleop_coral_missed_l1": event.teleop_coral_missed_l1,
			"teleop_algae_scored_net": event.teleop_algae_scored_net,
			"teleop_algae_missed_net": event.teleop_algae_missed_net,
			"teleop_algae_scored_processor": event.teleop_algae_scored_processor,
			// Endgame
			"endgame_coral_intake_capability": event.endgame_coral_intake_capability,
			"endgame_algae_intake_capability": event.endgame_algae_intake_capability,
			"endgame_climb_successful": event.endgame_climb_successful,
			"endgame_climb_type": event.endgame_climb_type,
			"endgame_climb_time": event.endgame_climb_time,
			// Overall
			"overall_robot_died": event.overall_robot_died,
			"overall_defended_others": event.overall_defended_others,
			"overall_was_defended": event.overall_was_defended,
			"overall_defended": event.overall_defended.sort().join(","),
			"overall_defended_by": event.overall_defended_by.sort().join(","),
			"overall_pushing": event.overall_pushing,
			"overall_defense_quality": event.overall_defense_quality,
			"overall_counter_defense": event.overall_counter_defense,
			"overall_driver_skill": event.overall_driver_skill,
			"overall_major_penalties": event.overall_major_penalties,
			"overall_minor_penalties": event.overall_minor_penalties,
			"overall_penalties_incurred": event.overall_penalties_incurred,
			"overall_comments": event.overall_comments,
			"robot_appeared": robot_appeared,
		};
		Object.entries(body)
			.forEach((k) => {
				const [field, val] = k

				const newVal = typeof val === "string" ?
					escapeUnicode(val) :
					val;

				// TODO: fix
				const access = field as keyof typeof body;
				body[access] = newVal;
			});

		// Do not block
		void tryFetch(body)
			.then((successful) => {
				if(successful) {
					window.alert("Submit successful.");
				} else {
					window.alert("Submit was not successful. Please show the QR to WebDev.");
				}
			});

		setQrValue(body);
	}
	async function tryFetch(body: MatchScoutTypes.SubmitBody): Promise<boolean> {
		let fetchLink = Constants.SERVER_ADDRESS;

		if(!fetchLink) {
			console.error("Could not get fetch link; Check .env");
			return false;
		}

		fetchLink += "reqType=submitMatchData";

		const submitBody = {
			...body,
		};

		try {
			const res = await fetch(fetchLink, {
				method: "POST",
				body: JSON.stringify(submitBody),
				headers: {
					"Content-Type": "application/json",
				},
			});

			return res.ok;
		} catch (_) {
			return false;
		}
	}

	function updateAutonValues(value: number): void {
		if(value) {
			accessor.setFieldValue("auton_leave_starting_line", true);
		}
	}
	async function trySubmit(event: MatchScoutTypes.All): Promise<void> {
		if(isLoading) {
			return;
		}

		setLoading(true);

		try {
			setNewMatchScout(event);

			const scouter_initials = accessor.getFieldValue("scouter_initials");
			const match_number = accessor.getFieldValue("match_number");
			const match_level = accessor.getFieldValue("comp_level");
			const robot_position = accessor.getFieldValue("robot_position");

			accessor.resetFields();
			accessor.setFieldValue("scouter_initials", scouter_initials);
			accessor.setFieldValue("comp_level", match_level);

			accessor.setFieldValue("match_number", match_number + 1);
			accessor.setFieldValue("robot_position", robot_position);

			setRobot_appeared(true);
			setWasDefendedIsVisible(false);
			setDefendedIsVisible(false);

			await updateNumbers();
		}
		catch (err) {
			console.error(`err=`, err);
		}
		finally {
			setLoading(false);
		}
	}

	async function updateTeamNumber(): Promise<void> {
		try {
			const compLevel = accessor.getFieldValue('comp_level');
			const matchNumber = accessor.getFieldValue('match_number');
			const robotPosition = accessor.getFieldValue('robot_position');
			const blueAllianceNumber = accessor.getFieldValue('blue_alliance');
			const redAllianceNumber = accessor.getFieldValue('red_alliance');

			// :eyes:
			const teamsInMatch = await getTeamsInMatch(eventKey, compLevel, matchNumber, blueAllianceNumber, redAllianceNumber);

			if(!teamsInMatch) {
				console.error("Failed to get teams playing: teams is empty");
				return;
			}

			setTeamsInMatch(teamsInMatch);

			const [color, index] = parseRobotPosition(robotPosition);
			const teamNumber = teamsInMatch[color][index];

			setTeamNumber(teamNumber);
		} catch (err) {
			console.error("Failed to request TBA data when updating team number", err);
		}
	}
	function calculateMatchLevel(): void {
		const compLevel = accessor.getFieldValue('comp_level');

		const inPlayoffs = isInPlayoffs(compLevel);

		setInPlayoffs(inPlayoffs);
	}
	async function updateNumbers(): Promise<void> {
		calculateMatchLevel();
		await updateTeamNumber();
	}

	function updatePenalties(): void {
		const major = accessor.getFieldValue("overall_major_penalties");
		const minor = accessor.getFieldValue("overall_minor_penalties");

		const shouldShow = major + minor > 0;

		setPenaltiesIsVisible(shouldShow);
	}

	function preMatch(): React.ReactElement {
		type FieldType = MatchScoutTypes.PreMatch;

		const compLevelOptions: { label: string, value: TbaApi.Comp_Level }[] = [
			{ label: "Qualifications", value: "qm" },
			{ label: "Playoffs", value: "sf" },
			{ label: "Finals", value: "f" },
		];

		function getRobotPositionOptions(): { label: string, value: string }[] {
			if(teamsInMatch?.blue) {
				const blueTeams = teamsInMatch.blue.map((team, index) => {
					const positionNumber = index + 1;
					return {
						label: `B${positionNumber}: ${team}`,
						value: `B${positionNumber}`,
					};
				});

				const redTeams = teamsInMatch.red.map((team, index) => {
					const positionNumber = index + 1;
					return {
						label: `R${positionNumber}: ${team}`,
						value: `R${positionNumber}`,
					};
				});

				return blueTeams.concat(redTeams);
			} else {
				return [
					{ label: "R1", value: "R1" },
					{ label: "R2", value: "R2" },
					{ label: "R3", value: 'R3' },
					{ label: "B1", value: "B1" },
					{ label: "B2", value: "B2" },
					{ label: "B3", value: 'B3' },
				];
			}
		}
		const robot_position = getRobotPositionOptions();
		const playoff_alliances = getAllianceTags(eventKey);

		return (
			<>
				<h2>Team: {team_number}</h2>

				<Input<FieldType>
					title="Scouter Initials"
					name="scouter_initials"
					pattern="^[a-zA-Z]{1,2}$"
					message="Please input your initials (1-2 letters only)"
					align="left"
					required
				/>

				<Select<FieldType>
					title={"Match Level"}
					name={"comp_level"}
					options={compLevelOptions}
					onChange={updateNumbers}
				/>

				<div className={"playoff-alliances"} style={{ display: inPlayoffs ? 'inherit' : 'none' }}>
					<Select<FieldType>
						title={"Blue Alliance"}
						name={"blue_alliance"}
						required={inPlayoffs}
						message={"Enter the blue alliance"}
						options={playoff_alliances}
						onChange={updateNumbers}
					/>

					<Select<FieldType>
						title={"Red Alliance"}
						name={"red_alliance"}
						required={inPlayoffs}
						message={"Enter the red alliance"}
						options={playoff_alliances}
						onChange={updateNumbers}
					/>
				</div>

				<NumberInput<FieldType>
					title={"Match #"}
					name={"match_number"}
					message={"Please enter match #"}
					onChange={updateNumbers}
					min={1}
					buttons={false}
					align={"left"}
				/>


				<Select<FieldType>
					title={"Robot Position"}
					name={"robot_position"}
					message={"Enter robot position"}
					options={robot_position}
				/>

				<details className="overrideOptions">
					<summary>Warning! These options should not be used normally!</summary>
					<NumberInput<FieldType>
						title={"Override Team"}
						name={"team_override"}
						required={false}
						onChange={(e: number) => {
							setTeamNumber(e);
						}}
						min={0}
						buttons={false}
						align={"left"}
					/>

					<button
						type="button"
						className={"noShowButton"}
						onMouseDown={() => {
							const confirmed = window.confirm("Are you sure that this robot did not appear?");

							if(!confirmed) {
								return;
							}

							const values = {...noShowValues};

							setTabNum("5");
							accessor.setFormValues(values);
							setRobot_appeared(false);
						}}
					>No Show</button>
				</details>

			</>
		);
	}

	function autonMatch(): React.ReactElement {
		type FieldType = MatchScoutTypes.AutonMatch;

		return (
			<div style={{ alignContent: 'center' }}>
				<Checkbox<FieldType>
					name="auton_leave_starting_line"
					title="Leave Starting Line?"
				/>
				<div className="inputRow">
					<NumberInput<FieldType>
						title={"A Coral Scored L4"}
						name={"auton_coral_scored_l4"}
						message={"Enter # coral scored for l4 in Auton"}
						onChange={updateAutonValues}
					/>

					<NumberInput<FieldType>
						title={"A Coral Missed L4"}
						name={"auton_coral_missed_l4"}
						message={"Enter # coral missed for l4 in Auton"}
						onChange={updateAutonValues}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"A Coral Scored L3"}
						name={"auton_coral_scored_l3"}
						message={"Enter # coral scored for l3 in Auton"}
						onChange={updateAutonValues}
					/>

					<NumberInput<FieldType>
						title={"A Coral Missed L3"}
						name={"auton_coral_missed_l3"}
						message={"Enter # coral missed for l3 in Auton"}
						onChange={updateAutonValues}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"A Coral Scored L2"}
						name={"auton_coral_scored_l2"}
						message={"Enter # coral scored for l2 in Auton"}
						onChange={updateAutonValues}
					/>

					<NumberInput<FieldType>
						title={"A Coral Missed L2"}
						name={"auton_coral_missed_l2"}
						message={"Enter # coral missed for l2 in Auton"}
						onChange={updateAutonValues}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"A Coral Scored L1"}
						name={"auton_coral_scored_l1"}
						message={"Enter # coral scored for l1 in Auton"}
						onChange={updateAutonValues}
					/>

					<NumberInput<FieldType>
						title={"A Coral Missed L1"}
						name={"auton_coral_missed_l1"}
						message={"Enter # coral missed for l1 in Auton"}
						onChange={updateAutonValues}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"A Algae Scored Net"}
						name={"auton_algae_scored_net"}
						message={"Enter # of algae scored for net in Auton"}
						onChange={updateAutonValues}
					/>

					<NumberInput<FieldType>
						title={"A Algae Missed Net"}
						name={"auton_algae_missed_net"}
						message={"Enter # of algae missed for net in Auton"}
						onChange={updateAutonValues}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"A Algae Processor"}
						name={"auton_algae_scored_processor"}
						message={"Enter # of algae scored for processor in Auton"}
						onChange={updateAutonValues}
					/>
				</div>

			</div>
		);
	}

	function teleopMatch(): React.ReactElement {
		type FieldType = MatchScoutTypes.TeleopMatch;

		return (
			<div>
				<div className="inputRow">
					<NumberInput<FieldType>
						title={"T Coral Scored L4"}
						name={"teleop_coral_scored_l4"}
						message={"Enter # of coral scored for l4 in Teleop"}
					/>

					<NumberInput<FieldType>
						title={"T Coral Missed L4"}
						name={"teleop_coral_missed_l4"}
						message={"Enter # of coral missed for l4 in Teleop"}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"T Coral Scored L3"}
						name={"teleop_coral_scored_l3"}
						message={"Enter # of coral scored for l3 in Teleop"}
					/>

					<NumberInput<FieldType>
						title={"T Coral Missed L3"}
						name={"teleop_coral_missed_l3"}
						message={"Enter # of coral missed for l3 in Teleop"}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"T Coral Scored L2"}
						name={"teleop_coral_scored_l2"}
						message={"Enter # of coral scored for l2 in Teleop"}
					/>

					<NumberInput<FieldType>
						title={"T Coral Missed L2"}
						name={"teleop_coral_missed_l2"}
						message={"Enter # of coral missed for l2 in Teleop"}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"T Coral Scored L1"}
						name={"teleop_coral_scored_l1"}
						message={"Enter # of coral scored for l1 in Teleop"}
					/>

					<NumberInput<FieldType>
						title={"T Coral Missed L1"}
						name={"teleop_coral_missed_l1"}
						message={"Enter # of coral missed for l1 in Teleop"}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"T Algae Scored Net"}
						name={"teleop_algae_scored_net"}
						message={"Enter # of algae scored for net in Teleop"}
					/>

					<NumberInput<FieldType>
						title={"T Algae Missed Net"}
						name={"teleop_algae_missed_net"}
						message={"Enter # of algae missed for net in Teleop"}
					/>
				</div>

				<div className="inputRow">
					<NumberInput<FieldType>
						title={"T Algae Processor"}
						name={"teleop_algae_scored_processor"}
						message={"Enter # of algae scored for processor in Teleop"}
					/>
				</div>
			</div>
		);
	}

	function endgameMatch(): React.ReactElement {
		type FieldType = MatchScoutTypes.EndgameMatch;
		const endgame_coral_intake_capability = [
			{ label: "Station", value: "Station" },
			{ label: "Ground", value: "Ground" },
			{ label: "Both", value: "Both" },
			{ label: "Neither", value: "Neither" },
		];
		const endgame_algae_intake_capability = [
			{ label: "Reef Zone", value: "Reef Zone" },
			{ label: "Ground", value: "Ground" },
			{ label: "Both", value: "Both" },
			{ label: "Neither", value: "Neither" },
		];
		const endgame_climb_type = [
			{ label: "Deep Hang", value: "Deep Hang" },
			{ label: "Shallow Hang", value: "Shallow Hang" },
			{ label: "Park", value: "Park" },
			{ label: "Neither", value: "Neither" },
		];
		return (
			<>
				<Select<FieldType>
					title={"Coral Intake Capability"}
					name={"endgame_coral_intake_capability"}
					message={"Enter coral intake capability"}
					options={endgame_coral_intake_capability}
				/>

				<Select<FieldType>
					title={"Algae Intake Capability"}
					name={"endgame_algae_intake_capability"}
					message={"Enter algae intake capability"}
					options={endgame_algae_intake_capability}
				/>
				<Checkbox<FieldType>
					name="endgame_climb_successful"
					title="Climp Successful?"
					onChange={(event) => {
						setClimbSuccessful(event);
					}}
				/>

				<Select<FieldType>
					title={"Climb Type"}
					name={"endgame_climb_type"}
					message={"Enter climb type"}
					options={endgame_climb_type}
				/>

				<NumberInput<FieldType>
					title={"Climb Time (Seconds)"}
					name={"endgame_climb_time"}
					message={"Enter climb time (seconds)"}
					min={climb_successful
						? 1 : 0}
					align={"left"}
				/>
			</>
		)}

	function overallMatch(): React.ReactElement {
		type FieldType = MatchScoutTypes.OverallMatch;

		const opposingTeams = opposingTeamNum.map((team) => ({ label: team.toString(), value: team.toString() }));

		return (
			<div className='matchbody'>
				<div className="inputRow">
					<Checkbox<FieldType>
						title="Robot died?"
						name="overall_robot_died"
					/>
					<Checkbox<FieldType>
						title="Defended others?"
						name="overall_defended_others"
						onChange={() => {
							setDefendedIsVisible(!defendedIsVisible);
						}}
					/>
					<Checkbox<FieldType>
						title="Was Defended?"
						name="overall_was_defended"
						onChange={() => {
							setWasDefendedIsVisible(!wasDefendedIsVisible);
						}}
					/>
				</div>

				<div
					style={{
						display: defendedIsVisible ? 'inherit' : 'none' ,
					}}
				>
					<Select<FieldType>
						title={"Defended"}
						name={"overall_defended"}
						required={defendedIsVisible}
						message={"Please select the teams it defended"}
						options={opposingTeams}
						multiple
					/>

					<NumberInput<FieldType>
						title={"Defense Quality (1 - 4)"}
						name={"overall_defense_quality"}
						required={defendedIsVisible}
						message={"Please input defense quality"}
						min={0}
						max={4}
					/>
				</div>

				<div
					style={{
						display: wasDefendedIsVisible ? 'inherit' : 'none' ,
					}}
				>
					<Select<FieldType>
						title={"Defended By"}
						name={"overall_defended_by"}
						required={wasDefendedIsVisible}
						message={"Please select the teams it was defended by"}
						options={opposingTeams}
						multiple
					/>
					<NumberInput<FieldType>
						title={<>Counter Defense<br />(1 - 4)</>}
						name={"overall_counter_defense"}
						required={wasDefendedIsVisible}
						message={"Please input the counter-defense rating"}
						min={0}
						max={4}
					/>
				</div>

				<div className='inputRow'>
					<NumberInput<FieldType>
						title={"Pushing (1 - 4)"}
						name={"overall_pushing"}
						message={"Please input the pushing rating"}
						min={0}
						max={4}
					/>
					<NumberInput<FieldType>
						title={"Driver Skill (1 - 4)"}
						name={"overall_driver_skill"}
						message={"Please input the driver skill rating"}
						min={0}
						max={4}
					/>
				</div>
				<div className='inputRow'>
					<NumberInput<FieldType>
						title={"Major Penalties"}
						name={"overall_major_penalties"}
						message={"Enter # of major penalties"}
						min={0}
						onChange={updatePenalties}
					/>
					<NumberInput<FieldType>
						title={"Minor Penalties"}
						name={"overall_minor_penalties"}
						message={"Enter # of minor penalties"}
						min={0}
						onChange={updatePenalties}
					/>
				</div>
				<TextArea<FieldType>
					title="Penalties Incurred"
					name="overall_penalties_incurred"
					message="Please enter the penalties"
					shown={penaltiesIsVisible}
				/>

				<TextArea<FieldType>
					title="Comments"
					name="overall_comments"
					message="Please enter some comments!"
				/>
			</div>
		)
	}

	const items: TabItems = [
		{
			key: '1',
			label: 'Pre',
			children: preMatch(),
		},
		{
			key: '2',
			label: 'Auton',
			children: autonMatch(),
		},
		{
			key: '3',
			label: 'Teleop',
			children: teleopMatch(),
		},
		{
			key: '4',
			label: 'Endgame',
			children: endgameMatch(),
		},
		{
			key: '5',
			label: 'Overall',
			children: overallMatch(),
		},
	];
	return (
		<>
			<Header name="Match Scout" back="#scoutingapp" />

			<match-scout>
				<Form<MatchScoutTypes.All>
					initialValues={formDefaultValues}
					onFinish={trySubmit}
					onFinishFailed={(values, errorFields) => {
						// TODO: Implement
						const errorMessage = errorFields.map((x) => x.errors.join(", ")).join("\n");
						window.alert(errorMessage);
					}}
					accessor={accessor}
				>
					<Tabs defaultActiveKey="1" activeKey={tabNum} items={items} onChange={(key) => { setTabNum(key) }} />
					<footer>
						{Number(tabNum) > 1 && (
							<button type="button" onMouseDown={() => { setTabNum((Number(tabNum) - 1).toString())}} className='tabButton'>Back</button>
						)}
						{Number(tabNum) < items.length && (
							<button type="button" onMouseDown={() => { setTabNum((Number(tabNum) + 1).toString())}} className='tabButton'>Next</button>
						)}
						{Number(tabNum) === items.length && (
							<button type="submit" className='submitButton'>Submit</button>
						)}
						{isLoading &&
							<h2>Submitting data...</h2>
						}
					</footer>
				</Form>
				<QrCode value={qrValue} />
			</match-scout>
		</>
	);
}

export default MatchScout;
