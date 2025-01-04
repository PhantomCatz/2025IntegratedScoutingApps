import '../public/stylesheets/style.css';
import '../public/stylesheets/teamdata.css';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
function TeamData(props: any) {
  const { team_number } = useParams();
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<{ [x: string]: any; }[]>([]);

  useEffect(() => { document.title = props.title }, [props.title]);
  const [cookies] = useCookies(['login', 'theme']);
  useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);
  useEffect(() => {
    async function fetchData(team_number: number) {
      try {
        const table = [];
        const response = await fetch(process.env.REACT_APP_MATCH_LOOKUP_URL + "?team_number=" + team_number);
        const data = await response.json();
        for (const matches in data.documents) {
          const kv: { [key: string]: any } = {};
          for (const match in data.documents[matches]) {
            for (const matchInfo in data.documents[matches][match]) {
              if (Number.isNaN(Number(matchInfo))) {
                //console.log(matchInfo + ":" + data.documents[matches][match][matchInfo]);
                if (matchInfo === "auto_path") {
                  kv[matchInfo] = <img src={data.documents[matches][match][matchInfo].toString()} alt=''></img>
                }
                else {
                  kv[matchInfo] = data.documents[matches][match][matchInfo].toString();
                }
              }
            }
          }
          table.push(kv);
        }
        setFetchedData(table);
        console.log(table);
      }
      catch (err) {
        console.log(err);
        window.alert("error has occured; please tell nathan asap");
        window.alert(err);
      }
      finally {
        setLoading(false);
      }
    };
    if (team_number) {
      fetchData(parseInt(team_number));
    }
  }, [team_number]);
  return (
    <div>
      <meta name="viewport" content="maximum-scale=1.0" />
      <div className='banner'>
        <header>
          <a href="/scoutingapp/lookup/match">
            <img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt=''></img>
          </a>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={logo} style={{ height: 256 + 'px' }} alt='' ></img>
                </td>
                <td>
                  <h1 style={{ display: 'inline-block', textAlign: 'center' }}>Team {team_number}</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
        <h2 style={{ whiteSpace: 'pre-line' }}>{loading ? "Loading..." : 'Data for ' + team_number}</h2>
        <Table dataSource={fetchedData} >
          <ColumnGroup title="Match Identifier">
            <Column title="Match #" dataIndex="match_number" key="match_number" />
            <Column title="Match Level" dataIndex="match_level" key="match_level" />
          </ColumnGroup>
          <ColumnGroup title="Auton">
            <Column title="Preload Scored" dataIndex="auto_preload_scored" key="auto_preload_scored" />
            <Column title="Leave" dataIndex="auto_leave" key="auto_leave" />
            <Column title="Amp Scored" dataIndex="auto_amps_scored" key="auto_amps_scored" />
            <Column title="Speaker Scored" dataIndex="auto_speaker_scored" key="auto_speaker_scored" />
            <Column title="Scoring Location" dataIndex="auto_scoring_location" key="auto_scoring_location" />
            <Column title="Pieces Picked" dataIndex="auto_pieces_picked" key="auto_pieces_picked" />
            <Column title="Missed Amp Pieces" dataIndex="auto_missed_pieces_amp" key="auto_misssed_pieces_amp" />
            <Column title="Missed Speaker Pieces" dataIndex="auto_missed_pieces_speaker" key="auto_missed_pieces_speaker" />
            <Column title="Total Points" dataIndex="auto_total_points" key="auto_total_points" />
          </ColumnGroup>
          <ColumnGroup title="Teleop">
            <Column title="Coopertition Pressed" dataIndex="teleop_coop_pressed" key="teleop_coop_pressed" />
            <Column title="Cooperated First" dataIndex="teleop_coop_first" key="teleop_coop_first" />
            <Column title="Amp Scored" dataIndex="teleop_amps_scored" key="teleop_amps_scored" />
            <Column title="Speaker Scored" dataIndex="teleop_speaker_scored" key="teleop_speaker_scored" />
            <Column title="Amplified Scored" dataIndex="teleop_pieces_note_amplifying_scored" key="teleop_pieces_note_amplifying_scored" />
            <Column title="Intake" dataIndex="intake" key="intake" />
            <Column title="Missed Amp Pieces" dataIndex="teleop_missed_pieces_amp" key="teleop_misssed_pieces_amp" />
            <Column title="Missed Speaker Pieces" dataIndex="teleop_missed_pieces_speaker" key="teleop_missed_pieces_speaker" />
            <Column title="Total Points" dataIndex="teleop_total_points" key="teleop_total_points" />
            <Column title="Scoring Location" dataIndex="teleop_scoring_location" key="teleop_scoring_location" />
            <Column title="Pieces Hoarded" dataIndex="tele_hoardedpieces" key="tele_hoardedpieces" />
          </ColumnGroup>
          <ColumnGroup title="End">
            <Column title="Climbed" dataIndex="EG_climbed" key="EG_climbed" />
            <Column title="Time Left" dataIndex="EG_timeLeft_when_climb" key="EG_timeLeft_when_climb" />
            <Column title="Parked" dataIndex="EG_parked" key="EG_parked" />
            <Column title="Trap Scored" dataIndex="EG_trapScored" key="EG_trapScored" />
            <Column title="Harmony" dataIndex="EG_harmony" key="EG_harmony" />
            <Column title="Spotlit" dataIndex="EG_mic_score" key="EG_mic_score" />
            <Column title="Climbing Affected" dataIndex="EG_climbing_affect" key="EG_climbing_affect" />
          </ColumnGroup>
          <ColumnGroup title="Overall">
            <Column title="Robot Died" dataIndex="OA_robot_died" key="OA_robot_died" />
            <Column title="Was Defended" dataIndex="OA_was_defend" key="OA_was_defend" />
            <Column title="Was Defended Teams" dataIndex="OA_was_defend_team" key="OA_was_defend_team" />
            <Column title="Defended" dataIndex="OA_defend" key="OA_defend" />
            <Column title="Defended" dataIndex="OA_defend_team" key="OA_defend_team" />
            <Column title="Pushing" dataIndex="OA_pushing_rating" key="OA_pushing_rating" />
            <Column title="Counterdefense" dataIndex="OA_counter_defense" key="OA_counter_defense" />
            <Column title="Number of Penalties" dataIndex="OA_numbers_penalties" key="OA_numbers_penalties" />
            <Column title="Penalties Incurred" dataIndex="OA_penalties_comments" key="OA_penalties_comments" />
            <Column title="Comments" dataIndex="OA_comments" key="OA_comments" />
            <Column title="Driver Skill" dataIndex="OA_driver_skill" key="OA_driver_skill" />
          </ColumnGroup>
        </Table>
      </div>
    </div>
  );
}

export default TeamData;
