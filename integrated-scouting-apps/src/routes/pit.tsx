import '../public/stylesheets/style.css';
import '../public/stylesheets/pit.css';
import '../public/stylesheets/match.css';
import '../public/stylesheets/robot_weight.css';
import { Checkbox, Form, Input, InputNumber, Select, Upload } from 'antd';
import { useRef } from 'react';
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import TextArea from 'antd/es/input/TextArea';
import Header from './header';
import QrCode from './qrCodeViewer';


//Rhys was here//

function PitScout(props: any) {
  const eventname = process.env.REACT_APP_EVENTNAME as string;
  const imageURI = useRef<string>();
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [robotImageURI] = useState([""]);
  const [formValue, setFormValue] = useState({
    robot_events: 0,
    robot_weight: 0,
    robot_motor_counter: 0,
    robot_pit_organization: 0,
    robot_team_safety: 0,
    robot_team_workmanship: 0,
    robot_GP: 0,
    comments: "",
  });
  const [qrValue, setQrValue] = useState<any>();
  const [robotWeight, setRobotWeight] = useState(0); // Add this line

  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  useEffect(() => {
    if ((document.getElementById("robot_events") as HTMLInputElement) !== null) {
      (document.getElementById("robot_events") as HTMLInputElement).value = formValue.robot_events.toString();
      form.setFieldValue('robot_events', formValue.robot_events);
    }
    if ((document.getElementById("robot_weight") as HTMLInputElement) !== null) {
      (document.getElementById("robot_weight") as HTMLInputElement).value = robotWeight.toString(); // changed
      form.setFieldValue('robot_weight', robotWeight); // changed
    }
    if ((document.getElementById("robot_motor_counter") as HTMLInputElement) !== null) {
      (document.getElementById("robot_motor_counter") as HTMLInputElement).value = formValue.robot_motor_counter.toString();
      form.setFieldValue('robot_motor_counter', formValue.robot_motor_counter);
    }
    if ((document.getElementById("robot_pit_organization") as HTMLInputElement) !== null) {
      (document.getElementById("robot_pit_organization") as HTMLInputElement).value = formValue.robot_pit_organization.toString();
      form.setFieldValue('robot_pit_organization', formValue.robot_pit_organization);
    }
    if ((document.getElementById("robot_team_safety") as HTMLInputElement) !== null) {
      (document.getElementById("robot_team_safety") as HTMLInputElement).value = formValue.robot_team_safety.toString();
      form.setFieldValue('robot_team_safety', formValue.robot_team_safety);
    }
    if ((document.getElementById("robot_team_workmanship") as HTMLInputElement) !== null) {
      (document.getElementById("robot_team_workmanship") as HTMLInputElement).value = formValue.robot_team_workmanship.toString();
      form.setFieldValue('robot_team_workmanship', formValue.robot_team_workmanship);
    }
    if ((document.getElementById("robot_GP") as HTMLInputElement) !== null) {
      (document.getElementById("robot_GP") as HTMLInputElement).value = formValue.robot_GP.toString();
      form.setFieldValue('robot_GP', formValue.robot_GP);
    }
    return () => { };
  }, [formValue, form, robotWeight]);
  useEffect(() => {
		async function getTeams() {
			try {
				const response = await (await fetch('https://www.thebluealliance.com/api/v3/event/' + eventname + "/teams", {
					method: "GET",
					headers: {
						'X-TBA-Auth-Key': process.env.REACT_APP_TBA_AUTH_KEY as string,
					}
				})).json();
        let message = "Teams not yet scouted:\n";
        for (const index in response) {
          const pitResponse = await (await fetch(process.env.REACT_APP_PIT_LOOKUP_URL as string + "?team_number=" + response[index].team_number)).json();
          if (pitResponse.documents.length === 0) {
            message += response[index].team_number + "\n";
          }
        }
        window.alert(message);
			}
			catch (err) {
				// console.log(err);
				// window.alert("Error occured, please do not do leave this message and notify a Webdev member immediately.");
				// window.alert(err);
			}
		};
		getTeams();
	}, [eventname]);

  async function submitData(event: any) {
    await canvasRef.current?.exportImage('png').then((data) => { imageURI.current = data; });
    const body = {
      "initial": event.scouter_initial,
      "robot_events": -1,
      "team_number": event.team_number,
      "robot_drive_train": event.robot_drive_train,
      "robot_weight": event.robot_weight,
      "robot_motor_type": event.robot_motor_type,
      "robot_motor_counter": event.robot_motor_counter,
      "robot_wheel_type": event.robot_wheel_type,
      "robot_coral_intake_capability": event.robot_coral_intake_capability,
      "robot_algae_intake_capability": event.robot_algae_intake_capability,
      "robot_algae_scoring_capability": event.robot_algae_scoring_capability,
      "robot_ability_score_l1": event.robot_ability_score_l1 || false,
      "robot_ability_score_l2": event.robot_ability_score_l2 || false,
      "robot_ability_score_l3": event.robot_ability_score_l3 || false,
      "robot_ability_score_l4": event.robot_ability_score_l4 || false,
      "robot_climbing_capabilities": event.robot_climbing_capabilities,
      "robot_pit_organization": event.robot_pit_organization,
      "robot_team_safety": event.robot_team_safety,
      "robot_team_workmanship": event.robot_team_workmanship,
      "robot_GP": event.robot_GP,
      "images": robotImageURI,
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
      console.log(err);
    }
  }
  function Pit() {
    type FieldType = {
      scouter_initial: string;
      team_number: number;
      robot_drive_train: string;
      robot_weight: number;
      robot_motor_type: string;
      robot_motor_counter: number;
      robot_wheel_type: string;
      robot_coral_intake_capability: string;
      robot_algae_intake_capability: string;
      robot_algae_scoring_capability: string;
      robot_ability_score_l1: boolean;
      robot_ability_score_l2: boolean;
      robot_ability_score_l3: boolean;
      robot_ability_score_l4: boolean;
      robot_climbing_capabilities: string;
      robot_pit_organization: number;
      robot_team_safety: number;
      robot_team_workmanship: number;
      robot_GP: number;
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
      { label: "Other", value: "Other" },
    ];
    const coralIntakeCap = [
      { label: "Coral Station", value: "Coral Station" },
      { label: "Ground", value: "Ground" },
      { label: "Both", value: "Both" },
      { label: "None", value: "None" },
    ];
    const algaeintakeCap = [
      { label: "Reef Zone", value: "Reef Zone" },
      { label: "Coral", value: "Coral" },
      { label: "Both", value: "Both" },
      { label: "None", value: "None" },
    ];
    const algaescoringCap = [
      { label: "Net", value: "Net" },
      { label: "Processor", value: "Processor" },
      { label: "Both", value: "Both" },
      { label: "None", value: "None" },
    ];
    const climbingCap = [
      { label: "Shallow", value: "Shallow" },
      { label: "Deep", value: "Deep" },
      { label: "None", value: "None" }
    ];
    return (
      <div>
        <h2>Scouter Initials</h2>
        <Form.Item<FieldType>
          name="scouter_initial"
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
        <Form.Item name="robot_drive_train" rules={[{ required: true, message: 'Please input the drive train type!' }]}>
        <Select
          options={drive_train}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
        </Form.Item>
        <h2>Motor Type</h2>
        <Form.Item name="robot_motor_type" rules={[{ required: true, message: 'Please input the motor type!' }]}>
        <Select
          options={motor_type}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
        </Form.Item>
        <h2># of Motors</h2>
        <Form.Item<FieldType> name="robot_motor_counter" rules={[{ required: true, message: 'Please input the number of motors!' }]}>
          <InputNumber
            controls
            min={0} // Modified: can start from 0
            className="input"
            value={formValue.robot_motor_counter}
            onChange={(value) => {
              setFormValue({ ...formValue, robot_motor_counter: value ? value : 0 });
            }}
            addonAfter={<Button onClick={() => {
              setFormValue(prevFormValue => ({ ...prevFormValue, robot_motor_counter: prevFormValue.robot_motor_counter + 1 }));
            }} className='incrementbutton'>+</Button>}
            addonBefore={<Button onClick={() => {
              setFormValue(prevFormValue => ({ ...prevFormValue, robot_motor_counter: Math.max(0, prevFormValue.robot_motor_counter - 1) })); //Modified
            }} className='decrementbutton'>-</Button>}
          />
        </Form.Item>
        <h2>Wheel Type</h2>
        <Form.Item name="robot_wheel_type" rules={[{ required: true, message: 'Please input the wheel type!' }]}>
        <Select
          placeholder=""
          options={wheel_type}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
        </Form.Item>
        <h2>Coral Intake Capability</h2>
          <Form.Item name="robot_coral_intake_capability" rules={[{ required: true, message: 'Please input the intake capability!' }]}>
          <Select
            options={coralIntakeCap}
            className="input"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ maxHeight: 'none' }}
          />
        </Form.Item>
        <h2>Coral Scoring</h2>
        <h2> L1 </h2>
        <Form.Item<FieldType> valuePropName="checked" name="robot_ability_score_l1">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <h2> L2 </h2>
        <Form.Item<FieldType> valuePropName="checked" name="robot_ability_score_l2">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <h2> L3 </h2>
        <Form.Item<FieldType> valuePropName="checked" name="robot_ability_score_l3">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <h2> L4 </h2>
        <Form.Item<FieldType> valuePropName="checked" name="robot_ability_score_l4">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <h2>Algae Intake Capability</h2>
              <Form.Item name="robot_algae_intake_capability" rules={[{ required: true, message: 'Please input the Algae intake capability!' }]}>
        <Select
          options={algaeintakeCap}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
      </Form.Item>
        <h2>Algae Scoring Capability</h2>
              <Form.Item name="robot_algae_scoring_capability" rules={[{ required: true, message: 'Please input the Algae Scoring capability!' }]}>
        <Select
          options={algaescoringCap}
          className="input"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
        />
      </Form.Item>
        <h2>Climbing Capability</h2>
        <Form.Item<FieldType> name="robot_climbing_capabilities" rules={[{ required: true, message: 'Please input the climbing capability!' }]}>
          <Select options={climbingCap} className="input" />
        </Form.Item>

        <Form.Item>
            <h2>Pit Organization(0-4)</h2>
          <Form.Item<FieldType> name="robot_pit_organization" rules={[{ required: true, message: 'Please input the pit organization rating!' }]}>
            <InputNumber
                  min={0}
                  max={4}
                  className="input"
                addonAfter={<Button onClick={() => {
                  setFormValue(prevValue => ({
                    ...prevValue,
                    robot_pit_organization: Math.min(4, (prevValue.robot_pit_organization || 0) + 1)
                }));
              }} className='incrementbutton'>+</Button>}
              addonBefore={<Button onClick={() => {
                setFormValue(prevValue => ({
                    ...prevValue,
                    robot_pit_organization: Math.max(0, (prevValue.robot_pit_organization || 0) - 1)
                  }));
              }} className='decrementbutton'>-</Button>}
            />
          </Form.Item>

          <Form.Item>
            <h2>Team Safety(0-4)</h2>
          <Form.Item<FieldType> name="robot_team_safety" rules={[{ required: true, message: 'Please input the team safety rating!' }]}>
            <InputNumber
                  min={0}
                  max={4}
                  className="input"
                addonAfter={<Button onClick={() => {
                  setFormValue(prevValue => ({
                    ...prevValue,
                    robot_team_safety: Math.min(4, (prevValue.robot_team_safety || 0) + 1)
                }));
              }} className='incrementbutton'>+</Button>}
              addonBefore={<Button onClick={() => {
                setFormValue(prevValue => ({
                    ...prevValue,
                    robot_team_safety: Math.max(0, (prevValue.robot_team_safety || 0) - 1)
                  }));
              }} className='decrementbutton'>-</Button>}
            />
          </Form.Item>
          </Form.Item>
        
          <Form.Item>
            <h2>Team Workmanship(0-4)</h2>
          <Form.Item<FieldType> name="robot_team_workmanship" rules={[{ required: true, message: 'Please input the team workmanship rating!' }]}>
            <InputNumber
                  min={0}
                  max={4}
                  className="input"
                addonAfter={<Button onClick={() => {
                  setFormValue(prevValue => ({
                    ...prevValue,
                    robot_team_workmanship: Math.min(4, (prevValue.robot_team_workmanship || 0) + 1)
                }));
              }} className='incrementbutton'>+</Button>}
              addonBefore={<Button onClick={() => {
                setFormValue(prevValue => ({
                    ...prevValue,
                    robot_team_workmanship: Math.max(0, (prevValue.robot_team_workmanship || 0) - 1)
                  }));
              }} className='decrementbutton'>-</Button>}
            />
          </Form.Item>
          </Form.Item>

          <Form.Item>
            <h2>Gracious Professionalism(0-4)</h2>
          <Form.Item<FieldType> name="robot_GP" rules={[{ required: true, message: 'Please input the GP rating!' }]}>
            <InputNumber
                  min={0}
                  max={4}
                  className="input"
                addonAfter={<Button onClick={() => {
                  setFormValue(prevValue => ({
                    ...prevValue,
                    robot_GP: Math.min(4, (prevValue.robot_GP || 0) + 1)
                }));
              }} className='incrementbutton'>+</Button>}
              addonBefore={<Button onClick={() => {
                setFormValue(prevValue => ({
                    ...prevValue,
                    robot_GP: Math.max(0, (prevValue.robot_GP || 0) - 1)
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
	<Header name={"Pit Scout"} back={"/scoutingapp"}/>
      <Form
        form={form}
        initialValues={{
          robot_ability_traversed_stage: false,
	}}
        onFinish={async (event) => {
          try {
            setLoading(true);
            await submitData(event);
            const initials = form.getFieldValue("scouter_initial");
            form.resetFields();
            setRobotWeight(0);
            form.setFieldsValue({ "scouter_initial": initials });
            setFormValue({
              robot_events: 0,
              robot_weight: 0,
              robot_motor_counter: 0,
              robot_pit_organization: 0,
              robot_team_safety: 0,
              robot_team_workmanship: 0,
              robot_GP: 0,
              comments: "",
            });
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
