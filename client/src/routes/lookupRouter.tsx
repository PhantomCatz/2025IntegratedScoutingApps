import '../public/stylesheets/lookupRouter.css';
import { useEffect } from 'react';
import Header from '../parts/header';

function LookupRouter(props: any) {
  useEffect(() => { document.title = props.title }, [props.title]);

  return (
    <>
      <Header name={"Data Lookup"} back={"#scoutingapp"} />

      <a className='mainButton' href='#scoutingapp/lookup/match'>Match</a>
      <a className='mainButton' href='#scoutingapp/lookup/strategic'>Strategic</a>
      <a className='mainButton' href='#scoutingapp/lookup/pit'>Pit</a>
    </>
  );
}

export default LookupRouter;
