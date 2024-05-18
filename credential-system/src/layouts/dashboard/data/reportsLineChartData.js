// reportsLineChartData.js
import { useState, useEffect } from "react";
import axios from "axios";

const useReportsLineChartData = () => {
  const [reportsLineChartData, setReportsLineChartData] = useState({
    sales: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
      datasets: [{ label: "Mobile apps", data: [50, 40, 300, 320, 500, 350, 200, 230, 500] }],
    },
    tasks: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
      datasets: [{ label: "User Requests", data: Array(12).fill(0) }], // Initialize with zeros
    },
  });

  useEffect(() => {
    const fetchUserRequestsPerMonth = async () => {
      try {
        const response = await axios.get("http://localhost:3001/requests/per-month");
        const userRequestsPerMonth = response.data;
        console.log("User requests per month:", userRequestsPerMonth);

        // Initialize counts array with zeros
        const counts = Array.from({ length: 12 }, () => 0);

        // Map the response data to extract the month numbers (1 to 12) and counts
        userRequestsPerMonth.forEach(entry => {
          const monthIndex = entry._id - 1; // Assuming _id represents month numbers from 1 to 12
          counts[monthIndex] = entry.count;
        });

        // Update the datasets with the new counts
        const updatedTasks = {
          labels: reportsLineChartData.tasks.labels,
          datasets: [{
            label: "User Requests",
            data: counts
          }]
        };

        console.log("Updated tasks data:", updatedTasks);
        
        setReportsLineChartData(prevData => ({
          ...prevData,
          tasks: updatedTasks
        }));
      } catch (error) {
        console.error("Error fetching user requests per month:", error);
      }
    };

    fetchUserRequestsPerMonth();
  }, []);

  return reportsLineChartData;
};

export default useReportsLineChartData;
