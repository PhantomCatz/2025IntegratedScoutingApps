import { Input, InputNumber, Tabs, } from 'antd';
import TextArea from 'antd/es/input/TextArea';

async function StrategicTabs(props) {
  const teamNumber = props.teamNumber;
  const data = props.data;
  if (!teamNumber) {
    return null;
  }

  let index = 2;

  const matches : { key: string; label: string; children: JSX.Element; }[] = [];

  for (const strategicInfo of data) {
    strategicInfo.comments = strategicInfo.comments.replaceAll("\\n", "\n");

    matches.push({
      key: `strategicData${strategicInfo.id}`,
      label: `${strategicInfo.scouter_initials.toUpperCase()}:${strategicInfo.team_number}`,
      children: (
        <>
          <h2>Match Event</h2>
          <Input className="input" disabled value={strategicInfo.match_event} />
          <h2>Scouter Initials</h2>
          <Input className="input" disabled value={strategicInfo.scouter_initials} />
          <h2>Match Level</h2>
          <Input className="input" disabled value={strategicInfo.match_level} />
          <h2>Match #</h2>
          <Input className="input" disabled value={strategicInfo.match_number} />
          <h2>Robot Position</h2>
          <Input className="input" disabled value={strategicInfo.robot_position} />
          <h2>Comments</h2>
          <TextArea className="strategic-input" disabled value={strategicInfo.comments} style={{marginBottom: '5%'}} />
        </>
      )
    });
    index++;
  }

  return matches;
}

export default StrategicTabs;
