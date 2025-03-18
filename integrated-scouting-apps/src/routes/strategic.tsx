import '../public/stylesheets/style.css';
import '../public/stylesheets/strategic.css';
import { useEffect, useState} from 'react';
import { Tabs, Input, Form, Select, InputNumber, Button, Flex, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { saveAs } from 'file-saver';
import Header from "./parts/header";
import QrCode from "./parts/qrCodeViewer";
import {getTeamNumber, isRoundNumberVisible, isInPlayoffs, getTeamsPlaying} from './utils/tbaRequest';

const formDefaultValues = {
  "match_event": null,
  "team_number": 0,
  "scouter_initials": null,
  "match_level": null,
  "match_number": 0,
  "robot_position": null,
  "comments": null,
  "red_alliance": [],
  "blue_alliance": [],
}

function Strategic(props: any, text:any) {
  const [form] = Form.useForm();
  const [tabNum, setTabNum] = useState("1");
  const [team_number, setTeamNum] = useState(0);
  const [teamsList, setTeamsList] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [roundIsVisible, setRoundIsVisible] = useState(false);
  const [qrValue, setQrValue] = useState<any>();
  const [shouldRetrySubmit, setShouldRetrySubmit] = useState(false);
  const [lastFormValue, setLastFormValue] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [inPlayoffs, setInPlayoffs] = useState(false);
  const [robot_appeared, setRobot_appeared] = useState(true);

  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  // useEffect(() => { getComments(team_number); return () => {}}, [team_number]);
  // useEffect(() => { calculateMatchLevel(); return () => {}}, [form, calculateMatchLevel()]);
  useEffect(() => {
    (async function() {
    let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

    if(!team_number) {
      return;
    }

    if(!fetchLink) {
      console.error("Could not get fetch link. Check .env");
      return;
    }

    fetchLink += "reqType=getTeamStrategic";

    fetchLink += `&team=${team_number}`;

    fetch(fetchLink)
      .then((res) => {
        const value = res.json();
        return value;
      })
      .then((data) => {
        
        if(!Object.keys(data).length) {
          setTeamData(null);
          throw new Error("No data");
        }

        setTeamData(data);
      })
      .catch((err) => {
        console.log("Error fetching data. Is server on?", err);
      });
    })();
  }, [team_number]);

  const match_event = process.env.REACT_APP_EVENTNAME;
  
  async function updateTeamNumber() {
    try {
      const matchLevel = form.getFieldValue('match_level');
      const matchNumber = form.getFieldValue('match_number');
      const robotPosition = form.getFieldValue('robot_position');
      const roundNumber = form.getFieldValue('round_number');
      const allianceNumber1 = form.getFieldValue('red_alliance');
      const allianceNumber2 = form.getFieldValue('blue_alliance');

      const teams = await getTeamsPlaying(matchLevel, matchNumber, roundNumber, allianceNumber1, allianceNumber2);
      setTeamsList(teams);

      const allianceNumber = form.getFieldValue(robotPosition[0] === "R" ? 'red_alliance' : 'blue_alliance');
      const teamNumber = await getTeamNumber(matchLevel, matchNumber, roundNumber, robotPosition, allianceNumber);
      setTeamNum(teamNumber);
    }
    catch (err) {
      console.log(err)
    }
  }
  async function setNewStrategicScout(event: any) {
    const body = {
      "match_event": match_event,
      "team_number": team_number,
      "scouter_initials": event.scouter_initials.toLowerCase(),
      "match_level": event.match_level,
      "match_number": event.match_number,
      "robot_position": event.robot_position,
      "comments": event.comments,
      "robot_appeared": robot_appeared,
    };
    const status = await tryFetch(body);

    if(status) {
      window.alert("Successfully submitted data.");
      return;
    }

    window.alert("Could not submit data. Please show QR to Webdev.");
    
    setQrValue(body);
  }
  async function tryFetch(body : any) {
    let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

    if(!fetchLink) {
      console.error("Could not get fetch link; Check .env");
      return;
    }

    fetchLink += "reqType=submitStrategicData";

    const submitBody = {
      ...body,
    };
    
    try {
      const res = await fetch(fetchLink, {
        method: "POST",
        body: JSON.stringify(submitBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return !!res.ok;
    } catch (err) {
      return false;
    }
  }
  function calculateMatchLevel() {
    const matchLevel = form.getFieldValue('match_level');
    const isVisible = isRoundNumberVisible(matchLevel);

    setRoundIsVisible(isVisible);

    const inPlayoffs = isInPlayoffs(matchLevel);

    setInPlayoffs(inPlayoffs);
  }
  async function trySubmit(event : any) {
    await setNewStrategicScout(event);

    const scouter_initials = form.getFieldValue('scouter_initials');
    const match_number = form.getFieldValue('match_number');
    const match_level = form.getFieldValue('match_level');
    const robot_position = form.getFieldValue('robot_position');

    form.setFieldsValue({...formDefaultValues});
    form.setFieldValue('scouter_initials', scouter_initials);
    form.setFieldValue('match_number', match_number + 1);
    form.setFieldValue('match_level', match_level);
    form.setFieldValue('robot_position', robot_position);

    await calculateMatchLevel();
    await updateTeamNumber();
  }
  async function runFormFinish(event? : any) {
    setLoading(true);

    if(event !== undefined) {
      setLastFormValue(event);
    } else {
      event = lastFormValue;
    }
    try {
      trySubmit(event);
    }
    catch (err) {
      console.log(err);
      window.alert("Error occured, please do not leave this message and notify a Webdev member immediately.");
    }
    finally {
      setLoading(false);
    }
  }
  function preMatch() {
    type FieldType = {
      scouter_initials: string;
      teamnum: number;
      match_level: string;
      match_number: number;
      round_number: number;
      robot_position: string;
      red_alliance: string;
      blue_alliance: string;
    };
    const rounds = [
      { label: "Qualifications", value: "Qualifications" },
      { label: "Quarter-Finals", value: "Quarter-Finals" },
      { label: "Semi-Finals", value: "Semi-Finals" },
      { label: "Finals", value: "Finals" },
    ];
    function getNum(n : number) {
      return teamsList[n] ? `: ${teamsList[n]}` : "";
    }
    const robot_position = [
      { label: `R1${getNum(0)}`, value: "R1" },
      { label: `R2${getNum(1)}`, value: "R2" },
      { label: `R3${getNum(2)}`, value: 'R3' },
      { label: `B1${getNum(3)}`, value: "B1" },
      { label: `B2${getNum(4)}`, value: "B2" },
      { label: `B3${getNum(5)}`, value: 'B3' },
    ];
    const playoff_alliances = [
      { label: "Alliance 1", value: "Alliance 1" },
      { label: "Alliance 2", value: "Alliance 2" },
      { label: "Alliance 3", value: "Alliance 3" },
      { label: "Alliance 4", value: "Alliance 4" },
      { label: "Alliance 5", value: "Alliance 5" },
      { label: "Alliance 6", value: "Alliance 6" },
      { label: "Alliance 7", value: "Alliance 7" },
      { label: "Alliance 8", value: "Alliance 8" },
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
        <div className={"playoff-alliances"} style={{ display: inPlayoffs ? 'inherit' : 'none' }}>
          
          <h2>Red Alliance</h2>
          <Form.Item<FieldType> name="red_alliance" rules={[{ required: inPlayoffs ? true : false, message: 'Enter the red alliance' }]}>
            <Select options={playoff_alliances}
              onChange={() => { calculateMatchLevel(); updateTeamNumber(); }}
              className="input"
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ maxHeight: 'none' }}
            />
          </Form.Item>
          <h2>Blue Alliance</h2>
          <Form.Item<FieldType> name="blue_alliance" rules={[{ required: inPlayoffs ? true : false, message: 'Enter the blue alliance' }]}>
            <Select options={playoff_alliances}
              onChange={() => { calculateMatchLevel(); updateTeamNumber(); }}
              className="input"
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ maxHeight: 'none' }}
            />
          </Form.Item>
        </div>
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
          <Select
            options={robot_position}
            onChange={() => { updateTeamNumber(); }}
            className='input'
            listItemHeight={10}
            listHeight={500}
            placement='bottomLeft'
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ maxHeight: 'none' }}
          />
        </Form.Item>
        <Flex justify='in-between' style={{ paddingBottom : '5%' }}>
          <Button onClick={() => setTabNum("2")} className='tabbutton'>Next</Button>
        </Flex>
      </div>
    );
  } 

  function comment() {
    let prevComments = null;
    type FieldType = {
      comments: string;
    };

    if(!teamData) {
      prevComments =  <p style={{fontSize:"300%"}}>This team has not been scouted yet.</p>;
    } else {
      const columns = [
        {
          "title" : 'Scouter Initials',
          "dataIndex" : 'scouter_initials',
          "width": '70vw',
        }, {
          "title" : 'Match #',
          "dataIndex" : 'match_number',
          "width" : '10vw',
        },
      ];

      const dataSource = [];
    
      for (const match of teamData) {
        dataSource.push({
          "key": `${match.match_event}|${match.match_level}|${match.match_number}|${match.scouter_initials}`,
          "scouter_initials" : `Scouter Initials: ${match.scouter_initials}`,
          "match_number" : match.match_number,
          "comment" : match.comments,
        });
      }
      
      prevComments = 
        <Table columns = {columns} dataSource = {dataSource} expandable = {{rowExpandable:(record) => true,
          expandedRowRender:(record) => {
            return <p>{record.comment}</p>
          }
        }}>
        </Table>;
    }

    return (
      <div>
        {prevComments}
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

  if(shouldRetrySubmit) {
    runFormFinish();
  }

  return (
    <div>
      <meta name="viewport" content="maximum-scale=1.0" />
      <Header name={"Strategic Scout"} back="#scoutingapp/" />
      <Form
        form={form}
        onFinish={runFormFinish}
      >
        <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} centered className='tabs' onChange={async (key) => { setTabNum(key); }} />
      </Form>
      <QrCode value={qrValue} />
    </div>
  );
} 


export default Strategic;
