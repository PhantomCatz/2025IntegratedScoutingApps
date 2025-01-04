import React, { useEffect } from 'react';
import { Button } from 'antd';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';

function Buh(props: any) {
	const [cookies] = useCookies(['theme']);
	useEffect(() => { document.title = props.title; return () => { }; }, [props.title]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);
	useEffect(() => { setInterval(() => { new Date().getSeconds() % 2 === 0 ? document.title = "💀" : document.title = "buh"}, 1000); return () => { } }, []);
	return (
		<div>
			<Button onClick={() => { window.alert("🗣️🗣️🔥🔥"); }}>CLICK HERE TO GET A FREE COPY OF LETHAL COMPANY</Button>
		</div>
	);
}

export default Buh;