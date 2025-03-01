import '../public/stylesheets/style.css';
import '../public/stylesheets/pitLookup.css';
import { useEffect, useState } from 'react';
import { Checkbox, Input, InputNumber, Tabs, Image, Flex } from 'antd';
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
      setTimeout(() => {setShouldRetryLoading(true);}, 50);
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

      fetchLink += "reqType=getTeamPit";

      fetchLink += `&team=${team_number}`;

      const response = await(await fetch(fetchLink)).json();

      if(!response.length) {
        window.alert("This team has not been scouted.");
        setItems([initialState()]);
        return;
      }


      const match: { key: string; label: string; children: JSX.Element; }[] = [];
      let index = 2;

      for (const pitInfo of response) {
        pitInfo.comments = pitInfo.comments.replaceAll("\\n", "\n");

        match.push({
          key: `${pitInfo.scouter_initials.toUpperCase()}|${pitInfo.team_number}|${index}`,
          label: pitInfo.scouter_initials.toUpperCase() + ": " + pitInfo.team_number,
          children: (
            <div>
            <h2>Match Event</h2>
            <Input className="input" disabled value={pitInfo.match_event} />
            <h2>Scouter Initials</h2>
            <Input className="input" disabled value={pitInfo.scouter_initials} />
            <h2>Robot Weight</h2>
            <Input className="input" disabled value={pitInfo.robot_weight} />
            <h2>Drive Train Type</h2>
            <Input className="input" disabled value={pitInfo.drive_train_type} />
            <h2>Motor Type</h2>
            <Input className="input" disabled value={pitInfo.motor_type} />
            <h2># of Motors</h2>
            <Input className="input" disabled value={pitInfo.number_of_motors} />
            <h2>Wheel Type</h2>
            <Input className="input" disabled value={pitInfo.wheel_type} />
            <h2>Coral Intake Capability</h2>
            <Input className="input" disabled value={pitInfo.coral_intake_capability} />
            <h2>Coral Scoring L1</h2>
            <div className={`booleanValue booleanValue__${!!pitInfo.coral_scoring_l1}`} >&nbsp;</div>
            <h2>Coral Scoring L2</h2>
            <div className={`booleanValue booleanValue__${!!pitInfo.coral_scoring_l2}`} >&nbsp;</div>
            <h2>Coral Scoring L3</h2>
            <div className={`booleanValue booleanValue__${!!pitInfo.coral_scoring_l3}`} >&nbsp;</div>
            <h2>Coral Scoring L4</h2>
            <div className={`booleanValue booleanValue__${!!pitInfo.coral_scoring_l4}`} >&nbsp;</div>
            <h2>Algae Intake Capability</h2>
            <Input className="input" disabled value={pitInfo.algae_intake_capability} />
            <h2>Algae Scoring Capability</h2>
            <Input className="input" disabled value={pitInfo.algae_scoring_capability} />
            <h2>Climbing Capability</h2>
            <Input className="input" disabled value={pitInfo.climbing_capability} />
            <h2>Pit Organization</h2>
            <Input className="input" disabled value={pitInfo.pit_organization} />
            <h2>Team Safety</h2>
            <Input className="input" disabled value={pitInfo.team_safety} />
            <h2>Team Workmanship</h2>
            <Input className="input" disabled value={pitInfo.team_workmanship} />
            <h2>Gracious Professionalism</h2>
            <Input className="input" disabled value={pitInfo.gracious_professionalism} />
            <h2>Comments</h2>
            <TextArea className="pit-comments" disabled value={pitInfo.comments} style={{marginBottom: '5%'}} />
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
      <Header name={"Pit Lookup"} back={"#scoutingapp/lookup"} />
      <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} centered className='tabs' onChange={async (key) => { setTabNum(key); }} />
    </div>
  );
};
export default TeamData;
