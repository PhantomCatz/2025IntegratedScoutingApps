import '../public/stylesheets/scoutingAppRouter.css';
import { useEffect } from 'react';
import Header from '../parts/header';

function ScoutingAppRouter(props: any) {
	useEffect(() => { document.title = props.title }, [props.title]);

	return (
		<>
			<Header name={"Scouting App"} back={"#"}/>

			<div className="scoutingAppRouter">
				<a className='mainButton' href='#scoutingapp/match'>Match</a>
				<a className='mainButton' href='#scoutingapp/strategic'>Strategic</a>
				<a className='mainButton' href='#scoutingapp/pit'>Pit</a>
				<a className='mainButton' href='#scoutingapp/lookup'>Data Lookup</a>
				{/* <a className='mainbutton' href='#scoutingapp/picklist'>Picklist</a> */}
			</div>
		</>
	);
}

export default ScoutingAppRouter;
