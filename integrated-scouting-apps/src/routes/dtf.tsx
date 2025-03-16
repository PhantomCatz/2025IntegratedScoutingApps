import '../public/stylesheets/dtf.css';
import { useEffect } from 'react';
import { Input, Form, InputNumber } from 'antd';
import Header from "./parts/header";

const NUM_ALLIANCES = 2;
const TEAMS_PER_ALLIANCE = 3;

function DTF(props: any) {
  const [form] = Form.useForm();
  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);

  const teamInput : any = [];

  for(let allianceNumber = 1; allianceNumber <= NUM_ALLIANCES; allianceNumber++) {
    const allianceId = `alliance${allianceNumber}`;
    const teamNumberInput = [];

    for(let teamNumber = 1; teamNumber <= TEAMS_PER_ALLIANCE; teamNumber++) {
      const teamNumberId = `team${teamNumber + TEAMS_PER_ALLIANCE * (allianceNumber - 1)}Num`;
      console.log(teamNumberId);

      teamNumberInput.push(
        <div key={teamNumberId}>
          <h2>Team {teamNumber + TEAMS_PER_ALLIANCE * (allianceNumber - 1)} Number</h2>
          <Form.Item
            name={teamNumberId}
            rules={[{ required: (teamNumber === 1), message: "Please input the team number!" }]}
          >
            <InputNumber min={0} className="input" />
          </Form.Item>
        </div>
      );
    }

    teamInput.push(
      <div key={allianceId}>
        <h2>Alliance {allianceNumber}</h2>
        <hr/>
        {teamNumberInput}
      </div>
    );
  }

  return (
    <>
      <Header name={"Drive Team Feeder"} back={"#home"} />
      <Form
        form={form}
        onFinish={async (event) => {
          const teamNums = [];

          for(let i = 1; i <= NUM_ALLIANCES * TEAMS_PER_ALLIANCE; i++) {
            const number = event[`team${i}Num`];
            console.log(number);
            teamNums.push(number);
          }

          teamNums.filter((num) => num !== undefined);

          window.location.href = "#dtf/" + teamNums.join(",");
        }}
      >
        {teamInput}
        <Form.Item>
          <Input type="submit" value="Submit" className="submit" />
        </Form.Item>
      </Form>
    </>
  );
}

export default DTF;

