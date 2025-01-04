import '../public/stylesheets/login.css';
import logo from '../public/images/logo.png';
import VerifyLogin from '../verifyToken';
import no_image from '../public/images/no_image.png';
import { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { base64url, SignJWT } from 'jose';
import { useCookies } from 'react-cookie';

function LoginPage(props: any) {
	const [msg, setMsg] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	// eslint-disable-next-line
	const [cookies, setCookies, removeCookies] = useCookies(['login', 'theme']);
	useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
	useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);

	type FieldType = {
		username: string,
		password: string,
	};
	return (
		<div>
			<div className='banner'>
				<header>
					<a href='/'>
						<img src={no_image} style={{ height: 64 + 'px', paddingTop: '5%' }} alt='' />
					</a>
					<table>
						<tbody>
							<tr>
								<td>
									<img src={logo} style={{ height: 256 + 'px' }} alt='' />
								</td>
								<td>
									<h1 style={{ display: 'inline-block', textAlign: 'center' }}>Login</h1>
								</td>
							</tr>
						</tbody>
					</table>
				</header>
			</div>
			<Form onFinish={async (event) => {
				try {
					setIsLoading(true);
					await fetch((process.env.REACT_APP_LOGIN_URL as string) + "?user_name=" + event.username.toLowerCase() + "&password=" + event.password, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						}
					}).then(response => response.json()).then(async data => {
						let response = data;
						console.log(response);
						response = "true"; //REMOVE THIS LINE WHEN DONE TESTING
						if (response.toString() === "true") {
							const hash = base64url.decode(process.env.REACT_APP_HASH as string);
							const signed = await new SignJWT({ username: event.username, password: event.password }).setExpirationTime("5hrs").setProtectedHeader({ alg: 'HS256' }).sign(hash);
							removeCookies("login");
							setCookies("login", signed);
							window.location.href = "/home";
						}
						else if (response[process.env.REACT_APP_RESPONSE as string]) {
							setMsg("Incorrect login");
						}
						else {
							setMsg("Fatal error; tell a WebDev member immediately!");
						}
						setIsLoading(false);
					});
				}
				catch (err) {
					console.log(err);
					window.alert("Error occured, please do not do leave this message and notify a Webdev member immediately.");
					window.alert(err);
				}
			}}>
				<h2 style={{ color: "red" }}>{msg}</h2>
				<h2>Username</h2>
				<Form.Item<FieldType> name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
					<Input className='input' autoComplete='username' />
				</Form.Item>
				<h2>Password</h2>
				<Form.Item<FieldType> name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
					<Input.Password className='input' autoComplete='current-password' />
				</Form.Item>
				<Input type="submit" value="Submit" className='submit' />
				<h2 style={{ display: isLoading ? 'inherit' : 'none' }}>Submitting data...</h2>
			</Form>
		</div>
	);
};

export default LoginPage;