// layouts/dashboard/index.js
import React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Sidebar from "layouts/pdashboard/sidebar/Sidebar";

function Dashboard() {
  return (
    <>
    <Grid container spacing={0} style={{ backgroundColor: '#060b26' }}>
        <Grid item xs={2}>
            <Sidebar />
        </Grid>
        <Grid item xs={10}>
            <MDBox py={3}>
                {/* Your main content goes here */}
            </MDBox>
        </Grid>
    </Grid>
    </>
  );
}

export default Dashboard;
