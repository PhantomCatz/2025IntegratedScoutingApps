import '../public/stylesheets/style.css';
import '../public/stylesheets/dtf.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Checkbox, Flex, Input, Tabs } from "antd";
import TextArea from 'antd/es/input/TextArea';
import Header from "./header";
import Chart from 'chart.js/auto';
import ChartComponent from "./chart"; 

const MAX_NUM_TEAMS = 3;

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
      console.error("Could not get fetch link; Check .env");
      return;
    }

    fetchLink += "reqType=getTeam"

    for(let i = 0; i < MAX_NUM_TEAMS; i++) {
      if(teamList.length > i) {
        fetchLink += `&team${i+1}=${teamList[i]}`;
      }
    }

    fetch(fetchLink)
      .then((res) => {
        const value = res.json();
        return value;
      })
      .then((data) => {
        setTeamData(data)
      })
      .catch((err) => {
        console.log("Error fetching data. Is server on?", err);
      });
  }, [teamList]);
  useEffect(() => {
    getDTF(teamList);
  }, [teamData]);
  
  function aggregateData(k : any, v : any, data : any) {
    const l = data.match_count;
    switch(k) {
    // Average values
    case "auton_coral_scored_l4":
    case "auton_coral_scored_l3":
    case "auton_coral_scored_l2":
    case "auton_coral_scored_l1":
    case "auton_algae_scored_net":
    case "auton_algae_scored_processor":
    case "teleop_coral_scored_l4":
    case "teleop_coral_scored_l3":
    case "teleop_coral_scored_l2":
    case "teleop_coral_scored_l1":
    case "teleop_algae_scored_net":
    case "teleop_algae_scored_processor":
    case "endgame_climb_time":
    case "overall_driver_skill":
      if(data[k] === undefined) {
        data[k] = v as any/l;
      } else {
        data[k] += v as any/l;
      }
      break;
    // Summative values
    case "auton_coral_missed_l4":
    case "auton_coral_missed_l3":
    case "auton_coral_missed_l2":
    case "auton_coral_missed_l1":
      data.auton_coral_missed += v as any;
      break;
    case "teleop_coral_missed_l4":
    case "teleop_coral_missed_l3":
    case "teleop_coral_missed_l2":
    case "teleop_coral_missed_l1":
      data.teleop_coral_missed += v as any;
      break;
    case "auton_algae_missed_net":
    case "teleop_algae_missed_net":
    case "overall_robot_died":
      if(data[k] === undefined) {
        data[k] = v as any;
      } else {
        data[k] += v as any;
      }
      break;
    case "overall_comments":
      data[k] += v + "\n";
      break;
    // Special Values
    case "endgame_coral_intake_capability":
    case "endgame_algae_intake_capability":
    case "endgame_climb_type":
      let change = 0;
      if(!data[k]) {
        change = 1;
      } else if(data[k] === "Neither") {
        change = 1;
      } else if(data[k] === "Both") {
        change = -1;
      } else if(v === "Neither") {
        change = -1;
      } else if(v === "Both") {
        change = 1;
      } else if(data[k] === v) {
        change = -1;
      }
      switch(change) {
      case -1:
        break;
      case 1:
        data[k] = v;
        break;
      default:
        console.error(`Team has conflicting ${k} types: `, data[k], v);
        //console.log(data);
        data[k] = "Both";
        break;
      }
      break;
    // Default: Do nothing
    default:
      //console.log("did nothing for", k);
      break;
    }
  }
  function getScore(k : any, v : any) {
    const map : any = {
      "auton_coral_scored_l4": 7,
      "auton_coral_scored_l3": 6,
      "auton_coral_scored_l2": 4,
      "auton_coral_scored_l1": 3,
      "auton_algae_scored_net": 4,
      "auton_algae_scored_processor": 6,
      "teleop_coral_scored_l4": 5,
      "teleop_coral_scored_l3": 4,
      "teleop_coral_scored_l2": 3,
      "teleop_coral_scored_l1": 2,
      "teleop_algae_scored_net": 4,
      "teleop_algae_scored_processor": 6,
    }

    if(map[k]) {
      return map[k] * v;
    } else if(k === "endgame_climb_type") {
      switch(v) {
      case "Deep Hang":
        return 12;
      case "Shallow Hang":
        return 6;
      case "Park":
        return 2;
      default:
        return 0;
      }
    } else if(k === "auton_leave_starting_line" && v) {
      return 3;
    } else {
      return 0;
    }
  }
  function mergeTeamData(matches: any[]) {
    const data : any = {
        // Auton
        //"auton_leave_starting_line": event.auton_leave_starting_line,
        "auton_coral_scored_l4": 0,
        //"auton_coral_missed_l4": 0,
        "auton_coral_scored_l3": 0,
        //"auton_coral_missed_l3": 0,
        "auton_coral_scored_l2": 0,
        //"auton_coral_missed_l2": 0,
        "auton_coral_scored_l1": 0,
        //"auton_coral_missed_l1": 0,
        "auton_algae_scored_net": 0,
        "auton_algae_missed_net": 0,
        "auton_algae_scored_processor": 0,
        "auton_coral_missed": 0,
        // Teleop
        "teleop_coral_scored_l4": 0,
        //"teleop_coral_missed_l4": 0,
        "teleop_coral_scored_l3": 0,
        //"teleop_coral_missed_l3": 0,
        "teleop_coral_scored_l2": 0,
        //"teleop_coral_missed_l2": 0,
        "teleop_coral_scored_l1": 0,
        //"teleop_coral_missed_l1": 0,
        "teleop_algae_scored_net": 0,
        "teleop_algae_missed_net": 0,
        "teleop_algae_scored_processor": 0,
        "teleop_coral_missed": 0,
        // Endgame
        "endgame_coral_intake_capability": "",
        //"endgame_coral_station": event.endgame_coral_station
        "endgame_algae_intake_capability": "",
        /*
        "endgame_climb_successful": event.endgame_climb_successful,
        "endgame_climb_type": event.endgame_climb_type,
        */
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
        "overall_penalties_incurred": null,
        "overall_comments": "",

        "total_score" : 0,
        "average_score" : 0,
        "match_count": 0,
    };
    if(!matches) {
      console.log("matches=", matches);
      return data;
    }
    data.match_count = matches.length;
    const l = data.match_count;

    if(l === 0) {
      return data;
    }
    for(const match of matches) {
      for(const [k, v] of Object.entries(match)) {
        aggregateData(k, v, data);
        if(getScore(k, v) === undefined) {
          console.log(k, v);
        }
        data.total_score += getScore(k, v);
      }
    }
    data.average_score = data.total_score / l;
    return data;
  }

  async function getDTF(teams: string[]) {
    setLoading(true);
    try {
      let index = 2;
      const match: { key: string; label: string; children: JSX.Element }[] = [];

      if(!teamData) {
        console.log("Could not load DTF. No data found");
        return (<></>);
      } else {
        console.log("Loaded data.");
      }

      const persistentData = [];
      for (const team of teams) {
        const data : any = mergeTeamData(teamData[team]);

        if(data.match_count === 0) {
          match.push({
            key: index.toString(),
            label: team.toString(),
            children: <p className={"errorLabel"}>No Data for team {team}</p>,
          });
          
          persistentData.push(data);
          index++;
          continue;
        }
        //console.log(data);

        persistentData.push(data);

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
                   <Input className="dtf-input" disabled value={data.auton_coral_scored_l1} /> 
                 </Flex>
                 <Flex vertical align='flex-start'>
                   <h2>L2 avg</h2>
                   <Input className="dtf-input" disabled value={data.auton_coral_scored_l2} /> 
                 </Flex>
               </Flex>
               <Flex justify='in-between'>
                 <Flex vertical align='flex-start'>
                   <h2>L3 avg</h2>
                   <Input className="dtf-input" disabled value={data.auton_coral_scored_l3} /> 
                 </Flex>
                 <Flex vertical align='flex-start'>
                   <h2>L4 avg</h2>
                   <Input className="dtf-input" disabled value={data.auton_coral_scored_l4} />
                 </Flex>
               </Flex>

               <h2>Avg Algae Processed</h2>
               <Input className="input" disabled value={data.auton_algae_scored_processor} /> 
               <h2>Avg Algae Net</h2>
               <Input className="input" disabled value={data.auton_algae_scored_net}  /> 
               <h2>Missed Coral</h2>
               <Input className="input" disabled value={data.auton_coral_missed} />
               <h2>Missed Algae</h2>
               <Input className="input" disabled value={data.auton_algae_missed_net} />
         </div>  
          )
        },
          { key: "3", label: "Teleop/End", children:( <div> 
            <Flex justify='in-between'>
                 <Flex vertical align='flex-start'>
                   <h2>L1 avg</h2>
                   <Input className="dtf-input" disabled value={data.teleop_coral_scored_l1} />
                 </Flex>
                 <Flex vertical align='flex-start'>
                   <h2>L2 avg</h2>
                   <Input className="dtf-input" disabled value={data.teleop_coral_scored_l2} /> 
                 </Flex>
               </Flex>
               <Flex justify='in-between'>
                 <Flex vertical align='flex-start'>
                   <h2>L3 avg</h2>
                   <Input className="dtf-input" disabled value={data.teleop_coral_scored_l3} /> 
                 </Flex>
                 <Flex vertical align='flex-start'>
                   <h2>L4 avg</h2>
                   <Input className="dtf-input" disabled value={data.teleop_coral_scored_l4} />
                 </Flex>
               </Flex>
               <h2>Avg Algae Processed</h2>
               <Input className="input" disabled value={data.teleop_algae_scored_processor} /> 
               <h2>Avg Algae Net</h2>
               <Input className="input" disabled value={data.teleop_algae_scored_net}  /> 
               <h2>Missed Coral</h2>
               <Input className="input" disabled value={data.teleop_coral_missed} />
               <h2>Missed Algae</h2>
               <Input className="input" disabled value={data.teleop_algae_missed_net} />
               <h2>Climb Type</h2>
               <Input className="input" disabled value={data.endgame_climb_type} /> 
               <h2>Avg Climb Time</h2>
               <Input className="input" disabled value={data.endgame_climb_time} /> 
         </div> 
         )
        },
          { key: "4", label: "OA", children: (
              <div>
                <h2>Matches Played</h2>
                <Input className="input" disabled value={data.match_count}  /> 
                <h2>Robot Died (counter: matches)</h2>
                <Input className="input" disabled value={data.overall_robot_died}  /> 
                <h2>Intake Algae Type</h2>
                <Input className="input" disabled value={data.endgame_algae_intake_capability}  /> 
                <h2>Intake Coral Type</h2>
                <Input className="input" disabled value={data.endgame_coral_intake_capability}  /> 
                <h2>Robot Comments</h2>
                <TextArea disabled className="textbox_input" value={data.overall_comments} /> 
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

      let totalAverage = 0;
      for(const t of persistentData) {
        totalAverage += (t as any).average_score;
      }

      match.push({ 
        key: "1",
        label: "Summary",
        children:
        <div> 
        <h2>Average Alliance Score</h2> 
        <Input className="input" disabled value={totalAverage} />
        {persistentData[0]?.match_count > 0 && (
          <>
            <h2>Team {teams[0]} Avg Score</h2>
            <Input className="input" disabled value={persistentData[0].average_score} /> 
          </>
        )}
        {persistentData[1]?.match_count > 0 && (
          <>
            <h2>Team {teams[1]} Avg Score</h2>
            <Input className="input" disabled value={persistentData[1].average_score} /> 
          </>
        )}
        {persistentData[2]?.match_count > 0 && (
          <>
            <h2>Team {teams[2]} Avg Score</h2>
            <Input className="input" disabled value={persistentData[2].average_score} /> 
          </>
        )}
        <h2>Driver Skill</h2>
        <Flex justify='in-between'>
          {persistentData[0]?.match_count > 0 && (
            <Flex vertical align='center'>
              <h2 className='summary_text'>{teams[0]}</h2>
              <Input className="dtf-input" disabled value={persistentData[0].overall_driver_skill} /> 
            </Flex>
          )}
          {persistentData[1]?.match_count > 0 && (
            <Flex vertical align='center'>
              <h2 className='summary_text'>{teams[1]}</h2>
              <Input className="dtf-input" disabled value={persistentData[1].overall_driver_skill} /> 
            </Flex>
          )}
          {persistentData[2]?.match_count > 0 && (
            <Flex vertical align='center'>
              <h2 className='summary_text'>{teams[2]}</h2>
              <Input className="dtf-input" disabled value={persistentData[2].overall_driver_skill} />
            </Flex>
          )}
        </Flex>
      </div>
        
      });

      setItems(match);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
    setLoading(false);
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
