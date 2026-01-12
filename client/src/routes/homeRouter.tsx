import '../public/stylesheets/homeRouter.css';
import { useEffect } from 'react';
import Header from '../parts/header';

type Props = {
	title: string,
};

function HomeRouter(props: Props): React.ReactElement {
	useEffect(() => { document.title = props.title }, [props.title]);

	return (
		<>
			<Header name={"Strategy App"} />

			<home-router>
				<a className='homeButton' href='#scoutingapp'>Scouting App</a>
				<a className='homeButton' href='#dtf'>DTF</a>
			</home-router>
		</>
	);
}

export default HomeRouter;
