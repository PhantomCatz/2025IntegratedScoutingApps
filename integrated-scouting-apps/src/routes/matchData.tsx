import '../public/stylesheets/style.css';
import '../public/stylesheets/teamdata.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import Header from "./parts/header";

function TeamData(props: any) {
  const { teamNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState<{ [x: string]: any; }[]>([]);

  useEffect(() => { document.title = props.title }, [props.title]);
  useEffect(() => {
    async function fetchData(teamNumber: number) {
      try {
        const table = [];
        
        let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

        if(!fetchLink) {
          console.error("Could not get fetch link. Check .env");
          return;
        }

        fetchLink += "reqType=getTeam";
        fetchLink += `&team1=${teamNumber}`;

        const response = await (await fetch(fetchLink)).json();
        const data : any[] = response[1];

        for (const match of data) {
          const row:  { [key: string]: any } = {};
          for (const field in match) {
            switch(field) {
            case "auton_leave_starting_line":
            case "endgame_climb_successful":
            case "overall_robot_died":
            case "overall_defended_others":
            case "overall_was_defended":
              row[field] = (<div className={`boolean_${!!match[field]}`}>&nbsp;</div>);
              break;
            case "overall_comments":
              row[field] = match[field].replaceAll("\\n", "\n");
              break;
            default:
              row[field] = match[field].toString();
              break;
            }
          }
          row["key"] = `${match.match_event}|${match.match_level}|${match.match_number}|${match.scouter_initials}`;
          table.push(row);
        }

        setMatchData(table);
      }
      catch (err) {
        console.log("Error occured when getting data: ", err);
      }
      finally {
        setLoading(false);
      }
    }
    if (teamNumber) {
      fetchData(parseInt(teamNumber));
    }
  }, [teamNumber]);
  const columns = {
    "Match Identifier": {
      "Match Event": "match_event",
      "Scouter Initials": "scouter_initials",
      "Match Level": "match_level",
      "Match #": "match_number",
      "Robot Starting Position": "robot_starting_position",
    },
    "Teleop": {
      "Coral Scored L4": "teleop_coral_scored_l4",
      "Coral Missed L4": "teleop_coral_missed_l4",
      "Coral Scored L3": "teleop_coral_scored_l3",
      "Coral Missed L3": "teleop_coral_missed_l3",
      "Coral Scored L2": "teleop_coral_scored_l2",
      "Coral Missed L2": "teleop_coral_missed_l2",
      "Coral Scored L1": "teleop_coral_scored_l1",
      "Coral Missed L1": "teleop_coral_missed_l1",
      "Algae Scored Net": "teleop_algae_scored_net",
      "Algae Missed Net": "teleop_algae_missed_net",
      "Algae Scored Processor": "teleop_algae_scored_processor",
    },
    "Auton": {
      "Left Starting Line": "auton_leave_starting_line",
      "Coral Scored L4": "auton_coral_scored_l4",
      "Coral Missed L4": "auton_coral_missed_l4",
      "Coral Scored L3": "auton_coral_scored_l3",
      "Coral Missed L3": "auton_coral_missed_l3",
      "Coral Scored L2": "auton_coral_scored_l2",
      "Coral Missed L2": "auton_coral_missed_l2",
      "Coral Scored L1": "auton_coral_scored_l1",
      "Coral Missed L1": "auton_coral_missed_l1",
      "Algae Scored Net": "auton_algae_scored_net",
      "Algae Missed Net": "auton_algae_missed_net",
      "Algae Scored Processor": "auton_algae_scored_processor",
    },
    "Endgame": {
      "Coral Intake": "endgame_coral_intake_capability",
      "Coral Station": "endgame_coral_station",
      "Algae Intake": "endgame_algae_intake_capability",
      "Climb Successful": "endgame_climb_successful",
      "Climb Type": "endgame_climb_type",
      "Climb Time": "endgame_climb_time",
    },
    "Overall": {
      "Robot Died": "overall_robot_died",
      "Defended Others": "overall_defended_others",
      "Was Defended": "overall_was_defended",
      "Defended": "overall_defended",
      "Defended by": "overall_defended_by",
      "Pushing": "overall_pushing",
      "Counter Defense": "overall_counter_defense",
      "Driver Skill": "overall_driver_skill",
      "# Penalties": "overall_num_penalties",
      "Penalties Incurred": "overall_penalties_incurred",
      "Comments": "overall_comments",
    },
  };
  function makeColumns() {
    const groups = [];
    for(const [section, fields] of Object.entries(columns)) {
      const group = [];
      for(const [title, field] of Object.entries(fields)) {
        group.push(
          <Column title={title} dataIndex={field} key={field} />
        );
      }
      groups.push(
        <ColumnGroup title={section} key={section}>
          {group}
        </ColumnGroup>
      );
    }

    return groups;
  }
  return (
    <>
      <meta name="viewport" content="maximum-scale=1.0" />
      <Header name={`Data for ${teamNumber}`} back="#scoutingapp/lookup/match" />
      <h2 style={{ whiteSpace: 'pre-line' }}>{loading ? "Loading..." : ""}</h2>
      <Table dataSource={matchData} >
        {makeColumns()}
      </Table>
    </>
  );
}

export default TeamData;
