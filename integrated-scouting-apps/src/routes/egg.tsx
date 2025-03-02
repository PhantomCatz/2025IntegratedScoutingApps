import '../public/stylesheets/style.css';
import { Button, Tabs, TabsProps } from 'antd';
import { useEffect } from 'react';
import Header from "./header";

function Egg(props: any) {
  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);

  function hyoungjun() {
    return (
        <div>
            
        </div>
    )
  }
  

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ];

  return (
    <div>
      <Header name={"Strategy App"} rootPage={true} />
      <div style={{ height: '1250px' }}>
        <Button className='homebutton' href='/scoutingapp'>Scouting App</Button>
        <Button className='homebutton' href='/dtf'>DTF</Button>
        {/* <Button className='homebutton' href='/watchlist'>Watchlist</Button> */}
      </div>
    </div>
  );
}

export default Egg;
