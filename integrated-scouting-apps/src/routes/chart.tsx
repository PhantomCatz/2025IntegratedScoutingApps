import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import {Flex, Tabs } from "antd";

const chartOptions : any = {
  plugins: {
    legend: {
      labels: {
        font: {
          size: 18
        },
      }
    },
    tooltip: {
      titleFont: {
        size: 18 // Title font size
      },
      bodyFont: {
        size: 16 // Data font size
      }
    }
  },
  responsive: true,
  indexAxis: 'y', 
  scales: {
    x: {
      stacked: true, 
      beginAtZero: true,
    },
    y: {
      stacked: true,
      ticks: {
        font: {
          size: 18 // Adjust this for larger label text
        }
      }
    },
  },
};


function ChartComponent(props : any) {
  const [algaeChart, setAlgaeChart] = useState<any>(null);
  const [coralChart, setCoralChart] = useState<any>(null);

  const teamNumber = props.teamNumber;
  const index = props.index;
  
  useEffect(() => {
    (async function() {
      let ratio = {
        algae_scored_ratio: 0,
        algae_missed_ratio: 0,

        coral_scored_l1_ratio: 0,
        coral_scored_l2_ratio: 0,
        coral_scored_l3_ratio: 0,
        coral_scored_l4_ratio: 0,

        coral_missed_l1_ratio: 0,
        coral_missed_l2_ratio: 0,
        coral_missed_l3_ratio: 0,
        coral_missed_l4_ratio: 0,
      }

      const matchData = await getMatchData(teamNumber);

      // Calculate ratios
      ratio.algae_scored_ratio = matchData.algae_scored / matchData.algae_overall_total;
      ratio.algae_missed_ratio = matchData.algae_missed / matchData.algae_overall_total;

      ratio.coral_scored_l1_ratio = matchData.coral_scored_l1 / matchData.coral_overall_total;
      ratio.coral_scored_l2_ratio = matchData.coral_scored_l2 / matchData.coral_overall_total;
      ratio.coral_scored_l3_ratio = matchData.coral_scored_l3 / matchData.coral_overall_total;
      ratio.coral_scored_l4_ratio = matchData.coral_scored_l4 / matchData.coral_overall_total;

      ratio.coral_missed_l1_ratio = matchData.coral_missed_l1 / matchData.coral_overall_total;
      ratio.coral_missed_l2_ratio = matchData.coral_missed_l2 / matchData.coral_overall_total;
      ratio.coral_missed_l3_ratio = matchData.coral_missed_l3 / matchData.coral_overall_total;
      ratio.coral_missed_l4_ratio = matchData.coral_missed_l4 / matchData.coral_overall_total;


      const algaeContext = document.querySelector(`.algaeChart_${teamNumber}_${index}`) as HTMLCanvasElement;
      const algaeChart = new Chart(algaeContext, {
        type: 'bar',
        data: {
          labels: ['Algae'], 
          datasets: [ 
            {
              label: 'Algae Scored', 
              data: [ratio.algae_scored_ratio],
              backgroundColor: 'rgba(45, 255, 202, 0.3)', 
              borderColor: 'rgb(45, 255, 202)',
              borderWidth: 1,
              barPercentage: 0.3
            },
            {
              label: 'Algae Missed', 
              data: [ratio.algae_missed_ratio],
              backgroundColor: 'rgba(255, 255, 255, 0.3)', 
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 1,
              barPercentage: 0.3
            },
          ],
        },
        options: chartOptions
      });
      setAlgaeChart(algaeChart);

      const coralContext = document.querySelector(`.coralChart_${teamNumber}_${index}`) as HTMLCanvasElement;
      const coralChart = new Chart(coralContext, {
        type: 'bar',
        data: {
          labels: ['Coral'], 
          datasets: [
            {
              label: 'L4 Scored',
              data: [ratio.coral_scored_l4_ratio],
              backgroundColor: 'rgb(185, 52, 206, 0.3)', 
              borderColor: 'rgb(185, 52, 206)',
              borderWidth: 1,
              barPercentage: 0.3,
            },
            {
              label: 'L4 Missed', 
              data: [ratio.coral_missed_l4_ratio],
              backgroundColor: 'rgba(255, 255, 255, 0.3)', 
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 1,
              barPercentage: 0.3
            },
            {
              label: 'L3 Scored', 
              data: [ratio.coral_scored_l3_ratio],
              backgroundColor: 'rgba(164, 74, 249, 0.3)', 
              borderColor: 'rgb(164, 74, 249)',
              borderWidth: 1,
              barPercentage: 0.3
            },
            {
              label: 'L3 Missed',
              data: [ratio.coral_missed_l3_ratio],
              backgroundColor: 'rgba(255, 255, 255, 0.3)', 
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 1,
              barPercentage: 0.3
            },
            {
              label: 'L2 Scored',
              data: [ratio.coral_scored_l2_ratio],
              backgroundColor: 'rgba(74, 129, 249, 0.3)', 
              borderColor: 'rgb(74, 129, 249)',
              borderWidth: 1,
              barPercentage: 0.3
            },
            {
              label: 'L2 Missed', 
              data: [ratio.coral_missed_l2_ratio],
              backgroundColor: 'rgba(255, 255, 255, 0.3)', 
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 1,
              barPercentage: 0.3
            },
            {
              label: 'L1 Scored', 
              data: [ratio.coral_scored_l1_ratio],
              backgroundColor: 'rgba(85, 196, 251, 0.3)', 
              borderColor: 'rgb(85, 196, 251)',
              borderWidth: 1,
              barPercentage: 0.3
            },
            {
              label: 'L1 Missed', 
              data: [ratio.coral_missed_l1_ratio],
              backgroundColor: 'rgba(255, 255, 255, 0.3)', 
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 1,
              barPercentage: 0.3
            },
          ],
        },
        options: chartOptions
      });

      setCoralChart(coralChart);
    })()
    .catch((err) => {});
  }, []);

  async function getMatchData(teamNumber:number) : Promise<{
    coral_scored_l1: number,
    coral_scored_l2: number,
    coral_scored_l3: number,
    coral_scored_l4: number,
    coral_missed_l1: number,
    coral_missed_l2: number,
    coral_missed_l3: number,
    coral_missed_l4: number,
    coral_overall_total: number,
    algae_scored: number,
    algae_missed: number,
    algae_overall_total: number
  }> {
    let total = {
      coral_scored_l1: 0,
      coral_scored_l2: 0,
      coral_scored_l3: 0,
      coral_scored_l4: 0,
      coral_missed_l1: 0,
      coral_missed_l2: 0,
      coral_missed_l3: 0,
      coral_missed_l4: 0,
      coral_overall_total: 0,
      algae_scored: 0,
      algae_missed: 0,
      algae_overall_total: 0,

    };

    try {
      const table = [];

      let fetchLink = process.env.REACT_APP_SERVER_ADDRESS;

      if(!fetchLink) {
        console.error("Could not get fetch link. Check .env");
        return total;
      }

      fetchLink += "reqType=getTeam";
      fetchLink += `&team1=${teamNumber}`;

      const response = await fetch(fetchLink);
      const data : any[] = (await response.json())[teamNumber];

      for (const match of data) {
        for(let [field, value] of Object.entries(match)) {
          if(value === null || value === undefined) {
            continue;
          }
          if(field.startsWith("auton_")) {
            field = field.substring("auton_".length);
          }
          if(field.startsWith("teleop_")) {
            field = field.substring("teleop_".length);
          }
          switch(field) {
            case "coral_scored_l1":
              case "coral_scored_l2":
              case "coral_scored_l3":
              case "coral_scored_l4":
              case "coral_missed_l1":
              case "coral_missed_l2":
              case "coral_missed_l3":
              case "coral_missed_l4":
              total[field] += value as number;
            break;
            case "algae_scored_net":
              case "algae_scored_processor":
              total.algae_scored += value as number;
            break;
            case "algae_missed_net":
              total.algae_missed += value as number;
            break;
            default:
              break;
          }
        }
      }
      total.coral_overall_total = total.coral_scored_l1 + total.coral_scored_l2 + 
                                  total.coral_scored_l3 + total.coral_scored_l4 +
                                  total.coral_missed_l1 + total.coral_missed_l2 +
                                  total.coral_missed_l3 + total.coral_missed_l4;

      total.algae_overall_total = (total.algae_scored + total.algae_missed);

      // debug code. 
      /*
      console.log("total.coral_missed_l1: ", total.coral_missed_l1);
      console.log("total.coral_missed_l2: ", total.coral_missed_l2);
      console.log("total.coral_missed_l3: ", total.coral_missed_l3);
      console.log("total.coral_missed_l4: ", total.coral_missed_l4);
      console.log("total.coral_scored_l1: ", total.coral_scored_l1);
      console.log("total.coral_scored_l2: ", total.coral_scored_l2);
      console.log("total.coral_scored_l3: ", total.coral_scored_l3);
      console.log("total.coral_scored_l4: ", total.coral_scored_l4);
      console.log("total.algae_missed: ", total.algae_missed);
      console.log("total.algae_scored: ", total.algae_scored);
      console.log("total.coral_overall_total: ", total.coral_overall_total);
      console.log("total.algae_overall_total: ", total.algae_overall_total);
      */

      return total;
    }
    catch (err) {
      console.log("Error occured when getting data: ", err);
      return total;
    }
  }

  return (
      <div  style={{ padding: '50px'}}>
        <h2>Algae: Processsed v. Netted</h2>
        {<canvas className={`algaeChart_${teamNumber}_${index}`}></canvas>}
        <h2>Coral: L1 v. L2 v. L3 v. L4</h2>
        {<canvas className={`coralChart_${teamNumber}_${index}`}></canvas>}
      </div>
  );
}

export default ChartComponent;
