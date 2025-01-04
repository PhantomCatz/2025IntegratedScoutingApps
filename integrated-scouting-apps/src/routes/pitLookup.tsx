import '../public/stylesheets/style.css';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useEffect, useState } from 'react';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
import { Checkbox, Input, InputNumber, Tabs, Image } from 'antd';
function Teamresponse(props: any) {
  const [cookies] = useCookies(['login', 'theme']);
  const [tabNum, setTabNum] = useState("1");
  const [items, setItems] = useState([
    {
      key: '1',
      label: 'Team',
      children: Lookup(),
    },
  ]);
  useEffect(() => { document.title = props.title }, [props.title]);
  useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);

  async function getComments(team_number: number) {
    try {
      if (team_number !== 0) {
        const response = await(await fetch(process.env.REACT_APP_PIT_LOOKUP_URL as string + "?team_number=" + team_number)).json();
        const robot_images = await(await fetch(process.env.REACT_APP_PIT_GRAPH_LOOKUP_URL as string + "?team_number=" + team_number)).json();
        console.log(robot_images.documents[0].images);
        const match: { key: string; label: string; children: JSX.Element; }[] = [];
        let index = 2;
        for (const pitLookup of response['documents']) {
          match.push({
            key: index.toString(),
            label: pitLookup.initial.toUpperCase() + ": " + pitLookup.team_number,
            children: (
              <div>
                <h2>Scouter Initials</h2>
                <Input className="input" disabled value={pitLookup.initial} />
                <h2>Team Number</h2>
                <Input className="input" disabled value={pitLookup.team_number} />
                <h2>Drive Team Type</h2>
                <Input className="input" disabled value={pitLookup.robot_drive_train} />
                <h2>Robot Weight</h2>
                <Input className="input" disabled value={pitLookup.robot_weight} />
                <h2>Motor Type</h2>
                <Input className="input" disabled value={pitLookup.robot_motor_type} />
                <h2># of Motors</h2>
                <Input className="input" disabled value={pitLookup.robot_motor_counter} />
                <h2>Wheel Type</h2>
                <Input className="input" disabled value={pitLookup.robot_wheel_type} />
                <h2>Intake Capability</h2>
                <Input className="input" disabled value={pitLookup.robot_intake_capability} />
                <h2>Shooting Capability</h2>
                <Input className="input" disabled value={pitLookup.robot_shooting_capability} />
                <h2>Under Stage</h2>
                <Input className="input" disabled value={pitLookup.robot_ability_traversed_stage} />
                <h2>Climbing Capability</h2>
                <Input className="input" disabled value={pitLookup.robot_climbing_capabilities} />
                <h2>Robot Trap</h2>
                <Checkbox className={pitLookup.robot_trap_detail ? "input_checkbox_filled" : "input_checkbox"} disabled />
                <h2>Robot Images</h2>
                <Image.PreviewGroup items={[robot_images.documents[0].images]} >
                  <Image
                    width={'100%'}
                    src={robot_images.documents[0].images[0]}
                  />
                </Image.PreviewGroup>
              </div>
            )
          });
          match.sort((a, b) => parseInt(a.key.substring(1)) - parseInt(b.key.substring(1)));
          index++;
        }
        for (let i = 0; i < match.length; i++) {
          setItems([...items, match[i]]);
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  };
  function Lookup() {
    return (
      <div>
        <h2>Team Number</h2>
        <InputNumber min={0} max={9999} className="input" id='teamNum' onChange={async (event) => await getComments(event as number)}/>
      </div>
    );
  }
  return (
    <div>
      <meta name="viewport" content="maximum-scale=1.0" />
      <div className='banner'>
        <header>
          <a href='/scoutingapp/lookup/'>
            <img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt='' />
          </a>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={logo} style={{ height: 256 + 'px' }} alt='' />
                </td>
                <td>
                  <h1 style={{ display: 'inline-block', textAlign: 'center' }}>Pit Lookup</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
      </div>
      <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} centered className='tabs' onChange={async (key) => { setTabNum(key); }} />
    </div>
  );
};
export default Teamresponse;