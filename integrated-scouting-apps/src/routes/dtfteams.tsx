import '../public/stylesheets/style.css';
import '../public/stylesheets/dtf.css';
import { useEffect, useState } from "react";
import VerifyLogin from '../verifyToken';
import { useCookies } from "react-cookie";
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useParams } from "react-router-dom";
import { Checkbox, Flex, Input, Tabs } from "antd";
import TextArea from 'antd/es/input/TextArea';

function DTFTeams(props: any) {
  const { team_number } = useParams();
  const [cookies] = useCookies(['login', 'theme']);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<{ key: string; label: string; children: JSX.Element; }[]>([]);
  useEffect(() => { document.title = props.title; return () => { }; }, [props.title]);
  useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);
  useEffect(() => {
    const teams = team_number?.split(",");
    if (teams === undefined) {
      window.alert("poo poo");
    }
    else {
      getDTF(teams);
      setLoading(true);
    }
    return () => { };
  }, [team_number]);

  async function getDTF(teams: string[]) {
    try {
      let index = 2;
      const match: { key: string; label: string; children: JSX.Element; }[] = [];
      const summaryInfo = [];
      const graphSummaryInfo = [];
      const teamScoreSummaryInfo = [];
      for (const team in teams) {
        const response = await (await fetch(process.env.REACT_APP_DTF_URL as string + "?team_number=" + teams[team])).json();
        const teleSpeakerGraph = (await (await fetch(process.env.REACT_APP_DTF_GRAPH_URL as string + "1?team_number=" + teams[team])).text()).replaceAll("#6E7079", "#fff").replaceAll("#5470c6", "#fff").replaceAll("#E0E6F1", "#fff").replaceAll("12px", "18px;font-weight:bold");
        const teleAmpGraph = (await (await fetch(process.env.REACT_APP_DTF_GRAPH_URL as string + "2?team_number=" + teams[team])).text()).replaceAll("#6E7079", "#fff").replaceAll("#5470c6", "#fff").replaceAll("#E0E6F1", "#fff").replaceAll("12px", "18px;font-weight:bold");
        const ratioGraph = (await (await fetch(process.env.REACT_APP_DTF_GRAPH_URL as string + "3?team_number=" + teams[team])).text()).replaceAll("#6E7079", "#fff").replaceAll("#ccc", "#fff").replaceAll("#333", "#fff").replaceAll("#464646", "#fff").replaceAll("12px", "16px;font-weight:bold").replaceAll("18px", "16px").replaceAll(' stroke-width="2" paint-order="stroke" stroke-miterlimit="2"', "");
        const autoSpeakerGraph = (await (await fetch(process.env.REACT_APP_DTF_GRAPH_URL as string + "4?team_number=" + teams[team])).text()).replaceAll("#6E7079", "#fff").replaceAll("#5470c6", "#fff").replaceAll("#E0E6F1", "#fff").replaceAll("12px", "18px;font-weight:bold");
        const autoAmpGraph = (await (await fetch(process.env.REACT_APP_DTF_GRAPH_URL as string + "5?team_number=" + teams[team])).text()).replaceAll("#6E7079", "#fff").replaceAll("#5470c6", "#fff").replaceAll("#E0E6F1", "#fff").replaceAll("12px", "18px;font-weight:bold");
        const autonPathResponse = await (await fetch(process.env.REACT_APP_DTF_AUTON_GRAPH_URL as string + "?team_number=" + teams[team])).json();
        const teamScore = await (await fetch(process.env.REACT_APP_DTF_TEAM_SCORE_URL as string + "?team_number=" + teams[team])).json();
        console.log(teamScore);
        const team1 = [
          {
            key: "1",
            label: "Auton",
            children: (
              <div>
                <Flex justify='in-between'>
                  <Flex vertical align='flex-start'>
                    <h2>Spkr Avg</h2>
                    <Input className="dtf-input" disabled value={Math.round(response.auto.auto_speaker_avg * 100) / 100} />
                  </Flex>
                  <Flex vertical align='flex-start'>
                    <h2>Spkr Max</h2>
                    <Input className="dtf-input" disabled value={response.auto.auto_speaker_peak} />
                  </Flex>
                  <Flex vertical align='flex-start'>
                    <h2>Spkr Min</h2>
                    <Input className="dtf-input" disabled value={response.auto.auto_speaker_min} />
                  </Flex>
                </Flex>
                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(autoSpeakerGraph)}`} width="100%" alt='' />
                <Flex justify='in-between'>
                  <Flex vertical align='flex-start'>
                    <h2>Amp Avg</h2>
                    <Input className="dtf-input" disabled value={Math.round(response.auto.auto_amps_avg * 100) / 100} />
                  </Flex>
                  <Flex vertical align='flex-start'>
                    <h2>Amp Max</h2>
                    <Input className="dtf-input" disabled value={response.auto.auto_amps_peak} />
                  </Flex>
                  <Flex vertical align='flex-start'>
                    <h2>Amp Min</h2>
                    <Input className="dtf-input" disabled value={response.auto.auto_amps_min} />
                  </Flex>
                </Flex>
                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(autoAmpGraph)}`} width="100%" alt='' />
                <h2>Score Ratio (Speaker : Amp)</h2>
                <Input className="input" disabled value={response.auto.auto_speaker_total + " : " + response.auto.auto_amps_total} />
                <h2>Start Position</h2>
                <Input className="input" disabled value={response.auto.robot_start_position} style={{ marginBottom: '5%' }} />
              </div>
            )
          },
          {
            key: "2",
            label: "Teleop",
            children: (
              <div>
                <Flex justify='in-between'>
                  <Flex vertical align='flex-start'>
                    <h2>Spkr Avg</h2>
                    <Input className="dtf-input" disabled value={Math.round(response.teleop.teleop_speaker_avg * 100) / 100} />
                  </Flex>
                  <Flex vertical align='flex-start'>
                    <h2>Spkr Max</h2>
                    <Input className="dtf-input" disabled value={response.teleop.teleop_speaker_peak} />
                  </Flex>
                  <Flex vertical align='flex-start'>
                    <h2>Spkr Min</h2>
                    <Input className="dtf-input" disabled value={response.teleop.teleop_speaker_min} />
                  </Flex>
                </Flex>
                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(teleSpeakerGraph)}`} width="100%" alt='' />
                <Flex justify='in-between'>
                  <Flex vertical align='flex-start'>
                    <h2>Amp Avg</h2>
                    <Input className="dtf-input" disabled value={Math.round(response.teleop.teleop_amps_avg * 100) / 100} />
                  </Flex>
                  <Flex vertical align='flex-start'>
                    <h2>Amp Max</h2>
                    <Input className="dtf-input" disabled value={response.teleop.teleop_amps_peak} />
                  </Flex>
                  <Flex vertical align='flex-start'>
                    <h2>Amp Min</h2>
                    <Input className="dtf-input" disabled value={response.teleop.teleop_amps_min} />
                  </Flex>
                </Flex>
                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(teleAmpGraph)}`} width="100%" alt='' />
                <h2>Score Ratio (Speaker : Amp)</h2>
                <Input className="input" disabled value={response.teleop.teleop_speaker_total + " : " + response.teleop.teleop_amps_total} />
                <h2>Intake</h2>
                <Input className="input" disabled value={response.teleop.teleop_intake} style={{ marginBottom: '5%' }} />
              </div>
            )
          },
          {
            key: "3",
            label: "End",
            children: (
              <div>
                <h2>Climb Ratio (Made : Total)</h2>
                <Input className="input" disabled value={response.endGame.climbed + " : " + response.endGame.total} />
                <h2>Harmony</h2>
                <Checkbox className={response.endGame.harmony ? "input_checkbox_filled" : "input_checkbox"} disabled checked={response.endGame.harmony} />
                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(ratioGraph)}`} width="100%" alt='' style={{ marginTop: '5%' }} />
              </div>
            )
          },
          {
            key: "4",
            label: "OA",
            children: (
              <div>
                <h2>Robot Died</h2>
                <Checkbox className={response.OA.OA_robot_died ? "input_checkbox_filled" : "input_checkbox"} disabled checked={response.OA.OA_robot_died ? true : false} />
                <h2>Traversed Stage</h2>
                <Checkbox className={response.OA.traverse_under_stage ? "input_checkbox_filled" : "input_checkbox"} disabled checked={response.OA.traverse_under_stage ? true : false} />
                <h2>Trap Scored</h2>
                <Checkbox className={response.OA.trap_scored ? "input_checkbox_filled" : "input_checkbox"} disabled checked={response.OA.trap_scored ? true : false} />
                <h2>Robot Comments</h2>
                <TextArea disabled className="textbox_input" value={response.OA.robot_comments} />
              </div>
            )
          },
        ];
        match.push({
          key: index.toString(),
          label: teams[team].toString(),
          children: (<Tabs items={team1} centered className='tabs' />)
        });
        index++;
        summaryInfo.push(response);
        graphSummaryInfo.push(autonPathResponse.LISAGAY);
        teamScoreSummaryInfo.push(teamScore);
      }
      match.push({
        key: "1",
        label: "Summary",
        children: (
          <div>
            <h2>Alliance Avg Score</h2>
            <Input className="input" disabled value={"j"} />
            <h2>Auton Path</h2>
            <Flex justify='in-between'>
              <Flex vertical align='center'>
                <h2 className='summary_text'>{teams[0]}</h2>
                <img src={graphSummaryInfo[0]} alt="" height={'100%'} width={'100%'} />
              </Flex>
              {teams[1] !== undefined && (
                <Flex vertical align='center'>
                  <h2 className='summary_text'>{teams[1]}</h2>
                  <img src={graphSummaryInfo[1]} alt="" height={'100%'} width={'100%'} />
                </Flex>
              )}
              {teams[2] !== undefined && (
                <Flex vertical align='center'>
                  <h2 className='summary_text'>{teams[2]} </h2>
                  <img src={graphSummaryInfo[2]} alt="" height={'100%'} width={'100%'} />
                </Flex>
              )}
            </Flex>
            <h2>Intake Source</h2>
            <Flex justify='in-between'>
              <Flex vertical align='center'>
                <h2 className='summary_text'>{teams[0]}</h2>
                <Input className="dtf-input" disabled value={summaryInfo[0].teleop.teleop_intake} />
              </Flex>
              {summaryInfo[1] !== undefined && (
                <Flex vertical align='center'>
                  <h2 className='summary_text'>{teams[1]}</h2>
                  <Input className="dtf-input" disabled value={summaryInfo[1].teleop.teleop_intake} />
                </Flex>
              )}
              {summaryInfo[2] !== undefined && (
                <Flex vertical align='center'>
                  <h2 className='summary_text'>{teams[2]} </h2>
                  <Input className="dtf-input" disabled value={summaryInfo[2].teleop.teleop_intake} />
                </Flex>
              )}
            </Flex>
            <h2>Traversed Stage</h2>
            <Flex justify='in-between'>
              <Flex vertical align='center'>
                <h2 className='summary_text'>{teams[0]}</h2>
                <Checkbox className={summaryInfo[0].OA.traverse_under_stage ? "input_checkbox_filled" : "input_checkbox"} disabled />
              </Flex>
              {summaryInfo[1] !== undefined && (
                <Flex vertical align='center'>
                  <h2 className='summary_text'>{teams[1]}</h2>
                  <Checkbox className={summaryInfo[1].OA.traverse_under_stage ? "input_checkbox_filled" : "input_checkbox"} disabled />
                </Flex>
              )}
              {summaryInfo[2] !== undefined && (
                <Flex vertical align='center'>
                  <h2 className='summary_text'>{teams[2]} </h2>
                  <Checkbox className={summaryInfo[2].OA.traverse_under_stage ? "input_checkbox_filled" : "input_checkbox"} disabled />
                </Flex>
              )}
            </Flex>
            <h2>Driver Skill</h2>
            <Flex justify='in-between'>
              <Flex vertical align='center'>
                <h2 className='summary_text'>{teams[0]}</h2>
                <Input className="dtf-input" disabled value={Math.round(summaryInfo[0].OA.avg_OA_driver_skill * 100) / 100} />
              </Flex>
              {summaryInfo[1] !== undefined && (
                <Flex vertical align='center'>
                  <h2 className='summary_text'>{teams[1]}</h2>
                  <Input className="dtf-input" disabled value={Math.round(summaryInfo[1].OA.avg_OA_driver_skill * 100) / 100} />
                </Flex>
              )}
              {summaryInfo[2] !== undefined && (
                <Flex vertical align='center'>
                  <h2 className='summary_text'>{teams[2]} </h2>
                  <Input className="dtf-input" disabled value={Math.round(summaryInfo[1].OA.avg_OA_driver_skill * 100) / 100} />
                </Flex>
              )}
            </Flex>
          </div>
        )
      });
      match.sort((a, b) => Number(a.key) - Number(b.key));
      setItems(match);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <div className='banner'>
        <header>
          <a href='/dtf'><img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt=''></img></a>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={logo} style={{ height: 256 + 'px' }} alt=''></img>
                </td>
                <td>
                  <h1 style={{ display: 'inline-block', textAlign: 'center' }}>Drive Team Feeder</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
        <h2 style={{ display: loading ? 'inherit' : 'none' }}>Loading data...</h2>
        <Tabs defaultActiveKey="1" items={items} centered className='tabs' />
      </div>
    </div>
  );
}
export default DTFTeams;