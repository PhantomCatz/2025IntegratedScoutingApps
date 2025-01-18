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
    if (teams) {

      getDTF(teams);
      setLoading(true);
    }
    return () => { };
  }, [team_number]);

  async function getDTF(teams: string[]) {
    try {
      let index = 2;
      const match: { key: string; label: string; children: JSX.Element }[] = [];
      {/*buttons for sprk avg, max, min (images for other te*/}
      for (const team of teams) {
        const teamTabs = [
          { key: "1", label: "Auton", children: ( <div>
          <Flex justify='in-between'>
                 <Flex vertical align='flex-start'>
                   <h2>L1 avg</h2>
                   <Input className="dtf-input" disabled value={""} /> 
                 </Flex>
                 <Flex vertical align='flex-start'>
                   <h2>L2 avg</h2>
                   <Input className="dtf-input" disabled value={""} /> 
                 </Flex>
               </Flex>
               <Flex justify='in-between'>
                 <Flex vertical align='flex-start'>
                   <h2>L3 avg</h2>
                   <Input className="dtf-input" disabled value={""} /> 
                 </Flex>
                 <Flex vertical align='flex-start'>
                   <h2>L4 avg</h2>
                   <Input className="dtf-input" disabled value={""} />
                 </Flex>
               </Flex>
               <h2>Can they leave?</h2>
                <Checkbox className={true ? "input_checkbox_filled" : "input_checkbox"} disabled checked={true ? true : false} /> 
               <h2>Avg Algae Processed</h2>
               <Input className="input" disabled value={""} /> 
               <h2>Avg Algae Net</h2>
               <Input className="input" disabled value={""}  /> 
               <h2>Missed Coral</h2>
               <Input className="input" disabled value={""} />
               <h2>Missed Algae</h2>
               <Input className="input" disabled value={""} />
               <h2>Climb</h2>
               <Input className="input" disabled value={""} /> 
               <h2>Avg Climb Time</h2>
               <Input className="input" disabled value={""} /> 
         </div>  
          )
        },
          { key: "2", label: "Teleop/End", children:( <div> 
            <Flex justify='in-between'>
                 <Flex vertical align='flex-start'>
                   <h2>L1 avg</h2>
                   <Input className="dtf-input" disabled value={""} />
                 </Flex>
                 <Flex vertical align='flex-start'>
                   <h2>L2 avg</h2>
                   <Input className="dtf-input" disabled value={""} /> 
                 </Flex>
               </Flex>
               <Flex justify='in-between'>
                 <Flex vertical align='flex-start'>
                   <h2>L3 avg</h2>
                   <Input className="dtf-input" disabled value={""} /> 
                 </Flex>
                 <Flex vertical align='flex-start'>
                   <h2>L4 avg</h2>
                   <Input className="dtf-input" disabled value={""} />
                 </Flex>
               </Flex>
               <h2>Avg Algae Processed</h2>
               <Input className="input" disabled value={""} /> 
               <h2>Avg Algae net</h2>
               <Input className="input" disabled value={""}  /> 
               <h2>Missed Coral</h2>
               <Input className="input" disabled value={""} />
               <h2>Missed Algae</h2>
               <Input className="input" disabled value={""} />
               <h2>Climb</h2>
               <Input className="input" disabled value={""} /> 
               <h2>Avg Climb Time</h2>
               <Input className="input" disabled value={""} /> 
         </div> 
         )
        },
             { key: "3", label: "OA", children: (
              <div>{/*checkboxes for YES or NO */}
                <h2>Robot Died (counter: matches)</h2>
                <Input className="input" disabled value={""}  /> 
                <h2>Intake Algae</h2>
                <Input className="input" disabled value={""}  /> 
                <h2>Intake Coral</h2>
                <Input className="input" disabled value={""}  /> 
                <h2>Robot Comments</h2>
                <TextArea disabled className="textbox_input" value={""} /> 
              </div>
            ) },
            
        ];

        match.push({
          key: index.toString(),
          label: team.toString(),
          children: <Tabs items={teamTabs} centered className="tabs" />,
        });
        index++;
      }

      match.push({ 
        key: "1",
        label: "Summary",
        children:
        <div> 
        <h2>Alliance Avg Score</h2> 
        <Input className="input" disabled value={""} />
        <h2>R1 Avg Score</h2>
        <Input className="input" disabled value={""} /> 
        <h2>R2 Avg Score</h2>
        <Input className="input" disabled value={""} /> 
        <h2>R3 Avg Score</h2>
        <Input className="input" disabled value={""} /> 
        <h2>Driver Skill</h2>
        <Flex justify='in-between'>
          <Flex vertical align='center'>
            <h2 className='summary_text'>{teams[0]}</h2>
            <Input className="dtf-input" disabled value={"null"} /> 
          </Flex>
          {true && (
            <Flex vertical align='center'>
              <h2 className='summary_text'>{teams[1]}</h2>
              <Input className="dtf-input" disabled value={"null"} /> 
            </Flex>
          )}
          {true && (
            <Flex vertical align='center'>
              <h2 className='summary_text'>{teams[2]} </h2>
              <Input className="dtf-input" disabled value={"null"} />
            </Flex>
          )}
        </Flex>
      </div>
        
      });

      setItems(match);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  }
  return (
    <div>
      <div className='banner'>
      <meta name="viewport" content="maximum-scale=1.0" />
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