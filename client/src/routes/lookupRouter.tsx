import '../public/stylesheets/lookupRouter.css';
import { useEffect } from 'react';
import Header from '../parts/header';

type Props = {
	title: string,
};

function LookupRouter(props: Props): React.ReactElement {
	useEffect(() => { document.title = props.title }, [props.title]);

	return (
		<>
			<Header name={"Data Lookup"} back={"#scoutingapp"} />

			<lookup-router>
				<a className='mainButton' href='#scoutingapp/lookup/match'>Match</a>
				<a className='mainButton' href='#scoutingapp/lookup/strategic'>Strategic</a>
				<a className='mainButton' href='#scoutingapp/lookup/pit'>Pit</a>
			</lookup-router>
		</>
	);
}

export default LookupRouter;
