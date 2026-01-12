import '../public/stylesheets/pitScout.css';
import { useLocalStorage, } from 'react-use';
import { useState, useEffect, useRef } from 'react';
import Header from '../parts/header';
import QrCode from '../parts/qrCodeViewer';
import { getTeamsNotScouted, } from '../utils/tbaRequest.ts';
import { readImage, escapeUnicode } from '../utils/utils';
import Form, { NumberInput, Select, Input, Checkbox, TextArea } from '../parts/formItems';
import { getFieldAccessor } from '../parts/formItems';
import Constants from '../utils/constants';

import type * as TbaApi from '../types/tbaApi';
import type * as PitScoutTypes from '../types/pitScout';

type Props = {
	title: string,
};

const formDefaultValues = {
	"team_number": 0,
	"scouter_initials": "",
	"robot_weight": 0,
	"drive_train_type": "",
	"motor_type": "",
	"number_of_motors": 0,
	"wheel_type": "",
	"coral_intake_capability": "",
	"intake_width": "",
	"coral_scoring_l1": false,
	"coral_scoring_l2": false,
	"coral_scoring_l3": false,
	"coral_scoring_l4": false,
	"can_remove_algae": false,
	"algae_intake_capability": "",
	"algae_scoring_capability": "",
	"score_aiming_coral": "",
	"score_aiming_algae": "",
	"aiming_description": "",
	"climbing_capability": "",
	"pit_organization": 4,
	"team_safety": 4,
	"team_workmanship": 4,
	"gracious_professionalism": 4,
	"comments": "",
} as const;

const IMAGE_DELIMITER = "$";

