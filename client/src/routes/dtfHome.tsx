import '../public/stylesheets/dtfHome.css';
import { useEffect } from 'react';
import { Input, Form, InputNumber } from 'antd';
import { NumberInput, } from '../parts/formItems';
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
        <NumberInput
          key={teamNumberId}
          name={teamNumberId}
          title={`Team ${teamNumber + TEAMS_PER_ALLIANCE * (allianceNumber - 1)} Number`}
          min={0}
          buttons={false}
          align="left"
          className="input"
        />
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
      <form
        form={form}
        onSubmit={async (event) => {
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
        <input type="submit" value="Submit" className="submit" />
      </form>
    </>
  );
}

export default DTF;

