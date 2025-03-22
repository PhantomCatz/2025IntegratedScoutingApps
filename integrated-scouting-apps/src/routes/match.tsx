import '../public/stylesheets/style.css';
import '../public/stylesheets/match.css';
import field_blue from '../public/images/field_blue.png';
import field_red from '../public/images/field_red.png';

import { useEffect, useState } from 'react';
import { Tabs, Input, Form, Select, Checkbox, InputNumber, Flex, Button} from 'antd';
import type { TabsProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Footer } from 'antd/es/layout/layout';
import Header from "./header";
import { Radio } from 'antd';
import QrCode from './qrCodeViewer';
import {getTeamNumber, isMatchVisible, getTeam} from './utils/tbaRequest';
import type { RadioChangeEvent } from "antd";

interface SpacerProps {
  height?: string;
  width?: string;
}

const Spacer: React.FC<SpacerProps> = ({ height = '0px', width = '0px' }) => {
  return <div style={{ height, width }} />;
};

const formDefaultValues = {
  /*
  // Pre-match
  "match_event": match_event,
  "team_number": team_number,
  "scouter_initials": event.scouter_initials.toLowerCase(),
  "match_level": event.match_level + (event.round_number !== undefined ? event.round_number : ""),
  "match_number": event.match_number,
  "robot_position": event.robot_position,
  "robot_starting_position": event.robot_starting_position,
  */
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
  "overall_penalties_incurred": null,
  "overall_comments": null,
  "overall_defense_quality" : 0,
};

