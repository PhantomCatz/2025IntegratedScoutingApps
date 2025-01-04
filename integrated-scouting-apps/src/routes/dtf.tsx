import '../public/stylesheets/dtf.css';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useEffect } from 'react';
import { Input, Form, InputNumber } from 'antd';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
function DTF(props: any) {
	const [form] = Form.useForm();
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
	const [cookies] = useCookies(['login', 'theme']);
	useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
	useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);

	return (
		<div>
			<meta name="viewport" content="maximum-scale=1.0" />
			<div className='banner'>
				<header>
					<a href='/home'>
						<img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt=''></img>
					</a>
					<table>
						<tbody>
							<tr>
								<td>
									<img src={logo} style={{ height: 256 + 'px' }} alt=''></img>
								</td>
								<td>
									<h1 style={{ display: 'inline-block', textAlign: 'center' }}>Drive Team Feeder</h1>
								</td>
							</tr>

						</tbody>

					</table>
				</header>
			</div>
			<Form
				form={form}
				onFinish={async event => {
					const teamNums = [event.team1Num, event.team2Num, event.team3Num].filter(num => num !== undefined);
					window.location.href = "/dtf/" + teamNums.join(",");
				}}
			>
				<div>
					<h2>Team 1 Number</h2>
					<Form.Item name="team1Num" rules={[{ required: true, message: "Please input the team number!" }]}>
						<InputNumber min={0} className="input" />
					</Form.Item>
					<h2>Team 2 Number</h2>
					<Form.Item name="team2Num">
						<InputNumber min={0} className="input" />
					</Form.Item>
					<h2>Team 3 Number</h2>
					<Form.Item name="team3Num">
						<InputNumber min={0} className="input" />
					</Form.Item>
					<Input type="submit" value="Submit" className='submit' />
				</div>
			</Form>
		</div>
	);
}

export default DTF;