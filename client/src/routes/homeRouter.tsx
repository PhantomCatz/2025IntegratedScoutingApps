import '../public/stylesheets/homeRouter.css';
import { useEffect } from 'react';
import Header from '../parts/header';

function HomeRouter(props: any) {
  useEffect(() => { document.title = props.title }, [props.title]);


  return (
    <>
      <Header name={"Strategy App"} rootPage={true} />
      <a className='homeButton' href='#scoutingapp'>Scouting App</a>
      <a className='homeButton' href='#dtf'>DTF</a>
      {/* <a className='homebutton' href='#watchlist'>Watchlist</a> */}
    </>
  );
}

export default HomeRouter;
