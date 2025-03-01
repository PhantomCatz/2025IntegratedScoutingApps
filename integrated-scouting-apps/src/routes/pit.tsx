import '../public/stylesheets/style.css';
import '../public/stylesheets/pit.css';
import '../public/stylesheets/match.css';
import { Checkbox, Form, Input, InputNumber, Select, Upload } from 'antd';
import { useRef } from 'react';
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import TextArea from 'antd/es/input/TextArea';
import Header from './header';
import QrCode from './qrCodeViewer';
import {getAllTeams, getTeamsNotScouted} from './utils/tbaRequest';

const formDefaultValues = {
  "match_event": null,
  "team_number": 0,
  "scouter_initials": null,
  "robot_weight": 0,
  "drive_train_type": null,
  "motor_type": null,
  "number_of_motors": 0,
  "wheel_type": null,
  "coral_intake_capability": null,
  "coral_scoring_l1": false,
  "coral_scoring_l2": false,
  "coral_scoring_l3": false,
  "coral_scoring_l4": false,
  "algae_intake_capability": null,
  "algae_scoring_capability": null,
  "climbing_capability": null,
  "pit_organization": 0,
  "team_safety": 0,
  "team_workmanship": 0,
  "gracious_professionalism": 0,
  "comments": null,
}

function PitScout(props: any) {
  const match_event = process.env.REACT_APP_EVENTNAME as string;
  const imageURI = useRef<string>();
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [robotImageURI] = useState([""]);
  const [formValue, setFormValue] = useState(formDefaultValues);
  const [qrValue, setQrValue] = useState<any>();
  const [robotWeight, setRobotWeight] = useState(0);

  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  useEffect(() => {
    if ((document.getElementById("robot_weight") as HTMLInputElement) !== null) {
      (document.getElementById("robot_weight") as HTMLInputElement).value = robotWeight.toString();
      form.setFieldValue('robot_weight', robotWeight);
    }
    if ((document.getElementById("number_of_motors") as HTMLInputElement) !== null) {
      (document.getElementById("number_of_motors") as HTMLInputElement).value = formValue.number_of_motors.toString();
      form.setFieldValue('number_of_motors', formValue.number_of_motors);
    }
    if ((document.getElementById("pit_organization") as HTMLInputElement) !== null) {
      (document.getElementById("pit_organization") as HTMLInputElement).value = formValue.pit_organization.toString();
      form.setFieldValue('pit_organization', formValue.pit_organization);
    }
    if ((document.getElementById("team_safety") as HTMLInputElement) !== null) {
      (document.getElementById("team_safety") as HTMLInputElement).value = formValue.team_safety.toString();
      form.setFieldValue('team_safety', formValue.team_safety);
    }
    if ((document.getElementById("team_workmanship") as HTMLInputElement) !== null) {
      (document.getElementById("team_workmanship") as HTMLInputElement).value = formValue.team_workmanship.toString();
      form.setFieldValue('team_workmanship', formValue.team_workmanship);
    }
    if ((document.getElementById("gracious_professionalism") as HTMLInputElement) !== null) {
      (document.getElementById("gracious_professionalism") as HTMLInputElement).value = formValue.gracious_professionalism.toString();
      form.setFieldValue('gracious_professionalism', formValue.gracious_professionalism);
    }
    return () => { };
  }, [formValue, form, robotWeight]);
  useEffect(() => {
    (async function() {
      const initialMessage = "Teams not scouted:";
      let message = initialMessage;

      try {

        const teamsNotScouted = await getTeamsNotScouted();

        if(teamsNotScouted === null || teamsNotScouted === undefined) {
          throw new Error("Could not access teams");
        }
        
        teamsNotScouted.sort(function (a : any, b : any) { return parseInt(a) - parseInt(b); });

        for (const team of teamsNotScouted) {
          message += "\n" + team;
        }

        if(message === initialMessage) {
          window.alert("All teams have been scouted.");
        } else {
          window.alert(message);
        }
      } catch (err : any) {
        console.error("Error in fetching teams: ", err.message);
      }})();
  }, [match_event]);

  async function submitData(event: any) {
    await canvasRef.current?.exportImage('png').then((data) => { imageURI.current = data; });
    const body = {
      "match_event": match_event,
      "team_number": event.team_number,
      "scouter_initials": event.scouter_initials.toLowerCase(),
      "robot_weight": event.robot_weight,
      "drive_train_type": event.drive_train_type,
      "motor_type": event.motor_type,
      "number_of_motors": event.number_of_motors,
      "wheel_type": event.wheel_type,
      "coral_intake_capability": event.coral_intake_capability,
      "coral_scoring_l1": event.coral_scoring_l1 || false,
      "coral_scoring_l2": event.coral_scoring_l2 || false,
      "coral_scoring_l3": event.coral_scoring_l3 || false,
      "coral_scoring_l4": event.coral_scoring_l4 || false,
      "algae_intake_capability": event.algae_intake_capability,
      "algae_scoring_capability": event.algae_scoring_capability,
      "climbing_capability": event.climbing_capability,
      "pit_organization": event.pit_organization,
      "team_safety": event.team_safety,
      "team_workmanship": event.team_workmanship,
      "gracious_professionalism": event.gracious_professionalism,
      "comments": event.comments,
    };
    setQrValue(body);
  };
  async function getPitScout(team_number: number) {
    try {
      const response = await fetch(process.env.REACT_APP_PIT_LOOKUP_URL as string + "?team_number=" + team_number);
      const data = await response.json();
      if (data.documents[0] !== undefined) {
        window.alert("This team has already been scouted! You are still able to rescout.");
      }
    }
    catch (err) {
      console.log("Could not fetch team data:",err);
    }
  }
  function Pit() {
    type FieldType = {
      scouter_initials: string;
      team_number: number;
      drive_train_type: string;
      robot_weight: number;
      motor_type: string;
      number_of_motors: number;
      wheel_type: string;
      coral_intake_capability: string;
      algae_intake_capability: string;
      algae_scoring_capability: string;
      coral_scoring_l1: boolean;
      coral_scoring_l2: boolean;
      coral_scoring_l3: boolean;
      coral_scoring_l4: boolean;
      climbing_capability: string;
      pit_organization: number;
      team_safety: number;
      team_workmanship: number;
      gracious_professionalism: number;
      robot_images: string;
      comments: string;
    };
    const drive_train = [
      { label: "Tank", value: "Tank" },
      { label: "Swerve", value: "Swerve" },
      { label: "H-Drive", value: "H-Drive" },
      { label: "Other", value: "Other" },
    ];
    const motor_type = [
      { label: "Falcon 500", value: "Falcon 500" },
      { label: "Kraken", value: "Kraken" },
      { label: "NEO", value: "NEO" },
      { label: "CIM", value: "CIM" },
      { label: "Other", value: "Other" },
    ];
    const wheel_type = [
      { label: "Nitrile / Neoprene / Plaction", value: "Nitrile_Neoprene_Plaction" },
      { label: "HiGrip", value: "HiGrip" },
      { label: "Colson", value: 'Colson' },
      { label: "Stealth / Smooth grip", value: "Stealth_Smooth grip" },
      { label: "Pneumatasic", value: "Pneumatasic" },
      { label: "Omni", value: "Omni" },
      { label: "Mechanum", value: "Mechanum" },
      { label: "TPU", value: "TPU" },
      { label: "Other", value: "Other" },
    ];
    const coralIntakeCap = [
      { label: "Coral Station", value: "Coral Station" },
      { label: "Ground", value: "Ground" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    const algaeintakeCap = [
      { label: "Reef Zone", value: "Reef Zone" },
      { label: "Coral", value: "Coral" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    const algaescoringCap = [
      { label: "Net", value: "Net" },
      { label: "Processor", value: "Processor" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    const climbingCap = [
      { label: "Shallow", value: "Shallow" },
      { label: "Deep", value: "Deep" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    return (
      <div>
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
              if (!/^[A-Za-z]+$/.test(keyValue)) {
                event.preventDefault();
              }
            }}
          />
        </Form.Item>
        <h2>Team #</h2>
        <Form.Item<FieldType> 
          name="team_number" 
          rules={[{ required: true, message: 'Please input the team number!' }]}>
          <InputNumber 
            controls 
            min={1} 
           max={99999} 
           className="input"
           onChange={(value) => {
              if (value !== null) {
               const limitedValue = Math.min(99999, value);
                getPitScout(limitedValue);
              }
            }}
            onKeyPress={(event) => {
              const currentValue = event.currentTarget.value;
              const charCode = event.which ? event.which : event.keyCode;
              if (charCode > 31 && (charCode < '0'.charCodeAt(0) || charCode > '9'.charCodeAt(0))) {
                  event.preventDefault();
              }
              if (currentValue.length >= 5) {
                event.preventDefault();
              }
            }}
          />
        </Form.Item>
        <h2>Robot Weight (lbs)</h2>
        <Form.Item
          name="robot_weight"
          rules={[{ required: true, message: 'Please input the robot weight in lbs!' }]}
        >
          <InputNumber
            min={0}
            max={1000}
            precision={0}
            placeholder="0"
            className="input robot-weight-input"
            value={robotWeight}
            onChange={(value) => {
              const numValue = typeof value === 'number' ? value : 0;
              setRobotWeight(numValue);
            }}
            onKeyPress={(event) => {
              const charCode = event.which ? event.which : event.keyCode;
              if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                event.preventDefault();
              }
            }}
            formatter={(value) => `${value}`.replace(/^0+/, '')}
            parser={(value) => value ? Math.round(parseFloat(value)) : 0}
          />
        </Form.Item>
        <h2>Drive Train Type</h2>
        <Form.Item name="drive_train_type" rules={[{ required: true, message: 'Please input the drive train type!' }]}>
        <Select
          options={drive_train}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
        </Form.Item>
        <h2>Motor Type</h2>
        <Form.Item name="motor_type" rules={[{ required: true, message: 'Please input the motor type!' }]}>
        <Select
          options={motor_type}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
        </Form.Item>
        <h2># of Motors</h2>
        <Form.Item<FieldType> name="number_of_motors" rules={[{ required: true, message: 'Please input the number of motors!' }]}>
          <InputNumber
            controls
            min={0} // Modified: can start from 0
            className="input"
            value={formValue.number_of_motors}
            onChange={(value) => {
              setFormValue({ ...formValue, number_of_motors: value ? value : 0 });
            }}
            addonAfter={<Button onMouseDown={() => {
              setFormValue(prevFormValue => ({ ...prevFormValue, number_of_motors: prevFormValue.number_of_motors + 1 }));
            }} className='incrementbutton'>+</Button>}
            addonBefore={<Button onMouseDown={() => {
              setFormValue(prevFormValue => ({ ...prevFormValue, number_of_motors: Math.max(0, prevFormValue.number_of_motors - 1) })); //Modified
            }} className='decrementbutton'>-</Button>}
          />
        </Form.Item>
        <h2>Wheel Type</h2>
        <Form.Item name="wheel_type" rules={[{ required: true, message: 'Please input the wheel type!' }]}>
        <Select
          placeholder=""
          options={wheel_type}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
        </Form.Item>
        <h2>Coral Intake Capability</h2>
          <Form.Item name="coral_intake_capability" rules={[{ required: true, message: 'Please input the intake capability!' }]}>
          <Select
            options={coralIntakeCap}
            className="input"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ maxHeight: 'none' }}
          />
        </Form.Item>
        <h2>Coral Scoring</h2>
        <h2>L1</h2>
        <Form.Item<FieldType> valuePropName="checked" name="coral_scoring_l1">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <h2>L2</h2>
        <Form.Item<FieldType> valuePropName="checked" name="coral_scoring_l2">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <h2>L3</h2>
        <Form.Item<FieldType> valuePropName="checked" name="coral_scoring_l3">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <h2>L4</h2>
        <Form.Item<FieldType> valuePropName="checked" name="coral_scoring_l4">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <h2>Algae Intake Capability</h2>
              <Form.Item name="algae_intake_capability" rules={[{ required: true, message: 'Please input the Algae intake capability!' }]}>
        <Select
          options={algaeintakeCap}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
      </Form.Item>
        <h2>Algae Scoring Capability</h2>
              <Form.Item name="algae_scoring_capability" rules={[{ required: true, message: 'Please input the Algae Scoring capability!' }]}>
        <Select
          options={algaescoringCap}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
      </Form.Item>
        <h2>Climbing Capability</h2>
        <Form.Item<FieldType> name="climbing_capability" rules={[{ required: true, message: 'Please input the climbing capability!' }]}>
          <Select options={climbingCap} className="input" />
        </Form.Item>

        <Form.Item>
            <h2>Pit Organization(0-4)</h2>
          <Form.Item<FieldType> name="pit_organization" rules={[{ required: true, message: 'Please input the pit organization rating!' }]}>
            <InputNumber
                  min={0}
                  max={4}
                  className="input"
                addonAfter={<Button onMouseDown={() => {
                  setFormValue(prevValue => ({
                    ...prevValue,
                    pit_organization: Math.min(4, (prevValue.pit_organization || 0) + 1)
                }));
              }} className='incrementbutton'>+</Button>}
              addonBefore={<Button onMouseDown={() => {
                setFormValue(prevValue => ({
                    ...prevValue,
                    pit_organization: Math.max(0, (prevValue.pit_organization || 0) - 1)
                  }));
              }} className='decrementbutton'>-</Button>}
            />
          </Form.Item>

          <Form.Item>
            <h2>Team Safety(0-4)</h2>
          <Form.Item<FieldType> name="team_safety" rules={[{ required: true, message: 'Please input the team safety rating!' }]}>
            <InputNumber
                  min={0}
                  max={4}
                  className="input"
                addonAfter={<Button onMouseDown={() => {
                  setFormValue(prevValue => ({
                    ...prevValue,
                    team_safety: Math.min(4, (prevValue.team_safety || 0) + 1)
                }));
              }} className='incrementbutton'>+</Button>}
              addonBefore={<Button onMouseDown={() => {
                setFormValue(prevValue => ({
                    ...prevValue,
                    team_safety: Math.max(0, (prevValue.team_safety || 0) - 1)
                  }));
              }} className='decrementbutton'>-</Button>}
            />
          </Form.Item>
          </Form.Item>
        
          <Form.Item>
            <h2>Team Workmanship(0-4)</h2>
          <Form.Item<FieldType> name="team_workmanship" rules={[{ required: true, message: 'Please input the team workmanship rating!' }]}>
            <InputNumber
                  min={0}
                  max={4}
                  className="input"
                addonAfter={<Button onMouseDown={() => {
                  setFormValue(prevValue => ({
                    ...prevValue,
                    team_workmanship: Math.min(4, (prevValue.team_workmanship || 0) + 1)
                }));
              }} className='incrementbutton'>+</Button>}
              addonBefore={<Button onMouseDown={() => {
                setFormValue(prevValue => ({
                    ...prevValue,
                    team_workmanship: Math.max(0, (prevValue.team_workmanship || 0) - 1)
                  }));
              }} className='decrementbutton'>-</Button>}
            />
          </Form.Item>
          </Form.Item>

          <Form.Item>
            <h2>Gracious Professionalism(0-4)</h2>
          <Form.Item<FieldType> name="gracious_professionalism" rules={[{ required: true, message: 'Please input the GP rating!' }]}>
            <InputNumber
                  min={0}
                  max={4}
                  className="input"
                addonAfter={<Button onMouseDown={() => {
                  setFormValue(prevValue => ({
                    ...prevValue,
                    gracious_professionalism: Math.min(4, (prevValue.gracious_professionalism || 0) + 1)
                }));
              }} className='incrementbutton'>+</Button>}
              addonBefore={<Button onMouseDown={() => {
                setFormValue(prevValue => ({
                    ...prevValue,
                    gracious_professionalism: Math.max(0, (prevValue.gracious_professionalism || 0) - 1)
                  }));
              }} className='decrementbutton'>-</Button>}
            />
          </Form.Item>
          </Form.Item>

        </Form.Item>
        <h2>Comments</h2>
        <Form.Item<FieldType> name="comments">
          <TextArea style={{ verticalAlign: 'center' }} className='textbox_input' />
        </Form.Item>
        <h2 style={{ display: loading ? 'inherit' : 'none' }}>Submitting data...</h2>
        <Input type="submit" value="Submit" className='submit' style={{ marginBottom: '5%' }} />
      </div>
    );
  }
  return (
    <div>
	<Header name={"Pit Scout"} back={"/#scoutingapp"}/>
      <Form
        form={form}
        initialValues={formDefaultValues}
        onFinish={async (event) => {
          try {
            setLoading(true);
            await submitData(event);
            const initials = form.getFieldValue("scouter_initials");
            form.resetFields();
            setRobotWeight(0);
			setFormValue(formDefaultValues);
            form.setFieldsValue({...formDefaultValues, "scouter_initials": initials});
          }
          catch (err) {
            // console.log(err);
            // window.alert("Error occured, please do not do leave this message and notify a Webdev member immediately.");
            // window.alert(err);
          }
          finally {
            setLoading(false);
          }
        }}
      >
        {Pit()}
      </Form>
      <QrCode value={qrValue} />
    </div>
  );
}
export default PitScout;