function PitScout(props: Props): React.ReactElement {
	const [_eventKey, _setEventKey] = useLocalStorage<TbaApi.EventKey>('eventKey', Constants.EVENT_KEY);
	const [isLoading, setLoading] = useState(false);
	const [qrValue, setQrValue] = useState<any>();
	const [robotImageURI, setRobotImageURI] = useState<string[]>([]);
	const robotImageInput = useRef<HTMLInputElement>(null);
	const [refresh, setRefresh] = useState(false);

	if(!_eventKey) {
		throw new Error("Could not get event key");
	}
	const eventKey = _eventKey;

	const accessor = getFieldAccessor<PitScoutTypes.Pit>();

	useEffect(() => {
		document.title = props.title;
	}, [props.title]);
	useEffect(() => {
		void (async function() {
			const initialMessage = "Teams not scouted:";
			let message = initialMessage;

			try {
				const teamsNotScouted = await getTeamsNotScouted(eventKey);

				if(teamsNotScouted === null) {
					throw new Error("Could not access teams");
				}

				teamsNotScouted.sort((a, b) => a - b);

				message += teamsNotScouted.join("\n");

				if(message === initialMessage) {
					window.alert("All teams have been scouted.");
				} else {
					window.alert(message);
				}
			} catch (err) {
				console.error("Error in fetching teams: ", (err)?.message);
			}})();
	}, [eventKey]);

	function submitData(event: PitScoutTypes.Pit): void {
		const body: PitScoutTypes.SubmitBody = {
			"match_event": eventKey,
			"team_number": event.team_number,
			"scouter_initials": event.scouter_initials.toLowerCase(),
			"robot_weight": event.robot_weight,
			"drive_train_type": event.drive_train_type,
			"motor_type": event.motor_type,
			"number_of_motors": event.number_of_motors,
			"wheel_type": event.wheel_type,
			"intake_width": event.intake_width,
			"coral_intake_capability": event.coral_intake_capability,
			"coral_scoring_l1": event.coral_scoring_l1 || false,
			"coral_scoring_l2": event.coral_scoring_l2 || false,
			"coral_scoring_l3": event.coral_scoring_l3 || false,
			"coral_scoring_l4": event.coral_scoring_l4 || false,
			"can_remove_algae": event.can_remove_algae || false,
			"algae_intake_capability": event.algae_intake_capability,
			"algae_scoring_capability": event.algae_scoring_capability,
			"score_aiming_coral": event.score_aiming_coral,
			"score_aiming_algae": event.score_aiming_algae,
			"aiming_description": event.aiming_description,
			"climbing_capability": event.climbing_capability,
			"pit_organization": event.pit_organization,
			"team_safety": event.team_safety,
			"team_workmanship": event.team_workmanship,
			"gracious_professionalism": event.gracious_professionalism,
			"comments": event.comments,
		};
		Object.entries(body)
			.forEach((item) => {
				const [field, value] = item;

				const newVal = typeof value === "string" ?
					escapeUnicode(value) :
					value;

				body[field] = newVal;
			});

		void tryFetch(body)
			.then((successful) => {
				if(successful) {
					window.alert("Submit successful.");
				} else {
					window.alert("Submit was not successful. Please show the QR to WebDev. You will have to manually submit pictures.");
				}
			});

		setQrValue(body);
	}
	async function tryFetch(body: PitScoutTypes.SubmitBody): Promise<boolean> {
		let fetchLink = Constants.SERVER_ADDRESS;

		if(!fetchLink) {
			console.error("Could not get fetch link; Check .env");
			return false;
		}

		fetchLink += "reqType=submitPitData";

		const imageData = robotImageURI.join(IMAGE_DELIMITER);

		const submitBody = {
			...body,
			robotImageURI: imageData,
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
		} catch (err) {
			console.error(`Failed to submit data:`, err);

			return false;
		}
	}
	function Pit(): React.ReactElement {
		type FieldType = PitScoutTypes.Pit;
		const drive_train_options = [
			{ label: "Tank", value: "Tank" },
			{ label: "Swerve", value: "Swerve" },
			{ label: "H-Drive", value: "H-Drive" },
			{ label: "Other", value: "Other" },
		];
		const motor_type_options = [
			{ label: "Falcon 500", value: "Falcon 500" },
			{ label: "Kraken", value: "Kraken" },
			{ label: "NEO", value: "NEO" },
			{ label: "CIM", value: "CIM" },
			{ label: "Other", value: "Other" },
		];
		const wheel_type_options = [
			{ label: "Nitrile / Neoprene / Plaction", value: "Nitrile_Neoprene_Plaction" },
			{ label: "HiGrip", value: "HiGrip" },
			{ label: "Colson", value: 'Colson' },
			{ label: "Stealth / Smooth grip", value: "Stealth_Smooth grip" },
			{ label: "Pneumatasic", value: "Pneumatasic" },
			{ label: "Omni", value: "Omni" },
			{ label: "Mechanum", value: "Mechanum" },
			{ label: "TPU", value: "TPU" },
			{ label: "Other", value: "Other" },
		];
		const coral_intake_capability_options = [
			{ label: "Coral Station - Small", value: "Coral Station - Small" },
			{ label: "Coral Station - Wide", value: "Coral Station - Wide" },
			{ label: "Ground", value: "Ground" },
			{ label: "Both", value: "Both" },
			{ label: "Neither", value: "Neither" },
		];
		const intake_width_options = [
			{ label: "Full Width", value: "Full Width" },
			{ label: "Half Width", value: "Half Width" },
			{ label: "Claw/ Aiming", value: "Claw/ Aiming" },
			{ label: "Other", value: "Other" },
		];
		const algae_intake_capability_options = [
			{ label: "Reef Zone", value: "Reef Zone" },
			{ label: "Ground", value: "Ground" },
			{ label: "Both", value: "Both" },
			{ label: "Neither", value: "Neither" },
		];
		const algae_scoring_capability_options = [
			{ label: "Net", value: "Net" },
			{ label: "Processor", value: "Processor" },
			{ label: "Both", value: "Both" },
			{ label: "Neither", value: "Neither" },
		];
		const score_aiming_coral_options = [
			{ label: "Manual", value: "Manual" },
			{ label: "Auto", value: "Auto" },
			{ label: "Neither", value: "Neither" },
		];
		const score_aiming_algae_options = [
			{ label: "Manual", value: "Manual" },
			{ label: "Auto", value: "Auto" },
			{ label: "Neither", value: "Neither" },
		];
		const climbing_capability_options = [
			{ label: "Shallow", value: "Shallow" },
			{ label: "Deep", value: "Deep" },
			{ label: "Both", value: "Both" },
			{ label: "Neither", value: "Neither" },
		];
		return (
			<>
				<Input<FieldType>
					title="Scouter Initials"
					name="scouter_initials"
					pattern="^[a-zA-Z]{1,2}$"
					message="Please input your initials (1-2 letters only)"
					align="left"
					required
				/>

				<NumberInput<FieldType>
					title={"Team #"}
					name={"team_number"}
					message={"Please input the team number"}
					min={1}
					max={99999}
					buttons={false}
					align={"left"}
				/>

				<NumberInput<FieldType>
					title={"Robot Weight (lbs)"}
					name={"robot_weight"}
					message={"Please input the robot weight in lbs"}
					min={0}
					max={1000}
					align={"left"}
				/>

				<Select<FieldType>
					title={"Drive Train Type"}
					name={"drive_train_type"}
					message={"Please input the drive train type"}
					options={drive_train_options}
				/>
				<Select<FieldType>
					title={"Motor Type"}
					name={"motor_type"}
					message={"Please input the motor type"}
					options={motor_type_options}
				/>
				<NumberInput<FieldType>
					title={"# of Motors"}
					name={"number_of_motors"}
					message={"Please input the number of motors"}
					min={0}
					align={"left"}
				/>
				<Select<FieldType>
					title={"Wheel Type"}
					name={"wheel_type"}
					message={"Please input the wheel type"}
					options={wheel_type_options}
				/>
				<Select<FieldType>
					title={"Coral Intake Type"}
					name={"coral_intake_capability"}
					message={"Please input the intake type"}
					options={coral_intake_capability_options}
				/>
				<Select<FieldType>
					title={"Intake Width"}
					name={"intake_width"}
					message={"Please input the intake width"}
					options={intake_width_options}
				/>
				<h2>Coral Scoring</h2>
				<Checkbox<FieldType>
					name="coral_scoring_l1"
					title="L1"
				/>
				<Checkbox<FieldType>
					name="coral_scoring_l2"
					title="L2"
				/>
				<Checkbox<FieldType>
					name="coral_scoring_l3"
					title="L3"
				/>
				<Checkbox<FieldType>
					name="coral_scoring_l4"
					title="L4"
				/>
				<Select<FieldType>
					title={"Algae Intake Capability"}
					name={"algae_intake_capability"}
					message={"Please input the algae intake capability"}
					options={algae_intake_capability_options}
				/>
				<Select<FieldType>
					title={"Algae Scoring Capability"}
					name={"algae_scoring_capability"}
					message={'Please input the algae scoring capability'}
					options={algae_scoring_capability_options}
				/>
				<Select<FieldType>
					title={"Coral Score Aiming"}
					name={"score_aiming_coral"}
					message={"Please input the coral score aiming"}
					options={score_aiming_coral_options}
				/>
				<Select<FieldType>
					title={"Algae Score Aiming"}
					name={"score_aiming_algae"}
					message={"Please input the algae score aiming"}
					options={score_aiming_algae_options}
				/>
				<TextArea<FieldType>
					name="aiming_description"
					title="Aiming Description"
				/>

				<Select<FieldType>
					title={"Climbing Capability"}
					name={"climbing_capability"}
					message={"Please input the climbing capability"}
					options={climbing_capability_options}
				/>

				<NumberInput<FieldType>
					title={"Pit Organization(0-4)"}
					name={"pit_organization"}
					message={"Please input pit organization rating"}
					min={0}
					max={4}
					align={"left"}
				/>

				<NumberInput<FieldType>
					title={"Team Safety(0-4)"}
					name={"team_safety"}
					message={"Please input team safety rating"}
					min={0}
					max={4}
					align={"left"}
				/>

				<NumberInput<FieldType>
					title={"Team Workmanship(0-4)"}
					name={"team_workmanship"}
					message={"Please input team workmanship rating"}
					min={0}
					max={4}
					align={"left"}
				/>

				<NumberInput<FieldType>
					title={"Gracious Professionalism(0-4)"}
					name={"gracious_professionalism"}
					message={"Please input GP rating"}
					min={0}
					max={4}
					align={"left"}
				/>

				<TextArea<FieldType>
					name="comments"
					title="Comments"
				/>
				<h2 style={{ display: isLoading ? 'inherit' : 'none' }}>Submitting data...</h2>

				<label className="robotImageLabel" htmlFor="robotImageInput">Select Image {`(${robotImageInput?.current?.files?.length ?? 0} images)`}</label>
				<input
					ref={robotImageInput}
					id="robotImageInput"
					type="file"
					accept="image/*"
					multiple
					onChange={function() {
						setRefresh(!refresh);
					}}
				/>
				<input type="submit" value="Submit" className='submit' />
			</>
		);
	}
	return (
		<>
			<Header name={"Pit Scout"} back={"#scoutingapp"}/>

			<pit-scout>
				<Form<PitScoutTypes.Pit>
					accessor={accessor}
					initialValues={formDefaultValues}
					onFinish={async (event) => {
						if(isLoading) {
							return;
						}
						try {
							setLoading(true);

							submitData(event);

							const initials = accessor.getFieldValue("scouter_initials");

							accessor.resetFields();

							if(robotImageInput.current) {
								const fileList: FileList = robotImageInput.current.files ?? new FileList();

								const promises: Promise<string>[] = [];

								try {
									// cannot map over FileList
									for (const file of fileList) {
										const image = readImage(file);
										promises.push(image);
									}
								} catch (err) {
									console.error(`File reading error =`, err);
									window.alert("Error in reading file");
									return;
								}

								const parsedFiles: string[] = await Promise.all(promises);

								setRobotImageURI(parsedFiles)
								robotImageInput.current.value = "";
							}

							accessor.setFormValues({...formDefaultValues, "scouter_initials": initials});
						}
						catch (err) {
							console.error(err);
							window.alert("Error occured, please do not leave this message and notify a Webdev member immediately.");
							window.alert(err);
						}
						finally {
							setLoading(false);
						}
					}}
					onFinishFailed={({values, errorFields, outOfDate}) => {
						// TODO: Implement

						const errorMessage = errorFields.map((x) => x.errors.join(", ")).join("\n");
						window.alert(errorMessage);
					}}
				>
					{Pit()}
				</Form>
				<QrCode value={qrValue} />
			</pit-scout>
		</>
	);
}

export default PitScout;
