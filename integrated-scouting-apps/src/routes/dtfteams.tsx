import '../public/stylesheets/style.css';
import '../public/stylesheets/dtf.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Checkbox, Flex, Input, Tabs } from "antd";
import TextArea from 'antd/es/input/TextArea';
import Header from "./header";

function DTFTeams(props: any) {
  const { teamParams } = useParams();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<{ key: string; label: string; children: JSX.Element; }[]>([]);
  const [teamList, setTeamList] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<any>(null);
  
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
    getDTF(teamList);
    setLoading(true);
  }, [teamList]);
  useEffect(() => {
    if (!(teamList?.length)) {
      return;
    }
    fetch(`/api?${teamList[0] ? `team1=${teamList[0]}` : ""}${teamList[1] ? `&team2=${teamList[1]}` : ""}${teamList[2] ? `&team3=${teamList[2]}` : ""}`)
      .then((res) => {
        const value = res.json();
        return value;
      })
      .then((data) => {
        setTeamData(data)
        console.log(data)
      });
  }, [teamList]);

  const data: any = { L1: 0, L2: 0, L3: 0, L4: 0 }; // Initialize storage for aggregated values

  if (teamData && teamData[team1]) {
    for (const m of teamData[team1]) { // Loop through each match entry for team1
      for (const [k, v] of Object.entries(m)) { // Loop through each field in the match entry
        if (k === "L1") data.L1 += v as number;
        if (k === "L2") data.L2 += v as number;
        if (k === "L3") data.L3 += v as number;
        if (k === "L4") data.L4 += v as number;
      }
    }
  
  async function getDTF(teams: string[]) {
    try {
      let index = 2;
      const match: { key: string; label: string; children: JSX.Element }[] = [];
      
      console.log(teamData)
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
