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
        labels: ['Match 1', 'Match 2', 'Match 3','Match 4','Match 5', 'Match 6'], // x-axis labels
        datasets: [
          {
            label: '# of Coral', // First dataset
            data: [12, 19, 3, 13, 21, 10],
            backgroundColor: 'rgba(153, 102, 255, 0.2)', 
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
          {
            label: '# of Algae', // Second dataset
            data: [7, 6, 4, 2, 5, 9],
            backgroundColor: 'rgba(72, 201, 176, 0.2)', 
            borderColor: 'rgba(72, 201, 176, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true, // Ensure the y-axis starts at zero
          },
        },
      },
    });

    const ctx2 = document.getElementById('chart2') as HTMLCanvasElement;
new Chart(ctx2, {
  type: 'bar',
  data: {
    labels:['Match 1', 'Match 2', 'Match 3','Match 4','Match 5', 'Match 6'],
    datasets: [
      {
        label: '# Auton scored', // First dataset
        data: [12, 19, 3, 13, 21, 10],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: '# Teleop scored', // Second dataset
        data: [7, 6, 4, 2, 5, 9],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '# End scored', // Second dataset
        data: [2, 3, 5, 4, 6, 7],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        mode: 'index', // Ensures tooltips for both datasets are visible
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true, // Enable stacking for x-axis
      },
      y: {
        stacked: true, // Enable stacking for y-axis
        beginAtZero: true,
      },
    },
  },
});

    

    const ctx3 = document.getElementById('chart3') as HTMLCanvasElement;
    new Chart(ctx3, {
      type: 'line',
      data: {
        labels: ['Match 1', 'Match 2', 'Match 3','Match 4','Match 5', 'Match 6'],
        datasets: [
          {
            label: '# Auton scored', // First dataset
            data: [12, 19, 8, 13, 21, 10],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
          },
          {
            label: '# Teleop scored', // Second dataset
            data: [7, 6, 4, 2, 5, 9],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
          },
          {
            label: '# End scored', // Second dataset
            data: [2, 3, 5, 4, 6, 7],
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (

      <div className='banner'>
      <meta name="viewport" content="maximum-scale=1.0" />
        <header>
          <a href='/dtf'><img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt=''></img></a>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={logo} style={{ height: 256 + 'px' }} alt=''></img>
                </td>
                <td>
                  <h1 style={{ display: 'inline-block', textAlign: 'center' }}>2637 Data Charts</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
      <div  style={{ padding: '50px'}}>
        <h2>Chart 1: Coral v. Algae</h2>
        <canvas id="chart1"></canvas>
        <h2>Chart 2: Segmented Bar Chart</h2>
        <canvas id="chart2"></canvas>
        <h2>Chart 3: Line Chart</h2>
        <canvas id="chart3"></canvas>
      </div>
    </div>
  );
}

export default ChartComponent;
