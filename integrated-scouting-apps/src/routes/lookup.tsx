import '../public/stylesheets/style.css';
import { Button } from 'antd';
import { useEffect } from 'react';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
import Header from "./header";

function Lookup(props: any) {
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
	const [cookies] = useCookies(['login', 'theme']);
	useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
	useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);

	return (
		<div>
			<meta name="viewport" content="maximum-scale=1.0" />
			<Header name={"Data Lookup"} back={"/scoutingapp"} />
			<div>
				<Button className='mainbutton' href='/scoutingapp/lookup/match'>Match</Button>
				<Button className='mainbutton' href='/scoutingapp/lookup/strategic'>Strategic</Button>
				<Button className='mainbutton' href='/scoutingapp/lookup/pit'>Pit</Button>
				<Button className='mainbutton' href='/scoutingapp/lookup/pitpicture'>Pit Picture</Button>
				{/* <Button className='mainbutton' href='/scoutingapp/strategic/driverskill'>Driver Skill</Button> */}
			</div>
		</div>
	);
}

export default Lookup;
