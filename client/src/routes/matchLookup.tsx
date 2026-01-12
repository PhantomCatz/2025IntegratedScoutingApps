import '../public/stylesheets/matchLookup.css';
import { useEffect, useState } from 'react';
import {useLocalStorage, } from 'react-use';
import Form, { Input, NumberInput } from '../parts/formItems';
import { getFieldAccessor } from '../parts/formItems';
import Header from '../parts/header';
import { getAllTeams, } from '../utils/tbaRequest.ts';
import Constants from '../utils/constants';

import type * as TbaApi from '../types/tbaApi';

type Props = {
	title: string,
};
type Fields = {
	teamNumber: number,
};

function MatchLookup(props: Props): React.ReactElement {
	const [teamNumberElements, setTeamNumberElements] = useState<React.ReactElement[] | null>(null);
	const [_eventKey, _setEventKey] = useLocalStorage<TbaApi.EventKey>("eventKey", Constants.EVENT_KEY);
	const [isLoading, setIsLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);

	const accessor = getFieldAccessor<Fields>();

	if(!_eventKey) {
		throw new Error("Could not get event key");
	}

	const eventKey = _eventKey;

	useEffect(() => { document.title = props.title; }, [props.title]);
	useEffect(() => {
		void (async function() {
			setIsLoading(true);
			try {
				const data = await getAllTeams(eventKey);

				if(!data) {
					throw new Error("Could not get data");
				}

				const teamNumbers = data.map(function (team) {
					return (<h2 key={team}>
						<a href={`#scoutingapp/lookup/teamdata/${team}`}>{team}</a>
					</h2>);
				});

				setTeamNumberElements(teamNumbers);
			} catch (err) {
				console.error("Error fetching team list: ", err);
			}
			setIsLoading(false);
		})();
	}, [eventKey]);

	if(!isLoading && !teamNumberElements) {
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		setTimeout(() => {setRefresh(!refresh);}, 1000);
	}

	return (
		<>
			<Header name={"Match Lookup"} back={"#scoutingapp/lookup"} />

			<match-lookup>
				<Form<Fields>
					accessor={accessor}
					onFinish={event => {
						window.location.href = "#scoutingapp/lookup/teamData/" + event.teamNumber.toString();
					}}
				>
					<NumberInput
						title="Team Number"
						name="teamNumber"
						message="Please input the team number!"
						min={0}
					/>
					<button
						type="submit"
						value="Submit"
						className='submitButton'
					/>
					<h2>List of Teams</h2>
					{teamNumberElements}
				</Form>
			</match-lookup>
		</>
	);
}

export default MatchLookup;
