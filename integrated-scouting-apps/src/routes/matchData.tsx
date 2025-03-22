import '../public/stylesheets/style.css';
import '../public/stylesheets/teamdata.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import Header from "./parts/header";

const DATA_COLUMNS = {
  "Match Identifier": {
    "Match Event": "match_event",
    "Scouter Initials": "scouter_initials",
    "Match Level": "match_level",
    "Match #": "match_number",
    "Robot Starting Position": "robot_starting_position",
  },
  "Teleop": {
    "Coral L4": "teleop_coral_l4",
    "Coral L3": "teleop_coral_l3",
    "Coral L2": "teleop_coral_l2",
    "Coral L1": "teleop_coral_l1",
    "Algae Net": "teleop_algae_net",
    "Algae Scored Processor": "teleop_algae_scored_processor",
  },
  "Auton": {
    "Left Starting Line": "auton_leave_starting_line",
    "Coral L4": "auton_coral_l4",
    "Coral L3": "auton_coral_l3",
    "Coral L2": "auton_coral_l2",
    "Coral L1": "auton_coral_l1",
    "Algae Net": "auton_algae_net",
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

const HIDABLE_FIELDS : any = {
  //"teleop_coral_scored_l4": false,
  //"teleop_coral_missed_l4": false,
  //"teleop_coral_scored_l3": false,
  //"teleop_coral_missed_l3": false,
  //"teleop_coral_scored_l2": false,
  //"teleop_coral_missed_l2": false,
  //"teleop_coral_scored_l1": false,
  //"teleop_coral_missed_l1": false,
  //"teleop_algae_scored_net": false,
  //"teleop_algae_missed_net": false,
  "teleop_algae_scored_processor": false,

  //"auton_coral_scored_l4": false,
  //"auton_coral_missed_l4": false,
  //"auton_coral_scored_l3": false,
  //"auton_coral_missed_l3": false,
  //"auton_coral_scored_l2": false,
  //"auton_coral_missed_l2": false,
  //"auton_coral_scored_l1": false,
  //"auton_coral_missed_l1": false,
  //"auton_algae_scored_net": false,
  //"auton_algae_missed_net": false,
  "auton_algae_scored_processor": false,
};

const FIXED_FIELDS : any = {
    "match_number": true,
};

function TeamData(props: any) {
  const { teamNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState<{ [x: string]: any; }[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState({...HIDABLE_FIELDS});

  useEffect(() => { document.title = props.title }, [props.title]);
  useEffect(() => {
    async function fetchData(teamNumber: number) {
      try {
        let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

        if(!fetchLink) {
          console.error("Could not get fetch link. Check .env");
          return;
        }

        fetchLink += "reqType=getTeam";
        fetchLink += `&team1=${teamNumber}`;

        const response = await (await fetch(fetchLink)).json();
        
        const table = [];
        const data : any[] = response[1];

        for (const match of data) {
          const row : any = {};

          for (const field in match) {
            const [result, location, empty] = getCellValue(field, match[field], match);

            if(location === null) {
              continue;
            }
            row[location] = result;

            if(hiddenColumns[location] === false && empty === false) {
              hiddenColumns[location] = true;
            }
          }
          //const key = `${match.id}`;
          const key = `${match.match_event}|${match.match_level}|${match.match_number}|${match.scouter_initials}`;
          row["key"] = key;

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
  useEffect(() => {
    fixFields();
  }, [matchData]);

  const fixedFields : number[] = [];

  let titleCount = 0;

  function getCellValue(field : any, value : any, data : any) : any {
    let result = null;
    let location = null;
    let empty = null;

    switch(field) {
      case "auton_coral_scored_l4":
      case "auton_coral_scored_l3":
      case "auton_coral_scored_l2":
      case "auton_coral_scored_l1":
      case "auton_algae_scored_net":
      case "teleop_coral_scored_l4":
      case "teleop_coral_scored_l3":
      case "teleop_coral_scored_l2":
      case "teleop_coral_scored_l1":
      case "teleop_algae_scored_net":
        const scored = value;
        const missed = data[field.replace("scored", "missed")];
        const total = scored + missed;

        result = `${scored}/${total}`;
        location = field.replace("_scored", "");
        empty = false;
        break;
      case "auton_leave_starting_line":
      case "endgame_climb_successful":
      case "overall_robot_died":
      case "overall_defended_others":
      case "overall_was_defended":
        result = (<div className={`booleanValue booleanValue__${!!value}`} key={`field`}>&nbsp;</div>);
        location = field;
        empty = !!value;
        break;
      case "overall_comments":
        result = value.replaceAll("\\n", "\n");
        location = field;
        break;
      case "match_event":
      case "scouter_initials":
      case "match_level":
      case "match_number":
      case "robot_position":
      case "robot_starting_position":
      case "auton_algae_scored_processor":
      case "teleop_algae_scored_processor":
      case "endgame_coral_intake_capability":
      case "endgame_coral_station":
      case "endgame_algae_intake_capability":
      case "endgame_climb_type":
      case "endgame_climb_time":
      case "overall_defended":
      case "overall_defended_by":
      case "overall_pushing":
      case "overall_counter_defense":
      case "overall_driver_skill":
      case "overall_num_penalties":
      case "overall_penalties_incurred":
        result = data[field].toString();
        location = field;
        break;
      case "team_number":
      case "auton_coral_missed_l4":
      case "auton_coral_missed_l3":
      case "auton_coral_missed_l2":
      case "auton_coral_missed_l1":
      case "auton_algae_missed_net":
      case "teleop_coral_missed_l4":
      case "teleop_coral_missed_l3":
      case "teleop_coral_missed_l2":
      case "teleop_coral_missed_l1":
      case "teleop_algae_missed_net":
        break;
      default:
        console.error(`Unknown field`, field);
        break;
    }

    return [result, location, empty];
  }
  function makeColumns() {
    const groups = [];
    for(const [section, fields] of Object.entries(DATA_COLUMNS)) {
      const group = [];
      for(const [title, field] of Object.entries(fields)) {
        if(hiddenColumns[field] === false) {
          continue;
        }

        if(FIXED_FIELDS[field] === true) {
          fixedFields.push(titleCount);
        }
        group.push(
          <Column title={title} dataIndex={field} key={field} />
        );
        titleCount++;
      }
      groups.push(
        <ColumnGroup title={section} key={section}>
          {group}
        </ColumnGroup>
      );
    }

    fixFields();
    return groups;
  }

  function fixFields() {
    //console.log("fixedFields=", fixedFields);
    for(const num of fixedFields) {
      document.querySelectorAll(`.matchDataTable table tr > :nth-child(${num + 1}):not([scope=colgroup])`)
      .forEach((x : any) => {
        x.classList.add("cell__fixed");
      });
    }
  }
  
  return (
    <>
      <meta name="viewport" content="maximum-scale=1.0" />
      <Header name={`Data for ${teamNumber}`} back="#scoutingapp/lookup/match" />
      <h2 style={{ whiteSpace: 'pre-line' }}>{loading ? "Loading..." : ""}</h2>
      <Table dataSource={matchData} className={"matchDataTable"}>
      {
        makeColumns()
      }
        
      </Table>
    </>
  );
}

export default TeamData;
