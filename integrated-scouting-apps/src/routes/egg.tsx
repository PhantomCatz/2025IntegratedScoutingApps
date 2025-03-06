import '../public/stylesheets/style.css';
import { Button, Flex, Input, Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import Header from "./header";
import { Footer } from 'antd/es/layout/layout';

function Egg(props: any) {
  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  const [tabNum, setTabNum] = useState("1");
  const [showEgg, setShowEgg] = useState(false);

  function hyoungjun() {
    return (
        <div>
            
        </div>
    )
  }

  function rhys() {
    
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Don't Click!</h2>
        <Button
          onClick={() => setShowEgg(!showEgg)}
          style={{ marginBottom: "20px" }}
        >
          Why'd You Click Me?
        </Button>
        {showEgg && (
          <div style={{ fontSize: "48px", color: "green" }}>
            🥚 Ok Buddy. 🎉 
          </div>
        )}
      </div>
    );
  }

  function isaac() {
    return (
        <div>
            
        </div>
    )
  }
  
  function lucien() {
    return (
        <div>
            
        </div>
    )
  }

  function railey() {
    return (
        <div>
            
        </div>
    )
  }

  function brian() {
    return (
        <div>
            
        </div>
    )
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'hyoungjun',
      children: hyoungjun(),
    },
    {
      key: '2',
      label: 'rhys',
      children: rhys(),
    },
    {
      key: '3',
      label: 'isaac',
      children: isaac(),
    },
    {
      key: '4',
      label: 'lucien',
      children: lucien(),
    },
    {
      key: '5',
      label: 'railey',
      children: railey(),
    },
    {
      key: '6',
      label: 'brian',
      children: brian(),
    },
  ];

  return (
    <div>
      <Header name={"Strategy App"} />
      <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} className='tabs' centered onChange={async (key) => { setTabNum(key) }} />
        <Footer style={{ position: "sticky", bottom: "0" }}>
          <Flex justify='in-between' id={"footer"} >
            {Number(tabNum) !== 1 && (
              <Button onMouseDown={async () => { setTabNum((Number(tabNum) - 1).toString()) }} className='tabbutton'>Back</Button>
            )}
            {Number(tabNum) !== items.length && (
              <Button onMouseDown={async () => { setTabNum((Number(tabNum) + 1).toString()) }} className='tabbutton'>Next</Button>
            )}
            {Number(tabNum) === items.length && (
              <Input type="submit" value="Submit" className='match_submit' />
            )}
          </Flex>
        </Footer>
    </div>
  );
}

export default Egg;
