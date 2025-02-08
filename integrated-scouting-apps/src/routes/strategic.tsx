import '../public/stylesheets/style.css';
import '../public/stylesheets/strategic.css';
import { useEffect, useState} from 'react';
import { Tabs, Input, Form, Select, InputNumber, Button, Flex } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { saveAs } from 'file-saver';
import Header from "./header";
import QrCode from "./qrCodeViewer";

function Strategic(props: any, text:any) {
  const [form] = Form.useForm();
  const [tabNum, setTabNum] = useState("1");
  const [teamNum, setTeamNum] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [roundIsVisible, setRoundIsVisible] = useState(false);
  const [qrValue, setQrValue] = useState<any>();

  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  // useEffect(() => { getComments(teamNum); return () => {}}, [teamNum]);
  // useEffect(() => { calculateMatchLevel(); return () => {}}, [form, calculateMatchLevel()]);
  const eventname = process.env.REACT_APP_EVENTNAME;
  
  async function setNewStrategicScout(event: any) {
    console.log(teamNum)
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
    console.log(body);
    if (teamNum === 0) {
      window.alert("Team number is 0, please check in Pre.");
      throw new Error("bad team number");
    }
    

    // eslint-disable-next-line
    const WORKING_TEST_DO_NOT_REMOVE_OR_YOU_WILL_BE_FIRED = {
      "matchIdentifier": {
        "team_number": 2637,
        "Initials": "LL",
        "match_level": "Qual",
        "match_number": 5,
        "match_event": "2024CALA",
      },
      "comment": {
        "comment": "asdfasdfasdf"
      }
    };
    
    setQrValue(body);
  }
  async function updateTeamNumber() {
    try {
      const matchLevel = form.getFieldValue('matchlevel');
      const matchNumber = form.getFieldValue('matchnum');
      const roundNumber = form.getFieldValue('roundnum');
      
      if (!matchLevel ||
          !matchNumber ||
          roundIsVisible && !roundNumber) {
        return;
      }

      const matchID = roundIsVisible ?
        `${eventname}_${matchLevel}${matchNumber}m${roundNumber}` :
        `${eventname}_${matchLevel}${matchNumber}`;

      const response = await fetch('https://www.thebluealliance.com/api/v3/match/' + matchID, {
        method: "GET",
        headers: {
          'X-TBA-Auth-Key': process.env.REACT_APP_TBA_AUTH_KEY as string,
        }
      });
      const data = await response.json();
      const robotPosition = form.getFieldValue('robotpos');
      const team_color = robotPosition.substring(0, robotPosition.indexOf('_'));
      const team_num = robotPosition.substring(robotPosition.indexOf('_') + 1) - 1;
      const fullTeam = data.alliances[team_color].team_keys[team_num];
      setTeamNum(parseInt(fullTeam.substring(3)));
      console.log("Reading team " + Number(fullTeam.substring(3)))
    }
    catch (err) {
    }
  }
  async function calculateMatchLevel() {
    const matchlevel = form.getFieldValue('matchlevel');
    if (matchlevel !== "Qualifications") {
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
      { label: "Qualifications", value: "Qualifications" },
      { label: "Elimination", value: "Elimination" },
      { label: "Finals", value: "Finals" },
    ];
    const robotpos = [
      { label: "R1", value: "R1" },
      { label: "R2", value: "R2" },
      { label: "R3", value: 'R3' },
      { label: "B1", value: "B1" },
      { label: "B2", value: "B2" },
      { label: "B3", value: 'B3' },
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
        <Form.Item<FieldType> name="matchnum" rules={[{ required: true, message: 'Please input the match number!',  }]}>
          <InputNumber min={1} className = "input" onChange={() => { updateTeamNumber(); }} type='number' /> 
        </Form.Item>
        <h2 style={{ display: roundIsVisible ? 'inherit' : 'none' }}>Round #</h2>
        <Form.Item<FieldType> name="roundnum" rules={[{ required: roundIsVisible ? true : false, message: 'Please input the round number!' }]} style={{ display: roundIsVisible ? 'inherit' : 'none' }}>
          <InputNumber min={1} onChange={() => { updateTeamNumber(); }} style={{ display: roundIsVisible ? 'inherit' : 'none' }} className="input" type='number' pattern="\d*" onWheel={(event) => (event.target as HTMLElement).blur()} />
        </Form.Item>
        <h2>Robot Position</h2>
        <Form.Item<FieldType> name="robotpos" rules={[{ required: true, message: 'Please input the robot position!' }]}>
          <Select options={robotpos} onChange={() => { updateTeamNumber(); }} className='input' listItemHeight={10} listHeight={500} placement='bottomLeft'/>
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
    
    };
    return (
      <div>
        <h2>Comments</h2>
        <Form.Item<FieldType> name="comments" rules={[{ required: true, message: "Please input some comments!" }]}>
          <TextArea style={{ verticalAlign: 'center' }} className='strategic-input' />
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
      <Header name={"Strategic Scout"} back="/scoutingapp/" />
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
      <QrCode value={qrValue} />
    </div>
  );
} 

export default Strategic;
