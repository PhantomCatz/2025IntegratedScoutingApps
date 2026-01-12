import '../public/stylesheets/dtfHome.css';
import Header from '../parts/header';
import { useEffect } from 'react';
import Form, { NumberInput, } from '../parts/formItems';
import { getFieldAccessor } from '../parts/formItems';
import Constants from '../utils/constants';

import type { All, Props, } from '../types/dtfHome';

function DTFHome(props: Props): React.ReactElement {
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);

	const accessor = getFieldAccessor<All>();

	const teamInput: React.ReactElement[] = [];

	for(let allianceNumber = 1; allianceNumber <= Constants.NUM_ALLIANCES; allianceNumber++) {
		const allianceId = `alliance${allianceNumber}`;
		const teamNumberInput = [];

		for(let teamNumber = 1; teamNumber <= Constants.TEAMS_PER_ALLIANCE; teamNumber++) {
			const teamNumberId = `team${teamNumber + Constants.TEAMS_PER_ALLIANCE * (allianceNumber - 1)}Num`;

			teamNumberInput.push(
				<NumberInput<All>
					key={teamNumberId}
					name={`teamNumber${teamNumberId}` as keyof All}
					title={`Team ${teamNumber + Constants.TEAMS_PER_ALLIANCE * (allianceNumber - 1)} Number`}
					min={0}
					buttons={false}
					align="left"
				/>
			);
		}

		teamInput.push(
			<div key={allianceId}>
				<h2>Alliance {allianceNumber}</h2>
				<hr/>
				{teamNumberInput}
			</div>
		);
	}

	return (
		<>
			<Header name={"Drive Team Feeder"} back={"#"} />

			<dtf-home>
				<Form<All>
					onFinish={(event: All) => {
						const teamNums: number[] = [];

						for(let i = 1; i <= Constants.NUM_ALLIANCES * Constants.TEAMS_PER_ALLIANCE; i++) {
							const number = event[`teamNumber${i}` as keyof All];
							teamNums.push(number);
						}

						window.location.href = "#dtf/" + teamNums.join(",");
					}}
					accessor={accessor}
				>
					{teamInput}
					<button type="submit" className="submitButton" >Submit</button>
				</Form>
			</dtf-home>
		</>
	);
}

export default DTFHome;
