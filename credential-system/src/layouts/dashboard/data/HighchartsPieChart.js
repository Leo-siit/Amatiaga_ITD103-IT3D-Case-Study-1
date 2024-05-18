// HighchartsPieChart.js
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

const HighchartsPieChart = () => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users/categories");
        const { alumni, student } = response.data;
        
        setPieData([
          { name: 'Alumni', y: alumni },
          { name: 'Student', y: student }
        ]);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'User Requests by Category',
    },
    series: [{
      name: 'Requests',
      colorByPoint: true,
      data: pieData,
    }],   
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HighchartsPieChart;
