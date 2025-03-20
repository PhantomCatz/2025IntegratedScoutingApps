import { Input, InputNumber, Tabs, } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const IMAGE_DELIMITER = "$";

async function PitTabs(team_number: number, inCallback? : boolean) {
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

  fetchLink += "reqType=getTeamPit";

  fetchLink += `&team=${team_number}`;

  const response = await(await fetch(fetchLink)).json();

  if(!response.length) {
    window.alert("This team has not been scouted.");
    return null;
  }

  let index = 2;

  const matches : { key: string; label: string; children: JSX.Element; }[] = [];

  for (const pitInfo of response) {
    pitInfo.comments = pitInfo.comments.replaceAll("\\n", "\n");

    const images = pitInfo.robotImageURI?.split(IMAGE_DELIMITER) || [];

    const pictures = [];

    for(let i = 0; i < images.length; i++) {
      pictures.push(
        <div key={`pitImage${i}`}>
          <h3>Picture {i + 1}</h3>
          <img src={images[i]}></img>
        </div>
      );
    }

    matches.push({
      key: `${pitInfo.id}`,
      label: `${pitInfo.scouter_initials.toUpperCase()} : ${pitInfo.team_number}`,
      children: (
        <>
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

          <h2>Pit Pictures</h2>
          {pictures}
        </>
      )
    });
    index++;
  }
  matches.sort((a, b) => parseInt(a.key) - parseInt(b.key));

  return matches;
}

export default PitTabs;
