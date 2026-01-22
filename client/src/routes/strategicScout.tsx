import '../public/stylesheets/strategicScout.css';
import { useEffect, useState} from 'react';
import { useLocalStorage, } from 'react-use';
import { Table } from 'antd';
import { Tabs } from '../parts/tabs';
import Header from '../parts/header';
import QrCode from '../parts/qrCodeViewer';
import { isInPlayoffs, getTeamsInMatch, getAllianceTags, parseRobotPosition } from '../utils/tbaRequest.ts';
import { escapeUnicode } from '../utils/utils';
import { getFieldAccessor } from '../parts/formItems';
import Form, { NumberInput, Select, Input, TextArea, } from '../parts/formItems';
import Constants from '../utils/constants';

import type * as TbaApi from '../types/tbaApi';
import type * as StrategicScoutTypes from '../types/strategicScout';
import type * as Database from '../types/database';
import type * as ResultTypes from '../types/resultTypes';

const formDefaultValues = {
	"scouter_initials": "",
	"match_level": "",
	"match_number": 0,
	"robot_position": undefined,
	"comments": "",
	"red_alliance": undefined,
	"blue_alliance": undefined,
	"penalties": 0,
} as const;

type Props = {
	title: string,
};

function StrategicScout(props: Props): React.ReactElement {
	const [tabNum, setTabNum] = useState("1");
	const [team_number, setTeamNumber] = useState(0);
	const [teamsInMatch, setTeamsInMatch] = useState<ResultTypes.TeamsInMatch | null>(null);
	const [qrValue, setQrValue] = useState<unknown>();
	const [teamData, setTeamData] = useState<Database.StrategicEntry[] | null>(null);
	const [inPlayoffs, setInPlayoffs] = useState(false);
	const [_eventKey, _setEventKey] = useLocalStorage<TbaApi.EventKey>('eventKey', Constants.EVENT_KEY);

	if(!_eventKey) {
		throw new Error("Could not get event key");
	}

	const eventKey = _eventKey;

	const accessor = getFieldAccessor<StrategicScoutTypes.All>();

	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
	useEffect(() => {
		void (async function() {
			let fetchLink = Constants.SERVER_ADDRESS;

			if(!team_number) {
				return;
			}

			if(!fetchLink) {
				console.error("Could not get fetch link. Check .env");
				return;
			}

			fetchLink += "reqType=getTeamStrategic";

			fetchLink += `&team=${team_number}`;

			try {
				const request = await fetch(fetchLink);
				const data = await request.json() as Database.StrategicEntry[] | null;
				if(!data?.length) {
					console.error(`No data for team ${team_number}`);
					setTeamData(null);
					return;
				}

				setTeamData(data);
			} catch (err) {
					console.error("Error fetching data. Is server on?", err);
				}
		})();
	}, [team_number]);

	async function updateTeamNumber(): Promise<void> {
		try {
			const compLevel = accessor.getFieldValue('comp_level');
			const matchNumber = accessor.getFieldValue('match_number');
			const robotPosition = accessor.getFieldValue('robot_position');
			const blueAllianceNumber = Number(accessor.getFieldValue('blue_alliance'));
			const redAllianceNumber = Number(accessor.getFieldValue('red_alliance'));

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
	function setNewStrategicScout(event: StrategicScoutTypes.All): void {
		const body: StrategicScoutTypes.SubmitBody = {
			"match_event": eventKey,
			"team_number": team_number,
			"scouter_initials": event.scouter_initials.toLowerCase(),
			"comp_level": event.comp_level,
			"match_number": event.match_number,
			"robot_position": event.robot_position,
			"blue_alliance": event.blue_alliance,
			"red_alliance": event.red_alliance,
			// "team_rating": event.team_rating,
			"comments": event.comments,
		};
		Object.entries(body)
			.forEach((entry) => {
				const [field, value] = entry;

				const newVal = typeof value === "string" ?
					escapeUnicode(value) :
					value;

				// :eyes: :eyes: :eyes:
				const access = field as keyof typeof body;
				// :eyes: :eyes: :eyes:
				body[access] = newVal as unknown as never;
			});

		void tryFetch(body)
			.then((successful) => {
				if(successful) {
					window.alert("Submit successful.");
				} else {
					window.alert("Submit was not successful. Please show the QR to WebDev.");
				}
			})

		setQrValue(body);
	}
	async function tryFetch(body: StrategicScoutTypes.SubmitBody): Promise<boolean> {
		let fetchLink = Constants.SERVER_ADDRESS;

		if(!fetchLink) {
			console.error("Could not get fetch link; Check .env");
			return false;
		}

		fetchLink += "reqType=submitStrategicData";

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
	function calculateMatchLevel(): void {
		const matchLevel = accessor.getFieldValue('comp_level');

		const inPlayoffs = isInPlayoffs(matchLevel);

		setInPlayoffs(inPlayoffs);
	}
	async function trySubmit(event: StrategicScoutTypes.All): Promise<void> {
		setNewStrategicScout(event);

		const scouter_initials = accessor.getFieldValue('scouter_initials');
		const match_number = accessor.getFieldValue('match_number');
		const comp_level = accessor.getFieldValue('comp_level');
		const match_event = accessor.getFieldValue('match_event');
		const robot_position = accessor.getFieldValue('robot_position');

		accessor.resetFields();

		accessor.setFieldValue('scouter_initials', scouter_initials);
		accessor.setFieldValue('comp_level', comp_level);
		accessor.setFieldValue('match_event', match_event);
		accessor.setFieldValue("match_number", match_number + 1);
		accessor.setFieldValue('robot_position', robot_position);

		calculateMatchLevel();
		await updateTeamNumber();
	}
	async function runFormFinish(event: StrategicScoutTypes.All): Promise<void> {
		try {
			await trySubmit(event);
		} catch (err) {
			console.error(err);
			window.alert("Error occured, please do not leave this message and notify a Webdev member immediately.");
		}
	}
	async function updateNumbers(): Promise<void> {
		calculateMatchLevel();
		await updateTeamNumber();
	}

	function preMatch(): React.ReactElement {
		type FieldType = StrategicScoutTypes.PreMatch;

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
					name="scouter_initials"
					title="Scouter Initials"
					maxLength={2}
					pattern="^[A-Za-z]{1,2}$"
					message="Please enter only letters (max 2)"
					align="left"
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
					message={"Enter match #"}
					onChange={updateNumbers}
					min={1}
					buttons={false}
					align={"left"}
				/>

				<Select<FieldType>
					title={"Robot Position"}
					name={"robot_position"}
					message={"Please input the robot position"}
					options={robot_position}
					onChange={updateNumbers}
				/>

				<button type="button" onClick={() => { setTabNum("2"); }} className='tabButton'>Next</button>

			</>
		);
	}

	function comment(): React.ReactElement {
		let prevComments;
		type FieldType = StrategicScoutTypes.Comment;

		if(teamData) {
			const columns = [
				{
					"title": 'Scouter Initials',
					"dataIndex": 'scouter_initials',
					"width": '70vw',
				}, {
					"title": 'Match #',
					"dataIndex": 'match_number',
					"width": '10vw',
				},
			];

			const dataSource = [];

			for (const match of teamData) {
				dataSource.push({
					"key": `${match.id}`,
					"scouter_initials": `Scouter Initials: ${match.scouter_initials}`,
					"match_number": match.match_number,
					"comment": match.comments,
				});
			}

			prevComments =
				<Table
					columns={columns}
					dataSource={dataSource}
				>
				</Table>;
		} else {
			prevComments = <p>This team has not been scouted yet.</p>;
		}

		return (
			<div>
				{prevComments}

				<TextArea<FieldType>
					title="Comments"
					name="comments"
					message="Please input some comments!"
				/>

				<button type='button' onClick={() => { setTabNum("1"); }} className='tabButton'>Back</button>
				<button type='submit' className='submitButton'>Submit</button>
			</div>
		);
	}
	const items = [
		{
			key: '1',
			label: 'Pre',
			children: preMatch(),
		},
		{
			key: '2',
			label: 'Comment',
			children: comment(),
		},
	];

	return (
		<>
			<Header name={"Strategic Scout"} back="#scoutingapp/" />

			<strategic-scout>
				<Form<StrategicScoutTypes.All>
					accessor={accessor}
					initialValues={formDefaultValues}
					onFinish={runFormFinish}
					onFinishFailed={(_values, errorFields) => {
						// TOOD: Implement

						const errorMessage = Object.entries(errorFields).map((x) => x[0]).join("\n");
						window.alert(errorMessage);
					}}
				>
					<Tabs defaultActiveKey="1" activeKey={tabNum} items={items} onChange={(key) => { setTabNum(key); }} />
				</Form>
				<QrCode value={qrValue} />
			</strategic-scout>
		</>
	);
}

export default StrategicScout;
