import '../public/stylesheets/style.css';
import '../public/stylesheets/strategic.css';
import { useEffect, useState} from 'react';
import { Tabs, Input, Form, Select, InputNumber, Button, Flex } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { saveAs } from 'file-saver';
import Header from "./header";
import QrCode from "./qrCodeViewer";
import {getTeamNumber, isMatchVisible} from './utils/tbaRequest';

const formDefaultValues = {
  "match_event": null,
  "team_number": 0,
  "scouter_initials": null,
  "match_level": null,
  "match_number": 0,
  "robot_position": null,
  "comments": null,
}

function Strategic(props: any, text:any) {
  const [form] = Form.useForm();
  const [tabNum, setTabNum] = useState("1");
  const [team_number, setTeamNum] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [roundIsVisible, setRoundIsVisible] = useState(false);
  const [qrValue, setQrValue] = useState<any>();

  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  // useEffect(() => { getComments(team_number); return () => {}}, [team_number]);
  // useEffect(() => { calculateMatchLevel(); return () => {}}, [form, calculateMatchLevel()]);
  const match_event = process.env.REACT_APP_EVENTNAME;
  
  async function setNewStrategicScout(event: any) {
    const body = {
      "match_event": match_event,
      "team_number": team_number,
      "scouter_initials": event.scouter_initials.toLowerCase(),
      "match_level": event.match_level,
      "match_number": event.match_number,
      "robot_position": event.robot_position,
      "comments": event.comments,
    };
    if (!team_number) {
      window.alert("Team number is 0, please check in Pre.");
      throw new Error("bad team number");
    }
    

    // eslint-disable-next-line
    const WORKING_TEST_DO_NOT_REMOVE_OR_YOU_WILL_BE_FIRED = {
      "matchIdentifier": {
        "team_number": 2637,
        "scouter_initials": "LL",
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
      const matchLevel = form.getFieldValue('match_level');
      const matchNumber = form.getFieldValue('match_number');
      const robotPosition = form.getFieldValue('robot_position');
      const roundNumber = form.getFieldValue('round_number');

      const teamNumber = await getTeamNumber(roundIsVisible, matchLevel, matchNumber, roundNumber, robotPosition);

      setTeamNum(teamNumber);
    }
    catch (err) {
      console.log(err)
    }
  }
  function calculateMatchLevel() {
    const isVisible = isMatchVisible(form.getFieldValue('match_level'));
    setRoundIsVisible(isVisible);
  }
  function preMatch() {
    type FieldType = {
      scouter_initials: string;
      teamnum: number;
      match_level: string;
      match_number: number;
      round_number: number;
      robot_position: string;
    };
    const rounds = [
      { label: "Qualifications", value: "qm" },
      { label: "Quarter-Finals", value: "qf" },
      { label: "Semi-Finals", value: "sf" },
      { label: "Finals", value: "f" },
    ];
    const robot_position = [
      { label: "R1", value: "red_1" },
      { label: "R2", value: "red_2" },
      { label: "R3", value: 'red_3' },
      { label: "B1", value: "blue_1" },
      { label: "B2", value: "blue_2" },
      { label: "B3", value: 'blue_3' },
    ];
    return (
      <div>
        <h2>Team: {team_number}</h2>
        <h2>Scouter Initials</h2>
        <Form.Item<FieldType> name="scouter_initials" rules={[{ required: true, message: 'Please input your initials!' }]}>
          <Input maxLength={2} className="input" />
        </Form.Item>
        <h2>Match Level</h2>
        <Form.Item<FieldType> name="match_level" rules={[{ required: true, message: 'Please input the match level!' }]}>
          <Select options={rounds} className="input" onChange={() => { calculateMatchLevel(); updateTeamNumber(); }} />
        </Form.Item>
        <h2>Match #</h2>
        <Form.Item<FieldType> name="match_number" rules={[{ required: true, message: 'Please input the match number!',  }]}>
          <InputNumber min={1} className = "input" onChange={() => { updateTeamNumber(); }} type='number' /> 
        </Form.Item>
        <h2 style={{ display: roundIsVisible ? 'inherit' : 'none' }}>Round #</h2>
        <Form.Item<FieldType> name="round_number" rules={[{ required: roundIsVisible ? true : false, message: 'Please input the round number!' }]} style={{ display: roundIsVisible ? 'inherit' : 'none' }}>
          <InputNumber min={1} onChange={() => { updateTeamNumber(); }} style={{ display: roundIsVisible ? 'inherit' : 'none' }} className="input" type='number' pattern="\d*" onWheel={(event) => (event.target as HTMLElement).blur()} />
        </Form.Item>
        <h2>Robot Position</h2>
        <Form.Item<FieldType> name="robot_position" rules={[{ required: true, message: 'Please input the robot position!' }]}>
          <Select options={robot_position} onChange={() => { updateTeamNumber(); }} className='input' listItemHeight={10} listHeight={500} placement='bottomLeft'/>
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
            await setNewStrategicScout(event);
            const scouter_initials = form.getFieldValue('scouter_initials');
            const match_number = form.getFieldValue('match_number');
            const match_level = form.getFieldValue('match_level');
            const robot_position = form.getFieldValue('robot_position');
            form.setFieldsValue({...formDefaultValues})
            form.setFieldValue('scouter_initials', scouter_initials);
            form.setFieldValue('match_number', match_number + 1);
            form.setFieldValue('match_level', match_level);
            form.setFieldValue('robot_position', robot_position);
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
