import '../public/stylesheets/style.css';
import { Button } from 'antd';
import { useEffect } from 'react';
import Header from "./header";

function HomePage(props: any) {
  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);

  return (
    <div>
      <Header name={"Strategy App"} rootPage={true} />
      <div style={{ height: '1250px' }}>
        <Button className='homebutton' href='/scoutingapp'>Scouting App</Button>
        <Button className='homebutton' href='/dtf'>DTF</Button>
        <Button className='homebutton' href='/watchlist'>Watchlist</Button>
      </div>
    </div>
  );
}

export default HomePage;
