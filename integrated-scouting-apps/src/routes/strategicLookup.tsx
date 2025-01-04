import '../public/stylesheets/style.css';
import '../public/stylesheets/strategic.css';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useEffect, useState } from 'react';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
import { Input, InputNumber, Tabs } from 'antd';
import TextArea from 'antd/es/input/TextArea';
function TeamData(props: any) {

  const [cookies] = useCookies(['login', 'theme']);
  const [tabNum, setTabNum] = useState("1");
  //const [fetchedData, setFetchedData] = useState([]);
  const [items, setItems] = useState([
    {
      key: '1',
      label: 'Team',
      children: Lookup(),
    },
  ]);
  useEffect(() => { document.title = props.title }, [props.title]);
  useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);
  // useEffect(() => {
	// 	async function getTeams() {
	// 		try {
	// 			const response = await fetch('https://www.thebluealliance.com/api/v3/event/' + eventname + "/teams", {
	// 				method: "GET",
	// 				headers: {
	// 					'X-TBA-Auth-Key': process.env.REACT_APP_TBA_AUTH_KEY as string,
	// 				}
	// 			});
	// 			const data = await response.json();
	// 			const teamNumbers = data.map((team: any) => <h2><a onClick={async () => {await getComments(team.team_number as number)}}>{team.team_number}</a></h2>);
	// 			setFetchedData(teamNumbers);
	// 		}
	// 		catch (err) {
	// 			console.log(err);
	// 			window.alert("Error occured, please do not do leave this message and notify a Webdev member immediately.");
	// 			window.alert(err);
	// 		}
	// 	};
	// 	getTeams();
	// }, [eventname]);

  async function getComments(team_number: number) {
    try {
      if (team_number !== 0) {
        const response = await fetch(process.env.REACT_APP_COMMENT_LOOKUP_URL as string + "?team_number=" + team_number);
        const data = await response.json();
        const match: { key: string; label: string; children: JSX.Element; }[] = [];
        let index = 2;
        for (const strategicComment of data['documents']) {
          match.push({
            key: index.toString(),
            label: strategicComment.matchIdentifier.match_level + " " + strategicComment.matchIdentifier.match_number,
            children: (
              <div>
                <h2>Scouter Initials</h2>
                <Input className="input" disabled value={strategicComment.matchIdentifier.Initials} />
                <h2>Match Level</h2>
                <Input className="input" disabled value={strategicComment.matchIdentifier.match_level} />
                <h2>Match #</h2>
                <Input className="input" disabled value={strategicComment.matchIdentifier.match_number} />
                <h2>Round #</h2>
                <Input className="input" disabled value={strategicComment.matchIdentifier.round_number} />
                <h2>Robot Position</h2>
                <Input className="input" disabled value={strategicComment.matchIdentifier.robotpos} />
                <h2>Times Amplified</h2>
                <Input className="input" disabled value={strategicComment.timesAmplified} />
                <h2>Comments</h2>
                <TextArea className="strategic-input" disabled value={strategicComment.comment} style={{marginBottom: '5%'}} />
              </div>
            )
          });
          match.sort((a, b) => parseInt(a.key.substring(1)) - parseInt(b.key.substring(1)));
          index++;
        }
        for (let i = 0; i < match.length; i++) {
          setItems([...items, match[i]]);
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  };
  // async function getDriverSkill(team_number: number) {
  //   try {
  //     if (team_number !== 0) {
  //       const response = await fetch(process.env.REACT_APP_STRATEGIC_DRIVER_SKILL_LOOKUP_URL as string + "?team_number=" + team_number);
  //       const data = await response.json();
  //       const match: { key: string; label: string; children: JSX.Element; }[] = [];
  //       let index = 2;
  //       for (const strategicComment of data['documents']) {
  //         match.push({
  //           key: index.toString(),
  //           label: strategicComment.matchIdentifier.match_level + " " + strategicComment.matchIdentifier.match_number,
  //           children: (
  //             <div>
  //               <h2>Scouter Initials</h2>
  //               <Input className="input" disabled value={strategicComment.matchIdentifier.Initials} />
  //               <h2>Match Level</h2>
  //               <Input className="input" disabled value={strategicComment.matchIdentifier.match_level} />
  //               <h2>Match #</h2>
  //               <Input className="input" disabled value={strategicComment.matchIdentifier.match_number} />
  //               <h2>Round #</h2>
  //               <Input className="input" disabled value={strategicComment.matchIdentifier.round_number} />
  //               <h2>Robot Position</h2>
  //               <Input className="input" disabled value={strategicComment.matchIdentifier.robotpos} />
  //               <h2>Comments</h2>
  //               <TextArea className="strategic-input" disabled value={strategicComment.driverskill} style={{marginBottom: '5%'}} />
  //             </div>
  //           )
  //         });
  //         match.sort((a, b) => parseInt(a.key.substring(1)) - parseInt(b.key.substring(1)));
  //         index++;
  //       }
  //       for (let i = 0; i < match.length; i++) {
  //         setItems([...items, match[i]]);
  //       }
  //     }
  //   }
  //   catch (err) {
  //     console.log(err);
  //     window.alert("Error occured, please do not do leave this message and notify a Webdev member immediately.");
  //     window.alert(err);
  //   }
  // };
  function Lookup() {
    // const strategic = [
    //   { label: "Comments", value: "comments" },
    //   { label: "Driver Skill", value: 'driverskill' },
    // ];
    return (
      <div>
        <h2>Team Number</h2>
        <InputNumber min={0} max={9999} className="input" id='teamNum' onChange={async (event) => await getComments(event as number)}/>
        {/* <h2>List of Teams</h2>
        {fetchedData} */}
      </div>
    );
  }
  return (
    <div>
      <meta name="viewport" content="maximum-scale=1.0" />
      <div className='banner'>
        <header>
          <a href='/scoutingapp/lookup/'>
            <img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt='' />
          </a>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={logo} style={{ height: 256 + 'px' }} alt='' />
                </td>
                <td>
                  <h1 style={{ display: 'inline-block', textAlign: 'center' }}>Strategic Lookup</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
      </div>
      <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} centered className='tabs' onChange={async (key) => { setTabNum(key); }} />
    </div>
  );
};
export default TeamData;