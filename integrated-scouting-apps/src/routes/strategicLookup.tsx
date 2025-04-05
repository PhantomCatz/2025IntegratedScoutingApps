import '../public/stylesheets/style.css';
import '../public/stylesheets/strategic.css';
import { useEffect, useState } from 'react';
import { InputNumber, Tabs } from 'antd';
import Header from "./parts/header";
import { getAllTeams } from './utils/tbaRequest';
import StrategicTabs from './parts/strategicTabs';

function TeamData(props: any) {
  const eventName = process.env.REACT_APP_EVENTNAME;

  const [shouldRetryLoading, setShouldRetryLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [teamNumber, setTeamNumber] = useState(0);
  const [tabNum, setTabNum] = useState("1");
  const [items, setItems] = useState([initialState()]);

  useEffect(() => { document.title = props.title }, [props.title]);
  useEffect(() => {
    (async function() {
      try {
        const data = await getAllTeams();

        if(!data) {
          throw new Error("Could not get data");
        }

        const teamNumbers = data.map(function (team: any) { 
          return (<h2 key={team}>
                  <a onClick={async () => {setTeamNumber(team); await setTabs(team)}}>{team}</a>
                  </h2>);
        });

        setFetchedData(teamNumbers);
      }
      catch (err) {
        console.error("Error fetching team list: ", err);
      }
    })();
  }, [eventName]);
  useEffect(() => {
    const prev : any = [];

    for(let i = 1; i < items.length; i++) {
      prev.push(items);
    }

    const res = [initialState(), ...prev];

    setItems(res);
  }, [fetchedData]);

  function initialState() {
    return {
      key: '1',
      label: 'Team',
      children: Lookup(),
    };
  }
  function Lookup() {
    if(!fetchedData) {
      setTimeout(() => {setShouldRetryLoading(true);}, 100);
    }
    return (
      <div>
        <h2>Team Number</h2>
        <InputNumber min={0} max={99999} className="input" id='teamNumber' />
        <div className={"centered"}>
          <button className={"submitButton"} onMouseDown={async function(event) {
            const input : any = document.querySelector("#teamNumber");
            await setTabs(input.ariaValueNow);
          }}>Submit</button>
        </div>
        <h2>List of Teams</h2>
        {fetchedData}
      </div>
    );
  }
  
  async function setTabs(team_number : number, inCallback? : boolean) {
    try {
      const tabs = await StrategicTabs(team_number, inCallback);

      if(tabs !== null) {
        setItems([initialState(), ...tabs]);
      } else {
        setItems([initialState()]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Hack to circumvent bug
  if(shouldRetryLoading) {
    setShouldRetryLoading(false);
    setTabs(teamNumber, true);
  }
  return (
    <div>
      <meta name="viewport" content="maximum-scale=1.0" />
      <Header name={"Strategic Lookup"} back={"#scoutingapp/lookup/"} />
      <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} centered className='tabs' onChange={async (key) => { setTabNum(key); }} />
    </div>
  );
}

export default TeamData;
