import '../public/stylesheets/style.css';
import '../public/stylesheets/picklist.css';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useEffect, useState } from 'react';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
import Column from 'antd/es/table/Column';
import { Table } from 'antd';

function Picklists(props: any) {
  const [cookies] = useCookies(['login', 'theme']);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<{ [x: string]: any; }[]>([]);
  useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);
  useEffect(() => { document.title = props.title }, [props.title]);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const teams: { [key: string]: any } = {};
        let kv = [];
        const response = await fetch(process.env.REACT_APP_PICKLIST_URL as string);
        const data = await response.json();
        for (const team in data) {
          if (teams[data[team].team_number] === undefined) {
            teams[data[team].team_number] = (data[team]);
            if (teams[data[team].team_number].first_score === undefined) {
              teams[data[team].team_number].first_score = data[team].score;
            }
            if (teams[data[team].team_number].second_score === undefined) {
              teams[data[team].team_number].second_score = 0;
            }
            if (teams[data[team].team_number].third_score === undefined) {
              teams[data[team].team_number].third_score = 0;
            }
            if (teams[data[team].team_number].robot_died === undefined) {
              teams[data[team].team_number].robot_died = 0;
            }
            if (teams[data[team].team_number].match_numbers === undefined) {
              teams[data[team].team_number].match_numbers = 1;
            }
            if (teams[data[team].team_number].rank === undefined) {
              teams[data[team].team_number].rank = 1;
            }
          }
          else {
            if (data[team].score > teams[data[team].team_number].first_score) {
              teams[data[team].team_number].third_score = teams[data[team].team_number].second_score;
              teams[data[team].team_number].second_score = teams[data[team].team_number].first_score;
              teams[data[team].team_number].first_score = data[team].score;
            }
            else if (data[team].score > teams[data[team].team_number].second_score) {
              teams[data[team].team_number].third_score = teams[data[team].team_number].second_score;
              teams[data[team].team_number].second_score = data[team].score;
            }
            else if (data[team].score > teams[data[team].team_number].third_score) {
              teams[data[team].team_number].third_score = data[team].score;
            }
            teams[data[team].team_number].score += data[team].score;
            teams[data[team].team_number].auto_scored_pieces += data[team].auto_scored_pieces;
            teams[data[team].team_number].teleop_amps_scored += data[team].teleop_amps_scored;
            teams[data[team].team_number].teleop_speaker_scored += data[team].teleop_speaker_scored;

            teams[data[team].team_number].auto_missed_pieces += data[team].auto_missed_pieces;
            teams[data[team].team_number].teleop_missed_amps += data[team].teleop_missed_amps;
            teams[data[team].team_number].teleop_missed_speaker += data[team].teleop_missed_speaker;

            teams[data[team].team_number].match_numbers++;
            // console.log(teams[data[team].team_number].team_number + ": first_score: " + teams[data[team].team_number].first_score);
            // console.log(teams[data[team].team_number].team_number + ": second_score: " + teams[data[team].team_number].second_score);
            // console.log(teams[data[team].team_number].team_number + ": third_score: " + teams[data[team].team_number].third_score);
            // console.log(teams[data[team].team_number].team_number + ": match_numbers: " + teams[data[team].team_number].match_numbers);
            // console.log(teams[data[team].team_number].team_number + ": score: " + teams[data[team].team_number].score);
          }
          if (data[team].robot_died) {
            teams[data[team].team_number].robot_died++;
          }
        }
        for (const team in teams) {
          teams[teams[team].team_number].avg_score = Math.round(teams[teams[team].team_number].score / teams[teams[team].team_number].match_numbers * 100) / 100;
          teams[teams[team].team_number].iegr = Math.round(((teams[teams[team].team_number].first_score + teams[teams[team].team_number].second_score + teams[teams[team].team_number].third_score) / 3) * 100) / 100;

          teams[teams[team].team_number].auto_score_ratio = teams[teams[team].team_number].auto_scored_pieces + "/" + (teams[teams[team].team_number].auto_scored_pieces + teams[teams[team].team_number].auto_missed_pieces);
          teams[teams[team].team_number].auto_scored_pieces = Math.round(teams[teams[team].team_number].auto_scored_pieces / teams[teams[team].team_number].match_numbers * 100) / 100;

          teams[teams[team].team_number].amp_score_ratio = teams[teams[team].team_number].teleop_amps_scored + "/" + (teams[teams[team].team_number].teleop_amps_scored + teams[teams[team].team_number].teleop_missed_amps);
          teams[teams[team].team_number].speaker_score_ratio = teams[teams[team].team_number].teleop_speaker_scored + "/" + (teams[teams[team].team_number].teleop_speaker_scored + teams[teams[team].team_number].teleop_missed_speaker);
          teams[teams[team].team_number].teleop_amps_scored = Math.round(teams[teams[team].team_number].teleop_amps_scored / teams[teams[team].team_number].match_numbers * 100) / 100;
          teams[teams[team].team_number].teleop_speaker_scored = Math.round(teams[teams[team].team_number].teleop_speaker_scored / teams[teams[team].team_number].match_numbers * 100) / 100;
        }
        for (const team in teams) {
          kv.push(teams[team]);

        }
        kv.sort((a, b) => {return (b.avg_score - a.avg_score);});
        for (const team in kv) {
          kv[team].rank = Number(team) + 1;
        }
        setFetchedData(kv);
      }
      catch (err) {
        console.log(err);
        window.alert("Error occured, please do not do leave this message and notify a Webdev member immediately.");
        window.alert(err);
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <div className='banner'>
        <header>
          <a href="/scoutingapp/">
            <img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt=''></img>
          </a>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={logo} style={{ height: 256 + 'px' }} alt='' ></img>
                </td>
                <td>
                  <h1 style={{ display: 'inline-block', textAlign: 'center' }}>Picklists</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
        <h2 style={{ whiteSpace: 'pre-line' }}>{loading ? 'Loading Data...' : ''}</h2>
        <Table dataSource={fetchedData} pagination={{ pageSize: 500 }}>
          <Column title="Rank #" dataIndex="rank" sorter={(a: any, b: any) => a.rank - b.rank} defaultSortOrder={"ascend"} fixed="left" />
          <Column title="Team #" dataIndex="team_number" sorter={(a: any, b: any) => a.team_number - b.team_number} />
          <Column title="Overall Score" dataIndex="avg_score" sorter={(a: any, b: any) => a.avg_score - b.avg_score} />
          <Column title="IEGR (Top 3)" dataIndex="iegr" sorter={(a: any, b: any) => a.iegr - b.iegr} />
          <Column title="Auton Avg" dataIndex="auto_scored_pieces" sorter={(a: any, b: any) => a.auto_scored_pieces - b.auto_scored_pieces} />
          <Column title="Auton (Scr/Att)" dataIndex="auto_score_ratio" sorter={(a: any, b: any) => a.auto_score_ratio.length - b.auto_score_ratio.length} />
          <Column title="Teleop Amp Avg" dataIndex="teleop_amps_scored" sorter={(a: any, b: any) => a.teleop_amps_scored - b.teleop_amps_scored} />
          <Column title="Teleop Amp (Scr/Att)" dataIndex="amp_score_ratio" sorter={(a: any, b: any) => a.amp_score_ratio.length - b.amp_score_ratio.length} />
          <Column title="Teleop Spkr Avg" dataIndex="teleop_speaker_scored" sorter={(a: any, b: any) => a.teleop_speaker_scored - b.teleop_speaker_scored} />
          <Column title="Teleop Spkr (Scr/Att)" dataIndex="speaker_score_ratio" sorter={(a: any, b: any) => a.speaker_score_ratio.length - b.speaker_score_ratio.length} />
          <Column title="Robot Deaths" dataIndex="robot_died" sorter={(a: any, b: any) => a.robot_died - b.robot_died} className='robotdied' />
        </Table>
      </div>
    </div>
  );
}

export default Picklists;