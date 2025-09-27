import '../public/stylesheets/pitScout.css';
import { Checkbox, Form, Input, } from 'antd';
import { useRef } from 'react';
import React, { useState, useEffect } from 'react';
import TextArea from 'antd/es/input/TextArea';
import Header from '../parts/header';
import QrCode, { escapeUnicode, } from '../parts/qrCodeViewer';
import { getTeamsNotScouted, } from '../utils/tbaRequest';
import { NumberInput, Select } from '../parts/formItems';

namespace Fields {
    export type Pit = {
      scouter_initials: string;
      team_number: number;
      drive_train_type: string;
      robot_weight: number;
      motor_type: string;
      number_of_motors: number;
      wheel_type: string;
      intake_width: string;
      coral_intake_capability: string;
      coral_scoring_l1: boolean;
      coral_scoring_l2: boolean;
      coral_scoring_l3: boolean;
      coral_scoring_l4: boolean;
      can_remove_algae: boolean;
      algae_intake_capability: string;
      algae_scoring_capability: string;
      score_aiming_coral: string,
      score_aiming_algae: string,
      aiming_description: string,
      climbing_capability: string;
      pit_organization: number;
      team_safety: number;
      team_workmanship: number;
      gracious_professionalism: number;
      robot_images: string;
      comments: string;
    };
}

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
  "intake_width": null,
  "coral_scoring_l1": false,
  "coral_scoring_l2": false,
  "coral_scoring_l3": false,
  "coral_scoring_l4": false,
  "can_remove_algae": false,
  "algae_intake_capability": null,
  "algae_scoring_capability": null,
  "score_aiming_coral": null,
  "score_aiming_algae": null,
  "aiming_description": null,
  "climbing_capability": null,
  "pit_organization": 0,
  "team_safety": 0,
  "team_workmanship": 0,
  "gracious_professionalism": 0,
  "comments": null,
}

const IMAGE_DELIMITER = "$";

