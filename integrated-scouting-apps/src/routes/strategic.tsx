import '../public/stylesheets/style.css';
import '../public/stylesheets/strategic.css';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useEffect, useState } from 'react';
import { Tabs, Input, Form, Select, InputNumber, Button, Flex } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
import { saveAs } from 'file-saver';

function Strategic(props: any) {
  const [form] = Form.useForm();
  const [tabNum, setTabNum] = useState("1");
  const [teamNum, setTeamNum] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [roundIsVisible, setRoundIsVisible] = useState(false);
  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  const [cookies] = useCookies(['login', 'theme']);
  useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);
  // useEffect(() => { getComments(teamNum); return () => {}}, [teamNum]);
  // useEffect(() => { calculateMatchLevel(); return () => {}}, [form, calculateMatchLevel()]);
  const eventname = process.env.REACT_APP_EVENTNAME;
  
  async function setNewStrategicScout(event: any) {
    console.log(teamNum)
    if (teamNum === 0) {
      window.alert("Team number is 0, please check in Pre.");
    }
    else {
      const body = {
        "matchIdentifier": {
          "Initials": event.initials,
          "match_event": eventname,
          "match_level": event.matchlevel,
          "match_number": event.matchnum,
          "team_number": teamNum,
        },
        "comment": event.comments,
        "timesAmplified": event.timesamplified,
      };
      // eslint-disable-next-line
      const WORKING_TEST_DO_NOT_REMOVE_OR_YOU_WILL_BE_FIRED = {
        "matchIdentifier": {
          "Initials": "LL",
          "match_event": "2024CALA",
          "team_number": 2637,
          "match_level": "Qual",
          "match_number": 4
        },
        "comment": {
          "comment": "asdfasdfasdf"
        }
      };
      try {
        if (!window.navigator.onLine) {
          window.alert("Your device is offline; please download the following .json file and give it to a Webdev member.");
          saveAs(new Blob([JSON.stringify(body)], { type: "text/json" }), event.initials + event.matchnum + ".json");
        }
        else {
          console.log(body)
          await fetch(process.env.REACT_APP_STRATEGIC_URL as string, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            }
          })
            .then(async (response) => await response.json()).then(async (data) => {
              window.alert(data.insertedId);
            });
        }
      }
      catch (err) {
        console.log(err);
        window.alert("Error occured, please do not do leave this message and notify a Webdev member!");
        window.alert(err);
      }
    }
  };
  async function updateTeamNumber() {
    try {
      if (roundIsVisible) {
        const matchID = eventname + "_" + form.getFieldValue('matchlevel') + form.getFieldValue('matchnum') + "m" + form.getFieldValue('roundnum');
        const response = await fetch('https://www.thebluealliance.com/api/v3/match/' + matchID,
          {
            method: "GET",
            headers: {
              'X-TBA-Auth-Key': process.env.REACT_APP_TBA_AUTH_KEY as string,
            }
          });
        const data = await response.json();
        const team_color = form.getFieldValue('robotpos').substring(0, form.getFieldValue('robotpos').indexOf('_'));
        const team_num = form.getFieldValue('robotpos').substring(form.getFieldValue('robotpos').indexOf('_') + 1) - 1;
        const fullTeam = (data.alliances[team_color].team_keys[team_num] !== null ? data.alliances[team_color].team_keys[team_num] : 0);
        setTeamNum(parseInt(fullTeam.substring(3)));
        console.log(fullTeam)
        console.log(Number(fullTeam.substring(3)))
      }
      else {
        const matchID = eventname + "_" + form.getFieldValue('matchlevel') + form.getFieldValue('matchnum');
        const response = await fetch('https://www.thebluealliance.com/api/v3/match/' + matchID,
          {
            method: "GET",
            headers: {
              'X-TBA-Auth-Key': process.env.REACT_APP_TBA_AUTH_KEY as string,
            }
          });
        const data = await response.json();
        const team_color = form.getFieldValue('robotpos').substring(0, form.getFieldValue('robotpos').indexOf('_'));
        const team_num = form.getFieldValue('robotpos').substring(form.getFieldValue('robotpos').indexOf('_') + 1) - 1;
        const fullTeam = (data.alliances[team_color].team_keys[team_num] !== null ? data.alliances[team_color].team_keys[team_num] : 0);
        setTeamNum(parseInt(fullTeam.substring(3)));
        console.log(fullTeam)
        console.log(Number(fullTeam.substring(3)))
      }
    }
    catch (err) {
    }
  }
  async function calculateMatchLevel() {
    const matchlevel = form.getFieldValue('matchlevel');
    if (matchlevel !== "qm") {
      setRoundIsVisible(true);
    }
    else {
      setRoundIsVisible(false);
    }
  }
  function preMatch() {
    type FieldType = {
      initials: string;
      teamnum: number;
      matchlevel: string;
      matchnum: number;
      roundnum: number;
      robotpos: string;
    };
    const rounds = [
      { label: "Qualifications", value: "qm" },
      { label: "Elimination", value: "sf" },
      { label: "Finals", value: "f" },
    ];
    const robotpos = [
      { label: "R1", value: "red_1" },
      { label: "R2", value: "red_2" },
      { label: "R3", value: 'red_3' },
      { label: "B1", value: "blue_1" },
      { label: "B2", value: "blue_2" },
      { label: "B3", value: 'blue_3' },
    ];
    return (
      <div>
        <h2>Team: {teamNum}</h2>
        <h2>Scouter Initials</h2>
        <Form.Item<FieldType> name="initials" rules={[{ required: true, message: 'Please input your initials!' }]}>
          <Input maxLength={2} className="input" />
        </Form.Item>
        <h2>Match Level</h2>
        <Form.Item<FieldType> name="matchlevel" rules={[{ required: true, message: 'Please input the match level!' }]}>
          <Select options={rounds} className="input" onChange={() => { calculateMatchLevel(); updateTeamNumber(); }} />
        </Form.Item>
        <h2>Match #</h2>
        <Form.Item<FieldType> name="matchnum" rules={[{ required: true, message: 'Please input the match number!' }]}>
          <InputNumber min={1} className="input" onChange={() => { updateTeamNumber(); }} />
        </Form.Item>
        <h2 style={{ display: roundIsVisible ? 'inherit' : 'none' }}>Round #</h2>
        <Form.Item<FieldType> name="roundnum" rules={[{ required: roundIsVisible ? true : false, message: 'Please input the round number!' }]} style={{ display: roundIsVisible ? 'inherit' : 'none' }}>
          <InputNumber min={1} onChange={() => { updateTeamNumber(); }} style={{ display: roundIsVisible ? 'inherit' : 'none' }} className="input" type='number' pattern="\d*" onWheel={(event) => (event.target as HTMLElement).blur()} />
        </Form.Item>
        <h2>Robot Position</h2>
        <Form.Item<FieldType> name="robotpos" rules={[{ required: true, message: 'Please input the robot position!' }]}>
          <Select options={robotpos} onChange={() => { updateTeamNumber(); }} className="input" />
        </Form.Item>
        <Flex justify='in-between' style={{ paddingBottom : '5%' }}>
          <Button onClick={() => setTabNum("2")} className='tabbutton'>Next</Button>
        </Flex>
      </div>
    );
  }
  function comment() {
    type FieldType = {
      comments: string;
      timesamplified: number;
    };
    return (
      <div>
        <h2>Comments</h2>
        <Form.Item<FieldType> name="comments" rules={[{ required: true, message: "Please input some comments!" }]}>
          <TextArea style={{ verticalAlign: 'center' }} className='strategic-input' />
        </Form.Item>
        <h2>Times Amplified</h2>
        <Form.Item<FieldType> name="timesamplified" rules={[{ required: true, message: 'Please input the number of times the speaker was amplified!' }]}>
          <InputNumber type='number' pattern="\d*" onWheel={(event) => (event.target as HTMLInputElement).blur()} min={0} className="input" />
        </Form.Item>
        <h2 style={{ display: isLoading ? 'inherit' : 'none' }}>Submitting data...</h2>
        <Flex justify='in-between' style={{ paddingBottom : '5%' }}>
          <Button onClick={() => { setTabNum("1"); }} className='tabbutton'>Back</Button>
          <Input type="submit" value="Submit" className='submitbutton' />
        </Flex>
      </div>
    );
  }
  const items = [
    {
      key: '1',
      label: 'Pre',
      children: preMatch(),
    },
    {
      key: '2',
      label: 'Comment',
      children: comment(),
    },
  ];
  return (
    <div>
      <meta name="viewport" content="maximum-scale=1.0" />
      <div className='banner'>
        <header>
          <a href='/scoutingapp/'>
            <img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt='' />
          </a>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={logo} style={{ height: 256 + 'px' }} alt='' />
                </td>
                <td>
                  <h1 style={{ display: 'inline-block', textAlign: 'center' }}>Strategic Scout</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
      </div>
      <Form
        form={form}
        onFinish={async event => {
          setLoading(true);
          try {
            await updateTeamNumber();
            console.log(teamNum)
            await setNewStrategicScout(event);
            const initials = form.getFieldValue('initials');
            const matchnum = form.getFieldValue('matchnum');
            const matchlevel = form.getFieldValue('matchlevel');
            const robotpos = form.getFieldValue('robotpos');
            form.resetFields();
            form.setFieldValue('initials', initials);
            form.setFieldValue('matchnum', matchnum + 1);
            form.setFieldValue('matchlevel', matchlevel);
            form.setFieldValue('robotpos', robotpos);
            await calculateMatchLevel();
            await updateTeamNumber();
          }
          catch (err) {
            console.log(err);
            window.alert("Error occured, please do not do leave this message and notify a Webdev member immediately.");
            window.alert(err);
          }
          finally {
            setLoading(false);
          }
        }}
      >
        <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} centered className='tabs' onChange={async (key) => { setTabNum(key); }} />
      </Form>
    </div>
  );
}

export default Strategic;