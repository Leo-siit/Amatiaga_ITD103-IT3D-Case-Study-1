import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import requestTableData from "layouts/tables/data/requestTableData";
import CreateFormModal from "layouts/tables/modal/CreateFormModal";

function Tables() {
  const { columns, rows, EditFormModal, DeleteModal, openEditModal, openDeleteModal } = requestTableData();
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(rows); 

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdData, setCreatedData] = useState({});
  const [credentials, setCredentials] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch credentials data when component mounts
    axios.get("http://localhost:3001/credentials")
      .then((response) => {
        setCredentials(response.data);
      })
      .catch((error) => {
        console.error("Error fetching credentials:", error);
      });
  
    // Fetch users data when component mounts
    axios.get("http://localhost:3001/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);     // Empty dependency array ensures the effect runs only once when component mounts

  useEffect(() => {
    // Filter rows based on search value
    if (searchValue.trim() === "") {
      setFilteredData(rows);
    } else {
      const filteredRows = rows.filter((row) => {
        const name = row.name.props.name;
        const credentials = row.credentials.map((credential) => credential.props.title).join(", ");
        const lowerCaseSearch = searchValue.toLowerCase();
        return (
          (name?.toLowerCase().includes(lowerCaseSearch) ||
            credentials?.toLowerCase().includes(lowerCaseSearch))
        );
      });
      setFilteredData(filteredRows);
    }
  }, [searchValue, rows]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setCreatedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };  

  const handleCreateFormSubmit = async (e) => {
    e.preventDefault();
  
    const requestData = {
      name: createdData.name,
      credentials: createdData.credentials,
      total_pay: createdData.total_pay,
      approved: createdData.approved,
      claim_date: createdData.claim_date,
      claim_status: createdData.claim_status,
    };
  
    try {
      const response = await axios.post('http://localhost:3001/create/request', requestData);
      console.log(response.data.message);
      closeCreateModal();  // Use the correct function to close the modal
      // Refresh data or perform any other actions needed after form submission
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };     

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Request Table
                </MDTypography>
              </MDBox>
              <MDBox px={5} py={1} mt={1}>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                  style={{
                    color: "black",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    width: "23%", // Full width input
                    padding: "8px 12px", // Adjust padding for inner spacing
                  }}
                />

                <MDButton variant="contained" color="info" size="small" style={{ marginLeft: "67%" }} onClick={openCreateModal}>
                  Create
                </MDButton>
                </MDBox>

                <MDBox px={2} pb={2}>
                <DataTable
                  table={{
                    columns,
                    rows: searchValue.trim() === "" ? rows : filteredData,
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                  openEditModal={openEditModal}
                  searchTerm={searchValue}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {EditFormModal},
      {DeleteModal}
      <CreateFormModal
        isOpen={isCreateModalOpen}
        handleClose={closeCreateModal}
        handleFieldChange={handleFieldChange}
        createdData={createdData}
        credentials={credentials}
        users={users} 
        handleCreateFormSubmit={handleCreateFormSubmit}
      />
    </DashboardLayout>
  );
}

export default Tables;
