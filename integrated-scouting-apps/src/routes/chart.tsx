import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import {Flex, Tabs } from "antd";
function ChartComponent() {
  useEffect(() => {
    const ctx1 = document.getElementById('chart1') as HTMLCanvasElement;
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Algae scored'], 
        datasets: [
          {
            label: '# processed', 
            data: [12],
            backgroundColor: 'rgb(72, 175, 201, 0.2)', 
            borderColor: 'rgb(72, 175, 201)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: '# netted', 
            data: [7],
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

    const ctx2 = document.getElementById('chart2') as HTMLCanvasElement;
    //const ctx2 = ((<canvas></canvas>) as any) as HTMLCanvasElement;
new Chart(ctx2, {
  type: 'bar',
      data: {
        labels: ['Coral scored'], 
        datasets: [
          {
            label: '#L1 scored',
            data: [15],
            backgroundColor: 'rgba(255, 52, 42, 0.2)', 
            borderColor: 'rgb(255, 52, 42)',
            borderWidth: 1,
            barPercentage: 0.3,
          },
          {
            label: '#L1 missedd', 
            data: [5],
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: '#L2 scored', 
            data: [16],
            backgroundColor: 'rgba(85, 196, 251, 0.2)', 
            borderColor: 'rgb(85, 196, 251)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: '#L2 attempted',
            data: [7],
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: '#L3 scored',
            data: [10],
            backgroundColor: 'rgba(78, 216, 135, 0.2)', 
            borderColor: 'rgb(78, 216, 135)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: '#L3 attempted', 
            data: [1],
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: '#L4 scored', 
            data: [17],
            backgroundColor: 'rgba(255, 252, 89, 0.2)', 
            borderColor: 'rgb(255, 252, 89)',
            borderWidth: 1,
            barPercentage: 0.3
          },
          {
            label: '#L4 attempted', 
            data: [7],
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
  }, []);

  return (
      <div  style={{ padding: '50px'}}>
        <h2>Algae: Processsed v. Netted</h2>
        {<canvas id="chart1"></canvas>}
        <h2>Coral: L1 v. L2 v. L3 v. L4</h2>
        {<canvas id="chart2"></canvas>}
      </div>
  );
}

export default ChartComponent;
