import '../public/stylesheets/matchLookup.css';
import { useEffect, useState } from 'react';
import Form, { Input, NumberInput } from '../parts/formItems';
import Header from '../parts/header';
import { getAllTeams, getDivisionsList } from '../utils/tbaRequest';
import { Select } from '../parts/formItems';

function MatchLookup(props: any) {
	const DEFAULT_MATCH_EVENT = EVENT_NAME || "";

	const [fetchedData, setFetchedData] = useState([]);
	const [match_event, setMatchEvent] = useState(DEFAULT_MATCH_EVENT);
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
	useEffect(() => {
		(async function() {
			try {
				const data = await getAllTeams(match_event);

				const teamNumbers = data.map(function (team: any) {
					return (<h2 key={team}>
						<a href={`#scoutingapp/lookup/teamdata/${team}`}>{team}</a>
					</h2>)
				});

				setFetchedData(teamNumbers);
			}
			catch (err) {
				console.error("Error fetching team list: ", err);
			}
		})();
	}, [match_event]);

	const matchEvents = [
		{ label: `Default (${DEFAULT_MATCH_EVENT})`, value: DEFAULT_MATCH_EVENT },
	];
	for(const [eventName, eventId] of Object.entries(getDivisionsList())) {
		matchEvents.push({
			label: eventName,
			value: eventId
		});
	}

	return (
		<>
			<Header name={"Match Lookup"} back={"#scoutingapp/lookup"} />

			<div className="matchLookup">
				<Form
					onFinish={async event => {
						window.location.href = "#scoutingapp/lookup/teamData/" + event.teamNum;
					}}
				>
					<Select
						title={"Match Event"}
						name={"match_event"}
						options={matchEvents}
						required={false}
						onChange={async (e? : string) => {
							if(e) {
								await setMatchEvent(e);
							} else {

							}
						}}
					/>
					<NumberInput
						title="Team Number"
						name="teamNum"
						message="Please input the team number!"
						min={0}
					/>
					<button
						type="submit"
						value="Submit"
						className='submitButton'
					/>
					<h2>List of Teams</h2>
					{fetchedData}
				</Form>
			</div>
		</>
	);
}

export default MatchLookup;
