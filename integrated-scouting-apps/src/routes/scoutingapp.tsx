import '../public/stylesheets/style.css';
import { Button } from 'antd';
import { useEffect } from 'react';
import Header from "./header";

function ScoutingPage(props: any) {
  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);

  return (
    <div>
      <meta name="viewport" content="maximum-scale=1.0" />
      <Header name={"Scouting App"} back={"#home"} />
      <div>
        <Button className='mainbutton' href='#scoutingapp/match'>Match</Button>
        <Button className='mainbutton' href='#scoutingapp/strategic'>Strategic</Button>
        <Button className='mainbutton' href='#scoutingapp/pit'>Pit</Button>
        <Button className='mainbutton' href='#scoutingapp/lookup'>Data Lookup</Button>
        {/* <Button className='mainbutton' href='#scoutingapp/picklist'>Picklist</Button> */}
      </div>
	</div>
  );
}

export default ScoutingPage;
