import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { splitString, } from '../utils/utils';

function ChartComponent(props : any) {
  const autonAlgaeCanvas = useRef(null);
  const teleopAlgaeCanvas = useRef(null);
  const autonCoralCanvas = useRef(null);
  const teleopCoralCanvas = useRef(null);

  const teamNumber = props.teamNumber;
  const index = props.index;
  const teamMatches = props.teamMatches; // [{<field>:<value>},...] for field, value in match database
  const teamStrategic = props.teamStrategic; // [{<field>:<value>},...] for field, value in match database

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

    function commentCallback(message, items) {
      const dataPoint = items[0];
      const match = teamMatches[dataPoint.dataIndex];
      const match_number = match.match_number;
      const match_level = match.match_level;

      const currentTeamMatches = teamMatches.filter((row) => row.match_number === match_number && row.match_level === match_level);
      const currentStrategicMatches = teamStrategic.filter((row) => row.match_number === match_number && row.match_level === match_level);
      const comments = [];
      for(const match of currentTeamMatches) {
        message.push("MS: " + match.overall_comments);
      }
      for(const match of currentStrategicMatches) {
        message.push("SS: " + match.comments);
      }
    }

    createChart(autonAlgaeCanvas.current, teamMatches, matchNumbers, {
      "Scored": {
        values: {
          "Net": "auton_algae_scored_net",
          "Processor": "auton_algae_scored_processor",
        },
        calculateAverage: true,
      },
      "Missed": {
        values: {
          "Net": "auton_algae_missed_net",
        },
        calculateAverage: true,
      },
    }, commentCallback);
    createChart(teleopAlgaeCanvas.current, teamMatches, matchNumbers, {
      "Scored": {
        values: {
          "Net": "teleop_algae_scored_net",
          "Processor": "teleop_algae_scored_processor",
        },
        calculateAverage: true,
      },
      "Missed": {
        values: {
          "Net": "teleop_algae_missed_net",
        },
        calculateAverage: true,
      },
    }, commentCallback);
    createChart(autonCoralCanvas.current, teamMatches, matchNumbers, {
      "Scored": {
        values: {
          "L1": "auton_coral_scored_l1",
          "L2": "auton_coral_scored_l2",
          "L3": "auton_coral_scored_l3",
          "L4": "auton_coral_scored_l4",
        },
        calculateAverage: true,
      },
      "Missed": {
        values: {
          "L1": "auton_coral_missed_l1",
          "L2": "auton_coral_missed_l2",
          "L3": "auton_coral_missed_l3",
          "L4": "auton_coral_missed_l4",
        },
        calculateAverage: true,
      },
    }, commentCallback);
    createChart(teleopCoralCanvas.current, teamMatches, matchNumbers, {
      "Scored": {
        values: {
          "L1": "teleop_coral_scored_l1",
          "L2": "teleop_coral_scored_l2",
          "L3": "teleop_coral_scored_l3",
          "L4": "teleop_coral_scored_l4",
        },
        calculateAverage: true,
      },
      "Missed": {
        values: {
          "L1": "teleop_coral_missed_l1",
          "L2": "teleop_coral_missed_l2",
          "L3": "teleop_coral_missed_l3",
          "L4": "teleop_coral_missed_l4",
        },
        calculateAverage: true,
      },
    }, commentCallback);

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

function createChart(canvas, teamMatches, matchNumbers, config, tooltipCallback) {
  const values = [];
  const averages = [];
  for(const [dataLine, lineOptions] of Object.entries(config)) {
    const doAverage = lineOptions.calculateAverage;
    let average = 0;
    const data = teamMatches.map(function(row) {
      let value = 0;
      for(const [name, item] of Object.entries(lineOptions.values)) {
        value += row[item];
      }

      if(doAverage) {
        average += value;
      }

      return value;
    });

    values.push({
      label: dataLine,
      data: data,
    });

    if(doAverage) {
      if(teamMatches.length > 0) {
        average /= teamMatches.length;
      }
      averages.push({
        label: `Average ${dataLine}`,
        data: Array(teamMatches.length).fill(average),
        pointRadius: 0,
      });
    }
  }

  function tooltip(items) {
    let message = [];
    for(const dataPoint of items) {
      const match = teamMatches[dataPoint.dataIndex];

      const entry = config[dataPoint.dataset.label]?.values;
      if(!entry) {
        continue;
      }
      const names = Object.entries(entry);


      message.push(`${dataPoint.dataset.label}:`);
      message.push(`${names[0][0]}: ${match[names[0][1]]}`);


      for(let i = 1; i < names.length; i++) {
        message.push(`${names[i][0]}: ${match[names[i][1]]}`);
      }

      if(tooltipCallback) {
        tooltipCallback(message, items);
      }
    }

    const lineLength = 80;
    const lineSep = "\n";
    const wrappedLines = message.map((l) => splitString(l, lineLength).join(lineSep));

    return wrappedLines.join(lineSep);
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
