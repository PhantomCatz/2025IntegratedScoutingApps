import '../public/stylesheets/style.css';
import '../public/stylesheets/lookup.css';
import { useEffect, useState } from 'react';
import { Input, Form, InputNumber } from 'antd';
import Header from "./header";

function DataLookup(props: any) {
	const eventname = process.env.REACT_APP_EVENTNAME as string;
	const [form] = Form.useForm();
	const [fetchedData, setFetchedData] = useState([]);
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
	useEffect(() => {
		async function getTeams() {
			try {
				const response = await fetch('https://www.thebluealliance.com/api/v3/event/' + eventname + "/teams", {
					method: "GET",
					headers: {
						'X-TBA-Auth-Key': process.env.REACT_APP_TBA_AUTH_KEY as string,
					}
				});
				const data = await response.json();
				const teamNumbers = data.map((team: any) => <h2><a href={"/scoutingapp/lookup/teamdata/" + team.team_number}>{team.team_number}</a></h2>);
				setFetchedData(teamNumbers);
				console.log(data);
			}
			catch (err) {
				console.log(err);
				window.alert("Error occured, please do not do leave this message and notify a Webdev member immediately.");
				window.alert(err);
			}
		};
		getTeams();
	}, [eventname]);

	return (
		<div>
			<meta name="viewport" content="maximum-scale=1.0" />
			<Header name={"Match Lookup"} back={"/scoutingapp/lookup"} />
			<Form
				form={form}
				onFinish={async event => {
					window.location.href = "/scoutingapp/lookup/teamData/" + event.teamNum;
				}}
			>
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

export default DataLookup;
