import '../public/stylesheets/style.css';
import '../public/stylesheets/match.css';
import { useEffect, useState } from 'react';
import { Tabs, Input, Form, Checkbox, Flex, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Footer } from 'antd/es/layout/layout';
import Header from '../parts/header';
import QrCode, {escapeUnicode, } from '../parts/qrCodeViewer';
import {isInPlayoffs, getTeamsPlaying, getIndexNumber, getAllianceOffset, getDivisionsList, getAllianceTags } from '../utils/tbaRequest';
import type { TabsProps, } from "antd";
import { NumberInput, Select } from '../parts/formItems';

namespace Fields {
    export type PreMatch = {
      match_event: string,
      scouter_initials: string,
      match_level: string,
      match_number: number,
      robot_position: string,
      red_alliance: string,
      blue_alliance: string,
      team_override: string,
    };

    export type AutonMatch = {
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

    export type TeleopMatch = {
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

    export type EndgameMatch = {
      endgame_coral_intake_capability: boolean,
      endgame_algae_intake_capability: boolean,
      endgame_climb_successful: boolean,
      endgame_climb_type: boolean,
      endgame_climb_time: number,
    };

    export type OverallMatch = {
      overall_robot_died: boolean;
      overall_defended_others: boolean;
      overall_defended: string;
      overall_was_defended: boolean;
      overall_defended_by: string;
      overall_num_penalties: number;
      overall_match_penalty: string;
      overall_tech_penalty: string;
      overall_penalties_incurred: string;
      overall_pushing: number;
      overall_driver_skill: number;
      overall_major_penalties: number;
      overall_minor_penalties: number;
      overall_counter_defense: number;
      overall_defense_quality: number;
      overall_comments: string;
    };

    export type All = PreMatch | AutonMatch | TeleopMatch | EndgameMatch | OverallMatch;
}

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
};

function MatchScout(props: any) {
  const DEFAULT_MATCH_EVENT = process.env.REACT_APP_EVENTNAME || "";

  if(DEFAULT_MATCH_EVENT === "") {
    console.error("Could not get match event. Check .env");
  }

  const [form] = Form.useForm();
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
  const [climb_successful, setClimbSuccessful] = useState(false);
  const [shouldShowAlliances, setShouldShowAlliances] = useState(false);
  const [match_event, setMatchEvent] = useState<string>(DEFAULT_MATCH_EVENT);
  const [allianceTags, setAllianceTags] = useState(() => getAllianceTags(match_event));

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  useEffect(() => {
    setClimbSuccessful(form.getFieldValue("endgame_climb_successful"))
  }, [form]);

  const currentRobotPosition = form.getFieldValue("robot_position");
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
  }, [teamsList, currentRobotPosition]);
  useEffect(() => {
    updateNumbers();
    setAllianceTags(getAllianceTags(match_event));
  }, [match_event]);

  function setNewMatchScout(event: any) {
    if (team_number === 0) {
      window.alert("Team number is 0, please check in Pre.");
      return;
    }
    const body : any = {
      // Pre-match
      "match_event": match_event,
      "team_number": team_number,
      "scouter_initials": event.scouter_initials.toLowerCase(),
      "match_level": event.match_level,
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
      "overall_major_penalties": event.overall_major_penalties || 0,
      "overall_minor_penalties": event.overall_minor_penalties || 0,
      "overall_penalties_incurred": event.overall_penalties_incurred || "",
      "overall_comments": event.overall_comments || "",
      "robot_appeared": robot_appeared,
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

    // Do not block
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

    setLoading(true);

    try {
      await setNewMatchScout(event);

      const scouter_initials = form.getFieldValue("scouter_initials");
      const match_number = form.getFieldValue("match_number");
      const match_event = form.getFieldValue("match_event");
      const match_level = form.getFieldValue("match_level");
      const robot_position = form.getFieldValue("robot_position");

      form.resetFields();
      form.setFieldValue("match_event", match_event);
      form.setFieldValue("scouter_initials", scouter_initials);
      form.setFieldValue("match_level", match_level);
      form.setFieldValue("match_number", Number(match_number) + 1);
      form.setFieldValue("robot_position", robot_position);

      setRobot_appeared(true);
      setWasDefendedIsVisible(false);
      setDefendedIsVisible(false);

      await updateNumbers();
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

    const inPlayoffs = isInPlayoffs(matchLevel);

    setInPlayoffs(inPlayoffs);
  }
  async function updateNumbers() {
    await calculateMatchLevel();
    await updateTeamNumber();
  }

  function updatePenalties() {
    const major = form.getFieldValue("overall_major_penalties");
    const minor = form.getFieldValue("overall_minor_penalties");

    const shouldShow = major + minor > 0;

    setPenaltiesIsVisible(shouldShow);
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
    const playoff_alliances = allianceTags;

    return (
      <>
        <h2>Team: {team_number}</h2>

        <Select<FieldType>
          title={"Match Event"}
          name={"match_event"}
          options={matchEvents}
          onChange={async (e? : string) => {
            if(e) {
              await setMatchEvent(e);
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
          message={"Enter robot position"}
          options={robot_position}
          onChange={updateNumbers}
        />

        <hr/>
        <div style={{fontSize: "250%", fontWeight: "100"}}>
        Warning! These options should not be used normally!
        </div>
        <NumberInput<FieldType>
          title={"Override Team"}
          name={"team_override"}
          required={false}
          onChange={(e? : number) => {
            if(e) {
              setTeam_number(e);
            } else {
              updateNumbers()
            }
          }}
          min={0}
          form={{
            setFieldValue: () => {},
            getFieldValue: () => {},
          }}
          buttons={false}
          align={"left"}
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
        
      </>
    );
  }
  
  function autonMatch() {
    type FieldType = Fields.AutonMatch;
    
    return (
      <div style={{ alignContent: 'center' }}>
        <h2>Leave Starting Line?</h2>
        <Form.Item<FieldType> name="auton_leave_starting_line" valuePropName="checked">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"A Coral Scored L4"}
              name={"auton_coral_scored_l4"}
              message={"Enter # coral scored for l4 in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"A Coral Missed L4"}
              name={"auton_coral_missed_l4"}
              message={"Enter # coral missed for l4 in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
          </div>
        </div>
            
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"A Coral Scored L3"}
              name={"auton_coral_scored_l3"}
              message={"Enter # coral scored for l3 in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"A Coral Missed L3"}
              name={"auton_coral_missed_l3"}
              message={"Enter # coral missed for l3 in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
          </div>
        </div>
        
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"A Coral Scored L2"}
              name={"auton_coral_scored_l2"}
              message={"Enter # coral scored for l2 in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"A Coral Missed L2"}
              name={"auton_coral_missed_l2"}
              message={"Enter # coral missed for l2 in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"A Coral Scored L1"}
              name={"auton_coral_scored_l1"}
              message={"Enter # coral scored for l1 in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"A Coral Missed L1"}
              name={"auton_coral_missed_l1"}
              message={"Enter # coral missed for l1 in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"A Algae Scored in Net"}
              name={"auton_algae_scored_net"}
              message={"Enter # of algae scored for net in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"A Algae Missed in Net"}
              name={"auton_algae_missed_net"}
              message={"Enter # of algae missed for net in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"A Algae Processor"}
              name={"auton_algae_scored_processor"}
              message={"Enter # of algae scored for processor in Auton"}
              onIncrease={updateAutonValues}
              form={form}
            />
          </div>
        </div>
            
      </div>
    );
  }

  function teleopMatch() {
    type FieldType = Fields.TeleopMatch;

    return (
      <div>
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"T Coral Scored L4"}
              name={"teleop_coral_scored_l4"}
              message={"Enter # of coral scored for l4 in Teleop"}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"T Coral Missed L4"}
              name={"teleop_coral_missed_l4"}
              message={"Enter # of coral missed for l4 in Teleop"}
              form={form}
            />
          </div>
        </div>
            
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"T Coral Scored L3"}
              name={"teleop_coral_scored_l3"}
              message={"Enter # of coral scored for l3 in Teleop"}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"T Coral Missed L3"}
              name={"teleop_coral_missed_l3"}
              message={"Enter # of coral missed for l3 in Teleop"}
              form={form}
            />
          </div>
        </div>
        
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"T Coral Scored L2"}
              name={"teleop_coral_scored_l2"}
              message={"Enter # of coral scored for l2 in Teleop"}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"T Coral Missed L2"}
              name={"teleop_coral_missed_l2"}
              message={"Enter # of coral missed for l2 in Teleop"}
              form={form}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"T Coral Scored L1"}
              name={"teleop_coral_scored_l1"}
              message={"Enter # of coral scored for l1 in Teleop"}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"T Coral Missed L1"}
              name={"teleop_coral_missed_l1"}
              message={"Enter # of coral missed for l1 in Teleop"}
              form={form}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"T Algae Scored in Net"}
              name={"teleop_algae_scored_net"}
              message={"Enter # of algae scored for net in Teleop"}
              form={form}
            />
              
            <NumberInput<FieldType>
              title={"T Algae Missed in Net"}
              name={"teleop_algae_missed_net"}
              message={"Enter # of algae missed for net in Teleop"}
              form={form}
            />
          </div>
        </div>

        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
            <NumberInput<FieldType>
              title={"T Algae Processor"}
              name={"teleop_algae_scored_processor"}
              message={"Enter # of algae scored for processor in Teleop"}
              form={form}
            />
          </div>
        </div>
      </div>
    );
  }
  
  function endgameMatch() {
    type FieldType = Fields.EndgameMatch;
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
        <Select<FieldType>
          title={"Coral Intake Capability"}
          name={"endgame_coral_intake_capability"}
          message={"Enter coral intake capability"}
          options={endgame_coral_intake_capability}
        />

        <Select<FieldType>
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

        <Select<FieldType>
          title={"Climb Type"}
          name={"endgame_climb_type"}
          message={"Enter climb type"}
          options={endgame_climb_type}
        />

        <NumberInput<FieldType>
          title={"Climb Time (Seconds)"}
          name={"endgame_climb_time"}
          message={"Enter climb time (seconds)"}
          form={form}
          min={climb_successful ? 1 : 0}
          align={"left"}
        />
      </>
  )}

  function overallMatch() {
    type FieldType = Fields.OverallMatch;

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
          <Select<FieldType>
            title={"Defended"}
            name={"overall_defended"}
            required={defendedIsVisible}
            message={"Please select the teams it defended"}
            options={opposingTeams}
            multiple
          />

          <NumberInput<FieldType>
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
          <Select<FieldType>
            title={"Defended By"}
            name={"overall_defended_by"}
            required={wasDefendedIsVisible}
            message={"Please select the teams it was defended by"}
            options={opposingTeams}
            multiple
            shown={wasDefendedIsVisible}
          />
          <NumberInput<FieldType>
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
          <NumberInput<FieldType>
            title={"Pushing (1 - 4)"}
            name={"overall_pushing"}
            message={"Please input the pushing rating"}
            min={0}
            max={4}
            form={form}
          />
          <NumberInput<FieldType>
            title={"Driver Skill (1 - 4)"}
            name={"overall_driver_skill"}
            message={"Please input the driver skill rating"}
            min={0}
            max={4}
            form={form}
          />
        </Flex>
        <Flex justify='in-between'>
          <NumberInput<FieldType>
            title={"Major Penalties"}
            name={"overall_major_penalties"}
            message={"Enter # of major penalties"}
            min={0}
            onChange={updatePenalties}
            form={form}
          />
          <NumberInput<FieldType>
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
      children: autonMatch(),
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
      children: overallMatch(),
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
