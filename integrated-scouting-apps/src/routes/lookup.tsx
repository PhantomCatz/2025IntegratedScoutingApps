import '../public/stylesheets/style.css';
import { Button } from 'antd';
import { useEffect } from 'react';
import Header from "./parts/header";

function Lookup(props: any) {
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);

	return (
		<div>
			<meta name="viewport" content="maximum-scale=1.0" />
			<Header name={"Data Lookup"} back={"#scoutingapp"} />
			<div>
				<Button className='mainbutton' href='#scoutingapp/lookup/match'>Match</Button>
				<Button className='mainbutton' href='#scoutingapp/lookup/strategic'>Strategic</Button>
				<Button className='mainbutton' href='#scoutingapp/lookup/pit'>Pit</Button>
			</div>
		</div>
	);
}

export default Lookup;
