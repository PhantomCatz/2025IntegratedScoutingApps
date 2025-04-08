import '../public/stylesheets/style.css';
import '../public/stylesheets/match.css';
import { useEffect, useState } from 'react';
import { Tabs, Input, Form, Checkbox, InputNumber, Flex, Button, Radio} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Footer } from 'antd/es/layout/layout';
import Header from "./parts/header";
import QrCode, {escapeUnicode, } from './parts/qrCodeViewer';
import {isInPlayoffs, isRoundNumberVisible, getTeamsPlaying, getIndexNumber, getAllianceOffset } from './utils/tbaRequest';
import type { TabsProps, RadioChangeEvent } from "antd";
import { NumberInput, Select } from './parts/formItems';

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
  "overall_defense_quality": 0,
  "overall_counter_defense": 0,
  "overall_driver_skill": 0,
  "overall_num_penalties": 0,
  "overall_major_penalties": 0,
  "overall_minor_penalties": 0,
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
  "overall_defense_quality": 0,
  "overall_counter_defense": 0,
  "overall_driver_skill": 0,
  "overall_major_penalties": 0,
  "overall_minor_penalties": 0,
  "overall_penalties_incurred": "",
  "overall_comments": "Robot did not appear",
  // Playoffs
  //"red_alliance": "",
  //"blue_alliance": "",
}

