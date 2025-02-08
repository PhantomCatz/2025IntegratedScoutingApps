import '../public/stylesheets/style.css';
import '../public/stylesheets/match.css';
import field_blue from '../public/images/field_blue.png';
import field_red from '../public/images/field_red.png';
import backpng from '../public/images/back.png'
import { useEffect, useState } from 'react';
import { Tabs, Input, Form, Select, Checkbox, InputNumber, Flex, Button, QRCode } from 'antd';
import type { TabsProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useCookies } from 'react-cookie';
import { Footer } from 'antd/es/layout/layout';
import Header from "antd/es/calendar/Header.js";
import { Radio } from 'antd';

interface SpacerProps {
  height?: string;
  width?: string;
}

const Spacer: React.FC<SpacerProps> = ({ height = '0px', width = '0px' }) => {
  return <div style={{ height, width }} />;
};

function MatchScout(props: any) {
  const [form] = Form.useForm();
  const [color, setColor] = useState(true);
  const [roundIsVisible, setRoundIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [usChecked, setUSChecked] = useState(false);
  const [csChecked, setCSChecked] = useState(false);
  const [lsChecked, setLSChecked] = useState(false);
  const [lChecked, setLChecked] = useState(false);
  const [tabNum, setTabNum] = useState("1");
  const [teamNum, setTeamNum] = useState(0);
  const [qrValue, setQrValue] = useState({}); //placeholder
  const [defendedIsVisible, setDefendedIsVisible] = useState(false);
  const [wasDefendedIsVisible, setWasDefendedIsVisible] = useState(false);
  const [penaltiesIsVisible, setPenaltiesIsVisible] = useState(false);
  const [opposingTeamNum, setOpposingTeamNum] = useState([""]);
  const [startPos, setStartPos] = useState("")
  interface HeaderProps {
    name: string;
    back: string;
  }

  const Header: React.FC<HeaderProps> = ({ name, back }) => {
    return (
      <header style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        <a href={back} style={{ marginRight: '20px' }}>
          <img src={backpng} alt="Back" style={{ width: '48px', height: '64px' }} />
        </a>
        <h1>{name}</h1>
      </header>
    );
  };
  const [formValue, setFormValue] = useState({
    autonL4Scored: 0,
    autonL3Scored: 0,
    autonL2Scored: 0,
    autonL1Scored: 0,
    autonAmpScored: 0,
    autonMissedAmpPieces: 0,
    autonMissedSpeakerPieces: 0,
    teleopSpeakerScored: 0,
    teleopAmpScored: 0,
    teleopMissedAmpPieces: 0,
    teleopMissedSpeakerPieces: 0,
    teleopHoardedPieces: 0,
    numPenalties: 0,
    pushingRating: 0,
    counterDefenseRating: 0,
    driverSkillRating: 0,
  });
  const eventname = process.env.REACT_APP_EVENTNAME;
  useEffect(() => { document.title = props.title; return () => { }; }, [props.title]);
  useEffect(() => {
    if ((document.getElementById("auton_L4scored") as HTMLInputElement) !== null) {
      (document.getElementById("auton_L4scored") as HTMLInputElement).value = formValue.autonL4Scored.toString();
      form.setFieldValue('auton_L4scored', formValue.autonL4Scored);
    }
    if ((document.getElementById("auton_L3scored") as HTMLInputElement) !== null) {
      (document.getElementById("auton_L3scored") as HTMLInputElement).value = formValue.autonL3Scored.toString();
      form.setFieldValue('auton_L3scored', formValue.autonL3Scored);
    }
    if ((document.getElementById("auton_L2scored") as HTMLInputElement) !== null) {
      (document.getElementById("auton_L2scored") as HTMLInputElement).value = formValue.autonL2Scored.toString();
      form.setFieldValue('auton_L2scored', formValue.autonL2Scored);
    }
    if ((document.getElementById("auton_L1scored") as HTMLInputElement) !== null) {
      (document.getElementById("auton_L1scored") as HTMLInputElement).value = formValue.autonL1Scored.toString();
      form.setFieldValue('auton_L1scored', formValue.autonL1Scored);
    }
    if ((document.getElementById("auton_ampscored") as HTMLInputElement) !== null) {
      (document.getElementById("auton_ampscored") as HTMLInputElement).value = formValue.autonAmpScored.toString();
      form.setFieldValue('auton_ampscored', formValue.autonAmpScored);
    }
    if ((document.getElementById("auton_missedpiecesamp") as HTMLInputElement) !== null) {
      (document.getElementById("auton_missedpiecesamp") as HTMLInputElement).value = formValue.autonMissedAmpPieces.toString();
      form.setFieldValue('auton_missedpiecesamp', formValue.autonMissedAmpPieces);
    }
    if ((document.getElementById("auton_missedpiecesspeaker") as HTMLInputElement) !== null) {
      (document.getElementById("auton_missedpiecesspeaker") as HTMLInputElement).value = formValue.autonMissedSpeakerPieces.toString();
      form.setFieldValue('auton_missedpiecesspeaker', formValue.autonMissedSpeakerPieces);
    }
    if ((document.getElementById("tele_speakerscored") as HTMLInputElement) !== null) {
      (document.getElementById("tele_speakerscored") as HTMLInputElement).value = formValue.teleopSpeakerScored.toString();
      form.setFieldValue('tele_speakerscored', formValue.teleopSpeakerScored);
    }
    if ((document.getElementById("tele_ampscored") as HTMLInputElement) !== null) {
      (document.getElementById("tele_ampscored") as HTMLInputElement).value = formValue.teleopAmpScored.toString();
      form.setFieldValue('tele_ampscored', formValue.teleopAmpScored);
    }
    if ((document.getElementById("tele_missedpiecesamp") as HTMLInputElement) !== null) {
      (document.getElementById("tele_missedpiecesamp") as HTMLInputElement).value = formValue.teleopMissedAmpPieces.toString();
      form.setFieldValue('tele_missedpiecesamp', formValue.teleopMissedAmpPieces);
    }
    if ((document.getElementById("tele_missedpiecesspeaker") as HTMLInputElement) !== null) {
      (document.getElementById("tele_missedpiecesspeaker") as HTMLInputElement).value = formValue.teleopMissedSpeakerPieces.toString();
      form.setFieldValue('tele_missedpiecesspeaker', formValue.teleopMissedSpeakerPieces);
    }
    if ((document.getElementById("tele_hoardedpieces") as HTMLElement) !== null) {
      (document.getElementById("tele_hoardedpieces") as HTMLInputElement).value = formValue.teleopHoardedPieces.toString();
      form.setFieldValue('tele_hoardedpieces', formValue.teleopHoardedPieces);
    }
    if ((document.getElementById("numpenalties") as HTMLElement) !== null) {
      (document.getElementById("numpenalties") as HTMLInputElement).value = formValue.numPenalties.toString();
      form.setFieldValue('numpenalties', formValue.numPenalties);
    }
    if ((document.getElementById("pushing") as HTMLElement) !== null) {
      (document.getElementById("pushing") as HTMLInputElement).value = formValue.pushingRating.toString();
      form.setFieldValue('pushing', formValue.pushingRating);
    }
    if ((document.getElementById("counterdefense") as HTMLElement) !== null) {
      (document.getElementById("counterdefense") as HTMLInputElement).value = formValue.counterDefenseRating.toString();
      form.setFieldValue('counterdefense', formValue.counterDefenseRating);
    }
    if ((document.getElementById("driverskill") as HTMLElement) !== null) {
      (document.getElementById("driverskill") as HTMLInputElement).value = formValue.driverSkillRating.toString();
      form.setFieldValue('driverskill', formValue.driverSkillRating);
    }
    return () => {};

  }, [formValue, form]);
  async function setNewMatchScout(event: any) {
    if (teamNum === 0) {
      window.alert("Team number is 0, please check in Pre.");
    }
    else {
      const body = {
        "matchIdentifier": {
          "Initials": event.initials.toLowerCase(),
          "match_event": eventname,
          "match_level": event.matchlevel + (event.roundnum !== undefined ? event.roundnum : ""),
          "match_number": event.matchnum,
          "team_number": teamNum,
          "robot_position": event.robotpos,
          "starting_position": event.startingloc,
        },
        "auto": {
          "auto_preload_scored": false,
          "auto_leave": event.leavespawn,
          "auto_amps_scored": event.auton_ampscored,
          "auto_speaker_scored": formValue.autonL4Scored,
          "auto_scoring_location": event.auton_scoringloc,
          "auto_pieces_picked": event.piecespicked,
          "auto_missed_pieces_amp": event.auton_missedpiecesamp,
          "auto_missed_pieces_speaker": event.auton_missedpiecesspeaker,
        },
        "teleop": {
          "teleop_amps_scored": event.tele_ampscored,
          "teleop_speaker_scored": event.tele_speakerscored,
          "intake": event.intake,
          "teleop_missed_pieces_amp": event.tele_missedpiecesamp,
          "teleop_missed_pieces_speaker": event.tele_missedpiecesspeaker,
          "teleop_scoring_location": event.tele_scoringloc,
          "teleop_shooting_location": event.shootingloc,
          "teleop_hoarded_pieces": event.tele_hoardedpieces,
        },
        "engGame": {
          "EG_climbed": event.climbed,
          "EG_parked": event.parked,
          "EG_trapScored": event.trapscored,
        },
        "overAll": {
          "OA_robot_died": event.robotdied,
          "OA_was_defend": event.wasdefended,
          "OA_was_defend_team": event.wasdefendedteam,
          "OA_defend": event.defended,
          "OA_defend_team": event.defendedteam,
          "OA_numbers_penalties": event.numpenalties,
          "OA_penalties_comments": event.penaltiesincurred,
          "OA_comments": event.comments,
          "OA_driver_skill": event.driverskill,
        }
      };
      // eslint-disable-next-line
      const TESTDONOTREMOVE = {
        "matchIdentifier": {
          "Initials": "test",
          "match_event": "test",
          "match_level": "test",
          "match_number": -1,
          "team_number": -1,
          "robot_position": "test",
          "starting_position": "test"
        },
        "auto": {
          "auto_preload_scored": false,
          "auto_leave": false,
          "auto_amps_scored": -1,
          "auto_speaker_scored": -1,
          "auto_scoring_location": "test",
          "auto_pieces_picked": [],
          "auto_missed_pieces_amp": -1,
          "auto_missed_pieces_speaker": -1,
          "auto_path": "test",
          "auto_total_points": -1,
        },
        "teleop": {
          "teleop_coop_pressed": false,
          "teleop_coop_first": false,
          "teleop_amps_scored": -1,
          "teleop_speaker_scored": -1,
          "teleop_times_amplify": -1,
          "intake": "test",
          "teleop_traverse_stage": false,
          "teleop_missed_pieces_amp": -1,
          "teleop_missed_pieces_speaker": -1,
          "teleop_scoring_location": "test",
          "teleop_total_points": -1,
          "teleop_shooting_location": [],
          "teleop_hoarded_pieces": -1,
          "teleop_path": "test",
        },
        "engGame": {
          "EG_climbed": false,
          "EG_timeLeft_when_climb": -1,
          "EG_parked": false,
          "EG_trapScored": false,
          "EG_harmony": false,
          "EG_mic_score": false,
          "EG_climbing_affect": false,
        },
        "overAll": {
          "OA_hoarded": false,
          "OA_robot_died": false,
          "OA_was_defend": false,
          "OA_was_defend_team": [],
          "OA_defend": false,
          "OA_defend_team": [],
          "OA_pushing_rating": -1,
          "OA_counter_defense": -1,
          "OA_numbers_penalties": -1,
          "OA_penalties_comments": "test",
          "OA_driver_skill": -1,
          "OA_comments": "test",
        }
      };
      const qrBody = [];
      const bodyArray = Object.values(body);
      for (const tabBody in bodyArray) {
        const value = Object.values(bodyArray[tabBody]);
        for (const data in value) {
          qrBody.push(value[data]);
        }
      }
      try {
        // if (!window.navigator.onLine) {
        //   window.alert("Your device is offline; please download the following .json file and give it to a Webdev member.");
        //   saveAs(new Blob([JSON.stringify(body)], { type: "text/json" }), event.initials + event.matchnum + ".json");
        // }
        // else {
        //   await fetch(process.env.REACT_APP_MATCH_URL as string, {
        //     method: "POST",
        //     body: JSON.stringify(body),
        //     headers: {
        //       "Content-Type": "application/json",
        //     }
        //   })
        //     .then(async (response) => await response.json()).then(async (data) => {
        //       window.alert("Successfully submitted with ID: " + data.match.insertedId);
        //       // saveAs(new Blob([JSON.stringify(body)], { type: "text/json" }), event.initials + event.matchnum + ".json");
        //     });
        // }
        setQrValue(qrBody);
      }
      catch (err) {
        console.log(err);
        window.alert("Error occured, please do not do leave this message, download the file (not a virus), and notify a Webdev member!");
        window.alert(err);
        // saveAs(new Blob([JSON.stringify(body)], { type: "text/json" }), event.initials + event.matchnum + ".json");
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
        setColor((team_color === "red" ? true : false));
        const team_num = form.getFieldValue('robotpos').substring(form.getFieldValue('robotpos').indexOf('_') + 1) - 1;
        const fullTeam = (data.alliances[team_color].team_keys[team_num] !== null ? data.alliances[team_color].team_keys[team_num] : 0);
        setTeamNum(Number(fullTeam.substring(3)));
        await updateDefendedList();
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
        setColor((team_color === "red" ? true : false));
        const team_num = form.getFieldValue('robotpos').substring(form.getFieldValue('robotpos').indexOf('_') + 1) - 1;
        const fullTeam = (data.alliances[team_color].team_keys[team_num] !== null ? data.alliances[team_color].team_keys[team_num] : 0);
        setTeamNum(Number(fullTeam.substring(3)));
        await updateDefendedList();
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
  async function updateDefendedList() {
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
        let result: any[] = [];
        for (const team in data.alliances[color ? 'red' : 'blue'].team_keys) {
          result.push(data.alliances[color ? 'blue' : 'red'].team_keys[team].substring(3));
        }
        setOpposingTeamNum(result);
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
        let result: any[] = [];
        for (const team in data.alliances[color ? 'red' : 'blue'].team_keys) {
          result.push(data.alliances[color ? 'blue' : 'red'].team_keys[team].substring(3));
        }
        setOpposingTeamNum(result);
      }
    }
    catch (err) {
    }
  }
  function preMatch() {
    type FieldType = {
      initials: string,
      matchlevel: string,
      matchnum: number,
      robotpos: string,
      preloaded: boolean,
      roundnum: number,
    };
    const rounds = [
      { label: "Qualifications", value: "qm" },
      { label: "Semi-Finals", value: "sf" },
      { label: "Quarter-Finals", value: "qf" },
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
        <Form.Item<FieldType> name="initials" rules={[{ required: true, message: 'Enter initials' }]}>
          <Input maxLength={2} className="input" />
        </Form.Item>
        <h2>Match #</h2>
        <Form.Item<FieldType> name="matchnum" rules={[{ required: true, message: 'Enter match #' }]}>
          <InputNumber min={1} onChange={updateTeamNumber} className="input" type='number' pattern="\d*" onWheel={(event) => (event.target as HTMLElement).blur()} />
        </Form.Item>
        <h2>Match Level:</h2>
        <Form.Item<FieldType> name="matchlevel" rules={[{ required: true, message: 'Enter match level' }]}>
          <Select options={rounds} onChange={() => { calculateMatchLevel(); updateTeamNumber(); }} className="input" />
        </Form.Item>
        <h2 style={{ display: roundIsVisible ? 'inherit' : 'none' }}>Round #</h2>
        <Form.Item<FieldType> name="roundnum" rules={[{ required: roundIsVisible ? true : false, message: 'Enter round #' }]} style={{ display: roundIsVisible ? 'inherit' : 'none' }}>
          <InputNumber min={1} onChange={updateTeamNumber} style={{ display: roundIsVisible ? 'inherit' : 'none' }} className="input" type='number' pattern="\d*" onWheel={(event) => (event.target as HTMLElement).blur()} />
        </Form.Item>
        <h2>Robot Position:</h2>
        <Form.Item<FieldType> name="robotpos" rules={[{ required: true, message: 'Enter robot position' }]}>
          <Select options={robotpos} onChange={updateTeamNumber} className="input" />
        </Form.Item>
        <div className = 'divdivdiv'> 
        <div className = 'radioRow'> 
          <div className = 'radioColumn'>
            
          <Spacer height = "125px"/>
            <div className = 'radioLabel'>
              <h3>B&Sigma;1</h3>
              <input type = "radio" name = "startPos" value = "B&Sigma;1" className = "startPos"/>
            </div>

            <div className = 'radioLabel'>
              <h3>B&Sigma;2</h3>
              <input type = "radio" name = "startPos" value = "B&Sigma;2" className = "startPos"/>
            </div>

            <div className = 'radioLabel'>
              <h3>B&Sigma;3</h3>
              <input type = "radio" name = "startPos" value = "B&Sigma;3" className = "startPos"/>
            </div>

          </div>
          
          <Spacer width = "30px"/>
          <div className = "boxes">
            <div className = 'blueBox'></div>
            <div className = 'redBox'></div>
          </div>
          <Spacer width = "30px"/>

          <div className = 'radioColumn'>
            
          <Spacer height = "125px"/>
            <div className = 'radioLabel'>
              <input type = "radio" name = "startPos" value = "R&Sigma;1" className = "startPos"/>
              <h3>R&Sigma;1</h3>
            </div>

            <div className = 'radioLabel'>
              <input type = "radio" name = "startPos" value = "R&Sigma;2" className = "startPos"/>
              <h3>R&Sigma;2</h3>
            </div>

            <div className = 'radioLabel'>
              <input type = "radio" name = "startPos" value = "R&Sigma;3" className = "startPos"/>
              <h3>R&Sigma;3</h3>
            </div>
            
          </div>
        </div>
        <Spacer height = "30px"/>
        </div>
        
        
      </div>
    );
  }
  function autonMatch() {
    type FieldType = {
      auton_L4scored: number,
      auton_L3scored: number,
      auton_L2scored: number,
      auton_L1scored: number,
      auton_netscored: number,
      auton_processorscored: number,
      auton_missedpiecesamp: number,
      auton_missedpiecesspeaker: number,
      leavespawn: boolean,
      auton_scoringloc: string,
      preloadscored: boolean,
      piecespicked?: string,
      auton_comments: string,
      imagepath: string,
      startingloc: string,
    };
    return (
      <div>
         <div style={{ alignContent: 'center' }}>
          
          <h2>Leave Starting Line?</h2>
          <Form.Item<FieldType> name="leavespawn" valuePropName="checked">
            <Checkbox className='input_checkbox' />
          </Form.Item>
        <div className = 'radioRColumn'> 
          <div className = 'radioRow'>
          <Flex vertical align='flex-start'>
              <h2>#Coral L4</h2>
              <Form.Item<FieldType> name="auton_L4scored" rules={[{ required: true, message: 'Enter # of scored speaker pieces' }]}>
                <InputNumber
                  id="auton_L4scored"
                  type='number'
                  pattern="\d*"
                  disabled
                  onWheel={(event) => (event.target as HTMLInputElement).blur()}
                  min={0}
                  className="input"
                  addonAfter={<Button onClick={() => {
                    setFormValue({ ...formValue, autonL4Scored: formValue.autonL4Scored + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onClick={() => {
                    if (Number(formValue.autonL4Scored) > 0) {
                      setFormValue({ ...formValue, autonL4Scored: formValue.autonL4Scored - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral L3</h2>
              <Form.Item<FieldType> name="auton_L3scored" rules={[{ required: true, message: 'Enter # of scored speaker pieces' }]}>
                <InputNumber
                  id="auton_L3scored"
                  type='number'
                  pattern="\d*"
                  disabled
                  onWheel={(event) => (event.target as HTMLInputElement).blur()}
                  min={0}
                  className="input"
                  addonAfter={<Button onClick={() => {
                    setFormValue({ ...formValue, autonL3Scored: formValue.autonL3Scored + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onClick={() => {
                    if (Number(formValue.autonL3Scored) > 0) {
                      setFormValue({ ...formValue, autonL3Scored: formValue.autonL3Scored - 1 });
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
              <h2>#Coral L2</h2>
              <Form.Item<FieldType> name="auton_L2scored" rules={[{ required: true, message: 'Enter # of scored speaker pieces' }]}>
                <InputNumber
                  id="auton_L2scored"
                  type='number'
                  pattern="\d*"
                  disabled
                  onWheel={(event) => (event.target as HTMLInputElement).blur()}
                  min={0}
                  className="input"
                  addonAfter={<Button onClick={() => {
                    setFormValue({ ...formValue, autonL2Scored: formValue.autonL2Scored + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onClick={() => {
                    if (Number(formValue.autonL2Scored) > 0) {
                      setFormValue({ ...formValue, autonL2Scored: formValue.autonL2Scored - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            
          <Flex vertical align='flex-start'>
              <h2>#Coral L1</h2>
              <Form.Item<FieldType> name="auton_L1scored" rules={[{ required: true, message: 'Enter # of scored speaker pieces' }]}>
                <InputNumber
                  id="auton_L1scored"
                  type='number'
                  pattern="\d*"
                  disabled
                  onWheel={(event) => (event.target as HTMLInputElement).blur()}
                  min={0}
                  className="input"
                  addonAfter={<Button onClick={() => {
                    setFormValue({ ...formValue, autonL1Scored: formValue.autonL1Scored + 1 });
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onClick={() => {
                    if (Number(formValue.autonL1Scored) > 0) {
                      setFormValue({ ...formValue, autonL1Scored: formValue.autonL1Scored - 1 });
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
      tele_speakerscored: number,
      tele_ampscored: number,
      intake: string,
      shootingloc: string,
      cooppressed: boolean,
      cooppressed1st: boolean,
      traversedstage: boolean,
      tele_missedpiecesamp: number,
      tele_missedpiecesspeaker: number,
      tele_hoardedpieces: number,
      timesamplified: number,

      climbed: boolean,
      climbingaffected: boolean,
      parked: boolean,
      trapscored: boolean,
    };
    return (
      <div>
        <div style={{position: 'relative', width: 'min-content'}}>
            <img src={color ? field_red : field_blue} alt="" />
            <Checkbox id="us" onChange={(event) => {event.target.checked ? setUSChecked(true) : setUSChecked(false); setCSChecked(false); setLSChecked(false); setLChecked(false);}} checked={usChecked} style={color ? {position: 'absolute', right: '3.5%', top: '6%'} : {position: 'absolute', left: '3.5%', top: '6%'}} className='map_checkbox' />
            <Checkbox id="cs" onChange={(event) => {event.target.checked ? setCSChecked(true) : setCSChecked(false); setUSChecked(false); setLSChecked(false); setLChecked(false);}} checked={csChecked} style={color ? {position: 'absolute', right: '13.5%', top: '35%'} : {position: 'absolute', left: '13.5%', top: '35%'}} className='map_checkbox' />
            <Checkbox id="ls" onChange={(event) => {event.target.checked ? setLSChecked(true) : setLSChecked(false); setCSChecked(false); setUSChecked(false); setLChecked(false);}} checked={lsChecked} style={color ? {position: 'absolute', right: '3.5%', top: '50%'} : {position: 'absolute', left: '3.5%', top: '50%'}} className='map_checkbox' />
            <Checkbox id="l" onChange={(event) => {event.target.checked ? setLChecked(true) : setLChecked(false); setCSChecked(false); setLSChecked(false); setUSChecked(false);}} checked={lChecked} style={color ? {position: 'absolute', right: '3.5%', top: '70.5%'} : {position: 'absolute', left: '3.5%', top: '70.5%'}} className='map_checkbox' />

            <Checkbox style={color ? {position: 'absolute', right: '30.75%', top: '12.5%'} : {position: 'absolute', left: '30.75%', top: '12.5%'}} className='map_checkbox' />
            <Checkbox style={color ? {position: 'absolute', right: '30.75%', top: '30%'} : {position: 'absolute', left: '30.75%', top: '30%'}} className='map_checkbox' />
            <Checkbox style={color ? {position: 'absolute', right: '30.75%', top: '47.5%'} : {position: 'absolute', left: '30.75%', top: '47.5%'}} className='map_checkbox' />

            <Checkbox style={color ? {position: 'absolute', left: '0.05%', top: '7.5%'} : {position: 'absolute', right: '0.05%', top: '7.5%'}} className='map_checkbox' />
            <Checkbox style={color ? {position: 'absolute', left: '0.05%', top: '27.5%'} : {position: 'absolute', right: '0.05%', top: '27.5%'}} className='map_checkbox' />
            <Checkbox style={color ? {position: 'absolute', left: '0.05%', top: '47.5%'} : {position: 'absolute', right: '0.05%', top: '47.5%'}} className='map_checkbox' />
            <Checkbox style={color ? {position: 'absolute', left: '0.05%', top: '67.5%'} : {position: 'absolute', right: '0.05%', top: '67.5%'}} className='map_checkbox' />
            <Checkbox style={color ? {position: 'absolute', left: '0.05%', top: '87.5%'} : {position: 'absolute', right: '0.05%', top: '87.5%'}} className='map_checkbox' />
        </div>
          <Flex vertical align='flex-start'>
            <h2># Speaker</h2>
            <Form.Item<FieldType> name="tele_speakerscored" rules={[{ required: true, message: 'Enter # of scored speaker pieces' }]}>
              <InputNumber
                type='number'
                pattern="\d*"
                disabled
                onWheel={(event) => (event.target as HTMLElement).blur()}
                min={0}
                className="input"
                addonAfter={<Button onClick={() => {
                  setFormValue({ ...formValue, teleopSpeakerScored: formValue.teleopSpeakerScored + 1 });
                }} className='incrementbutton'>+</Button>}
                addonBefore={<Button onClick={() => {
                  if (Number(formValue.teleopSpeakerScored) > 0) {
                    setFormValue({ ...formValue, teleopSpeakerScored: formValue.teleopSpeakerScored - 1 });
                  }
                }} className='decrementbutton'>-</Button>}
              />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h2># Missed</h2>
            <Form.Item<FieldType> name="tele_missedpiecesspeaker" rules={[{ required: true, message: 'Enter # of missed speaker pieces' }]}>
              <InputNumber
                type='number'
                pattern="\d*"
                disabled
                onWheel={(event) => (event.target as HTMLElement).blur()}
                min={0}
                className="input"
                addonAfter={<Button onClick={() => {
                  setFormValue({ ...formValue, teleopMissedSpeakerPieces: formValue.teleopMissedSpeakerPieces + 1 });
                }} className='incrementbutton'>+</Button>}
                addonBefore={<Button onClick={() => {
                  if (Number(formValue.teleopMissedSpeakerPieces) > 0) {
                    setFormValue({ ...formValue, teleopMissedSpeakerPieces: formValue.teleopMissedSpeakerPieces - 1 });
                  }
                }} className='decrementbutton'>-</Button>}
              />
            </Form.Item>
          </Flex>
        <Flex justify='in-between'>
          <Flex vertical align='flex-start'>
            <h2># Amp</h2>
            <Form.Item<FieldType> name="tele_ampscored" rules={[{ required: true, message: 'Enter # of scored amp pieces' }]}>
              <InputNumber
                type='number'
                pattern="\d*"
                disabled
                onWheel={(event) => (event.target as HTMLElement).blur()}
                min={0}
                className="input"
                addonAfter={<Button onClick={() => {
                  setFormValue({ ...formValue, teleopAmpScored: formValue.teleopAmpScored + 1 });
                }} className='incrementbutton'>+</Button>}
                addonBefore={<Button onClick={() => {
                  if (Number(formValue.teleopAmpScored) > 0) {
                    setFormValue({ ...formValue, teleopAmpScored: formValue.teleopAmpScored - 1 });
                  }
                }} className='decrementbutton'>-</Button>}
              />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h2># Missed</h2>
            <Form.Item<FieldType> name="tele_missedpiecesamp" rules={[{ required: true, message: 'Enter # of missed amp pieces' }]}>
              <InputNumber
                type='number'
                pattern="\d*"
                disabled
                onWheel={(event) => (event.target as HTMLElement).blur()}
                min={0}
                className="input"
                addonAfter={<Button onClick={() => {
                  setFormValue({ ...formValue, teleopMissedAmpPieces: formValue.teleopMissedAmpPieces + 1 });
                }} className='incrementbutton'>+</Button>}
                addonBefore={<Button onClick={() => {
                  if (Number(formValue.teleopMissedAmpPieces) > 0) {
                    setFormValue({ ...formValue, teleopMissedAmpPieces: formValue.teleopMissedAmpPieces - 1 });
                  }
                }} className='decrementbutton'>-</Button>}
              />
            </Form.Item>
          </Flex>
        </Flex>
        <h2># Hoarded</h2>
        <Form.Item<FieldType> name="tele_hoardedpieces" rules={[{ required: false }]}>
          <InputNumber
            type='number'
            pattern="\d*"
            disabled
            onWheel={(event) => (event.target as HTMLElement).blur()}
            min={0}
            className="input"
            addonAfter={<Button onClick={() => {
              setFormValue({ ...formValue, teleopHoardedPieces: formValue.teleopHoardedPieces + 1 });
            }} className='incrementbutton'>+</Button>}
            addonBefore={<Button onClick={() => {
              if (Number(formValue.teleopHoardedPieces) > 0) {
                setFormValue({ ...formValue, teleopHoardedPieces: formValue.teleopHoardedPieces - 1 });
              }
            }} className='decrementbutton'>-</Button>}
          />
        </Form.Item>
        <Flex justify='in-between'>
          <Flex vertical align='flex-start'>
            <h2>Climbed?</h2>
            <Form.Item<FieldType> name="climbed" valuePropName="checked">
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
          <h2>Trap?</h2>
            <Form.Item<FieldType> name="trapscored" valuePropName="checked">
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h2>Parked?</h2>
            <Form.Item<FieldType> name="parked" valuePropName="checked">
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
        </Flex>
      </div>
    );
  }
  function overall() {
    type FieldType = {
      robotdied: boolean;
      defended: boolean;
      defendedteam: string;
      hoarded: boolean;
      wasdefended: boolean;
      wasdefendedteam: string;
      numpenalties: number;
      penaltiesincurred: string;
      comments: string;
      matchpen: string;
      techpen: string;
      pushing: number;
      driverskill: number;
      counterdefense: number;
    };
    return (
      <div className='matchbody'>
        <Flex justify='in-between'>
          <Flex vertical align='flex-start'>
            <h2>Robot died?</h2>
            <Form.Item<FieldType> name="robotdied" valuePropName="checked">
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h2>Defended others?</h2>
            <Form.Item<FieldType> name="defended" valuePropName="checked">
              <Checkbox className='input_checkbox' onChange={() => { updateDefendedList(); setDefendedIsVisible(!defendedIsVisible); }} />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h2>Was defended?</h2>
            <Form.Item<FieldType> name="wasdefended" valuePropName="checked">
              <Checkbox className='input_checkbox' onChange={() => { updateDefendedList(); setWasDefendedIsVisible(!wasDefendedIsVisible); }} />
            </Form.Item>
          </Flex>
        </Flex>
        <Flex justify='in-between'>
            <Flex vertical align='flex-start'>
              <h2>Pushing (1-4) (0 if N/A)</h2>
              <Form.Item<FieldType> name="pushing" rules={[{ required: true, message: 'Please input the pushing rating!' }]}>
                <InputNumber
                  type='number'
                  pattern="\d*"
                  onWheel={(event) => (event.target as HTMLElement).blur()}
                  min={0} max={4}
                  className="input"
                  addonAfter={<Button onClick={() => {
                    if (Number(formValue.pushingRating) < 4) {
                      setFormValue({ ...formValue, pushingRating: formValue.pushingRating + 1 });
                    }
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onClick={() => {
                    if (Number(formValue.pushingRating) > 0) {
                      setFormValue({ ...formValue, pushingRating: formValue.pushingRating - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            <Flex vertical align='flex-start'>
              <h2>Count. Defense (1-4) (0 if N/A)</h2>
              <Form.Item<FieldType> name="counterdefense" rules={[{ required: true, message: 'Please input the counterdefense rating!' }]}>
                <InputNumber
                  type='number'
                  pattern="\d*"
                  onWheel={(event) => (event.target as HTMLElement).blur()}
                  min={0} max={4}
                  className="input"
                  addonAfter={<Button onClick={() => {
                    if (Number(formValue.counterDefenseRating) < 4) {
                      setFormValue({ ...formValue, counterDefenseRating: formValue.counterDefenseRating + 1 });
                    }
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onClick={() => {
                    if (Number(formValue.counterDefenseRating) > 0) {
                      setFormValue({ ...formValue, counterDefenseRating: formValue.counterDefenseRating - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex justify='in-between'>
            <Flex vertical align='flex-start'>
              <h2>Driver Skill (1-4) (0 if N/A)</h2>
              <Form.Item<FieldType> name="driverskill" rules={[{ required: true, message: 'Please input the driverskill rating!' }]}>
                <InputNumber
                  type='number'
                  pattern="\d*"
                  onWheel={(event) => (event.target as HTMLElement).blur()}
                  min={0} max={4}
                  className="input"
                  addonAfter={<Button onClick={() => {
                    if (Number(formValue.driverSkillRating) < 4) {
                      setFormValue({ ...formValue, driverSkillRating: formValue.driverSkillRating + 1 });
                    }
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onClick={() => {
                    if (Number(formValue.driverSkillRating) > 0) {
                      setFormValue({ ...formValue, driverSkillRating: formValue.driverSkillRating - 1 });
                    }
                  }} className='decrementbutton'>-</Button>}
                />
              </Form.Item>
            </Flex>
            <Flex vertical align='flex-start'>
            <h2>Number of Penalties</h2>
              <Form.Item<FieldType> name="numpenalties" rules={[{ required: true, message: 'Enter # of incurred penalties' }]}>
                <InputNumber
                  type='number'
                  pattern="\d*"
                  disabled
                  onWheel={(event) => (event.target as HTMLElement).blur()}
                  min={0}
                  className="input"
                  addonAfter={<Button onClick={() => {
                    setFormValue({ ...formValue, numPenalties: formValue.numPenalties + 1 });
                    setPenaltiesIsVisible(true);
                  }} className='incrementbutton'>+</Button>}
                  addonBefore={<Button onClick={() => {
                    if (Number(formValue.numPenalties) > 0) {
                      setFormValue({ ...formValue, numPenalties: formValue.numPenalties - 1 });
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
          <Flex vertical align='flex-start'>
            <h2 style={{display: penaltiesIsVisible ? 'inherit' : 'none'}}>Match</h2>
            <Form.Item<FieldType> name="matchpen" valuePropName="checked" style={{ display: penaltiesIsVisible ? 'inherit' : 'none'}}>
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
          <Flex vertical align='flex-start'>
            <h2 style={{display: penaltiesIsVisible ? 'inherit' : 'none'}}>Tech</h2>
            <Form.Item<FieldType> name="techpen" valuePropName="checked" style={{ display: penaltiesIsVisible ? 'inherit' : 'none'}}>
              <Checkbox className='input_checkbox' />
            </Form.Item>
          </Flex>
        </Flex>
        <h2 style={{ display: defendedIsVisible ? 'inherit' : 'none' }}>Defended:</h2>
        <Form.Item<FieldType> name="defendedteam" valuePropName="checked" style={{ display: defendedIsVisible ? 'inherit' : 'none' }}>
          <Select mode='multiple' options={opposingTeamNum.map((team) => ({ label: team, value: team }))} className="input" showSearch={false} style={{ display: defendedIsVisible ? 'inherit' : 'none' }} />
        </Form.Item>
        <h2 style={{ display: wasDefendedIsVisible ? 'inherit' : 'none' }}>Defended By:</h2>
        <Form.Item<FieldType> name="wasdefendedteam" valuePropName="checked" style={{ display: wasDefendedIsVisible ? 'inherit' : 'none' }}>
          <Select mode='multiple' options={opposingTeamNum.map((team) => ({ label: team, value: team }))} className="input" showSearch={false} style={{ display: wasDefendedIsVisible ? 'inherit' : 'none' }} />
        </Form.Item>
        <h2>Penalties Incurred</h2>
        <Form.Item<FieldType> name="penaltiesincurred">
          <TextArea style={{ verticalAlign: 'center' }} className='textbox_input' />
        </Form.Item>
        <h2>Comments</h2>
        <Form.Item<FieldType> name="comments">
          <TextArea style={{ verticalAlign: 'center' }} className='textbox_input' />
        </Form.Item>
        {JSON.stringify(qrValue) !== "{}" && (
          <QRCode value={JSON.stringify(qrValue)} bgColor="transparent" color='black' style={{ width: '100%', height: '100%', marginBottom: '5%' }} />
        )} 
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
      label: 'Overall',
      children: overall(),
    },
  ];
  return (
    <div>
		<Header name ="Match Scout" back="/scoutingapp" />
      <Form
        form={form}
        initialValues={{
          leavespawn: false,
          amplifyscored: false,
          traversedstage: false,
          climbed: false,
          harmony: false,
          climbingaffected: false,
          parked: false,
          trapscored: false,
          robotdied: false,
          defended: false,
          wasdefended: false,
          wasdefendedteam: [],
          defendedteam: [],
          piecespicked: [],
          shootingloc: [],
          penaltiesincurred: "",
          comments: "",
        }}
        onFinish={async (event) => {
          try {
            setLoading(true);
            await setNewMatchScout(event);
            setFormValue({
              autonL4Scored: 0,
              autonL3Scored: 0,
              autonL2Scored: 0,
              autonL1Scored: 0,
              autonAmpScored: 0,
              autonMissedAmpPieces: 0,
              autonMissedSpeakerPieces: 0,
              teleopSpeakerScored: 0,
              teleopAmpScored: 0,
              teleopMissedAmpPieces: 0,
              teleopMissedSpeakerPieces: 0,
              teleopHoardedPieces: 0,
              numPenalties: 0,
              counterDefenseRating: 0,
              driverSkillRating: 0,
              pushingRating: 0,
            });
            const initials = form.getFieldValue("initials");
            const matchnum = form.getFieldValue("matchnum");
            const matchlevel = form.getFieldValue("matchlevel");
            const robotpos = form.getFieldValue("robotpos");
            form.resetFields();
            form.setFieldValue("initials", initials);
            form.setFieldValue("matchnum", matchnum + 1);
            form.setFieldValue("matchlevel", matchlevel);
            form.setFieldValue("robotpos", robotpos);
            setWasDefendedIsVisible(false);
            setDefendedIsVisible(false);
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
        }}
      >
        <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} className='tabs' centered onChange={async (key) => { setTabNum(key) }} />
        <Footer style={{ position: "sticky", bottom: "0" }}>
          <Flex justify='in-between' id={"footer"} style={{ paddingBottom: '5%', backgroundColor: document.body.style.backgroundColor.toString() }}>
            {Number(tabNum) !== 1 && (
              <Button onClick={async () => { setTabNum((Number(tabNum) - 1).toString()) }} className='tabbutton'>Back</Button>
            )}
            {Number(tabNum) !== items.length && (
              <Button onClick={async () => { setTabNum((Number(tabNum) + 1).toString()) }} className='tabbutton'>Next</Button>
            )}
            {Number(tabNum) === items.length && (
              <Input type="submit" value="Submit" className='match_submit' />
            )}
          </Flex>
          <h2 style={{ display: isLoading ? 'inherit' : 'none' }}>Submitting data...</h2>
        </Footer>
      </Form>
    </div>
  );
}

export default MatchScout;