function PitScout(props: any) {
  const match_event = import.meta.env.VITE_EVENTNAME || "";
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState(formDefaultValues);
  const [isLoading, setLoading] = useState(false);
  const [qrValue, setQrValue] = useState<any>();
  const [robotImageURI, setRobotImageURI] = useState<string[]>([]);
  const robotImageInput = useRef(null);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  useEffect(() => {
    const updateFields = [
      "team_number",
      "robot_weight",
      "number_of_motors",
      "pit_organization",
      "team_safety",
      "team_workmanship",
      "gracious_professionalism",
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
  useEffect(() => {
    (async function() {
      if(!match_event) {
        return;
      }

      const initialMessage = "Teams not scouted:";
      let message = initialMessage;

      try {
        const teamsNotScouted = await getTeamsNotScouted(match_event);

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
    const body : any = {
      "match_event": match_event,
      "team_number": event.team_number,
      "scouter_initials": event.scouter_initials.toLowerCase(),
      "robot_weight": event.robot_weight,
      "drive_train_type": event.drive_train_type,
      "motor_type": event.motor_type,
      "number_of_motors": event.number_of_motors,
      "wheel_type": event.wheel_type,
      "intake_width": event.intake_width,
      "coral_intake_capability": event.coral_intake_capability,
      "coral_scoring_l1": event.coral_scoring_l1 || false,
      "coral_scoring_l2": event.coral_scoring_l2 || false,
      "coral_scoring_l3": event.coral_scoring_l3 || false,
      "coral_scoring_l4": event.coral_scoring_l4 || false,
      "can_remove_algae": event.can_remove_algae || false,
      "algae_intake_capability": event.algae_intake_capability,
      "algae_scoring_capability": event.algae_scoring_capability,
      "score_aiming_coral": event.score_aiming_coral,
      "score_aiming_algae": event.score_aiming_algae,
      "aiming_description": event.aiming_description,
      "climbing_capability": event.climbing_capability,
      "pit_organization": event.pit_organization,
      "team_safety": event.team_safety,
      "team_workmanship": event.team_workmanship,
      "gracious_professionalism": event.gracious_professionalism,
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
      });

    setQrValue(body);
  }
  async function tryFetch(body : any) {
    let fetchLink = import.meta.env.VITE_SERVER_ADDRESS;

    if(!fetchLink) {
      console.error("Could not get fetch link; Check .env");
      return;
    }

    fetchLink += "reqType=submitPitData";

    const imageData = robotImageURI.join(IMAGE_DELIMITER);

    const submitBody = {
      ...body,
      robotImageURI: imageData,
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
  function Pit() {
    type FieldType = Fields.Pit;
    const drive_train_options = [
      { label: "Tank", value: "Tank" },
      { label: "Swerve", value: "Swerve" },
      { label: "H-Drive", value: "H-Drive" },
      { label: "Other", value: "Other" },
    ];
    const motor_type_options = [
      { label: "Falcon 500", value: "Falcon 500" },
      { label: "Kraken", value: "Kraken" },
      { label: "NEO", value: "NEO" },
      { label: "CIM", value: "CIM" },
      { label: "Other", value: "Other" },
    ];
    const wheel_type_options = [
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
    const coral_intake_capability_options = [
      { label: "Coral Station - Small", value: "Coral Station - Small" },
      { label: "Coral Station - Wide", value: "Coral Station - Wide" },
      { label: "Ground", value: "Ground" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    const intake_width_options = [
      { label: "Full Width", value: "Full Width" },
      { label: "Half Width", value: "Half Width" },
      { label: "Claw/ Aiming", value: "Claw/ Aiming" },
      { label: "Other", value: "Other" },
    ];
    const algae_intake_capability_options = [
      { label: "Reef Zone", value: "Reef Zone" },
      { label: "Ground", value: "Ground" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    const algae_scoring_capability_options = [
      { label: "Net", value: "Net" },
      { label: "Processor", value: "Processor" },
      { label: "Both", value: "Both" },
      { label: "Neither", value: "Neither" },
    ];
    const score_aiming_coral_options = [
      { label: "Manual", value: "Manual" },
      { label: "Auto", value: "Auto" },
      { label: "Neither", value: "Neither" },
    ];
    const score_aiming_algae_options = [
      { label: "Manual", value: "Manual" },
      { label: "Auto", value: "Auto" },
      { label: "Neither", value: "Neither" },
    ];
    const climbing_capability_options = [
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
        <NumberInput<FieldType>
          title={"Team #"}
          name={"team_number"}
          message={"Please input the team number"}
          min={1}
          max={99999}
          form={form}
          buttons={false}
          align={"left"}
        />

        <NumberInput<FieldType>
          title={"Robot Weight (lbs)"}
          name={"robot_weight"}
          message={"Please input the robot weight in lbs"}
          min={0}
          max={1000}
          form={form}
          align={"left"}
        />

        <Select<FieldType>
          title={"Drive Train Type"}
          name={"drive_train_type"}
          message={"Please input the drive train type"}
          options={drive_train_options}
        />
        <Select<FieldType>
          title={"Motor Type"}
          name={"motor_type"}
          message={"Please input the motor type"}
          options={motor_type_options}
        />
        <NumberInput<FieldType>
          title={"# of Motors"}
          name={"number_of_motors"}
          message={"Please input the number of motors"}
          min={0}
          form={form}
          align={"left"}
        />
        <Select<FieldType>
          title={"Wheel Type"}
          name={"wheel_type"}
          message={"Please input the wheel type"}
          options={wheel_type_options}
        />
        <Select<FieldType>
          title={"Coral Intake Type"}
          name={"coral_intake_capability"}
          message={"Please input the intake type"}
          options={coral_intake_capability_options}
        />
        <Select<FieldType>
          title={"Intake Width"}
          name={"intake_width"}
          message={"Please input the intake width"}
          options={intake_width_options}
        />
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
        <h2>Can Remove Algae</h2>
        <Form.Item<FieldType> valuePropName="checked" name="can_remove_algae">
          <Checkbox className='input_checkbox' />
        </Form.Item>
        <Select<FieldType>
          title={"Algae Intake Capability"}
          name={"algae_intake_capability"}
          message={"Please input the algae intake capability"}
          options={algae_intake_capability_options}
        />
        <Select<FieldType>
          title={"Algae Scoring Capability"}
          name={"algae_scoring_capability"}
          message={'Please input the algae scoring capability'}
          options={algae_scoring_capability_options}
        />
        <Select<FieldType>
          title={"Coral Score Aiming"}
          name={"score_aiming_coral"}
          message={"Please input the coral score aiming"}
          options={score_aiming_coral_options}
        />
        <Select<FieldType>
          title={"Algae Score Aiming"}
          name={"score_aiming_algae"}
          message={"Please input the algae score aiming"}
          options={score_aiming_algae_options}
        />
        <h2>Aiming Description</h2>
        <Form.Item<FieldType>
          name="aiming_description"
          rules={[
            { required: true, message: 'Please input Aiming Description!' },
          ]}
        >
         <TextArea style={{ verticalAlign: 'center' }} className='textbox_input' />
       </Form.Item>

        <Select<FieldType>
          title={"Climbing Capability"}
          name={"climbing_capability"}
          message={"Please input the climbing capability"}
          options={climbing_capability_options}
        />

        <NumberInput<FieldType>
          title={"Pit Organization(0-4)"}
          name={"pit_organization"}
          message={"Please input pit organization rating"}
          min={0}
          max={4}
          form={form}
          align={"left"}
        />

        <NumberInput<FieldType>
          title={"Team Safety(0-4)"}
          name={"team_safety"}
          message={"Please input team safety rating"}
          min={0}
          max={4}
          form={form}
          align={"left"}
        />

        <NumberInput<FieldType>
          title={"Team Workmanship(0-4)"}
          name={"team_workmanship"}
          message={"Please input team workmanship rating"}
          min={0}
          max={4}
          form={form}
          align={"left"}
        />

        <NumberInput<FieldType>
          title={"Gracious Professionalism(0-4)"}
          name={"gracious_professionalism"}
          message={"Please input GP rating"}
          min={0}
          max={4}
          form={form}
          align={"left"}
        />

        <h2>Comments</h2>
        <Form.Item<FieldType> name="comments">
          <TextArea style={{ verticalAlign: 'center' }} className='textbox_input' />
        </Form.Item>
        <h2 style={{ display: isLoading ? 'inherit' : 'none' }}>Submitting data...</h2>

        <Form.Item<FieldType> name="robot_images">
          <>
            <label className="robotImageLabel" htmlFor="robotImageInput">Select Image{robotImageURI.length ? ` (${robotImageURI.length} images)` : ""}</label>
            <input
              ref={robotImageInput}
              id="robotImageInput"
              type="file"
              multiple
              onChange={async (event) => {
                const fileList = event.target.files || [];
                const copy = [...(fileList as any)];

                const files : string[] = [];

                for(let i = 0; i < copy.length; i++) {
                  const file = copy[i];

                  try {
                    if(!file.type.startsWith("image")) {
                      window.alert(`'${file.type.substring(file.type.indexOf("/") + 1)}' is not supported`);
                      continue;
                    }
                  } catch (err) {
                    console.log(`File reading error =`, err);
                    window.alert("Error in reading file");
                    return;
                  }

                  const image : string = await readImage(file);

                  files.push(image);
                }

                setRobotImageURI(files);
            }}/>
          </>
        </Form.Item>
        <Input type="submit" value="Submit" className='submit' style={{ marginBottom: '5%' }} />
      </div>
    );
  }
  return (
    <>
      <Header name={"Pit Scout"} back={"#scoutingapp"}/>
      <Form
        form={form}
        initialValues={formDefaultValues}
        onFinish={async (event) => {
          if(isLoading) {
            return;
          }
          try {
            setLoading(true);

            await submitData(event);

            const initials = form.getFieldValue("scouter_initials");

            form.resetFields();
            setFormValue({...formDefaultValues});
            form.setFieldsValue({...formDefaultValues, "scouter_initials": initials});
          }
          catch (err) {
             console.log(err);
             window.alert("Error occured, please do not leave this message and notify a Webdev member immediately.");
             window.alert(err);
          }
          finally {
            setLoading(false);
          }
        }}
        onFinishFailed={({values, errorFields, outOfDate}) => {
          console.log("values=", values);
          console.log("errorFields=", errorFields);
          console.log("outOfDate=", outOfDate);

          const errorMessage = errorFields.map((x : any) => x.errors.join(", ")).join("\n");
          window.alert(errorMessage);
        }}
      >
        {Pit()}
      </Form>
      <QrCode value={qrValue} />
    </>
  );
}

async function readImage(blob : any) : Promise<string> {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const base64Image : string = reader.result as string;

      resolve(base64Image);
    };
    reader.onerror = () => {
      reject("Could not read image");
    }
  });
}

export default PitScout;
