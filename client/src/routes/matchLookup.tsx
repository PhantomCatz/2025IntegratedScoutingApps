import '../public/stylesheets/matchLookup.css';
import { useEffect, useState } from 'react';
import { Input, Form, InputNumber } from 'antd';
import Header from '../parts/header';
import { getAllTeams, getDivisionsList } from '../utils/tbaRequest';
import { Select } from '../parts/formItems';

function TeamData(props: any) {
  const DEFAULT_MATCH_EVENT = EVENT_NAME || "";

	const [form] = Form.useForm();
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
		<div>
			<Header name={"Match Lookup"} back={"#scoutingapp/lookup"} />
			<Form
				form={form}
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
				<div>
					<h2>Team Number</h2>
					<Form.Item name="teamNum" rules={[{ required: true, message: "Please input the team number!" }]}>
						<InputNumber min={0} className="input" />
					</Form.Item>
					<Input type="submit" value="Submit" className='submit' />
					<h2>List of Teams</h2>
					{fetchedData}
				</div>
			</Form>
		</div>
	);
}

export default TeamData;
