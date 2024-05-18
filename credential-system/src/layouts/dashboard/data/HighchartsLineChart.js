// HighchartsLineChart.js
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useReportsLineChartData from 'layouts/dashboard/data/reportsLineChartData';

const HighchartsLineChart = () => {
  const { tasks } = useReportsLineChartData();

  const options = {
    title: {
      text: 'User Requests per Month'
    },
    xAxis: {
      categories: tasks.labels
    },
    series: [{
      name: 'User Requests',
      data: tasks.datasets[0].data
    }]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HighchartsLineChart;