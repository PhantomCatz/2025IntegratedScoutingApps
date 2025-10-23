import '../public/stylesheets/dtfHome.css';
import { useEffect } from 'react';
import { Input, Form, InputNumber } from 'antd';
import { NUM_ALLIANCES, TEAMS_PER_ALLIANCE, } from '../utils/utils';
import Header from '../parts/header';

function DTF(props: any) {
  const [form] = Form.useForm();
  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);

  const teamInput : any = [];

  for(let allianceNumber = 1; allianceNumber <= NUM_ALLIANCES; allianceNumber++) {
    const allianceId = `alliance${allianceNumber}`;
    const teamNumberInput = [];

    for(let teamNumber = 1; teamNumber <= TEAMS_PER_ALLIANCE; teamNumber++) {
      const teamNumberId = `team${teamNumber + TEAMS_PER_ALLIANCE * (allianceNumber - 1)}Num`;

      teamNumberInput.push(
        <div key={teamNumberId}>
          <h2>Team {teamNumber + TEAMS_PER_ALLIANCE * (allianceNumber - 1)} Number</h2>
          <Form.Item
            name={teamNumberId}
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

