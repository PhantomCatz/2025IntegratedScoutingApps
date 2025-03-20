import { Input, InputNumber, Tabs, } from 'antd';
import TextArea from 'antd/es/input/TextArea';

async function StrategicTabs(team_number: number, inCallback? : boolean) {
  const window = {
    alert : function(...args : any[]) {
      if(!!inCallback) {
        return;
      }
      globalThis.window.alert(...args);
    }
  };
  if (!team_number) {
    return null;
  }

  let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

  if(!fetchLink) {
    console.error("Could not get fetch link. Check .env");
    return null;
  }

  fetchLink += "reqType=getTeamStrategic";

  fetchLink += `&team=${team_number}`;

  const response = await(await fetch(fetchLink)).json();

  if(!response.length) {
    //window.alert("This team has not been scouted.");
    return null;
  }

  let index = 2;

  const matches : { key: string; label: string; children: JSX.Element; }[] = [];

  for (const strategicInfo of response) {
    strategicInfo.comments = strategicInfo.comments.replaceAll("\\n", "\n");

    matches.push({
      key: `${strategicInfo.id}`,
      label: `${strategicInfo.scouter_initials.toUpperCase()} : ${strategicInfo.team_number}`,
      children: (
        <>
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
        </>
      )
    });
    index++;
  }
  matches.sort((a, b) => parseInt(a.key) - parseInt(b.key));

  return matches;
}

export default StrategicTabs;
