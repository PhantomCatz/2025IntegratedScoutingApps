import '../public/stylesheets/dtfHome.css'; // TODO: change
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Checkbox, Flex, Input, Tabs } from "antd";
import { NUM_ALLIANCES, TEAMS_PER_ALLIANCE, round, } from '../utils/utils';
import TextArea from 'antd/es/input/TextArea';
import Header from '../parts/header';
import ChartComponent from '../parts/chart';
import PitTabs from '../parts/pitTabs';
import StrategicTabs from '../parts/strategicTabs';

function DTFTeams(props: any) {
  const { teamParams } = useParams();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<{ key: string; label: string; children: JSX.Element; }[]>([]);
  const [teamList, setTeamList] = useState<string[]>([]);
  const [teamIndex, setTeamIndex] = useState<any>();
  const [teamsMatchData, setTeamsMatchData] = useState<any>();
  const [teamsStragicData, setTeamsStrategicData] = useState<any>();

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  useEffect(() => {
    const teams = teamParams?.split(",") || [];

    const inverse : any = {};

    for(let i = 0; i < teams.length; i++) {
      const num = teams[i] || 0;
      if(!num) {
        continue;
      }

      inverse[num] = i + 1;
    }

    setTeamList(teams);
    setTeamIndex(inverse);
  }, [teamParams]);
  useEffect(() => {
    if (!(teamList?.length)) {
      return;
    }
    let fetchLink = SERVER_ADDRESS;

    const teams = teamList.map((num) => {
      return Number(num || 0);
    });

    if(!fetchLink) {
      console.error("Could not get fetch link; Check .env");
      return;
    }

    fetchLink += "reqType=getTeam"

    for(let i = 0; i < NUM_ALLIANCES * TEAMS_PER_ALLIANCE; i++) {
      if(teamList[i]) {
        fetchLink += `&team${i+1}=${teamList[i]}`;
      }
    }

    fetch(fetchLink)
      .then((res) => res.json())
      .then(async (data) => {
        /*
          data = {
          <1-6>: [
              <field>: <value>
            ]
          }
          field, value from database
        */
        await preprocessData(data);
        setTeamsMatchData(data);
      })
      .catch((err) => {
        console.log("Error fetching data. Is server on?", err);
      });

    fetchLink = SERVER_ADDRESS;
    fetchLink += "reqType=getTeamStrategic";

    (async () => {
      const strategicData = {};
      for(const team of teams) {
        const res = await fetch(fetchLink + `&team=${team}`);
        const data = await res.json();
        strategicData[team] = data;
      }
      await preprocessData(strategicData);
      setTeamsStrategicData(strategicData);
    })()
  }, [teamList]);
  useEffect(() => {
    getDTF(teamList);
  }, [teamsMatchData, teamsStragicData]);

  async function preprocessData(data) {
    const matchLevelOrder = {
      "Qualifications": 0,
      "Playoffs": 1,
      "Finals": 2,
    } as const;
    console.log(`data=`, data);
    for(const teamIndex in data) {
      (await data[teamIndex]).sort(function(a, b) {
        const matchLevelComp = matchLevelOrder[a.match_level] - matchLevelOrder[b.match_level];
        if(matchLevelComp !== 0) {
          return matchLevelComp;
        }
        return a.match_number - b.match_number;
      });
    }
  }
  function aggregateData(k : any, v : any, data : any) {
    const l = data.match_count;
    if(v === null && v === undefined) {
      return;
    }
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

    case "overall_robot_died":
      if(data[k] === undefined) {
        data[k] = v as any;
      } else {
        data[k] += v as any;
      }
      break;
    case "overall_comments":
      data[k] += v.replace("\\n", "\n") + "\n";
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
        data[k] = "Both";
        break;
      }
      break;
    // Default: Do nothing
    default:
      //console.log("did nothing for", k);
      break;
    }
    switch(k){
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

      const total_field = k.replace("_missed","").replace("_scored","") + ("_total");
      if(data[total_field] === undefined) {
        data[total_field] = v as any/l;
      } else {
        data[total_field] += v as any/l;
      }
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
        "auton_coral_l4_total": 0,
        //"auton_coral_missed_l4": 0,
        "auton_coral_scored_l3": 0,
        "auton_coral_l3_total": 0,
        //"auton_coral_missed_l3": 0,
        "auton_coral_scored_l2": 0,
        "auton_coral_l2_total": 0,
        //"auton_coral_missed_l2": 0,
        "auton_coral_scored_l1": 0,
        "auton_coral_l1_total": 0,
        //"auton_coral_missed_l1": 0,
        "auton_algae_scored_net": 0,
        "auton_algae_missed_net": 0,
        "auton_algae_net_total": 0,
        "auton_algae_scored_processor": 0,

        // Teleop
        "teleop_coral_scored_l4": 0,
        "teleop_coral_l4_total": 0,
        //"teleop_coral_missed_l4": 0,
        "teleop_coral_scored_l3": 0,
        "teleop_coral_l3_total": 0,
        //"teleop_coral_missed_l3": 0,
        "teleop_coral_scored_l2": 0,
        "teleop_coral_l2_total": 0,
        //"teleop_coral_missed_l2": 0,
        "teleop_coral_scored_l1": 0,
        "teleop_coral_l1_total": 0,
        //"teleop_coral_missed_l1": 0,
        "teleop_algae_scored_net": 0,
        "teleop_algae_missed_net": 0,
        "teleop_algae_net_total": 0,
        "teleop_algae_scored_processor": 0,

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
        "overall_major_penalties": 0,
        "overall_minor_penalties": 0,
        "overall_penalties_incurred": null,
        "overall_comments": "",

        "robot_played": true,

        "total_score" : 0,
        "average_score" : 0,
        "match_count": 0,
    };
    if(!matches) {
      return data;
    }
    data.match_count = matches.filter((x) => x.robot_appeared).length;
    const l = matches.length;

    if(l === 0) {
      return data;
    }
    for(const match of matches) {
      if(!match.robot_appeared) {
        continue;
      }
      for(const [k, v] of Object.entries(match)) {
        aggregateData(k, v, data);
        if(getScore(k, v) === undefined) {
          console.log("field ", k, " is ", v, " and has no score");
          continue;
        }
        data.total_score += getScore(k, v);
      }
    }
    data.average_score = data.match_count ?
      data.total_score / data.match_count :
      0;

    for(const [k, v] of Object.entries(data)) {
      if(typeof v === "number") {
        data[k] = round(v);
      }
    }
    return data;
  }

  async function getAllianceTab(teams : any, persistentData : any, index : number) {
    const tabs : any = [];
    const alliancePersistentData : any = [];

    let teamCount = (index - 1) * TEAMS_PER_ALLIANCE;
    for (const team of teams) {
      teamCount++;
      if(!team) {
        continue;
      }

      const dataIndex = teamIndex[team];
      const teamMatches = teamsMatchData[dataIndex];

      const data = mergeTeamData(teamMatches);
      persistentData[team] = data;
      alliancePersistentData.push(data);

      let hasData = true;
      if(!teamMatches?.length) {
        hasData = false;
      }


      const strategicData = teamsStragicData[team];
      // let pitData = await PitTabs(Number(team));
      let strategicTabs = await StrategicTabs({team: team, data: strategicData});

      const teamTabs = [];
      let teamTabsCount = 1;

      if(hasData) {
        teamTabs.push({ key: "Charts", label: "Charts", children:
          <>
            <ChartComponent teamNumber={team} index={teamCount} teamMatches={teamMatches} teamStrategic={strategicData}/>
          </>
        });

        teamTabs.push({ key: "Auton", label: "Auton", children:
          <>
            <Flex justify='in-between'>
              <Flex vertical align='flex-start'>
                <h2>L1 avg</h2>
                <Input className="dtf-input" disabled value={`${data.auton_coral_scored_l1}/${data.auton_coral_l1_total}`} />
              </Flex>
              <Flex vertical align='flex-start'>
                <h2>L2 avg</h2>
                <Input className="dtf-input" disabled value={`${data.auton_coral_scored_l2}/${data.auton_coral_l2_total}`} />
              </Flex>
            </Flex>
            <Flex justify='in-between'>
              <Flex vertical align='flex-start'>
                <h2>L3 avg</h2>
                <Input className="dtf-input" disabled value={`${data.auton_coral_scored_l3}/${data.auton_coral_l3_total}`} />
              </Flex>
              <Flex vertical align='flex-start'>
                <h2>L4 avg</h2>
                <Input className="dtf-input" disabled value={`${data.auton_coral_scored_l4}/${data.auton_coral_l4_total}`} />
              </Flex>
            </Flex>

            <h2>Avg Algae Processed</h2>
            <Input className="input" disabled value={data.auton_algae_scored_processor} />
            <h2>Avg Algae Net</h2>
            <Input className="input" disabled value={`${data.auton_algae_scored_net}/${data.auton_algae_net_total}`}  />
          </>
        });

        teamTabs.push({ key: "Teleop/End", label: "Teleop/End", children:
          <>
            <Flex justify='in-between'>
              <Flex vertical align='flex-start'>
                <h2>L1 avg</h2>
                <Input className="dtf-input" disabled value={`${data.teleop_coral_scored_l1}/${data.teleop_coral_l1_total}`} />
              </Flex>
              <Flex vertical align='flex-start'>
                <h2>L2 avg</h2>
                <Input className="dtf-input" disabled value={`${data.teleop_coral_scored_l2}/${data.teleop_coral_l2_total}`} />
              </Flex>
            </Flex>
            <Flex justify='in-between'>
              <Flex vertical align='flex-start'>
                <h2>L3 avg</h2>
                <Input className="dtf-input" disabled value={`${data.teleop_coral_scored_l3}/${data.teleop_coral_l3_total}`} />
              </Flex>
              <Flex vertical align='flex-start'>
                <h2>L4 avg</h2>
                <Input className="dtf-input" disabled value={`${data.teleop_coral_scored_l4}/${data.teleop_coral_l4_total}`} />
              </Flex>
            </Flex>
            <h2>Avg Algae Processed</h2>
            <Input className="input" disabled value={data.teleop_algae_scored_processor} />
            <h2>Avg Algae Net</h2>
            <Input className="input" disabled value={`${data.teleop_algae_scored_net}/${data.teleop_algae_net_total}`}  />
            <h2>Climb Type</h2>
            <Input className="input" disabled value={data.endgame_climb_type} />
            <h2>Avg Climb Time</h2>
            <Input className="input" disabled value={data.endgame_climb_time} />
          </>
        });

        teamTabs.push({ key: "OA", label: "OA", children:
          <>
            <h2>Matches Played</h2>
            <Input className="input" disabled value={`${data.match_count}/${teamMatches.length}`}  />
            <h2>Robot Died (counter: matches)</h2>
            <Input className="input" disabled value={data.overall_robot_died}  />
            <h2>Intake Algae Type</h2>
            <Input className="input" disabled value={data.endgame_algae_intake_capability}  />
            <h2>Intake Coral Type</h2>
            <Input className="input" disabled value={data.endgame_coral_intake_capability}  />
            <h2>Robot Comments</h2>
            <TextArea disabled className="textbox_input" value={data.overall_comments} style={{marginBottom: '5%'}}/>
          </>
        });
      } else {
        teamTabs.push({ key: "NoData", label: "No Data", children:
          <p className={"errorLabel"}>No Data for team {team}</p>,
        });
      }

      /*
      teamTabs.push({ key: "Pit", label: "Pit", children:
        <>
          { pitData &&
            <Tabs items={pitData} centered className="tabs" />
              || <p className={"errorLabel"}>No Pit Data</p>
          }
        </>
      });
     */
      teamTabs.push({ key: "Strategic", label: "Strategic", children:
        <>
          { strategicTabs ?
            <Tabs items={strategicTabs} centered className="tabs" />
              : <p className={"errorLabel"}>No Strategic Data</p>
          }
        </>
      });

      tabs.push({ key: `${team}|${teamCount}`, label: team, children:
        <>
          <Tabs items={teamTabs} centered className={"tabs"} />
        </>
      });
    }

    const averageScores = [];
    const driverSkills = [];

    let totalAverage = 0;

    for(let i = 0; i < TEAMS_PER_ALLIANCE; i++) {
      const team = alliancePersistentData[i];
      const teamNumber = teams[i];
      const shouldDisplay = alliancePersistentData[i]?.match_count > i;

      if(!shouldDisplay) {
        continue;
      }

      totalAverage += (team as any).average_score;

      averageScores.push(
        <div key={`${teamNumber}AverageScoreSkill`}>
          <h2>Team {teamNumber} Avg Score</h2>
          <Input className="input" disabled value={team.average_score} />
        </div>
      );
      driverSkills.push(
        <Flex vertical align='center' key={`${teamNumber}DriverSkill`}>
          <h2 className='summary_text'>{teamNumber}</h2>
          <Input className="dtf-input" disabled value={team.overall_driver_skill} />
        </Flex>
      );
    }

    tabs.push({ key: "Summary", label: "Summary", children:
        <>
          <h2>Average Alliance Score</h2>
          <Input className="input" disabled value={totalAverage} />
            {averageScores}
          <h2>Driver Skill</h2>
          <Flex justify='in-between'>
            {driverSkills}
          </Flex>
        </>
    });

    return tabs;
  }
  async function getDTF(teams: string[]) {
    setLoading(true);

    if(!teamsMatchData || !teamsStragicData) {
      return;
    }

    try {
      let index = 2;
      const match: { key: string; label: string; children: JSX.Element }[] = [];

      if(!teamsMatchData) {
        console.log("Could not load DTF. No data found");
        return (<></>);
      } else {
        console.log("Loaded data.");
      }

      const persistentData : any = {};
      const allianceTabs : any = [];

      for(let i = 1; i <= NUM_ALLIANCES; i++) {
        const alliance = teams.slice((i - 1) * TEAMS_PER_ALLIANCE, i * TEAMS_PER_ALLIANCE);

        const allianceTab = await getAllianceTab(alliance, persistentData, i);

        allianceTabs.push({ key: `Alliance${i}`, label: `Alliance ${i}`, children:
          <>
            <Tabs items={allianceTab} centered className='tabs' />
          </>
        });
      }

      const allianceAverageScores = [];
      const averageScores = [];

      for(let i = 0; i < NUM_ALLIANCES; i++) {
        const averageScoresGroup = [];
        let allianceTotalAverage = 0;

        for(let j = 0; j < TEAMS_PER_ALLIANCE; j++) {
          const index = i * TEAMS_PER_ALLIANCE + j;
          const teamNumber = Number(teamList[index]);

          if(!teamNumber) {
            continue;
          }

          const data = persistentData[teamNumber];

          averageScoresGroup.push(
            <div key={`${i}|${j}`}>
              <h2>Team {teamNumber} Average Score</h2>
              <Input className="input" disabled value={data.average_score} />
            </div>
          );

          allianceTotalAverage += data.average_score;
        }

        averageScores.push(
          <div key={`allianceRobotAverages${i + 1}`}>
            <h2>Alliance {i + 1} Robots</h2>
            {averageScoresGroup}
          </div>
        );
        allianceAverageScores.push(
          <div key={`allianceAverage${i + 1}`}>
            <h2>Alliance {i + 1} Average Score</h2>
            <Input className="input" disabled value={allianceTotalAverage} />
          </div>
        );

      }

      allianceTabs.push({ key: "OverallSummary", label: "Overall Summary", children:
        <>
          {allianceAverageScores}
          {averageScores}
        </>
      });

      setItems(allianceTabs);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
    setLoading(false);
  }
  return (
    <>
      <Header name={"Drive Team Feeder"} back={"#home"} />
      <h2 style={{ display: loading ? 'inherit' : 'none' }}>Loading data...</h2>
      <Tabs defaultActiveKey="1" items={items} centered className='tabs' />
    </>
  );
}
export default DTFTeams;
