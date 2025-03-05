import '../public/stylesheets/style.css';
import '../public/stylesheets/strategic.css';
import { useEffect, useState } from 'react';
import { Input, InputNumber, Tabs } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Header from "./header";
import { getAllTeams } from './utils/tbaRequest';

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
                  <a onClick={async () => {setTeamNumber(team); await getComments(team)}}>{team}</a>
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
            await getComments(input.ariaValueNow);
          }}>Submit</button>
        </div>
        <h2>List of Teams</h2>
        {fetchedData}
      </div>
    );
  }

  async function getComments(team_number: number, inCallback? : boolean) {
    const window = {
      alert : function(...args : any[]) {
        if(!!inCallback) {
          return;
        }
        globalThis.window.alert(...args);
      }
    };
    try {
      if (!team_number) {
        return;
      }
      
      let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

      if(!fetchLink) {
        console.error("Could not get fetch link. Check .env");
        return;
      }

      fetchLink += "reqType=getTeamStrategic";

      fetchLink += `&team=${team_number}`;

      const response = await(await fetch(fetchLink)).json();

      if(!response.length) {
        window.alert("This team has not been scouted.");
        setItems([initialState()]);
        return;
      }


      const match: { key: string; label: string; children: JSX.Element; }[] = [];
      let index = 2;

      for (const strategicInfo of response) {
        strategicInfo.comments = strategicInfo.comments.replaceAll("\\n", "\n");

        match.push({
          key: `${strategicInfo.scouter_initials.toUpperCase()}|${strategicInfo.team_number}|${index}`,
          label: strategicInfo.scouter_initials.toUpperCase() + ": " + strategicInfo.team_number,
          children: (
              <div>
                <h2>Scouter Initials</h2>
                <Input className="input" disabled value={strategicInfo.match_event} />
                <h2>Scouter Initials</h2>
                <Input className="input" disabled value={strategicInfo.scouter_initials} />
                <h2>Match Level</h2>
                <Input className="input" disabled value={strategicInfo.match_level} />
                <h2>Match #</h2>
                <Input className="input" disabled value={strategicInfo.match_number} />
                <h2>Round #</h2>
                <Input className="input" disabled value={strategicInfo.round_number} />
                <h2>Robot Position</h2>
                <Input className="input" disabled value={strategicInfo.robot_position} />
                <h2>Comments</h2>
                <TextArea className="strategic-input" disabled value={strategicInfo.comments} style={{marginBottom: '5%'}} />
              </div>
          )
        });
        index++;
      }
      match.sort((a, b) => parseInt(a.key) - parseInt(b.key));
      setItems([initialState(), ...match]);
    } catch (err) {
      console.log(err);
    }

  }
  // Hack to circumvent bug
  if(shouldRetryLoading) {
    setShouldRetryLoading(false);
    getComments(teamNumber, true);
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
