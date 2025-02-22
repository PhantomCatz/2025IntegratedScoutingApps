import '../public/stylesheets/style.css';
import '../public/stylesheets/teamdata.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import Header from "./header";

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

        const response = await fetch(fetchLink);
        const data : any[] = (await response.json())[teamNumber];

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
            default:
              row[field] = match[field].toString();
              break;
            }
          }
          row["key"] = `${match.match_event}|${match.match_level}|${match.match_number}|${match.scouter_initials}`;
          table.push(row);
        }

        console.log("table=", table);
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
  return (
    <>
      <meta name="viewport" content="maximum-scale=1.0" />
      <Header name={`Data for ${teamNumber}`} back="/scoutingapp/lookup/match" />
      <h2 style={{ whiteSpace: 'pre-line' }}>{loading ? "Loading..." : ""}</h2>
      <Table dataSource={matchData} >
        <ColumnGroup title="Match Identifier">
          <Column title="Match Event" dataIndex="match_event" key="match_event"/>
          <Column title="Scouter Initials" dataIndex="scouter_initials" key="scouter_initials"/>
          <Column title="Match Level" dataIndex="match_level" key="match_level"/>
          <Column title="Match #" dataIndex="match_number" key="match_number"/>
          <Column title="Robot Starting Position" dataIndex="robot_starting_position" key="robot_starting_position"/>
        </ColumnGroup>
        <ColumnGroup title="Auton">
          <Column title="Left Starting Line" dataIndex="auton_leave_starting_line" key="auton_leave_starting_line"/>
          <Column title="Coral Scored L4" dataIndex="auton_coral_scored_l4" key="auton_coral_scored_l4"/>
          <Column title="Coral Missed L4" dataIndex="auton_coral_missed_l4" key="auton_coral_missed_l4"/>
          <Column title="Coral Scored L3" dataIndex="auton_coral_scored_l3" key="auton_coral_scored_l3"/>
          <Column title="Coral Missed L3" dataIndex="auton_coral_missed_l3" key="auton_coral_missed_l3"/>
          <Column title="Coral Scored L2" dataIndex="auton_coral_scored_l2" key="auton_coral_scored_l2"/>
          <Column title="Coral Missed L2" dataIndex="auton_coral_missed_l2" key="auton_coral_missed_l2"/>
          <Column title="Coral Scored L1" dataIndex="auton_coral_scored_l1" key="auton_coral_scored_l1"/>
          <Column title="Coral Missed L1" dataIndex="auton_coral_missed_l1" key="auton_coral_missed_l1"/>
          <Column title="Algae Scored Net" dataIndex="auton_algae_scored_net" key="auton_algae_scored_net"/>
          <Column title="Algae Missed Net" dataIndex="auton_algae_missed_net" key="auton_algae_missed_net"/>
          <Column title="Algae Scored Processor" dataIndex="auton_algae_scored_processor" key="auton_algae_scored_processor"/>
        </ColumnGroup>
        <ColumnGroup title="Teleop">
          <Column title="Coral Scored L4" dataIndex="teleop_coral_scored_l4" key="teleop_coral_scored_l4"/>
          <Column title="Coral Missed L4" dataIndex="teleop_coral_missed_l4" key="teleop_coral_missed_l4"/>
          <Column title="Coral Scored L3" dataIndex="teleop_coral_scored_l3" key="teleop_coral_scored_l3"/>
          <Column title="Coral Missed L3" dataIndex="teleop_coral_missed_l3" key="teleop_coral_missed_l3"/>
          <Column title="Coral Scored L2" dataIndex="teleop_coral_scored_l2" key="teleop_coral_scored_l2"/>
          <Column title="Coral Missed L2" dataIndex="teleop_coral_missed_l2" key="teleop_coral_missed_l2"/>
          <Column title="Coral Scored L1" dataIndex="teleop_coral_scored_l1" key="teleop_coral_scored_l1"/>
          <Column title="Coral Missed L1" dataIndex="teleop_coral_missed_l1" key="teleop_coral_missed_l1"/>
          <Column title="Algae Scored Net" dataIndex="teleop_algae_scored_net" key="teleop_algae_scored_net"/>
          <Column title="Algae Missed Net" dataIndex="teleop_algae_missed_net" key="teleop_algae_missed_net"/>
          <Column title="Algae Scored Processor" dataIndex="teleop_algae_scored_processor" key="teleop_algae_scored_processor"/>
        </ColumnGroup>
        <ColumnGroup title="Endgame">
          <Column title="Coral Intake" dataIndex="endgame_coral_intake_capability" key="endgame_coral_intake_capability"/>
          <Column title="Coral Station" dataIndex="endgame_coral_station" key="endgame_coral_station"/>
          <Column title="Algae Intake" dataIndex="endgame_algae_intake_capability" key="endgame_algae_intake_capability"/>
          <Column title="Climb Successful" dataIndex="endgame_climb_successful" key="endgame_climb_successful"/>
          <Column title="Climb Type" dataIndex="endgame_climb_type" key="endgame_climb_type"/>
          <Column title="Climb Time" dataIndex="endgame_climb_time" key="endgame_climb_time"/>
        </ColumnGroup>
        <ColumnGroup title="Overall">
          <Column title="Robot Died" dataIndex="overall_robot_died" key="overall_robot_died"/>
          <Column title="Defended Others" dataIndex="overall_defended_others" key="overall_defended_others"/>
          <Column title="Was Defended" dataIndex="overall_was_defended" key="overall_was_defended"/>
          <Column title="Defended" dataIndex="overall_defended" key="overall_defended"/>
          <Column title="Defended by" dataIndex="overall_defended_by" key="overall_defended_by"/>
          <Column title="Pushing" dataIndex="overall_pushing" key="overall_pushing"/>
          <Column title="Counter Defense" dataIndex="overall_counter_defense" key="overall_counter_defense"/>
          <Column title="Driver Skill" dataIndex="overall_driver_skill" key="overall_driver_skill"/>
          <Column title="# Penalties" dataIndex="overall_num_penalties" key="overall_num_penalties"/>
          <Column title="Penalties Incurred" dataIndex="overall_penalties_incurred" key="overall_penalties_incurred"/>
          <Column title="Comments" dataIndex="overall_comments" key="overall_comments"/>
        </ColumnGroup>
      </Table>
    </>
  );
}

export default TeamData;