function MatchScout(props: any) {
  const [form] = Form.useForm();
  const [color, setColor] = useState('');
  const [roundIsVisible, setRoundIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [usChecked, setUSChecked] = useState(false);
  const [csChecked, setCSChecked] = useState(false);
  const [lsChecked, setLSChecked] = useState(false);
  const [lChecked, setLChecked] = useState(false);
  const [tabNum, setTabNum] = useState("1");
  const [team_number, setTeam_number] = useState(0);
  const [qrValue, setQrValue] = useState<any>();
  const [defendedIsVisible, setDefendedIsVisible] = useState(false);
  const [wasDefendedIsVisible, setWasDefendedIsVisible] = useState(false);
  const [penaltiesIsVisible, setPenaltiesIsVisible] = useState(false);
  const [opposingTeamNum, setOpposingTeamNum] = useState([""]);
  const [robot_starting_position, setRobot_starting_position] = useState("")
  const [formValue, setFormValue] = useState<any>(formDefaultValues);
  const [shouldRetrySubmit, setShouldRetrySubmit] = useState(true);
  const [lastFormValue, setLastFormValue] = useState<any>(null);
  const [leftStartPos, setLeftStartPos] = useState(false);
  const [autonPoints, setAutonPoints] = useState(0);

  const handleStartPosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRobot_starting_position(event.target.value);
  };
  
  const match_event = process.env.REACT_APP_EVENTNAME;

  useEffect(() => { document.title = props.title; return () => { }; }, [props.title]);
  useEffect(() => {
    if ((document.getElementById("auton_coral_scored_l4") as HTMLInputElement) !== null) {
      (document.getElementById("auton_coral_scored_l4") as HTMLInputElement).value = formValue.auton_coral_scored_l4.toString();
      form.setFieldValue('auton_coral_scored_l4', formValue.auton_coral_scored_l4);
    }
    if ((document.getElementById("auton_coral_scored_l3") as HTMLInputElement) !== null) {
      (document.getElementById("auton_coral_scored_l3") as HTMLInputElement).value = formValue.auton_coral_scored_l3.toString();
      form.setFieldValue('auton_coral_scored_l3', formValue.auton_coral_scored_l3);
    }
    if ((document.getElementById("auton_coral_scored_l2") as HTMLInputElement) !== null) {
      (document.getElementById("auton_coral_scored_l2") as HTMLInputElement).value = formValue.auton_coral_scored_l2.toString();
      form.setFieldValue('auton_coral_scored_l2', formValue.auton_coral_scored_l2);
    }
    if ((document.getElementById("auton_coral_scored_l1") as HTMLInputElement) !== null) {
      (document.getElementById("auton_coral_scored_l1") as HTMLInputElement).value = formValue.auton_coral_scored_l1.toString();
      form.setFieldValue('auton_coral_scored_l1', formValue.auton_coral_scored_l1);
    }
    if ((document.getElementById("auton_coral_missed_l4") as HTMLInputElement) !== null) {
      (document.getElementById("auton_coral_missed_l4") as HTMLInputElement).value = formValue.auton_coral_missed_l4.toString();
      form.setFieldValue('auton_coral_missed_l4', formValue.auton_coral_missed_l4);
    }
    if ((document.getElementById("auton_coral_missed_l3") as HTMLInputElement) !== null) {
      (document.getElementById("auton_coral_missed_l3") as HTMLInputElement).value = formValue.auton_coral_missed_l3.toString();
      form.setFieldValue('auton_coral_missed_l3', formValue.auton_coral_missed_l3);
    }
    if ((document.getElementById("auton_coral_missed_l2") as HTMLInputElement) !== null) {
      (document.getElementById("auton_coral_missed_l2") as HTMLInputElement).value = formValue.auton_coral_missed_l2.toString();
      form.setFieldValue('auton_coral_missed_l2', formValue.auton_coral_missed_l2);
    }
    if ((document.getElementById("auton_coral_missed_l1") as HTMLInputElement) !== null) {
      (document.getElementById("auton_coral_missed_l1") as HTMLInputElement).value = formValue.auton_coral_missed_l1.toString();
      form.setFieldValue('auton_coral_missed_l1', formValue.auton_coral_missed_l1);
    }
    if ((document.getElementById("auton_algae_scored_net") as HTMLInputElement) !== null) {
      (document.getElementById("auton_algae_scored_net") as HTMLInputElement).value = formValue.auton_algae_scored_net.toString();
      form.setFieldValue('auton_algae_scored_net', formValue.auton_algae_scored_net);
    }
    if ((document.getElementById("auton_algae_missed_net") as HTMLInputElement) !== null) {
      (document.getElementById("auton_algae_missed_net") as HTMLInputElement).value = formValue.auton_algae_missed_net.toString();
      form.setFieldValue('auton_algae_missed_net', formValue.auton_algae_missed_net);
    }
    if ((document.getElementById("auton_algae_scored_processor") as HTMLInputElement) !== null) {
      (document.getElementById("auton_algae_scored_processor") as HTMLInputElement).value = formValue.auton_algae_scored_processor.toString();
      form.setFieldValue('auton_algae_scored_processor', formValue.auton_algae_scored_processor);
    }
    if ((document.getElementById("teleop_coral_scored_l4") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_coral_scored_l4") as HTMLInputElement).value = formValue.teleop_coral_scored_l4.toString();
      form.setFieldValue('teleop_coral_scored_l4', formValue.teleop_coral_scored_l4);
    }
    if ((document.getElementById("teleop_coral_scored_l3") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_coral_scored_l3") as HTMLInputElement).value = formValue.teleop_coral_scored_l3.toString();
      form.setFieldValue('teleop_coral_scored_l3', formValue.teleop_coral_scored_l3);
    }
    if ((document.getElementById("teleop_coral_scored_l2") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_coral_scored_l2") as HTMLInputElement).value = formValue.teleop_coral_scored_l2.toString();
      form.setFieldValue('teleop_coral_scored_l2', formValue.teleop_coral_scored_l2);
    }
    if ((document.getElementById("teleop_coral_scored_l1") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_coral_scored_l1") as HTMLInputElement).value = formValue.teleop_coral_scored_l1.toString();
      form.setFieldValue('teleop_coral_scored_l1', formValue.teleop_coral_scored_l1);
    }
    if ((document.getElementById("teleop_coral_missed_l4") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_coral_missed_l4") as HTMLInputElement).value = formValue.teleop_coral_missed_l4.toString();
      form.setFieldValue('teleop_coral_missed_l4', formValue.teleop_coral_missed_l4);
    }
    if ((document.getElementById("teleop_coral_missed_l3") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_coral_missed_l3") as HTMLInputElement).value = formValue.teleop_coral_missed_l3.toString();
      form.setFieldValue('teleop_coral_missed_l3', formValue.teleop_coral_missed_l3);
    }
    if ((document.getElementById("teleop_coral_missed_l2") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_coral_missed_l2") as HTMLInputElement).value = formValue.teleop_coral_missed_l2.toString();
      form.setFieldValue('teleop_coral_missed_l2', formValue.teleop_coral_missed_l2);
    }
    if ((document.getElementById("teleop_coral_missed_l1") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_coral_missed_l1") as HTMLInputElement).value = formValue.teleop_coral_missed_l1.toString();
      form.setFieldValue('teleop_coral_missed_l1', formValue.teleop_coral_missed_l1);
    }
    if ((document.getElementById("teleop_algae_scored_net") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_algae_scored_net") as HTMLInputElement).value = formValue.teleop_algae_scored_net.toString();
      form.setFieldValue('teleop_algae_scored_net', formValue.teleop_algae_scored_net);
    }
    if ((document.getElementById("teleop_algae_missed_net") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_algae_missed_net") as HTMLInputElement).value = formValue.teleop_algae_missed_net.toString();
      form.setFieldValue('teleop_algae_missed_net', formValue.teleop_algae_missed_net);
    }
    if ((document.getElementById("teleop_algae_scored_processor") as HTMLInputElement) !== null) {
      (document.getElementById("teleop_algae_scored_processor") as HTMLInputElement).value = formValue.teleop_algae_scored_processor.toString();
      form.setFieldValue('teleop_algae_scored_processor', formValue.teleop_algae_scored_processor);
    }
    if ((document.getElementById("overall_num_penalties") as HTMLElement) !== null) {
      (document.getElementById("overall_num_penalties") as HTMLInputElement).value = formValue.overall_num_penalties.toString();
      form.setFieldValue('overall_num_penalties', formValue.overall_num_penalties);
    }
    if ((document.getElementById("overall_pushing") as HTMLElement) !== null) {
      (document.getElementById("overall_pushing") as HTMLInputElement).value = formValue.overall_pushing.toString();
      form.setFieldValue('overall_pushing', formValue.overall_pushing);
    }
    if ((document.getElementById("overall_defense_quality") as HTMLElement) !== null) {
      (document.getElementById("overall_defense_quality") as HTMLInputElement).value = formValue.overall_defense_quality.toString();
      form.setFieldValue('overall_defense_quality', formValue.overall_defense_quality);
    }
    
    if ((document.getElementById("overall_counter_defense") as HTMLElement) !== null) {
      (document.getElementById("overall_counter_defense") as HTMLInputElement).value = formValue.overall_counter_defense.toString();
      form.setFieldValue('overall_counter_defense', formValue.overall_counter_defense);
    }
    if ((document.getElementById("overall_driver_skill") as HTMLElement) !== null) {
      (document.getElementById("overall_driver_skill") as HTMLInputElement).value = formValue.overall_driver_skill.toString();
      form.setFieldValue('overall_driver_skill', formValue.overall_driver_skill);
    }
    return () => {};

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
      "robot_starting_position": robot_starting_position,
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
      "overall_defended": event.overall_defended.sort(),
      "overall_defended_by": event.overall_defended_by.sort(),
      "overall_pushing": event.overall_pushing,
      "overall_defense_quality" : event.overall_defense_quality,
      "overall_counter_defense": event.overall_counter_defense,
      "overall_driver_skill": event.overall_driver_skill,
      "overall_num_penalties": event.overall_num_penalties,
      "overall_penalties_incurred": event.overall_penalties_incurred,
      "overall_comments": event.overall_comments,
    };

    const qrBody : any = {};
    for (const [field, value] of Object.entries(body)) {
      qrBody[field] = value;
    }
    setQrValue(qrBody);
  }
  useEffect(() => {
    if (autonPoints > 0)
    {
      form.setFieldValue("auton_leave_starting_line", true);
    }
    // else {
    //   form.setFieldValue("auton_leave_starting_line", false)
    // }
    

  }, [autonPoints]);

  

  async function trySubmit(event : any) {
    if(isLoading) {
      return;
    }

    if(!event) {
      event = lastFormValue;
    } else {
      setLastFormValue(event);
    }

    if(!robot_starting_position) {
      window.alert("Please enter the robot's starting position!");
      return;
    }

    try {
      setLoading(true);
      await setNewMatchScout(event);
      const scouter_initials = form.getFieldValue("scouter_initials");
      const match_number = form.getFieldValue("match_number");
      const match_level = form.getFieldValue("match_level");
      const robot_position = form.getFieldValue("robot_position");
      
      form.resetFields();
      setFormValue(formDefaultValues);
      form.setFieldValue("scouter_initials", scouter_initials);
      form.setFieldValue("match_number", match_number + 1);
      form.setFieldValue("match_level", match_level);
      form.setFieldValue("robot_position", robot_position);
      
      setWasDefendedIsVisible(false);
      setDefendedIsVisible(false);
      setPenaltiesIsVisible(false);

      await calculateMatchLevel();
      await updateTeamNumber();
      await updateDefendedList();
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
      const roundNumber = form.getFieldValue('round_number');
      const robotPosition = form.getFieldValue('robot_position');

      const teamNumber = await getTeamNumber(roundIsVisible, matchLevel, matchNumber, roundNumber, robotPosition);

      setTeam_number(teamNumber);

      await updateDefendedList();
    }
    catch (err) {
      console.error("Failed to request TBA data when updating team number");
    }
  }
  function calculateMatchLevel() {
    const isVisible = isMatchVisible(form.getFieldValue('match_level'));
    setRoundIsVisible(isVisible);
  }
  async function updateDefendedList() {
    try {
      const matchLevel = form.getFieldValue('match_level');
      const matchNumber = form.getFieldValue('match_number');
      const roundNumber = form.getFieldValue('round_number');
      const robotPosition = form.getFieldValue('robot_position');
      if (robotPosition == 'R1' || robotPosition == 'R2' || robotPosition == 'R3') {
        setColor('red');
      }
      else {
        setColor('blue');
      }

      const team = await getTeam(roundIsVisible, matchLevel, matchNumber, roundNumber, color);

      setOpposingTeamNum(team);
    }
    catch (err) {
      console.error("Failed to request TBA data when updating opposing team");
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
    };
    const rounds = [
      { label: "Qualifications", value: "Qualifications" },
      { label: "Quarter-Finals", value: "Quarter-Finals" },
      { label: "Semi-Finals", value: "Semi-Finals" },
      { label: "Finals", value: "Finals" },
    ];
    const robot_position = [
      { label: "R1", value: "R1" },
      { label: "R2", value: "R2" },
      { label: "R3", value: 'R3' },
      { label: "B1", value: "B1" },
      { label: "B2", value: "B2" },
      { label: "B3", value: 'B3' },
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
        
        <h2>Match #</h2>
		<Form.Item<FieldType> name="match_number" rules={[{ required: true, message: 'Enter match #' }]}>
          <InputNumber min={1} onChange={updateTeamNumber} className="input" type='number' pattern="\d*" onWheel={(e) => (e.target as HTMLElement).blur()}/>
        </Form.Item>

        <h2 style={{ display: roundIsVisible ? 'inherit' : 'none' }}>Round #</h2>
        <Form.Item<FieldType> name="round_number" rules={[{ required: roundIsVisible ? true : false, message: 'Enter round #' }]} style={{ display: roundIsVisible ? 'inherit' : 'none' }}>
          <InputNumber min={1} onChange={updateTeamNumber} style={{ display: roundIsVisible ? 'inherit' : 'none' }} className="input" type='number' pattern="\d*" onWheel={(e) => (e.target as HTMLElement).blur()}/>
        </Form.Item>

        <h2>Robot Position:</h2>
        <Form.Item<FieldType> name="robot_position" rules={[{ required: true, message: 'Enter robot position' }]}>
          <Select options={robot_position} onChange={updateTeamNumber} className="input"  listItemHeight={10} listHeight={500} placement='bottomLeft'/>
        </Form.Item>

        {/* <div className='divdivdiv'> 
        <h2>Robot Starting Position</h2>
        <div className='radioRow'> 
          <div className='radioColumn'>

          <Form.Item name="robot_starting_position">
          <div className='radioLabel'> 
            <h3>BS1</h3> 
            <input type="radio" name="robot_starting_position" value="BS1" className="robot_starting_position_radio" onChange={handleStartPosChange}/> 
          </div> 
          </Form.Item>

          <Form.Item name="robot_starting_position">
          <div className='radioLabel'> 
            <h3>BS2</h3> 
            <input type="radio" name="robot_starting_position" value="BS2" className="robot_starting_position_radio" onChange={handleStartPosChange}/> 
          </div> 
          </Form.Item>

          <Form.Item name="robot_starting_position">
          <div className='radioLabel'> 
            <h3>BS3</h3> 
            <input type="radio" name="robot_starting_position" value="BS3" className="robot_starting_position_radio" onChange={handleStartPosChange}/> 
          </div> 
          </Form.Item>


        </div> 

        <Spacer width="30px"/> 
        <div className="boxes"> 
          <div className='blueBox'></div> 
          <div className='redBox'></div>
        </div> 

      
        <Spacer width="30px"/>
        <div className='radioColumn'> 

        <Form.Item name="robot_starting_position">
          <div className='radioLabel'> 
            <input type="radio" name="robot_starting_position" value="RS3" className="robot_starting_position_radio" onChange={handleStartPosChange}/> 
            <h3>RS3</h3> 
          </div> 
        </Form.Item>

        <Form.Item name="robot_starting_position">
          <div className='radioLabel'> 
            <input type="radio" name="robot_starting_position" value="RS2" className="robot_starting_position_radio" onChange={handleStartPosChange}/> 
            <h3>RS2</h3>
          </div> 
        </Form.Item>

        <Form.Item name="robot_starting_position">
          <div className='radioLabel'> 
            <input type="radio" name="robot_starting_position" value="RS1" className="robot_starting_position_radio" onChange={handleStartPosChange}/> 
            <h3>RS1</h3> 
          </div>
        </Form.Item>

        </div>
        </div>
        <Spacer height="30px"/>
        </div>
         */}
        
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
      <div>
         <div style={{ alignContent: 'center' }}>
          
          <h2>Leave Starting Line?</h2>
          
          <Form.Item<FieldType> 
            name="auton_leave_starting_line" 
            valuePropName ="checked"
          >
            <Checkbox 
              className='input_checkbox'
              
            />
          </Form.Item>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Coral Scored L4</h2>
              <Form.Item<FieldType> name="auton_coral_scored_l4" rules={[{ required: true, message: 'Enter # of Coral Score L4' }]}>
                <InputNumber
                  id="auton_coral_scored_l4"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_coral_scored_l4: formValue.auton_coral_scored_l4 + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                    
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_coral_scored_l4) > 0) {
                      setFormValue({ ...formValue, auton_coral_scored_l4: formValue.auton_coral_scored_l4 - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                      
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral Missed L4</h2>
              <Form.Item<FieldType> name="auton_coral_missed_l4" rules={[{ required: true, message: 'Enter # of Coral Missed L4' }]}>
                <InputNumber
                  id="auton_coral_missed_l4"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_coral_missed_l4: formValue.auton_coral_missed_l4 + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_coral_missed_l4) > 0) {
                      setFormValue({ ...formValue, auton_coral_missed_l4: formValue.auton_coral_missed_l4 - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>
            
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Coral Scored L3</h2>
              <Form.Item<FieldType> name="auton_coral_scored_l3" rules={[{ required: true, message: 'Enter # of Coral Scored L3' }]}>
                <InputNumber
                  id="auton_coral_scored_l3"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_coral_scored_l3: formValue.auton_coral_scored_l3 + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_coral_scored_l3) > 0) {
                      setFormValue({ ...formValue, auton_coral_scored_l3: formValue.auton_coral_scored_l3 - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral Missed L3</h2>
              <Form.Item<FieldType> name="auton_coral_missed_l3" rules={[{ required: true, message: 'Enter # of Coral Missed L3' }]}>
                <InputNumber
                  id="auton_coral_missed_l3"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_coral_missed_l3: formValue.auton_coral_missed_l3 + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_coral_missed_l3) > 0) {
                      setFormValue({ ...formValue, auton_coral_missed_l3: formValue.auton_coral_missed_l3 - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>
        
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Coral Scored L2</h2>
              <Form.Item<FieldType> name="auton_coral_scored_l2" rules={[{ required: true, message: 'Enter # of Coral Scored L2' }]}>
                <InputNumber
                  id="auton_coral_scored_l2"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_coral_scored_l2: formValue.auton_coral_scored_l2 + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_coral_scored_l2) > 0) {
                      setFormValue({ ...formValue, auton_coral_scored_l2: formValue.auton_coral_scored_l2 - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral Missed L2</h2>
              <Form.Item<FieldType> name="auton_coral_missed_l2" rules={[{ required: true, message: 'Enter # of Coral Missed L2' }]}>
                <InputNumber
                  id="auton_coral_missed_l2"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_coral_missed_l2: formValue.auton_coral_missed_l2 + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_coral_missed_l2) > 0) {
                      setFormValue({ ...formValue, auton_coral_missed_l2: formValue.auton_coral_missed_l2 - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Coral Scored L1</h2>
              <Form.Item<FieldType> name="auton_coral_scored_l1" rules={[{ required: true, message: 'Enter # of Coral Scored L1' }]}>
                <InputNumber
                  id="auton_coral_scored_l1"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_coral_scored_l1: formValue.auton_coral_scored_l1 + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_coral_scored_l1) > 0) {
                      setFormValue({ ...formValue, auton_coral_scored_l1: formValue.auton_coral_scored_l1 - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral Missed L1</h2>
              <Form.Item<FieldType> name="auton_coral_missed_l1" rules={[{ required: true, message: 'Enter # of Coral Missed L1' }]}>
                <InputNumber
                  id="auton_coral_missed_l1"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_coral_missed_l1: formValue.auton_coral_missed_l1 + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_coral_missed_l1) > 0) {
                      setFormValue({ ...formValue, auton_coral_missed_l1: formValue.auton_coral_missed_l1 - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Algae Scored in Net</h2>
              <Form.Item<FieldType> name="auton_algae_scored_net" rules={[{ required: true, message: 'Enter # of Algae Scored in Net' }]}>
                <InputNumber
                  id="auton_algae_scored_net"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_algae_scored_net: formValue.auton_algae_scored_net + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_algae_scored_net) > 0) {
                      setFormValue({ ...formValue, auton_algae_scored_net: formValue.auton_algae_scored_net - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Algae Missed in Net</h2>
              <Form.Item<FieldType> name="auton_algae_missed_net" rules={[{ required: true, message: 'Enter # of Net Missed in Net' }]}>
                <InputNumber
                  id="auton_algae_missed_net"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_algae_missed_net: formValue.auton_algae_missed_net + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_algae_missed_net) > 0) {
                      setFormValue({ ...formValue, auton_algae_missed_net: formValue.auton_algae_missed_net - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Algae Processor</h2>
              <Form.Item<FieldType> name="auton_algae_scored_processor" rules={[{ required: true, message: 'Enter # of Algae Processor' }]}>
                <InputNumber
                  id="auton_algae_scored_processor"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, auton_algae_scored_processor: formValue.auton_algae_scored_processor + 1 });
                    setAutonPoints(prevPoints => {
                      const newPoints = prevPoints + 1;
                      return newPoints;
                    });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.auton_algae_scored_processor) > 0) {
                      setFormValue({ ...formValue, auton_algae_scored_processor: formValue.auton_algae_scored_processor - 1 });
                      setAutonPoints(prevPoints => {
                        const newPoints = prevPoints - 1;
                        return newPoints;
                      });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>

          </div>
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
          <Flex vertical align='flex-start'>
              <h2>#Coral Score L4</h2>
              <Form.Item<FieldType> name="teleop_coral_scored_l4" rules={[{ required: true, message: 'Enter # of Coral Scored L4' }]}>
                <InputNumber
                  id="teleop_coral_scored_l4"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_coral_scored_l4: formValue.teleop_coral_scored_l4 + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_coral_scored_l4) > 0) {
                      setFormValue({ ...formValue, teleop_coral_scored_l4: formValue.teleop_coral_scored_l4 - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral Missed L4</h2>
              <Form.Item<FieldType> name="teleop_coral_missed_l4" rules={[{ required: true, message: 'Enter # of Coral Missed L4' }]}>
                <InputNumber
                  id="teleop_coral_missed_l4"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_coral_missed_l4: formValue.teleop_coral_missed_l4 + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_coral_missed_l4) > 0) {
                      setFormValue({ ...formValue, teleop_coral_missed_l4: formValue.teleop_coral_missed_l4 - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>
            
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Coral Scored L3</h2>
              <Form.Item<FieldType> name="teleop_coral_scored_l3" rules={[{ required: true, message: 'Enter # of Coral Scored L3' }]}>
                <InputNumber
                  id="teleop_coral_scored_l3"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_coral_scored_l3: formValue.teleop_coral_scored_l3 + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_coral_scored_l3) > 0) {
                      setFormValue({ ...formValue, teleop_coral_scored_l3: formValue.teleop_coral_scored_l3 - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral Missed L3</h2>
              <Form.Item<FieldType> name="teleop_coral_missed_l3" rules={[{ required: true, message: 'Enter # of Coral Missed L3' }]}>
                <InputNumber
                  id="teleop_coral_missed_l3"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_coral_missed_l3: formValue.teleop_coral_missed_l3 + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_coral_missed_l3) > 0) {
                      setFormValue({ ...formValue, teleop_coral_missed_l3: formValue.teleop_coral_missed_l3 - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>
        
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Coral Scored L2</h2>
              <Form.Item<FieldType> name="teleop_coral_scored_l2" rules={[{ required: true, message: 'Enter # of Coral Scored L2' }]}>
                <InputNumber
                  id="teleop_coral_scored_l2"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_coral_scored_l2: formValue.teleop_coral_scored_l2 + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_coral_scored_l2) > 0) {
                      setFormValue({ ...formValue, teleop_coral_scored_l2: formValue.teleop_coral_scored_l2 - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral Missed L2</h2>
              <Form.Item<FieldType> name="teleop_coral_missed_l2" rules={[{ required: true, message: 'Enter # of Coral Missed L2' }]}>
                <InputNumber
                  id="teleop_coral_missed_l2"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_coral_missed_l2: formValue.teleop_coral_missed_l2 + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_coral_missed_l2) > 0) {
                      setFormValue({ ...formValue, teleop_coral_missed_l2: formValue.teleop_coral_missed_l2 - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Coral Scored L1</h2>
              <Form.Item<FieldType> name="teleop_coral_scored_l1" rules={[{ required: true, message: 'Enter # of Coral Scored L1' }]}>
                <InputNumber
                  id="teleop_coral_scored_l1"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_coral_scored_l1: formValue.teleop_coral_scored_l1 + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_coral_scored_l1) > 0) {
                      setFormValue({ ...formValue, teleop_coral_scored_l1: formValue.teleop_coral_scored_l1 - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral Missed L1</h2>
              <Form.Item<FieldType> name="teleop_coral_missed_l1" rules={[{ required: true, message: 'Enter # of Coral Missed L1' }]}>
                <InputNumber
                  id="teleop_coral_missed_l1"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_coral_missed_l1: formValue.teleop_coral_missed_l1 + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_coral_missed_l1) > 0) {
                      setFormValue({ ...formValue, teleop_coral_missed_l1: formValue.teleop_coral_missed_l1 - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Algae Scored in Net</h2>
              <Form.Item<FieldType> name="teleop_algae_scored_net" rules={[{ required: true, message: 'Enter # of Algae Scored in Net' }]}>
                <InputNumber
                  id="teleop_algae_scored_net"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_algae_scored_net: formValue.teleop_algae_scored_net + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_algae_scored_net) > 0) {
                      setFormValue({ ...formValue, teleop_algae_scored_net: formValue.teleop_algae_scored_net - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Algae Missed in Net</h2>
              <Form.Item<FieldType> name="teleop_algae_missed_net" rules={[{ required: true, message: 'Enter # of Net Missed in Net' }]}>
                <InputNumber
                  id="teleop_algae_missed_net"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_algae_missed_net: formValue.teleop_algae_missed_net + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_algae_missed_net) > 0) {
                      setFormValue({ ...formValue, teleop_algae_missed_net: formValue.teleop_algae_missed_net - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Algae Processor</h2>
              <Form.Item<FieldType> name="teleop_algae_scored_processor" rules={[{ required: true, message: 'Enter # of Algae Processor' }]}>
                <InputNumber
                  id="teleop_algae_scored_processor"
                  type='number'
                  pattern="\d*"
                  min={0}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    setFormValue({ ...formValue, teleop_algae_scored_processor: formValue.teleop_algae_scored_processor + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.teleop_algae_scored_processor) > 0) {
                      setFormValue({ ...formValue, teleop_algae_scored_processor: formValue.teleop_algae_scored_processor - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>

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
      { label: "Station", value: "Station" },
      { label: "Ground", value: "Ground" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    // const endgame_coral_station = [
    //   { label: "Top Station", value: "Top Station" },
    //   { label: "Bottom Station", value: "Bottom Station" },
    //   { label: "Both", value: "Both" },
    //   { label: "Neither", value: "Neither"}
    // ];
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

        {/* <h2>Coral Station:</h2>
        <Form.Item name="endgame_coral_station" rules={[{ required: true, message: 'Enter Coral Station' }]}>
        <Select options={endgame_coral_station} className="input" />
        </Form.Item> */}

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
      overall_defense_quality: number;
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

        <h2 style={{ display: defendedIsVisible ? 'inherit' : 'none' }}>Defense Quality (1 - 4):</h2>
        <Form.Item<FieldType> name="overall_defense_quality"style={{ display: defendedIsVisible ? 'inherit' : 'none' }}
            rules={[{required: defendedIsVisible, message : "Please input defene quality!"}]}>
                <InputNumber
                  type='number'
                  pattern="\d*"
                  min={0} max={4}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  className="input"
                  addonAfter={<Button onMouseDown={() => {
                    if (Number(formValue.overall_defense_quality) < 4) {
                      setFormValue({ ...formValue, overall_defense_quality: formValue.overall_defense_quality + 1 });
                    }
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onMouseDown={() => {
                    if (Number(formValue.overall_defense_quality) > 0) {
                      setFormValue({ ...formValue, overall_defense_quality: formValue.overall_defense_quality - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
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
              <h2 className="fieldTitle">Driver Skill</h2>
              <h2 className="fieldTitle">(1 - 4)</h2>
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
        <Flex justify='in-between'>
          <Flex vertical align='flex-start' style={{ display: penaltiesIsVisible ? 'inherit' : 'none'}}>
            <h2>Match</h2>
            <Form.Item<FieldType> name="matchpen" valuePropName="checked" >
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start' style={{ display: penaltiesIsVisible ? 'inherit' : 'none'}}>
            <h2>Tech</h2>
            <Form.Item<FieldType> name="techpen" valuePropName="checked">
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
        </Flex>
        
        <h2>Penalties Incurred</h2>
        <Form.Item<FieldType> name="overall_penalties_incurred" rules={[{ required: penaltiesIsVisible, message: 'Please enter the penalty(s)' }]}>
          <TextArea style={{ verticalAlign: 'center' }} className='textbox_input' />
        </Form.Item>
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
    <div>
    <Header name="Match Scout" back="#scoutingapp" />
      <Form
        form={form}
        initialValues={formDefaultValues}
        onFinish={trySubmit}
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
    </div>
  );
}

export default MatchScout;
