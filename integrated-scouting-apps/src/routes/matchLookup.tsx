import '../public/stylesheets/style.css';
import '../public/stylesheets/lookup.css';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useEffect, useState } from 'react';
import { Input, Form, InputNumber } from 'antd';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';

function DataLookup(props: any) {
	const eventname = process.env.REACT_APP_EVENTNAME as string;
	const [form] = Form.useForm();
	const [cookies] = useCookies(['login', 'theme']);
	const [fetchedData, setFetchedData] = useState([]);
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
	useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
	useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);
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
				const teamNumbers = data.map((team: any) => <h2><a href={"/scoutingapp/lookup/teamData/" + team.team_number}>{team.team_number}</a></h2>);
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
			<div className='banner'>
				<header>
					<a href='/scoutingapp/lookup/'>
						<img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt=''></img>
					</a>
					<table>
						<tbody>
							<tr>
								<td>
									<img src={logo} style={{ height: 256 + 'px' }} alt=''></img>
								</td>
								<td>
									<h1 style={{ display: 'inline-block', textAlign: 'center' }}>Match Lookup</h1>
								</td>
							</tr>
						</tbody>
					</table>
				</header>
			</div>
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