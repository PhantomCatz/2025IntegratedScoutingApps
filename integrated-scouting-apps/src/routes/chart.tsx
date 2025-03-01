import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import {Flex, Tabs } from "antd";


function ChartComponent(props : any) {

  const teamNumber = props.teamNumber;
  const index = props.index;

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
    alage_overall_total: number
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
      alage_overall_total: 0
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

      for (let i = 0; i < data.length; i++) {

        
        // total.coral_scored_l1 = auton_coral_scored_l1 + teleop_coral_scored_l1
        if (data[i].auton_coral_scored_l1 !== null && data[i].auton_coral_scored_l1 != undefined) {
          total.coral_scored_l1 += data[i].auton_coral_scored_l1;
        }


        if (data[i].teleop_coral_scored_l1 !== null && data[i].teleop_coral_scored_l1 !== undefined) {
          total.coral_scored_l1 += data[i].teleop_coral_scored_l1;
        }

        // total.coral_scored_l2 = auton_coral_scored_l2 + teleop_coral_scored_l2
        if (data[i].auton_coral_scored_l2 !== null && data[i].auton_coral_scored_l2 !== undefined) {
          total.coral_scored_l2 += data[i].auton_coral_scored_l2;
        }

        if (data[i].teleop_coral_scored_l2 !== null && data[i].teleop_coral_scored_l2 !== undefined) {
          total.coral_scored_l2 += data[i].teleop_coral_scored_l2;
        }

        // total.coral_scored_l3 = auton_coral_scored_l3 + teleop_coral_scored_l3
        if (data[i].auton_coral_scored_l3 !== null && data[i].auton_coral_scored_l3 !== undefined) {
          total.coral_scored_l3 += data[i].auton_coral_scored_l3;
        }

        if (data[i].teleop_coral_scored_l3 !== null && data[i].teleop_coral_scored_l3 !== undefined) {
          total.coral_scored_l3 += data[i].teleop_coral_scored_l3;
        }

        // total.coral_scored_l4 = auton_coral_scored_l4 + teleop_coral_scored_l4
        if (data[i].auton_coral_scored_l4 !== null && data[i].auton_coral_scored_l4 !== undefined) {
          total.coral_scored_l4 += data[i].auton_coral_scored_l4;
        }

        if (data[i].teleop_coral_scored_l4 !== null && data[i].teleop_coral_scored_l4 !== undefined) {
          total.coral_scored_l4 += data[i].teleop_coral_scored_l4;
        }

        // TODO:  need to verify that the data is valid. 
        if (data[i].auton.coral_missed_l1 !== null && data[i].auton.coral_missed_l1 !== undefined) {
          total.coral_missed_l1 += data[i].auton_coral_missed_l1;
        }

        if (data[i].teleop.coral_missed_l1 !== null && data[i].teleop.coral_missed_l1 !== undefined) {
          total.coral_missed_l1 += data[i].teleop_coral_missed_l1;
        }

        if (data[i].auton.coral_missed_l2  !== null && data[i].auton.coral_missed_l2 !== undefined) {
          total.coral_missed_l2 += data[i].auton_coral_missed_l2;
        }

        if (data[i].teleop.coral_missed_l2 !== null && data[i].teleop.coral_missed_l2 !== undefined) {
          total.coral_missed_l2 += data[i].teleop_coral_missed_l2;
        }

        if (data[i].auton.coral_missed_l3 !== null && data[i].auton.coral_missed_l3 !== undefined) {
          total.coral_missed_l3 += data[i].auton_coral_missed_l3;
        }

        if (data[i].teleop.coral_missed_l3 !== null && data[i].teleop.coral_missed_l3 !== undefined) {
          total.coral_missed_l3 += data[i].teleop_coral_missed_l3;
        }

        if (data[i].auton.coral_missed_l4 !== null && data[i].auton.coral_missed_l4 !== undefined) {
          total.coral_missed_l4 += data[i].auton_coral_missed_l4;
        }

        if (data[i].teleop.coral_missed_l4 !== null && data[i].teleop.coral_missed_l4 !== undefined) {
          total.coral_missed_l4 += data[i].teleop_coral_missed_l4;
        }
        
        total.algae_scored += (data[i].auton_algae_scored_net + data[i].teleop_algae_scored_net);
        total.algae_missed += (data[i].auton_algae_missed_net + data[i].teleop_algae_missed_net);

        total.coral_overall_total += (total.coral_scored_l1 + total.coral_scored_l2 + 
                                      total.coral_scored_l3 + total.coral_scored_l4 +
                                      total.coral_missed_l1 + total.coral_missed_l2 + total.coral_missed_l3 + 
                                      total.coral_missed_l4);

        total.alage_overall_total += total.algae_scored + total.algae_missed;
      }

      // debug code. 
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
      console.log("total.alage_overall_total: ", total.alage_overall_total);

      return total;

    }
    catch (err) {
      console.log("Error occured when getting data: ", err);
      return total;
    }
  }
  


  useEffect(() => {(
    async function() {

      const matchData = await getMatchData(teamNumber);

      // Calculate ratios
      let algae_scored_ratio = matchData.algae_scored / matchData.alage_overall_total;
      let algae_missed_ratio = matchData.algae_missed / matchData.alage_overall_total;

      let coral_scored_l1_ratio = matchData.coral_scored_l1 / matchData.coral_overall_total;
      let coral_scored_l2_ratio = matchData.coral_scored_l2 / matchData.coral_overall_total;
      let coral_scored_l3_ratio = matchData.coral_scored_l3 / matchData.coral_overall_total;
      let coral_scored_l4_ratio = matchData.coral_scored_l4 / matchData.coral_overall_total;

      let coral_missed_l1_ratio = matchData.coral_missed_l1 / matchData.coral_overall_total;
      let coral_missed_l2_ratio = matchData.coral_missed_l2 / matchData.coral_overall_total;
      let coral_missed_l3_ratio = matchData.coral_missed_l3 / matchData.coral_overall_total;
      let coral_missed_l4_ratio = matchData.coral_missed_l4 / matchData.coral_overall_total;


    const ctx1 = document.querySelector(`.chart1_${teamNumber}_${index}`) as HTMLCanvasElement;
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Algae'], 
        datasets: [ 
          {
            label: 'Algae Scored', 
            data: [algae_scored_ratio],
            backgroundColor: 'rgb(72, 175, 201, 0.2)', 
            borderColor: 'rgb(72, 175, 201)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: 'Algae Missed', 
            data: [algae_missed_ratio],
            backgroundColor: 'rgba(45, 255, 202, 0.2)', 
            borderColor: 'rgb(45, 255, 202)',
            borderWidth: 1,
            barPercentage: 0.3
          },

        ],
      },
      options: {
        responsive: true,
        indexAxis: 'y', 
        scales: {
          x: {
            stacked: true, 
            beginAtZero: true,
          },
          y: {
            stacked: true,
          },
        },
      }
    });

    // const ctx2 = document.getElementById('chart2') as HTMLCanvasElement;
    const ctx2 = document.querySelector(`.chart2_${teamNumber}_${index}`) as HTMLCanvasElement;
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Coral'], 
        datasets: [
          {
            label: 'L4 scored',
            data: [coral_scored_l4_ratio],
            backgroundColor: 'rgba(255, 52, 42, 0.2)', 
            borderColor: 'rgb(255, 52, 42)',
            borderWidth: 1,
            barPercentage: 0.3,
          },
          {
            label: 'L4 missed', 
            data: [coral_missed_l4_ratio],
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: 'L3 scored', 
            data: [coral_scored_l3_ratio],
            backgroundColor: 'rgba(85, 196, 251, 0.2)', 
            borderColor: 'rgb(85, 196, 251)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: 'L3 missed',
            data: [coral_missed_l3_ratio],
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: 'L2 scored',
            data: [coral_scored_l2_ratio],
            backgroundColor: 'rgba(78, 216, 135, 0.2)', 
            borderColor: 'rgb(78, 216, 135)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: 'L2 missed', 
            data: [coral_missed_l2_ratio],
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: 'L1 scored', 
            data: [coral_scored_l1_ratio],
            backgroundColor: 'rgba(255, 252, 89, 0.2)', 
            borderColor: 'rgb(255, 252, 89)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: 'L1 missed', 
            data: [coral_missed_l1_ratio],
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 1,
            barPercentage: 0.3
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: 'y', 
        scales: {
          x: {
            stacked: true, 
            beginAtZero: true,
          },
          y: {
            stacked: true,
          },
        },
      }
    });
  })()
  }, []);

const a=0;

  return (
      <div  style={{ padding: '50px'}}>
        <h2>Algae: Processsed v. Netted</h2>
        {<canvas className={`chart1_${teamNumber}_${index}`}></canvas>}
        <h2>Coral: L1 v. L2 v. L3 v. L4</h2>
        {<canvas className={`chart2_${teamNumber}_${index}`}></canvas>}
      </div>
  );
}

export default ChartComponent;
