import '../public/stylesheets/style.css';
import '../public/stylesheets/dtf.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Checkbox, Flex, Input, Tabs } from "antd";
import TextArea from 'antd/es/input/TextArea';
import Header from "./header";
import Chart from 'chart.js/auto';
import ChartComponent from "./chart"; 

function DTFTeams(props: any) {
  const { teamParams } = useParams();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<{ key: string; label: string; children: JSX.Element; }[]>([]);
  const [teamList, setTeamList] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<any>();
  
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  useEffect(() => {
    const teams = teamParams?.split(",") || [];
    setTeamList(teams);
  }, [teamParams]);
  useEffect(() => {
    if (!(teamList?.length)) {
      return;
    }
    let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

    if(!fetchLink) {
      console.error("Could not fetch data");
      return;
    }

    if(teamList.length >= 1) {
      fetchLink += `team1=${teamList[0]}`;
    }
    if(teamList.length >= 2) {
      fetchLink += `&team2=${teamList[1]}`;
    }
    if(teamList.length >= 3) {
      fetchLink += `&team3=${teamList[2]}`;
    }

    fetch(fetchLink)
      .then((res) => {
        const value = res.json();
        return value;
      })
      .then((data) => {
        setTeamData(data)
        console.log(data)
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  }, [teamList]);
  useEffect(() => {
    getDTF(teamList);
    setLoading(true);
  }, [teamData]);
  
  function mergeTeamData(matches: any[]) {
    const event : any = {};
    const data = {
        // Auton
        "auton_leave_starting_line": event.auton_leave_starting_line,
        "auton_coral_scored_l4": 0,
        "auton_coral_missed_l4": 0,
        "auton_coral_scored_l3": 0,
        "auton_coral_missed_l3": 0,
        "auton_coral_scored_l2": 0,
        "auton_coral_missed_l2": 0,
        "auton_coral_scored_l1": 0,
        "auton_coral_missed_l1": 0,
        "auton_algae_scored_net": 0,
        "auton_algae_missed_net": 0,
        "auton_algae_scored_processor": 0,
        // Teleop
        "teleop_coral_scored_l4": 0,
        "teleop_coral_missed_l4": 0,
        "teleop_coral_scored_l3": 0,
        "teleop_coral_missed_l3": 0,
        "teleop_coral_scored_l2": 0,
        "teleop_coral_missed_l2": 0,
        "teleop_coral_scored_l1": 0,
        "teleop_coral_missed_l1": 0,
        "teleop_algae_scored_net": 0,
        "teleop_algae_missed_net": 0,
        "teleop_algae_scored_processor": 0,
        // Endgame
        "endgame_coral_intake_capability": event.endgame_coral_intake_capability,
        "endgame_coral_station": event.endgame_coral_intake_capability,
        "endgame_algae_intake_capability": event.endgame_algae_intake_capability,
        "endgame_climb_successful": event.endgame_coral_intake_capability,
        "endgame_climb_type": event.endgame_climb_type,
        "endgame_climb_time": 0,
        // Overall
        "overall_robot_died": 0,
        "overall_defended_others": false,
        "overall_was_defended": false,
        "overall_defended": [],
        "overall_defended_by": [],
        "overall_pushing": 0,
        "overall_counter_defense": 0,
        "overall_driver_skill": 0,
        "overall_num_penalties": 0,
        "overall_penalties_incurred": event.overall_penalties_incurred,
        "overall_comments": event.overall_comments,
    };
    if(!matches) {
      console.log("matches=", matches);
      return data;
    }
    const l = matches.length;
    for(const match in matches) {
      for(const [k, v] of Object.entries(match)) {
        switch(k) {
          // Average values
        case "auton_coral_scored_l4":
        case "auton_coral_missed_l4":
        case "auton_coral_scored_l3":
        case "auton_coral_missed_l3":
        case "auton_coral_scored_l2":
        case "auton_coral_missed_l2":
        case "auton_coral_scored_l1":
        case "auton_coral_missed_l1":
        case "auton_algae_scored_net":
        case "auton_algae_missed_net":
        case "teleop_coral_scored_l4":
        case "teleop_coral_missed_l4":
        case "teleop_coral_scored_l3":
        case "teleop_coral_missed_l3":
        case "teleop_coral_scored_l2":
        case "teleop_coral_missed_l2":
        case "teleop_coral_scored_l1":
        case "teleop_coral_missed_l1":
        case "teleop_algae_scored_net":
        case "teleop_algae_missed_net":
          if(data[k] === undefined) {
            data[k] = v as any/l;
          } else {
            data[k] += v as any/l;
          }
          break;
        }
        // Summative values
      }
    }
    return data;
  }

  async function getDTF(teams: string[]) {
    try {
      let index = 2;
      const match: { key: string; label: string; children: JSX.Element }[] = [];

      if(!teamData) {
        console.log("Could not load DTF; no data found");
        return (<></>);
      }
      for (const team of teams) {
        const data : any = mergeTeamData(teamData[team]);

        const teamTabs = [
          { key: "1", label: "Charts", children: ( <div>
        <ChartComponent />
      </div>  
       )
     },
          { key: "2", label: "Auton", children: ( <div>
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
               <h2>Avg Algae Net</h2>
               <Input className="input" disabled value={""}  /> 
               <h2>Missed Coral</h2>
               <Input className="input" disabled value={""} />
               <h2>Missed Algae</h2>
               <Input className="input" disabled value={""} />
               <h2> Climb Type</h2>
               <Input className="input" disabled value={""} /> 
               <h2>Avg Climb Time</h2>
               <Input className="input" disabled value={""} /> 
         </div>  
          )
        },
          { key: "3", label: "Teleop/End", children:( <div> 
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
          { key: "4", label: "OA", children: (
              <div>
                <h2>Robot Died (counter: matches)</h2>
                <Input className="input" disabled value={""}  /> 
                <h2>Intake Algae Type</h2>
                <Input className="input" disabled value={""}  /> 
                <h2>Intake Coral Type</h2>
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
        <h2>Team 1 Avg Score</h2>
        <Input className="input" disabled value={""} /> 
        <h2>Team 2 Avg Score</h2>
        <Input className="input" disabled value={""} /> 
        <h2>Team 3 Avg Score</h2>
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
    <Header name={"Drive Team Feeder"} back={"/home"} />
    <h2 style={{ display: loading ? 'inherit' : 'none' }}>Loading data...</h2>
    <Tabs defaultActiveKey="1" items={items} centered className='tabs' />
    </div>
  );
}
export default DTFTeams;
