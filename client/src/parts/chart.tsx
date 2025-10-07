import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ChartComponent(props : any) {
  const autonAlgaeCanvas = useRef(null);
  const teleopAlgaeCanvas = useRef(null);
  const autonCoralCanvas = useRef(null);
  const teleopCoralCanvas = useRef(null);

  const teamNumber = props.teamNumber;
  const index = props.index;
  const teamMatches = props.teamMatches; // [{<field>:<value>},...] for field, value in match database

  useEffect(() => {
    if(!(autonAlgaeCanvas.current &&
        teleopAlgaeCanvas.current &&
        autonCoralCanvas.current &&
        teleopCoralCanvas.current
        )) {
      return;
    }
    const matchNumbers = teamMatches.map(function(row) {
      const match_level = row.match_level;
      const match_number = row.match_number;

      return match_level[0] + match_number;
    });

    createChart(autonAlgaeCanvas.current, teamMatches, matchNumbers, {
      "Scored": {
        "Net": "auton_algae_scored_net",
        "Processor": "auton_algae_scored_processor",
      },
      "Missed": {
        "Net": "auton_algae_missed_net",
      },
    });
    createChart(teleopAlgaeCanvas.current, teamMatches, matchNumbers, {
      "Scored": {
        "Net": "teleop_algae_scored_net",
        "Processor": "teleop_algae_scored_processor",
      },
      "Missed": {
        "Net": "teleop_algae_missed_net",
      },
    });
    createChart(autonCoralCanvas.current, teamMatches, matchNumbers, {
      "Scored": {
        "L1": "auton_coral_scored_l1",
        "L2": "auton_coral_scored_l2",
        "L3": "auton_coral_scored_l3",
        "L4": "auton_coral_scored_l4",
      },
      "Missed": {
        "L1": "auton_coral_missed_l1",
        "L2": "auton_coral_missed_l2",
        "L3": "auton_coral_missed_l3",
        "L4": "auton_coral_missed_l4",
      },
    });
    createChart(teleopCoralCanvas.current, teamMatches, matchNumbers, {
      "Scored": {
        "L1": "teleop_coral_scored_l1",
        "L2": "teleop_coral_scored_l2",
        "L3": "teleop_coral_scored_l3",
        "L4": "teleop_coral_scored_l4",
      },
      "Missed": {
        "L1": "teleop_coral_missed_l1",
        "L2": "teleop_coral_missed_l2",
        "L3": "teleop_coral_missed_l3",
        "L4": "teleop_coral_missed_l4",
      },
    });

  }, [autonAlgaeCanvas.current, teleopAlgaeCanvas.current, autonCoralCanvas.current, teleopCoralCanvas.current]);


  return (
      <>
        <h2>Auton Algae</h2>
        {<canvas ref={autonAlgaeCanvas}></canvas>}
        <h2>Teleop Algae</h2>
        {<canvas ref={teleopAlgaeCanvas}></canvas>}
        <h2>Auton Coral</h2>
        {<canvas ref={autonCoralCanvas}></canvas>}
        <h2>Teleop Coral</h2>
        {<canvas ref={teleopCoralCanvas}></canvas>}
      </>
  );
}

function createChart(canvas, teamMatches, matchNumbers, config) {
  const values = [];
  const averages = [];
  for(const [line, names] of Object.entries(config)) {
    let average = 0;
    const data = teamMatches.map(function(row) {
      let value = 0;
      for(const [name, item] of Object.entries(names)) {
        value += row[item];
      }
      average += value;

      return value;
    });

    values.push({
      label: line,
      data: data,
    });

    if(teamMatches.length > 0) {
      average /= teamMatches.length;
    }
    averages.push({
      label: `Average ${line}`,
      data: Array(teamMatches.length).fill(average),
      pointRadius: 0,
    });
  }

  function tooltip(items) {
    const dataPoint = items[0];
    const match = teamMatches[dataPoint.dataIndex];

    const entry = config[dataPoint.dataset.label];
    if(!entry) {
      return '';
    }
    const names = Object.entries(entry);

    let message = `${names[0][0]}: ${match[names[0][1]]}`;

    for(let i = 1; i < names.length; i++) {
      message += `\n${names[i][0]}: ${match[names[i][1]]}`;
    }

    return message;
  }

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: matchNumbers,
      datasets: [...values, ...averages, ]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            footer: tooltip,
          }
        }
      }
    }
  });
}


export default ChartComponent;
