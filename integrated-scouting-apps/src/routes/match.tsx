import '../public/stylesheets/style.css';
import '../public/stylesheets/match.css';
import { useEffect, useState } from 'react';
import { Tabs, Input, Form, Select, Checkbox, InputNumber, Flex, Button, Radio} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Footer } from 'antd/es/layout/layout';
import Header from "./parts/header";
import QrCode from './parts/qrCodeViewer';
import {isInPlayoffs, isRoundNumberVisible, getTeamsPlaying, getIndexNumber, getAllianceOffset } from './utils/tbaRequest';
import type { TabsProps, RadioChangeEvent } from "antd";
import { NumberInput, } from './parts/formItems';

interface SpacerProps {
  height?: string;
  width?: string;
}

const Spacer: React.FC<SpacerProps> = ({ height = '0px', width = '0px' }) => {
  return <div style={{ height, width }} />;
};

const formDefaultValues = {
  // Pre-match
  "match_event": "",
  "team_number": 0,
  "scouter_initials": "",
  //"match_level": "",
  //"match_number": 0,
  "robot_position": "",
  // Auton
  "auton_leave_starting_line": false,
  "auton_coral_scored_l4": 0,
  "auton_coral_missed_l4": 0,
  "auton_coral_scored_l3": 0,
  "auton_coral_missed_l3": 0,
  "auton_coral_scored_l2": 0,
  "auton_coral_missed_l2": 0,
  "auton_coral_scored_l1": 0,
  "auton_coral_missed_l1": 0,
  "auton_algae_scored_net": 0,
  "auton_algae_missed_net": 0,
  "auton_algae_scored_processor": 0,
  // Teleop
  "teleop_coral_scored_l4": 0,
  "teleop_coral_missed_l4": 0,
  "teleop_coral_scored_l3": 0,
  "teleop_coral_missed_l3": 0,
  "teleop_coral_scored_l2": 0,
  "teleop_coral_missed_l2": 0,
  "teleop_coral_scored_l1": 0,
  "teleop_coral_missed_l1": 0,
  "teleop_algae_scored_net": 0,
  "teleop_algae_missed_net": 0,
  "teleop_algae_scored_processor": 0,
  // Endgame
  "endgame_coral_intake_capability": null,
  "endgame_coral_station": null,
  "endgame_algae_intake_capability": null,
  "endgame_climb_successful": false,
  "endgame_climb_type": null,
  "endgame_climb_time": 0,
  // Overall
  "overall_robot_died": false,
  "overall_defended_others": false,
  "overall_was_defended": false,
  "overall_defended": [],
  "overall_defended_by": [],
  "overall_pushing": 0,
  "overall_counter_defense": 0,
  "overall_driver_skill": 0,
  "overall_num_penalties": 0,
  "overall_tech_penalty": false,
  "overall_match_penalty": false,
  "overall_penalties_incurred": null,
  "overall_comments": null,
  // Playoffs
  "red_alliance": "",
  "blue_alliance": "",
};
const noShowValues = {
  // Pre-match
  //"match_event": "",
  //"team_number": 0,
  //"scouter_initials": "",
  //"match_level": "",
  //"match_number": 0,
  //"robot_position": "",
  // Auton
  "auton_leave_starting_line": false,
  "auton_coral_scored_l4": 0,
  "auton_coral_missed_l4": 0,
  "auton_coral_scored_l3": 0,
  "auton_coral_missed_l3": 0,
  "auton_coral_scored_l2": 0,
  "auton_coral_missed_l2": 0,
  "auton_coral_scored_l1": 0,
  "auton_coral_missed_l1": 0,
  "auton_algae_scored_net": 0,
  "auton_algae_missed_net": 0,
  "auton_algae_scored_processor": 0,
  // Teleop
  "teleop_coral_scored_l4": 0,
  "teleop_coral_missed_l4": 0,
  "teleop_coral_scored_l3": 0,
  "teleop_coral_missed_l3": 0,
  "teleop_coral_scored_l2": 0,
  "teleop_coral_missed_l2": 0,
  "teleop_coral_scored_l1": 0,
  "teleop_coral_missed_l1": 0,
  "teleop_algae_scored_net": 0,
  "teleop_algae_missed_net": 0,
  "teleop_algae_scored_processor": 0,
  // Endgame
  "endgame_coral_intake_capability": "Neither",
  "endgame_coral_station": "Neither",
  "endgame_algae_intake_capability": "Neither",
  "endgame_climb_successful": false,
  "endgame_climb_type": "Neither",
  "endgame_climb_time": 0,
  // Overall
  "overall_robot_died": false,
  "overall_defended_others": false,
  "overall_was_defended": false,
  "overall_defended": [],
  "overall_defended_by": [],
  "overall_pushing": 0,
  "overall_counter_defense": 0,
  "overall_driver_skill": 0,
  "overall_num_penalties": 0,
  "overall_tech_penalty": false,
  "overall_match_penalty": false,
  "overall_penalties_incurred": "",
  "overall_comments": "",
  // Playoffs
  //"red_alliance": "",
  //"blue_alliance": "",
}

