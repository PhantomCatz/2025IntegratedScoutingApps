import { Input, TextArea, } from './formItems';
import '../public/stylesheets/strategicTabs.css';

import type { TabItems } from './tabs';
import type * as Database from '../types/database';

type Props = {
	team: number;
	data: Database.StrategicEntry[] | null;
};

function StrategicTabs(props: Props): TabItems {
	const team = props.team;
	const data = props.data;
	if (!team) {
		return [];
	}

	const matches: TabItems = [];

	if(!data) {
		return matches;
	}

	for (const strategicInfo of data) {
		strategicInfo.comments = strategicInfo.comments.replaceAll("\\n", "\n");

		matches.push({
			key: `strategicData${strategicInfo.id}`,
			label: `${strategicInfo.scouter_initials.toUpperCase()}:${strategicInfo.team_number}`,
			children: (
				<strategic-tab>
					<Input
						title="Match Event"
						disabled
						defaultValue={strategicInfo.match_event}
					/>
					<Input
						title="Scouter Initials"
						disabled
						defaultValue={strategicInfo.scouter_initials}
					/>
					<Input
						title="Match Level"
						disabled
						defaultValue={strategicInfo.comp_level}
					/>
					<Input
						title="Match #"
						disabled
						defaultValue={strategicInfo.match_number.toString()}
					/>
					<Input
						title="Robot Position"
						disabled
						defaultValue={strategicInfo.robot_position}
					/>
					<TextArea
						title="Comments"
						disabled
						defaultValue={strategicInfo.comments}
					/>
				</strategic-tab>
			)
		});
	}

	return matches;
}

export default StrategicTabs;