function MatchScout(props: any) {
  const [form] = Form.useForm();
  // console.log(`form=`, form);
  const [formValue, setFormValue] = useState<any>(formDefaultValues);
  const [roundIsVisible, setRoundIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [tabNum, setTabNum] = useState("1");
  const [team_number, setTeam_number] = useState(0);
  const [teamsList, setTeamsList] = useState<string[]>([]);
  const [qrValue, setQrValue] = useState<any>();
  const [defendedIsVisible, setDefendedIsVisible] = useState(false);
  const [wasDefendedIsVisible, setWasDefendedIsVisible] = useState(false);
  const [penaltiesIsVisible, setPenaltiesIsVisible] = useState(false);
  const [opposingTeamNum, setOpposingTeamNum] = useState([""]);
  const [lastFormValue, setLastFormValue] = useState<any>(null);
  const [inPlayoffs, setInPlayoffs] = useState(false);
  const [robot_appeared, setRobot_appeared] = useState(true);
  const [leftStartPos, setLeftStartPos] = useState(false);
  const [autonPoints, setAutonPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [climbSuccessful, setClimbSuccessful] = useState(false);

  const match_event = process.env.REACT_APP_EVENTNAME;

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  useEffect(() => {
    const updateFields = [
      "match_number",
      "round_number",
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
      "endgame_climb_time",
      "overall_major_penalties",
      "overall_minor_penalties",
      "overall_pushing",
      "overall_defense_quality",
      "overall_counter_defense",
      "overall_driver_skill",
    ];
    for(const field of updateFields) {
      const element = document.getElementById(field);
      if (element === undefined || element === null) {
        continue;
      }

      // try {
      //   const value = (formValue as any)[field] ?? 0;
      //   element.ariaValueNow = value.toString();
      //   form.setFieldValue(field, value);
      // } catch (err) {
      //   console.log(`field=`, field);
      // }
    }
    setClimbSuccessful(form.getFieldValue("endgame_climb_successful"))
  }, [formValue, form]);
  useEffect(() => {
    const robotPosition = form.getFieldValue("robot_position");
    if(!robotPosition) {
      console.log(`robotPosition=`, robotPosition);
      return;
    }
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
  }, [teamsList, form.getFieldValue("robot_position")]);
  
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
      "auton_coral_scored_l4": event.auton_coral_scored_l4 || 0,
      "auton_coral_missed_l4": event.auton_coral_missed_l4 || 0,
      "auton_coral_scored_l3": event.auton_coral_scored_l3 || 0,
      "auton_coral_missed_l3": event.auton_coral_missed_l3 || 0,
      "auton_coral_scored_l2": event.auton_coral_scored_l2 || 0,
      "auton_coral_missed_l2": event.auton_coral_missed_l2 || 0,
      "auton_coral_scored_l1": event.auton_coral_scored_l1 || 0,
      "auton_coral_missed_l1": event.auton_coral_missed_l1 || 0,
      "auton_algae_scored_net": event.auton_algae_scored_net || 0,
      "auton_algae_missed_net": event.auton_algae_missed_net || 0,
      "auton_algae_scored_processor": event.auton_algae_scored_processor || 0,
      // Teleop
      "teleop_coral_scored_l4": event.teleop_coral_scored_l4 || 0,
      "teleop_coral_missed_l4": event.teleop_coral_missed_l4 || 0,
      "teleop_coral_scored_l3": event.teleop_coral_scored_l3 || 0,
      "teleop_coral_missed_l3": event.teleop_coral_missed_l3 || 0,
      "teleop_coral_scored_l2": event.teleop_coral_scored_l2 || 0,
      "teleop_coral_missed_l2": event.teleop_coral_missed_l2 || 0,
      "teleop_coral_scored_l1": event.teleop_coral_scored_l1 || 0,
      "teleop_coral_missed_l1": event.teleop_coral_missed_l1 || 0,
      "teleop_algae_scored_net": event.teleop_algae_scored_net || 0,
      "teleop_algae_missed_net": event.teleop_algae_missed_net || 0,
      "teleop_algae_scored_processor": event.teleop_algae_scored_processor || 0,
      // Endgame
      "endgame_coral_intake_capability": event.endgame_coral_intake_capability,
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
      "overall_defense_quality" : event.overall_defense_quality,
      "overall_counter_defense": event.overall_counter_defense,
      "overall_driver_skill": event.overall_driver_skill,
      "overall_num_penalties": event.overall_num_penalties,
      "overall_tech_penalty": event.overall_tech_penalty,
      "overall_match_penalty": event.overall_match_penalty,
      "overall_penalties_incurred": event.overall_penalties_incurred || "",
      "overall_comments": event.overall_comments || "",
      "robot_appeared": robot_appeared,
    };
    tryFetch(body)
      .then((successful) => {
        if(successful) {
          window.alert("Submit successful.");
        } else {
          window.alert("Submit was not successful. Please show the QR to WebDev.");
        }
      });

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

    setLoading(true);

    try {
      await setNewMatchScout(event);
      const scouter_initials = form.getFieldValue("scouter_initials");
      const match_number = form.getFieldValue("match_number");
      const match_level = form.getFieldValue("match_level");
      const robot_position = form.getFieldValue("robot_position");

      setWasDefendedIsVisible(false);
      setDefendedIsVisible(false);

      form.resetFields();
      setFormValue({...formDefaultValues,
        match_number: Number(match_number) + 1,
      });
      form.setFieldValue("scouter_initials", scouter_initials);
      form.setFieldValue("match_level", match_level);
      form.setFieldValue("robot_position", robot_position);
      setRobot_appeared(true);

      await calculateMatchLevel();
      await updateTeamNumber();
    }
    catch (err) {
      console.log(`err=`, err);
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

        await setTeam_number(teamNumber || 0);
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
  function updatePenalties() {
    const major = form.getFieldValue("overall_major_penalties");
    const minor = form.getFieldValue("overall_minor_penalties");

    const shouldShow = major + minor > 0;
    console.log(`major + minor=`, major + minor);
    console.log(`shouldShow=`, shouldShow);

    setPenaltiesIsVisible(shouldShow);
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

    async function updateNumbers() {
      await calculateMatchLevel();
      await updateTeamNumber();
    }

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
        <Select
          title={"Match Level"}
          name={"match_level"}
          options={rounds}
          onChange={updateNumbers}
        />

        <div className={"playoff-alliances"} style={{ display: inPlayoffs ? 'inherit' : 'none' }}>
          <Select
            title={"Red Alliance"}
            name={"red_alliance"}
            required={inPlayoffs}
            message={"Enter the red alliance"}
            options={playoff_alliances}
            onChange={updateNumbers}
          />
          
          <Select
            title={"Blue Alliance"}
            name={"blue_alliance"}
            required={inPlayoffs}
            message={"Enter the blue alliance"}
            options={playoff_alliances}
            onChange={updateNumbers}
          />
        </div>
        
        <NumberInput
          title={"Match #"}
          name={"match_number"}
          message={"Enter match #"}
          onChange={updateNumbers}
          min={1}
          form={form}
          buttons={false}
          align={"left"}
        />

        <NumberInput
          title={"Round #"}
          name={"round_number"}
          message={"Enter round #"}
          onChange={updateNumbers}
          min={0}
          form={form}
          shown={roundIsVisible}
          align={"left"}
        />

        <Select
          title={"Robot Position"}
          name={"robot_position"}
          message={"Enter robot position"}
          options={robot_position}
          onChange={updateNumbers}
        />

       <Button
         className={"noShowButton"}
         onMouseDown={async () => {
           const confirmed = window.confirm("Are you sure that this robot did not appear?");

           if(!confirmed) {
             return;
            }

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
              form={form}
            />
              
            <NumberInput
              title={"#Coral Missed L4"}
              name={"auton_coral_missed_l4"}
              message={"Enter # coral missed for l4"}
              onIncrease={updateAutonValues}
              form={form}
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
              form={form}
            />
              
            <NumberInput
              title={"#Coral Missed L3"}
              name={"auton_coral_missed_l3"}
              message={"Enter # coral missed for l3"}
              onIncrease={updateAutonValues}
              form={form}
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
              form={form}
            />
              
            <NumberInput
              title={"#Coral Missed L2"}
              name={"auton_coral_missed_l2"}
              message={"Enter # coral missed for l2"}
              onIncrease={updateAutonValues}
              form={form}
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
              form={form}
            />
              
            <NumberInput
              title={"#Coral Missed L1"}
              name={"auton_coral_missed_l1"}
              message={"Enter # coral missed for l1"}
              onIncrease={updateAutonValues}
              form={form}
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
              form={form}
            />
              
            <NumberInput
              title={"#Algae Missed in Net"}
              name={"auton_algae_missed_net"}
              message={"Enter # of algae missed for net"}
              onIncrease={updateAutonValues}
              form={form}
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
              form={form}
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
              form={form}
            />
              
            <NumberInput
              title={"#Coral Missed L4"}
              name={"teleop_coral_missed_l4"}
              message={"Enter # of coral missed for l4"}
              form={form}
            />
          </div>
        </div>
            
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L3"}
              name={"teleop_coral_scored_l3"}
              message={"Enter # of coral scored for l3"}
              form={form}
            />
              
            <NumberInput
              title={"#Coral Missed L3"}
              name={"teleop_coral_missed_l3"}
              message={"Enter # of coral missed for l3"}
              form={form}
            />
          </div>
        </div>
        
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L2"}
              name={"teleop_coral_scored_l2"}
              message={"Enter # of coral scored for l2"}
              form={form}
            />
              
            <NumberInput
              title={"#Coral Missed L2"}
              name={"teleop_coral_missed_l2"}
              message={"Enter # of coral missed for l2"}
              form={form}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Coral Scored L1"}
              name={"teleop_coral_scored_l1"}
              message={"Enter # of coral scored for l1"}
              form={form}
            />
              
            <NumberInput
              title={"#Coral Missed L1"}
              name={"teleop_coral_missed_l1"}
              message={"Enter # of coral missed for l1"}
              form={form}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Algae Scored in Net"}
              name={"teleop_algae_scored_net"}
              message={"Enter # of algae scored for net"}
              form={form}
            />
              
            <NumberInput
              title={"#Algae Missed in Net"}
              name={"teleop_algae_missed_net"}
              message={"Enter # of algae missed for net"}
              form={form}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput
              title={"#Algae Processor"}
              name={"teleop_algae_scored_processor"}
              message={"Enter # of algae scored for processor"}
              form={form}
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
      { label: "Station", value: "Station" },
      { label: "Ground", value: "Ground" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
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
        <Select
          title={"Coral Intake Capability"}
          name={"endgame_coral_intake_capability"}
          message={"Enter coral intake capability"}
          options={endgame_coral_intake_capability}
        />

        <Select
          title={"Algae Intake Capability"}
          name={"endgame_algae_intake_capability"}
          message={"Enter algae intake capability"}
          options={endgame_algae_intake_capability}
        />
        <h2>Climb Successful?</h2>
        <Form.Item<FieldType> name ="endgame_climb_successful" valuePropName="checked">
          <Checkbox
          className='input_checkbox'
          onChange={(x : any) => {
            setClimbSuccessful(x.target.checked);
          }}/>
        </Form.Item>

        <Select
          title={"Climb Type"}
          name={"endgame_climb_type"}
          message={"Enter climb type"}
          options={endgame_climb_type}
        />

        <NumberInput
          title={"Climb Time (Seconds)"}
          name={"endgame_climb_time"}
          message={"Enter climb time (seconds)"}
          form={form}
          min={climbSuccessful ? 1 : 0}
          align={"left"}
        />
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
      overall_match_penalty: string;
      overall_tech_penalty: string;
      overall_penalties_incurred: string;
      overall_pushing: number;
      overall_driver_skill: number;
      overall_counter_defense: number;
      overall_defense_quality: number;
      overall_comments: string;
    };

    const opposingTeams = opposingTeamNum.map((team) => ({ label: team, value: team }));

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

        <div
          style={{
            display: defendedIsVisible ? 'inherit' : 'none' ,
          }}
        >
          <Select
            title={"Defended"}
            name={"overall_defended"}
            required={defendedIsVisible}
            message={"Please select the teams it defended"}
            options={opposingTeams}
            multiple
          />

          <NumberInput
            title={"Defense Quality (1 - 4)"}
            name={"overall_defense_quality"}
            required={defendedIsVisible}
            message={"Please input defense quality"}
            min={0}
            max={4}
            form={form}
          />
        </div>

        <div
          style={{
            display: wasDefendedIsVisible ? 'inherit' : 'none' ,
          }}
        >
          <Select
            title={"Defended By"}
            name={"overall_defended_by"}
            required={wasDefendedIsVisible}
            message={"Please select the teams it was defended by"}
            options={opposingTeams}
            multiple
            shown={wasDefendedIsVisible}
          />
          <NumberInput
            title={<>Counter Defense<br />(1 - 4)</>}
            name={"overall_counter_defense"}
            required={wasDefendedIsVisible}
            message={"Please input the counter-defense rating"}
            min={0}
            max={4}
            form={form}
          />
        </div>

        <Flex justify='in-between'>
          <NumberInput
            title={"Pushing (1 - 4)"}
            name={"overall_pushing"}
            message={"Please input the pushing rating"}
            min={0}
            max={4}
            form={form}
          />
          <NumberInput
            title={"Driver Skill (1 - 4)"}
            name={"overall_driver_skill"}
            message={"Please input the driver skill rating"}
            min={0}
            max={4}
            form={form}
          />
        </Flex>
        <Flex justify='in-between'>
          <NumberInput
            title={"Major Penalties"}
            name={"overall_major_penalties"}
            message={"Enter # of major penalties"}
            min={0}
            onChange={updatePenalties}
            form={form}
          />
          <NumberInput
            title={"Minor Penalties"}
            name={"overall_minor_penalties"}
            message={"Enter # of minor penalties"}
            min={0}
            form={form}
            onChange={updatePenalties}
          />
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
