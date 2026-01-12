import { Input, TextArea, Checkbox } from './formItems';
import '../public/stylesheets/pitLookup.css';

import type { TabItems } from './tabs';
import type * as Database from '../types/database';

const IMAGE_DELIMITER = "$";

type Props = {
	teamNumber: number
	data: Database.PitEntry[] | null;
};

function PitTabs(props: Props): TabItems {
	const teamNumber = props.teamNumber;
	const data = props.data;

	const pitEntries: TabItems = [];

	if (!teamNumber || !data) {
		return pitEntries;
	}

	const matches: TabItems = [];

	for (const pitInfo of data) {
		pitInfo.comments = pitInfo.comments.replaceAll("\\n", "\n");

		const images = pitInfo.robotImageURI.split(IMAGE_DELIMITER).filter((x: string) => x !== "");

		const pictures = [];

		if(images.length > 0) {
			for(let i = 0; i < images.length; i++) {
				pictures.push(
					<div key={`pitImage${i}`}>
						<h3>Picture {i + 1}</h3>
						<img className={"pitImage"} src={images[i]}></img>
					</div>
				);
			}
		} else {
			pictures.push(
				<p key={"pitImage__no-pictures"}>
					No Pit Pictures D:
				</p>
			);
		}

		matches.push({
			key: `pitData${pitInfo.id}`,
			label: `${pitInfo.scouter_initials.toUpperCase()}:${pitInfo.team_number}`,
			children: (
				<div className="pitTabs">
					<h2>Match Event</h2>
					<Input disabled defaultValue={pitInfo.match_event} />
					<h2>Scouter Initials</h2>
					<Input disabled defaultValue={pitInfo.scouter_initials} />
					<h2>Robot Weight</h2>
					<Input disabled defaultValue={pitInfo.robot_weight.toString()} />
					<h2>Drive Train Type</h2>
					<Input disabled defaultValue={pitInfo.drive_train_type} />
					<h2>Motor Type</h2>
					<Input disabled defaultValue={pitInfo.motor_type} />
					<h2># of Motors</h2>
					<Input disabled defaultValue={pitInfo.number_of_motors.toString()} />
					<h2>Wheel Type</h2>
					<Input disabled defaultValue={pitInfo.wheel_type} />
					<h2>Coral Intake Capability</h2>
					<Input disabled defaultValue={pitInfo.coral_intake_capability} />
					<h2>Coral Scoring L1</h2>
					<Checkbox disabled defaultValue={Boolean(pitInfo.coral_scoring_l1)}/>
					<h2>Coral Scoring L2</h2>
					<Checkbox disabled defaultValue={Boolean(pitInfo.coral_scoring_l2)}/>
					<h2>Coral Scoring L3</h2>
					<Checkbox disabled defaultValue={Boolean(pitInfo.coral_scoring_l3)}/>
					<h2>Coral Scoring L4</h2>
					<Checkbox disabled defaultValue={Boolean(pitInfo.coral_scoring_l4)}/>
					<h2>Can Remove Algae</h2>
					<Checkbox disabled defaultValue={Boolean(pitInfo.can_remove_algae)} />
					<h2>Algae Intake Capability</h2>
					<Input disabled defaultValue={pitInfo.algae_intake_capability} />
					<h2>Algae Scoring Capability</h2>
					<Input disabled defaultValue={pitInfo.algae_scoring_capability} />
					<h2>Score Aiming Coral</h2>
					<Input disabled defaultValue={pitInfo.score_aiming_coral} />
					<h2>Score Aiming Algae</h2>
					<Input disabled defaultValue={pitInfo.score_aiming_algae} />
					<h2>Aiming Description</h2>
					<TextArea disabled defaultValue={pitInfo.aiming_description}/>
					<h2>Climbing Capability</h2>
					<Input disabled defaultValue={pitInfo.climbing_capability} />
					<h2>Pit Organization</h2>
					<Input disabled defaultValue={pitInfo.pit_organization.toString()} />
					<h2>Team Safety</h2>
					<Input disabled defaultValue={pitInfo.team_safety.toString()} />
					<h2>Team Workmanship</h2>
					<Input disabled defaultValue={pitInfo.team_workmanship.toString()} />
					<h2>Gracious Professionalism</h2>
					<Input disabled defaultValue={pitInfo.gracious_professionalism.toString()} />
					<h2>Comments</h2>
					<TextArea disabled defaultValue={pitInfo.comments} />

					<h2>Pit Pictures</h2>
					{pictures}
				</div>
			)
		});
	}
	matches.sort((a, b) => parseInt(a.key) - parseInt(b.key));

	return matches;
}

export default PitTabs;
