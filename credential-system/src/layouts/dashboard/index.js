
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import HighchartsLineChart from "layouts/dashboard/data/HighchartsLineChart"; 
import HighchartsPieChart from "layouts/dashboard/data/HighchartsPieChart";


function Dashboard() {
  const [pendingRequests, setPendingRequests] = useState(0);
  const [completedRequests, setCompletedRequests] = useState(0);

  // // Fetch transaction requests for today
  // useEffect(() => {
  //   const fetchTransactionRequests = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3001/requests/today");
  //       setTransactionRequests(response.data.count);
  //     } catch (error) {
  //       console.error("Error fetching transaction requests:", error);
  //     }
  //   };
  //   fetchTransactionRequests();
  // }, []);

    // Fetch count of pending requests for today
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3001/requests/pending");
        setPendingRequests(response.data.count);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };
    fetchPendingRequests();
  }, []);

  // Fetch completed requests for today
  useEffect(() => {
    const fetchCompletedRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3001/requests/completed/today");
        setCompletedRequests(response.data.count);
      } catch (error) {
        console.error("Error fetching completed requests:", error);
      }
    };
    fetchCompletedRequests();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="pending"
                title="Pending Requests"
                count={pendingRequests}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "it needs your approval.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} lg={6}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="done"
                title="Completed Requests"
                count={completedRequests}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "for today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {/* <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox> */}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {/* <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox> */}
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <MDBox mb={3}>
                <HighchartsPieChart />
              </MDBox>
            </Grid>
            {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid> */}
            <Grid item xs={12} lg={6}>
              <MDBox mb={3}>
                <HighchartsLineChart />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