function MatchScout(props: any) {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState<any>(formDefaultValues);
  const [roundIsVisible, setRoundIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [usChecked, setUSChecked] = useState(false);
  const [csChecked, setCSChecked] = useState(false);
  const [lsChecked, setLSChecked] = useState(false);
  const [lChecked, setLChecked] = useState(false);
  const [tabNum, setTabNum] = useState("1");
  const [team_number, setTeam_number] = useState(0);
  const [teamsList, setTeamsList] = useState<string[]>([]);
  const [qrValue, setQrValue] = useState<any>();
  const [defendedIsVisible, setDefendedIsVisible] = useState(false);
  const [wasDefendedIsVisible, setWasDefendedIsVisible] = useState(false);
  const [penaltiesIsVisible, setPenaltiesIsVisible] = useState(false);
  const [opposingTeamNum, setOpposingTeamNum] = useState([""]);
  const [shouldRetrySubmit, setShouldRetrySubmit] = useState(true);
  const [lastFormValue, setLastFormValue] = useState<any>(null);
  const [inPlayoffs, setInPlayoffs] = useState(false);
  const [robot_appeared, setRobot_appeared] = useState(true);
  const [leftStartPos, setLeftStartPos] = useState(false);
  const [autonPoints, setAutonPoints] = useState(0);

  const match_event = process.env.REACT_APP_EVENTNAME;

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  useEffect(() => {
    const updateFields = [
      "auton_coral_scored_l4",
      "auton_coral_scored_l3",
      "auton_coral_scored_l2",
      "auton_coral_scored_l1",
      "auton_coral_missed_l4",
      "auton_coral_missed_l3",
      "auton_coral_missed_l2",
      "auton_coral_missed_l1",
      "auton_algae_scored_net",
      "auton_algae_missed_net",
      "auton_algae_scored_processor",
      "teleop_coral_scored_l4",
      "teleop_coral_scored_l3",
      "teleop_coral_scored_l2",
      "teleop_coral_scored_l1",
      "teleop_coral_missed_l4",
      "teleop_coral_missed_l3",
      "teleop_coral_missed_l2",
      "teleop_coral_missed_l1",
      "teleop_algae_scored_net",
      "teleop_algae_missed_net",
      "teleop_algae_scored_processor",
      "overall_num_penalties",
      "overall_pushing",
      "overall_counter_defense",
      "overall_driver_skill",
    ];
    for(const field of updateFields) {
      const element = document.getElementById(field);
      if (element === null) {
        continue;
      }

      element.ariaValueNow = (formValue as any)[field].toString();
      form.setFieldValue(field, (formValue as any)[field]);
    }
  }, [formValue, form]);
  
  async function setNewMatchScout(event: any) {
    if (team_number === 0) {
      window.alert("Team number is 0, please check in Pre.");
      return;
    }
    const body = {
      // Pre-match
      "match_event": match_event,
      "team_number": team_number,
      "scouter_initials": event.scouter_initials.toLowerCase(),
      "match_level": event.match_level + (roundIsVisible && event.round_number !== undefined ? event.round_number : ""),
      "match_number": event.match_number,
      "robot_position": event.robot_position,
      // Auton
      "auton_leave_starting_line": event.auton_leave_starting_line,
      "auton_coral_scored_l4": event.auton_coral_scored_l4,
      "auton_coral_missed_l4": event.auton_coral_missed_l4,
      "auton_coral_scored_l3": event.auton_coral_scored_l3,
      "auton_coral_missed_l3": event.auton_coral_missed_l3,
      "auton_coral_scored_l2": event.auton_coral_scored_l2,
      "auton_coral_missed_l2": event.auton_coral_missed_l2,
      "auton_coral_scored_l1": event.auton_coral_scored_l1,
      "auton_coral_missed_l1": event.auton_coral_missed_l1,
      "auton_algae_scored_net": event.auton_algae_scored_net,
      "auton_algae_missed_net": event.auton_algae_missed_net,
      "auton_algae_scored_processor": event.auton_algae_scored_processor,
      // Teleop
      "teleop_coral_scored_l4": event.teleop_coral_scored_l4,
      "teleop_coral_missed_l4": event.teleop_coral_missed_l4,
      "teleop_coral_scored_l3": event.teleop_coral_scored_l3,
      "teleop_coral_missed_l3": event.teleop_coral_missed_l3,
      "teleop_coral_scored_l2": event.teleop_coral_scored_l2,
      "teleop_coral_missed_l2": event.teleop_coral_missed_l2,
      "teleop_coral_scored_l1": event.teleop_coral_scored_l1,
      "teleop_coral_missed_l1": event.teleop_coral_missed_l1,
      "teleop_algae_scored_net": event.teleop_algae_scored_net,
      "teleop_algae_missed_net": event.teleop_algae_missed_net,
      "teleop_algae_scored_processor": event.teleop_algae_scored_processor,
      // Endgame
      "endgame_coral_intake_capability": event.endgame_coral_intake_capability,
      "endgame_coral_station": event.endgame_coral_station,
      "endgame_algae_intake_capability": event.endgame_algae_intake_capability,
      "endgame_climb_successful": event.endgame_climb_successful,
      "endgame_climb_type": event.endgame_climb_type,
      "endgame_climb_time": event.endgame_climb_time,
      // Overall
      "overall_robot_died": event.overall_robot_died,
      "overall_defended_others": event.overall_defended_others,
      "overall_was_defended": event.overall_was_defended,
      "overall_defended": event.overall_defended.sort().join(","),
      "overall_defended_by": event.overall_defended_by.sort().join(","),
      "overall_pushing": event.overall_pushing,
      "overall_counter_defense": event.overall_counter_defense,
      "overall_driver_skill": event.overall_driver_skill,
      "overall_num_penalties": event.overall_num_penalties,
      "overall_penalties_incurred": event.overall_penalties_incurred,
      "overall_comments": event.overall_comments,
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

    fetchLink += "reqType=submitMatchData";

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
  
  
  function updateAutonValues() {
    form.setFieldValue("auton_leave_starting_line", true);
  }
  async function trySubmit(event : any) {
    if(isLoading) {
      return;
    }

    if(!event) {
      event = lastFormValue;
    } else {
      setLastFormValue(event);
    }

    try {
      setLoading(true);
      await setNewMatchScout(event);
      const scouter_initials = form.getFieldValue("scouter_initials");
      const match_number = form.getFieldValue("match_number");
      const match_level = form.getFieldValue("match_level");
      const robot_position = form.getFieldValue("robot_position");
      
      console.log(form.getFieldValue("red_alliance"));

      setWasDefendedIsVisible(false);
      setDefendedIsVisible(false);
      setPenaltiesIsVisible(false);

      form.resetFields();
      setFormValue(formDefaultValues);
      form.setFieldValue("scouter_initials", scouter_initials);
      form.setFieldValue("match_number", match_number + 1);
      form.setFieldValue("match_level", match_level);
      form.setFieldValue("robot_position", robot_position);

      await calculateMatchLevel();
      await updateTeamNumber();
      await updateDefendedList(robot_position);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  }

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

      if(robotPosition) {
        const index = getIndexNumber(robotPosition);
        const teamNumber = Number(teams[index]);
        setTeam_number(teamNumber);
        await updateDefendedList(robotPosition);
      } else {
        setTeam_number(0);
      }

    } catch (err) {
      console.error("Failed to request TBA data when updating team number", err);
    }
  }
  function calculateMatchLevel() {
    const matchLevel = form.getFieldValue('match_level');
    const isVisible = isRoundNumberVisible(matchLevel);

    setRoundIsVisible(isVisible);

    const inPlayoffs = isInPlayoffs(matchLevel);

    setInPlayoffs(inPlayoffs);
  }
  async function updateDefendedList(robotPosition : string) {
    try {
      const color = robotPosition[0] === "R" ?
        "blue" :
        "red";

      const indexOffset = getAllianceOffset(color);
      const team = [];

      for(let i = 0; i < 3; i++) {
        const num = teamsList[indexOffset + i];
        team.push(num);
      }

      setOpposingTeamNum(team);
    }
    catch (err) {
      console.error("Failed to request TBA data when updating opposing team", err);
    }
  }

  function preMatch() {
    type FieldType = {
      scouter_initials: string,
      match_level: string,
      match_number: number,
      robot_position: string,
      preloaded: boolean,
      round_number: number,
      red_alliance: string,
      blue_alliance: string,
    };
    const rounds = [
      { label: "Qualifications", value: "Qualifications" },
      { label: "Quarter-Finals", value: "Quarter-Finals" },
      { label: "Semi-Finals", value: "Semi-Finals" },
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
        <h2>Match Level:</h2>
        <Form.Item<FieldType> name="match_level" rules={[{ required: true, message: 'Enter match level' }]}>
          <Select options={rounds} onChange={() => { calculateMatchLevel(); updateTeamNumber(); }} className="input" />
        </Form.Item>

        <div className={"playoff-alliances"} style={{ display: inPlayoffs ? 'inherit' : 'none' }}>
          <h2>Red Alliance</h2>
          <Form.Item<FieldType> name="red_alliance" rules={[{ required: inPlayoffs ? true : false, message: 'Enter the red alliance' }]}>
            <Select
              options={playoff_alliances}
              onChange={() => { calculateMatchLevel(); updateTeamNumber(); }}
              className="input"
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ maxHeight: 'none' }}
            />
          </Form.Item>
          
          <h2>Blue Alliance</h2>
          <Form.Item<FieldType> name="blue_alliance" rules={[{ required: inPlayoffs ? true : false, message: 'Enter the blue alliance' }]}>
            <Select
              options={playoff_alliances}
              onChange={() => { calculateMatchLevel(); updateTeamNumber(); }}
              className="input"
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ maxHeight: 'none' }}
            />
          </Form.Item>
          
        </div>
        
        <h2>Match #</h2>
        <Form.Item<FieldType> name="match_number" rules={[{ required: true, message: 'Enter match #' }]}>
          <InputNumber min={1} onChange={updateTeamNumber} className="input" type='number' pattern="\d*" onWheel={(e) => (e.target as HTMLElement).blur()}/>
        </Form.Item>

        <div style={{ display: roundIsVisible ? 'inherit' : 'none' }}>
          <h2 >Round #</h2>
          <Form.Item<FieldType> name="round_number" rules={[{ required: roundIsVisible ? true : false, message: 'Enter round #' }]} >
            <InputNumber min={1} onChange={updateTeamNumber} className="input" type='number' pattern="\d*" onWheel={(e) => (e.target as HTMLElement).blur()}/>
          </Form.Item>
        </div>

        <h2>Robot Position:</h2>
        <Form.Item<FieldType> name="robot_position" rules={[{ required: true, message: 'Enter robot position' }]}>
          <Select options={robot_position} onChange={updateTeamNumber} className="input"  listItemHeight={10} listHeight={500} placement='bottomLeft'/>
        </Form.Item>

       <Button
         className={"noShowButton"}
         onMouseDown={async () => {
           const values = {...noShowValues};

           setTabNum("1");
           await sleep(100);
           setTabNum("2");
           await sleep(100);
           setTabNum("3");
           await sleep(100);
           setTabNum("4");
           await sleep(100);
           setTabNum("5");
           form.setFieldsValue(values);
           setRobot_appeared(false);
         }}
       >No Show</Button>
        
      </div>
    );
  }
  
  function AutonMatch() {
    type FieldType = {
      auton_coral_scored_l4: number,
      auton_coral_scored_l3: number,
      auton_coral_scored_l2: number,
      auton_coral_scored_l1: number,
      auton_coral_missed_l4: number,
      auton_coral_missed_l3: number,
      auton_coral_missed_l2: number,
      auton_coral_missed_l1: number,
      auton_algae_scored_net: number,
      auton_algae_missed_net: number,
      auton_algae_scored_processor: number,
      auton_leave_starting_line: boolean,
    };
    
    useEffect(() => {
      setLeftStartPos(autonPoints > 0);
    }, [autonPoints, leftStartPos]);

    return (
      <div style={{ alignContent: 'center' }}>
        <h2>Leave Starting Line?</h2>
        <Form.Item<FieldType> name="auton_leave_starting_line" valuePropName="checked">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L4"}
              name={"auton_coral_scored_l4"}
              message={"Enter # coral scored for l4"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Coral Missed L4"}
              name={"auton_coral_missed_l4"}
              message={"Enter # coral missed for l4"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
          </div>
        </div>
            
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L3"}
              name={"auton_coral_scored_l3"}
              message={"Enter # coral scored for l3"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Coral Missed L3"}
              name={"auton_coral_missed_l3"}
              message={"Enter # coral missed for l3"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
          </div>
        </div>
        
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L2"}
              name={"auton_coral_scored_l2"}
              message={"Enter # coral scored for l2"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Coral Missed L2"}
              name={"auton_coral_missed_l2"}
              message={"Enter # coral missed for l2"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L1"}
              name={"auton_coral_scored_l1"}
              message={"Enter # coral scored for l1"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Coral Missed L1"}
              name={"auton_coral_missed_l1"}
              message={"Enter # coral missed for l1"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Algae Scored in Net"}
              name={"auton_algae_scored_net"}
              message={"Enter # of algae scored for net"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Algae Missed in Net"}
              name={"auton_algae_missed_net"}
              message={"Enter # of algae missed for net"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Algae Processor"}
              name={"auton_algae_scored_processor"}
              message={"Enter # of algae scored for processor"}
              onIncrease={updateAutonValues}
              setForm={setFormValue}
            />
          </div>
        </div>
            
      </div>
    );
  }

  function teleopMatch() {
    type FieldType = {
      teleop_coral_scored_l4: number,
      teleop_coral_missed_l4: number,
      teleop_coral_scored_l3: number,
      teleop_coral_missed_l3: number,
      teleop_coral_scored_l2: number,
      teleop_coral_missed_l2: number,
      teleop_coral_scored_l1: number,
      teleop_coral_missed_l1: number,
      teleop_algae_scored_net: number,
      teleop_algae_missed_net: number,
      teleop_algae_scored_processor: number,
    };

    return (
      <div>
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L4"}
              name={"teleop_coral_scored_l4"}
              message={"Enter # of coral scored for l4"}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Coral Missed L4"}
              name={"teleop_coral_missed_l4"}
              message={"Enter # of coral missed for l4"}
              setForm={setFormValue}
            />
          </div>
        </div>
            
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L3"}
              name={"teleop_coral_scored_l3"}
              message={"Enter # of coral scored for l3"}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Coral Missed L3"}
              name={"teleop_coral_missed_l3"}
              message={"Enter # of coral missed for l3"}
              setForm={setFormValue}
            />
          </div>
        </div>
        
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L2"}
              name={"teleop_coral_scored_l2"}
              message={"Enter # of coral scored for l2"}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Coral Missed L2"}
              name={"teleop_coral_missed_l2"}
              message={"Enter # of coral missed for l2"}
              setForm={setFormValue}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L1"}
              name={"teleop_coral_scored_l1"}
              message={"Enter # of coral scored for l1"}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Coral Missed L1"}
              name={"teleop_coral_missed_l1"}
              message={"Enter # of coral missed for l1"}
              setForm={setFormValue}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Algae Scored in Net"}
              name={"teleop_algae_scored_net"}
              message={"Enter # of algae scored for net"}
              setForm={setFormValue}
            />
              
            <NumberInput
              title={"#Algae Missed in Net"}
              name={"teleop_algae_missed_net"}
              message={"Enter # of algae missed for net"}
              setForm={setFormValue}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Algae Processor"}
              name={"teleop_algae_scored_processor"}
              message={"Enter # of algae scored for processor"}
              setForm={setFormValue}
            />
          </div>
        </div>
      </div>
    );
  }
  
  function endgameMatch() {
    type FieldType = {
      endgame_climb_successful: boolean,
      endgame_climb_time: number,
    };
    const endgame_coral_intake_capability = [
      { label: "Ground", value: "Ground" },
      { label: "Station", value: "Station" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    const endgame_coral_station = [
      { label: "Top Station", value: "Top Station" },
      { label: "Bottom Station", value: "Bottom Station" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither"}
    ];
    const endgame_algae_intake_capability = [
      { label: "Reef Zone", value: "Reef Zone" },
      { label: "Ground", value: "Ground" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    const endgame_climb_type = [
      { label: "Deep Hang", value: "Deep Hang" },
      { label: "Shallow Hang", value: "Shallow Hang" },
      { label: "Park", value: "Park" },
      { label: "Neither", value: "Neither" },
    ];
    return (
      <>
        <h2>Coral Intake Capability:</h2>
        <Form.Item name="endgame_coral_intake_capability" rules={[{ required: true, message: 'Enter Coral Intake Capability' }]}>
          <Select options={endgame_coral_intake_capability} className="input" />
        </Form.Item>

        <h2>Coral Station:</h2>
        <Form.Item name="endgame_coral_station" rules={[{ required: true, message: 'Enter Coral Station' }]}>
          <Select options={endgame_coral_station} className="input" />
        </Form.Item>

        <h2>Algae Intake Capability:</h2>
        <Form.Item name="endgame_algae_intake_capability" rules={[{ required: true, message: 'Enter Algae Intake Capability' }]}>
          <Select options={endgame_algae_intake_capability} className="input" />
        </Form.Item>
        <h2>Climb Successful?</h2>
        <Form.Item<FieldType> name ="endgame_climb_successful" valuePropName="checked">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <h2>Climb Type:</h2>
        <Form.Item name="endgame_climb_type" rules={[{ required: true, message: 'Enter Climb Type' }]}>
          <Select options={endgame_climb_type} className="input" />
        </Form.Item>
        <h2>Climb Time (Seconds):</h2>
        <Form.Item<FieldType> name="endgame_climb_time" rules={[{ required: true, message: 'Enter Climb Time (Seconds)' }]}>
          <InputNumber min={1} className="input" type='number' pattern="\d*" onWheel={(e) => (e.target as HTMLElement).blur()}/>
        </Form.Item>
      </>
  )}

  function overall() {
    type FieldType = {
      overall_robot_died: boolean;
      overall_defended_others: boolean;
      overall_defended: string;
      hoarded: boolean;
      overall_was_defended: boolean;
      overall_defended_by: string;
      overall_num_penalties: number;
      overall_penalties_incurred: string;
      overall_comments: string;
      matchpen: string;
      techpen: string;
      overall_pushing: number;
      overall_driver_skill: number;
      overall_counter_defense: number;
    };
    return (
      <div className='matchbody'>
        <Flex justify='in-between'>
          <Flex vertical align='flex-start'>
            <h3>Robot died?</h3>
            <Form.Item<FieldType> name="overall_robot_died" valuePropName="checked">
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h3>Defended others?</h3>
            <Form.Item<FieldType> name="overall_defended_others" valuePropName="checked">
              <Checkbox className='input_checkbox' onChange={() => { setDefendedIsVisible(!defendedIsVisible); }} />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h3>Was Defended?</h3>
            <Form.Item<FieldType> name="overall_was_defended" valuePropName="checked">
              <Checkbox className='input_checkbox' onChange={() => { setWasDefendedIsVisible(!wasDefendedIsVisible); }} />
            </Form.Item>
          </Flex>
        </Flex>

        <h2 style={{ display: defendedIsVisible ? 'inherit' : 'none' }}>Defended:</h2>
        <Form.Item<FieldType> name="overall_defended" valuePropName="checked" style={{ display: defendedIsVisible ? 'inherit' : 'none' }}
            rules={[{required: defendedIsVisible, message : "Please select the teams it defended!"}]}>
          <Select mode='multiple' options={opposingTeamNum.map((team) => ({ label: team, value: team }))} className="input" showSearch={false} style={{ display: defendedIsVisible ? 'inherit' : 'none' }} />
        </Form.Item>
        <h2 style={{ display: wasDefendedIsVisible ? 'inherit' : 'none' }}>Defended By:</h2>
        <Form.Item<FieldType> name="overall_defended_by" valuePropName="checked" style={{ display: wasDefendedIsVisible ? 'inherit' : 'none' }}
              rules={[{required: wasDefendedIsVisible, message : "Please select the teams it was defended by!"}]}>
          <Select mode='multiple' options={opposingTeamNum.map((team) => ({ label: team, value: team }))} className="input" showSearch={false} style={{ display: wasDefendedIsVisible ? 'inherit' : 'none' }} />
        </Form.Item>

        <Flex justify='in-between'>
          <Flex vertical align='flex-start'>
            <h2 className="fieldTitle">Pushing</h2>
            <h2 className="fieldTitle">(1 - 4)</h2>
            <Form.Item<FieldType> name="overall_pushing" rules={[{ required: true, message: 'Please input the pushing rating!' }]}>
              <InputNumber
                type='number'
                pattern="\d*"
                min={0} max={4}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                className="input"
                addonAfter={<Button onMouseDown={() => {
                  if (Number(formValue.overall_pushing) < 4) {
                    setFormValue({ ...formValue, overall_pushing: formValue.overall_pushing + 1 });
                  }
                }} className='incrementbutton'>+</Button>}
                addonBefore={<Button onMouseDown={() => {
                  if (Number(formValue.overall_pushing) > 0) {
                    setFormValue({ ...formValue, overall_pushing: formValue.overall_pushing - 1 });
                  }
                }} className='decrementbutton'>-</Button>}
              />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h2 className="fieldTitle">Counter Defense</h2>
            <h2 className="fieldTitle">(1 - 4)</h2>
            <Form.Item<FieldType> name="overall_counter_defense" rules={[{ required: true, message: 'Please input the counter-defense rating!' }]}>
              <InputNumber
                type='number'
                pattern="\d*"
                min={0} max={4}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                className="input"
                addonAfter={<Button onMouseDown={() => {
                  if (Number(formValue.overall_counter_defense) < 4) {
                    setFormValue({ ...formValue, overall_counter_defense: formValue.overall_counter_defense + 1 });
                  }
                }} className='incrementbutton'>+</Button>}
                addonBefore={<Button onMouseDown={() => {
                  if (Number(formValue.overall_counter_defense) > 0) {
                    setFormValue({ ...formValue, overall_counter_defense: formValue.overall_counter_defense - 1 });
                  }
                }} className='decrementbutton'>-</Button>}
              />
            </Form.Item>
          </Flex>
        </Flex>
        <Flex justify='in-between'>
          <Flex vertical align='flex-start'>
            <h2 className="fieldTitle">Driver Skill<br/> (1 - 4)</h2>
            <Form.Item<FieldType> name="overall_driver_skill" rules={[{ required: true, message: 'Please input the driver skill rating!' }]}>
              <InputNumber
                type='number'
                pattern="\d*"
                min={0} max={4}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                className="input"
                addonAfter={<Button onMouseDown={() => {
                  if (Number(formValue.overall_driver_skill) < 4) {
                    setFormValue({ ...formValue, overall_driver_skill: formValue.overall_driver_skill + 1 });
                  }
                }} className='incrementbutton'>+</Button>}
                addonBefore={<Button onMouseDown={() => {
                  if (Number(formValue.overall_driver_skill) > 0) {
                    setFormValue({ ...formValue, overall_driver_skill: formValue.overall_driver_skill - 1 });
                  }
                }} className='decrementbutton'>-</Button>}
              />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
          <h2 className="fieldTitle">Num Penalties</h2>
          <h2 className="fieldTitle">&nbsp;</h2>
            <Form.Item<FieldType> name="overall_num_penalties" rules={[{ required: true, message: 'Enter # of incurred penalties' }]}>
              <InputNumber
                type='number'
                pattern="\d*"
                min={0}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                className="input"
                addonAfter={<Button onMouseDown={() => {
                  setFormValue({ ...formValue, overall_num_penalties: formValue.overall_num_penalties + 1 });
                  setPenaltiesIsVisible(true);
                }} className='incrementbutton'>+</Button>}
                addonBefore={<Button onMouseDown={() => {
                  if (Number(formValue.overall_num_penalties) > 1) {
                    setFormValue({ ...formValue, overall_num_penalties: formValue.overall_num_penalties - 1 });
                  }
                  else if (Number(formValue.overall_num_penalties) <= 1 && Number(formValue.overall_num_penalties) > 0) {
                    setFormValue({ ...formValue, overall_num_penalties: formValue.overall_num_penalties - 1 });
                    setPenaltiesIsVisible(false);
                  }
                  else {
                    setPenaltiesIsVisible(false);
                  }
                }} className='decrementbutton'>-</Button>}
              />
            </Form.Item>
          </Flex>
        </Flex>
        <Flex justify='in-between' style={{ display: penaltiesIsVisible ? 'inherit' : 'none'}}>
          <Flex vertical align='flex-start'>
            <h2>Match</h2>
            <Form.Item<FieldType> name="matchpen" valuePropName="checked" >
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h2>Tech</h2>
            <Form.Item<FieldType> name="techpen" valuePropName="checked">
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
        </Flex>
        <div style={{ display: penaltiesIsVisible ? 'inherit' : 'none'}}>
          <h2>Penalties Incurred</h2>
          <Form.Item<FieldType> name="overall_penalties_incurred" rules={[{ required: penaltiesIsVisible, message: 'Please enter the penalty(s)' }]}>
            <TextArea style={{ verticalAlign: 'center' }} className='textbox_input' />
          </Form.Item>
        </div>
        
        <h2>Comments</h2>
        <Form.Item<FieldType> name="overall_comments" rules={[{required : true, message : "Please enter some comments!"}]}>
          <TextArea style={{ verticalAlign: 'center' }} className='textbox_input' />
        </Form.Item>
      </div>
    )
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Pre',
      children: preMatch(),
    },
    {
      key: '2',
      label: 'Auton',
      children: AutonMatch(),
    },
    {
      key: '3',
      label: 'Teleop',
      children: teleopMatch(),
    },
    {
      key: '4',
      label: 'Endgame',
      children: endgameMatch(),
    },
    {
      key: '5',
      label: 'Overall',
      children: overall(),
    },
  
  ];
  return (
    <>
      <Header name="Match Scout" back="#scoutingapp" />
      <Form
        form={form}
        initialValues={formDefaultValues}
        onFinish={trySubmit}
        onFinishFailed={({values, errorFields, outOfDate}) => {
          console.log("values=", values);
          console.log("errorFields=", errorFields);
          console.log("outOfDate=", outOfDate);
          
          const errorMessage = errorFields.map((x : any) => x.errors.join(", ")).join("\n");
          window.alert(errorMessage);
        }}
      >
        <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} className='tabs' centered onChange={async (key) => { setTabNum(key) }} />
        <Footer style={{ position: "sticky", bottom: "0" }}>
          <Flex justify='in-between' id={"footer"} >
            {Number(tabNum) !== 1 && (
              <Button onMouseDown={async () => { setTabNum((Number(tabNum) - 1).toString()) }} className='tabbutton'>Back</Button>
            )}
            {Number(tabNum) !== items.length && (
              <Button onMouseDown={async () => { setTabNum((Number(tabNum) + 1).toString()) }} className='tabbutton'>Next</Button>
            )}
            {Number(tabNum) === items.length && (
              <Input type="submit" value="Submit" className='match_submit' />
            )}
          </Flex>
          <h2 style={{ display: isLoading ? 'inherit' : 'none' }}>Submitting data...</h2>
        </Footer>
      </Form>
      <QrCode value={qrValue} />
    </>
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default MatchScout;
