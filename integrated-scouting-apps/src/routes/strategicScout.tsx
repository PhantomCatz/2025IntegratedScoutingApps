import '../public/stylesheets/style.css';
import '../public/stylesheets/strategic.css';
import { useEffect, useState} from 'react';
import { Tabs, Input, Form, Button, Flex, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Header from '../parts/header';
import QrCode, { escapeUnicode, } from '../parts/qrCodeViewer';
import { isInPlayoffs, getTeamsPlaying, getIndexNumber, getDivisionsList } from '../utils/tbaRequest';
import { NumberInput, Select } from '../parts/formItems';

namespace Fields {
  export type PreMatch = {
      match_event: string;
      scouter_initials: string;
      match_level: string;
      match_number: number;
      robot_position: string;
      red_alliance: string;
      blue_alliance: string;
      penalties: number;
  };

  export type Comment = {
      comments: string;
      team_rating: string;
  };
}

const formDefaultValues = {
  "match_event": null,
  "team_number": 0,
  "scouter_initials": null,
  "match_level": null,
  "match_number": 0,
  "robot_position": null,
  "team_rating": null,
  "comments": null,
  "red_alliance": [],
  "blue_alliance": [],
  "penalties": 0,
}

function Strategic(props: any, text:any) {
  const DEFAULT_MATCH_EVENT = process.env.VITE_EVENTNAME || "";

  if(DEFAULT_MATCH_EVENT === "") {
    console.error("Could not get match event. Check .env");
  }

  const [form] = Form.useForm();
  const [tabNum, setTabNum] = useState("1");
  const [team_number, setTeamNum] = useState(0);
  const [teamsList, setTeamsList] = useState<string[]>([]);
  const [qrValue, setQrValue] = useState<any>();
  const [lastFormValue, setLastFormValue] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [inPlayoffs, setInPlayoffs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowAlliances, setShouldShowAlliances] = useState(false);
  const [match_event, setMatchEvent] = useState<string>(DEFAULT_MATCH_EVENT);

  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  useEffect(() => {
    (async function() {
      let fetchLink = process.env.VITE_SERVER_ADDRESS;

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

        if(!data?.length) {
          console.log(`No data for team ${team_number}`);
          setTeamData(null);
          return;
        }

        setTeamData(data);
      })
      .catch((err) => {
        console.log("Error fetching data. Is server on?", err);
      });
    })();
  }, [team_number]);

  useEffect(() => {
    updateNumbers();
  }, [match_event]);
  
  async function updateTeamNumber() {
    try {
      const matchLevel = form.getFieldValue('match_level');
      const matchNumber = form.getFieldValue('match_number');
      const robotPosition = form.getFieldValue('robot_position');
      const allianceNumber1 = form.getFieldValue('red_alliance');
      const allianceNumber2 = form.getFieldValue('blue_alliance');

      const teams : any = await getTeamsPlaying(match_event, matchLevel, matchNumber, allianceNumber1, allianceNumber2);

      if(teams.shouldShowAlliances) {
        setShouldShowAlliances(true);
      } else {
        setShouldShowAlliances(false);
      }
      setTeamsList(teams || []);

      if(robotPosition) {
        const index = getIndexNumber(robotPosition);
        const teamNumber = Number(teams[index]);

        await setTeamNum(teamNumber || 0);
      } else {
        setTeamNum(0);
      }

    } catch (err) {
      console.error("Failed to request TBA data when updating team number", err);
    }
  }
  async function setNewStrategicScout(event: any) {
    const body : any = {
      "match_event": match_event,
      "team_number": team_number,
      "scouter_initials": event.scouter_initials.toLowerCase(),
      "match_level": event.match_level,
      "match_number": event.match_number,
      "robot_position": event.robot_position,
      "team_rating": event.team_rating,
      "comments": event.comments,
    };
    Object.entries(body)
      .forEach((k) => {
        const field = k[0];
        const val = k[1];

        const newVal = typeof val === "string" ?
          escapeUnicode(val) :
          val;

        body[field] = newVal;
      });

    tryFetch(body)
      .then((successful) => {
        if(successful) {
          window.alert("Submit successful.");
        } else {
          window.alert("Submit was not successful. Please show the QR to WebDev.");
        }
      })

    setQrValue(body);
  }
  async function tryFetch(body : any) {
    let fetchLink = process.env.VITE_SERVER_ADDRESS;

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

    const inPlayoffs = isInPlayoffs(matchLevel);

    setInPlayoffs(inPlayoffs);
  }
  async function trySubmit(event : any) {
    await setNewStrategicScout(event);

    const scouter_initials = form.getFieldValue('scouter_initials');
    const match_number = form.getFieldValue('match_number');
    const match_level = form.getFieldValue('match_level');
    const match_event = form.getFieldValue('match_event');
    const robot_position = form.getFieldValue('robot_position');

    form.resetFields();
    form.setFieldValue('scouter_initials', scouter_initials);
    form.setFieldValue('match_level', match_level);
    form.setFieldValue('match_event', match_event);
    form.setFieldValue("match_number", Number(match_number) + 1);
    form.setFieldValue('robot_position', robot_position);

    await calculateMatchLevel();
    await updateTeamNumber();
  }
  async function runFormFinish(event? : any) {
    if(isLoading) {
      return;
    }
    setIsLoading(true);
    
    if(event !== undefined) {
      setLastFormValue(event);
    } else {
      event = lastFormValue;
    }

    try {
      await trySubmit(event);
    }
    catch (err) {
      console.log(err);
      window.alert("Error occured, please do not leave this message and notify a Webdev member immediately.");
    }
    finally {
      setIsLoading(false);
    }
  }
  async function updateNumbers() {
    await calculateMatchLevel();
    await updateTeamNumber();
  }

  function preMatch() {
    type FieldType = Fields.PreMatch;
    const matchEvents = [
      { label: `Default (${DEFAULT_MATCH_EVENT})`, value: DEFAULT_MATCH_EVENT },
    ];
    for(const [eventName, eventId] of Object.entries(getDivisionsList())) {
      matchEvents.push({
        label: eventName,
        value: eventId
      });
    }
    const rounds = [
      { label: "Qualifications", value: "Qualifications" },
      { label: "Playoffs", value: "Playoffs" },
      { label: "Finals", value: "Finals" },
    ];
  
    function getNum(n : number) {
      if(!teamsList) {
        return "";
      }
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

        <Select<FieldType>
          title={"Match Event"}
          name={"match_event"}
          options={matchEvents}
          onChange={(e? : string) => {
            console.log(`e=`, e);
            if(e) {
              setMatchEvent(e);
            } else {

            }
          }}
        />

        <h2>Scouter Initials</h2>
        <Form.Item<FieldType>
          name="scouter_initials"
          rules={[
            { required: true, message: 'Please input your initials!' },
              {
                pattern: /^[A-Za-z]{1,2}$/,
                 message: 'Please enter only letters (max 2)',
              },
            ]}
        >
          <Input 
            maxLength={2}
            className="input"
            onKeyPress={(event) => {
              const keyCode = event.keyCode || event.which;
              const keyValue = String.fromCharCode(keyCode);
              if (!/^[A-Za-z]*$/.test(keyValue)) {
                event.preventDefault();
              }
            }}
          />
        </Form.Item>
        
        <Select<FieldType>
          title={"Match Level"}
          name={"match_level"}
          options={rounds}
          onChange={updateNumbers}
        />

        <div className={"playoff-alliances"} style={{ display: inPlayoffs && shouldShowAlliances ? 'inherit' : 'none' }}>
          <Select<FieldType>
            title={"Red Alliance"}
            name={"red_alliance"}
            required={inPlayoffs && shouldShowAlliances}
            message={"Enter the red alliance"}
            options={playoff_alliances}
            onChange={updateNumbers}
          />
          
          <Select<FieldType>
            title={"Blue Alliance"}
            name={"blue_alliance"}
            required={inPlayoffs && shouldShowAlliances}
            message={"Enter the blue alliance"}
            options={playoff_alliances}
            onChange={updateNumbers}
          />
        </div>

        <NumberInput<FieldType>
          title={"Match #"}
          name={"match_number"}
          message={"Enter match #"}
          onChange={updateNumbers}
          min={1}
          form={form}
          buttons={false}
          align={"left"}
        />
        
        <Select<FieldType>
          title={"Robot Position"}
          name={"robot_position"}
          message={"Please input the robot position"}
          options={robot_position}
          onChange={updateNumbers}
        />

        <Flex justify='in-between' style={{ paddingBottom : '5%' }}>
          <Button onClick={() => setTabNum("2")} className='tabbutton'>Next</Button>
        </Flex>

      </div>
    );
  }

  function comment() {
    let prevComments = null;
    type FieldType = Fields.Comment;

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
          "key": `${match.id}`,
          "scouter_initials" : `Scouter Initials: ${match.scouter_initials}`,
          "match_number" : match.match_number,
          "comment" : match.comments,
        });
      }
      
      prevComments = 
        <Table
          columns={columns}
          dataSource={dataSource}
          expandable={{rowExpandable:(record) => true,
            expandedRowRender:(record) => {
            return <p>{record.comment}</p>
          }
          }}
          pagination={false}
        >
        </Table>;
    }

    return (
      <div>
        {prevComments}

        <h2>Comments</h2>
        <Form.Item<FieldType> name="comments" rules={[{ required: true, message: "Please input some comments!" }]}>
          <TextArea style={{ verticalAlign: 'center' }} className='strategic-input' />
        </Form.Item>

        <h2>Team Rating</h2>
        <Form.Item<FieldType>
          name="team_rating"
          rules={[
            { required: true, message: 'Please input the team rating' },
            ]}
        >
          <Input 
            className="input"
          />
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
      <Header name={"Strategic Scout"} back="#scoutingapp/" />
      <Form
        form={form}
        initialValues={formDefaultValues}
        onFinish={runFormFinish}
        onFinishFailed={({values, errorFields, outOfDate}) => {
          console.log("values=", values);
          console.log("errorFields=", errorFields);
          console.log("outOfDate=", outOfDate);
          
          const errorMessage = errorFields.map((x : any) => x.errors.join(", ")).join("\n");
          window.alert(errorMessage);
        }}
      >
        <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} centered className='tabs' onChange={async (key) => { setTabNum(key); }} />
      </Form>
      <QrCode value={qrValue} />
    </div>
  );
}



export default Strategic;
