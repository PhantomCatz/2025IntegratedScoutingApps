import '../public/stylesheets/scoutingAppRouter.css';
import { useEffect } from 'react';
import Header from '../parts/header';

type Props = {
	title: string,
};

function ScoutingAppRouter(props: Props): React.ReactElement {
	useEffect(() => { document.title = props.title }, [props.title]);

	return (
		<>
			<Header name={"Scouting App"} back={"#"}/>

			<scouting-app-router>
				<a className='mainButton' href='#scoutingapp/match'>Match</a>
				<a className='mainButton' href='#scoutingapp/strategic'>Strategic</a>
				<a className='mainButton' href='#scoutingapp/pit'>Pit</a>
				<a className='mainButton' href='#scoutingapp/lookup'>Data Lookup</a>
			</scouting-app-router>
		</>
	);
}

export default ScoutingAppRouter;
