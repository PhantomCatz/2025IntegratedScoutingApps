import '../public/stylesheets/style.css';
import '../public/stylesheets/lookup.css';
import { useEffect, useState } from 'react';
import { Input, Form, InputNumber } from 'antd';
import Header from './header';
import { getAllTeams } from './utils/tbaRequest';

function TeamData(props: any) {
	const eventName = process.env.REACT_APP_EVENTNAME;

	const [form] = Form.useForm();
	const [fetchedData, setFetchedData] = useState([]);
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
	useEffect(() => {
		(async function() {
			try {
				const data = await getAllTeams();
				
				const teamNumbers = data.map(function (team: any) {
					//console.log(team);

					return (<h2 key={team}>
							<a href={`/scoutingapp/lookup/teamdata/${team}`}>{team}</a>
							</h2>)
				});

				setFetchedData(teamNumbers);
			}
			catch (err) {
				console.error("Error fetching team list: ", err);
			}
		})();
	}, [eventName]);

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

export default TeamData;
