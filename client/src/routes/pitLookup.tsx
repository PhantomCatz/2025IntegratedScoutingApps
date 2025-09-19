import '../public/stylesheets/style.css';
import '../public/stylesheets/pitLookup.css';
import { useEffect, useState } from 'react';
import { InputNumber, Tabs, } from 'antd';
import Header from '../parts/header';
import { getAllTeams, getDivisionsList } from '../utils/tbaRequest';
import PitTabs from '../parts/pitTabs';
import { Select } from '../parts/formItems';

function TeamData(props: any) {
  const DEFAULT_MATCH_EVENT = import.meta.env.VITE_EVENTNAME || "";

  const [shouldRetryLoading, setShouldRetryLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [teamNumber, setTeamNumber] = useState(0);
  const [tabNum, setTabNum] = useState("1");
  const [items, setItems] = useState([initialState()]);
  const [match_event, setMatchEvent] = useState(DEFAULT_MATCH_EVENT);

  useEffect(() => { document.title = props.title }, [props.title]);
  useEffect(() => {
    (async function() {
      try {
        const data = await getAllTeams(match_event);

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
  }, [match_event]);
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
      setTimeout(() => {setShouldRetryLoading(true);}, 50);
    }
    return (
      <>
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
      </>
    );
  }

  async function setTabs(team_number : number, inCallback? : boolean) {
    try {
      const tabs = await PitTabs(team_number, inCallback);

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

  const matchEvents = [
    { label: `Default (${DEFAULT_MATCH_EVENT})`, value: DEFAULT_MATCH_EVENT },
  ];
  for(const [eventName, eventId] of Object.entries(getDivisionsList())) {
    matchEvents.push({
      label: eventName,
      value: eventId
    });
  }

  return (
    <>
      <meta name="viewport" content="maximum-scale=1.0" />
      <Header name={"Pit Lookup"} back={"#scoutingapp/lookup"} />
      <Select
        title={"Match Event"}
        name={"match_event"}
        options={matchEvents}
        onChange={async (e? : string) => {
          if(e) {
            await setMatchEvent(e);
          } else {

          }
        }}
      />
      <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} centered className='tabs' onChange={async (key) => { setTabNum(key); }} />
    </>
  );
};

export default TeamData;
