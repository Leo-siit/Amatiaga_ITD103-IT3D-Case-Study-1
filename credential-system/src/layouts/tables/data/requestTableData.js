import React, { useEffect, useState } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import team2 from "assets/images/team-2.jpg";1

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';


    const RequestTable = () => {
    const [requestData, setRequestData] = useState([]);
    const [credentials, setCredentials] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);
 

    // const [searchTerm, setSearchTerm] = useState(""); 

    useEffect(() => {
      axios.get("http://localhost:3001/requests")
        .then((response) => {
          setRequestData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching request data:", error);
        });

    // Fetch credentials from the backend API
      axios.get("http://localhost:3001/credentials")
        .then((response) => {
          setCredentials(response.data);
        })
        .catch((error) => {
          console.error("Error fetching credentials:", error);
        });
    }, []);

    const toggleClaimStatus = async (requestId) => {
      try {
        // Find the index of the request by ID
        const index = requestData.findIndex(request => request._id === requestId);
      
        if (index !== -1) {
          // Toggle the status
          const updatedData = [...requestData];
          updatedData[index].claimed = !updatedData[index].claimed;
      
          // Update the status in the backend
          await axios.put(`http://localhost:3001/toggleclaimstatus/${requestId}`, { claimed: updatedData[index].claimed });
      
          // Update the state to reflect the change
          setRequestData(updatedData);
        }
      } catch (error) {
        console.error("Error toggling status:", error);
      }
    };    

    const toggleStatus = async (requestId) => {
      try {
        const index = requestData.findIndex(request => request._id === requestId);
    
        if (index !== -1) {
          const updatedData = [...requestData];
          updatedData[index].approved = !updatedData[index].approved;
    
          let claimDate = null; // Default claim date
          if (updatedData[index].approved) {
            // Prompt for claim date when status is changed to "approved"
            const inputDate = prompt("Please enter a claim date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
            claimDate = inputDate ? inputDate : "0000-00-00";
          }
    
          const response = await axios.put(`http://localhost:3001/togglestatus/${requestId}`, {
            approved: updatedData[index].approved,
            claim_on: claimDate
          });
    
          if (response.status === 200) {
            updatedData[index].claim_on = claimDate; 
            setRequestData(updatedData);
          }
        }
      } catch (error) {
        console.error("Error toggling status:", error);
      }
    };    
  
    const Author = ({ image, name, email }) => (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={image} name={name} size="sm" />
        <MDBox ml={2} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
          <MDTypography variant="caption">{email}</MDTypography>
        </MDBox>
      </MDBox>
    );

    const Job = ({ title }) => (
      <MDBox lineHeight={1} textAlign="left">
        <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
          {title}
        </MDTypography>
      </MDBox>
    );
    
  // Function to open edit modal
  const openEditModal = (request) => {
    setSelectedRequest(request);
    // Initialize claim_date with the current date
    setEditedData({
      credentials: request.credentials.map((credential) => credential._id),
      total_payment: request.total_pay,
      status: request.approved ? "approved" : "pending",
      claim_date: request.claim_on, // Use current date if claim_date is not set
      claim_status: request.claimed ? "claimed" : "unclaimed"
    });
    setIsEditModalOpen(true);
  };

  // Function to close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Function to handle edit form submission
  const handleEditFormSubmit = async () => {
    try {
      // Prepare the edited data object
      const updatedData = {
        credentials: editedData.credentials, // Assuming credentials is an array of credential IDs
        total_pay: editedData.total_payment,
        approved: editedData.status === "approved", // Convert status to boolean
        claim_on: editedData.claim_date, // Assuming claim_date is a date string
        claimed: editedData.claim_status === "claimed" // Convert claim_status to boolean
      };

      // Make a PUT request to update the request in the backend
      const response = await axios.put(`http://localhost:3001/update/${selectedRequest._id}`, updatedData);
      
      // Check if the request was successful
      if (response.status === 200) {
        // Update the state with the updated request data
        const updatedRequests = requestData.map(request => 
          request._id === selectedRequest._id ? { ...request, ...updatedData } : request
        );
        setRequestData(updatedRequests);
        
        // Update the credentials state with the latest data
        axios.get("http://localhost:3001/credentials")
          .then((response) => {
            setCredentials(response.data);
          })
          .catch((error) => {
            console.error("Error fetching credentials:", error);
          });

        // Close the edit modal
        closeEditModal();
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };  

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };  

  const handleDeleteRequest = async () => {
    try {
      await axios.delete(`http://localhost:3001/delete/${requestToDelete._id}`);
      setRequestData(requestData.filter(request => request._id !== requestToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return {
    columns: [
      { Header: "name", accessor: "name", align: "left" },
      { Header: "credentials requested", accessor: "credentials", align: "left" },
      { Header: "total payment", accessor: "payment", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "claim date", accessor: "claim", align: "center" },
      { Header: "claim status", accessor: "claimed", align: "center" },
      { Header: "actions", accessor: "actions", align: "center" },
    ],

    rows: requestData.map(request => ({
      name: <Author image={team2} name={request.userID.name} email={request.userID.email} />,
      credentials: request.credentials.map(credential => <Job title={credential.name} />),
      status: (
        <MDButton ml={-1} onClick={() => toggleStatus(request._id)}>
          <MDBadge badgeContent={request.approved ? "approved" : "pending"} color={request.approved ? "success" : "warning"} variant="gradient" size="sm" />
        </MDButton>
      ),
      payment: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {request.total_pay}
        </MDTypography>
      ),
      claim: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {request.claim_on}
        </MDTypography>
      ),
      claimed: (
        <MDButton ml={-1} onClick={() => toggleClaimStatus(request._id)}>
          <MDBadge badgeContent={request.claimed ? "claimed" : "unclaimed"} color={request.claimed ? "success" : "error"} variant="gradient" size="sm" />
        </MDButton>
      ),
      actions: ( // Add actions
      <div>
        <MDButton variant="text" color="info" onClick={() => openEditModal(request)}>
          Edit
          </MDButton>
          
        <MDButton variant="text" color="error" onClick={() => {
          setRequestToDelete(request);
          setIsDeleteModalOpen(true);
        }}>
          Delete
        </MDButton>
      </div>
      ),
    })),
    
    EditFormModal: (
      <Modal
        open={isEditModalOpen}
        onClose={closeEditModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column', // Align items vertically
            justifyContent: 'space-between', // Space content evenly
            height: 'fit-content', // Adjust height to content size
          }}
        >
          <Typography variant="h3" component="h2" align="center" sx={{ mb: 2 }}>
            Edit Request
          </Typography>
          <form>
            <div sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold'}}>
                Credentials Requested:
              </Typography>
              <Select
                name="credentials"
                value={editedData.credentials || []} // Ensure that value is an array
                onChange={handleFieldChange}
                fullWidth
                multiple
                required
                sx={{
                  mb: 1,
                  mt: 1,
                  fontSize: '0.875rem',
                  height: '37px', // Increase the height of the Select
                  '& select': {
                    padding: '10px', // Adjust the padding of the select element
                  }
                }}
              >
                {credentials.map((credential) => (
                  <MenuItem key={credential._id} value={credential._id}>
                    {credential.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Total payment:
              </Typography>
              <input
                type="text"
                name="total_payment"
                value={editedData.total_payment}
                onChange={handleFieldChange}
                style={{
                  marginTop: '8px',
                  marginBottom: '8px',
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  fontSize: '0.875rem',
                }}
                required
              />
            </div>
            <div sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Status:
              </Typography>
              <Select
                name="status"
                value={editedData.status}
                onChange={handleFieldChange}
                required
                fullWidth
                sx={{
                  mb: 1,
                  mt: 1,
                  fontSize: '0.875rem',
                  height: '38px', // Increase the height of the Select
                  '& select': {
                    padding: '10px', // Adjust the padding of the select element
                  }
                }}
              >
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </div>
            <div sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Claim Date:
              </Typography>
              <input
                type="date"
                name="claim_date"
                value={editedData.claim_date}
                onChange={handleFieldChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  fontSize: '0.875rem',
                  marginTop: '8px',
                  marginBottom: '8px',
                }}
              />
            </div>
            <div>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Claim Status:
              </Typography>
              <Select
                name="claim_status"
                value={editedData.claim_status}
                onChange={handleFieldChange}
                required
                fullWidth
                sx={{
                  mb: 1,
                  mt: 1,
                  fontSize: '0.875rem',
                  height: '38px', // Increase the height of the Select
                  '& select': {
                    padding: '10px', // Adjust the padding of the select element
                  }
                }}
              >
                <MenuItem value="claimed">Claimed</MenuItem>
                <MenuItem value="unclaimed">Unclaimed</MenuItem>
              </Select>
            </div>
            <MDButton
              variant="text"
              color="white"
              onClick={handleEditFormSubmit}
              sx={{
                alignSelf: 'flex-start', // Align button to the left
                mt: 1, // Margin top for spacing
                fontSize: '0.875rem',
                color: 'white',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
            >
              Submit
            </MDButton>
          </form>
        </Box>
      </Modal>
    ),
    
    DeleteModal: (
        <Modal
      open={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography id="delete-modal-title" variant="h6" component="h2">
          Are you sure you want to delete this request?
        </Typography>
        <MDButton
          variant="contained"
          color="error"
          onClick={handleDeleteRequest}
          sx={{ mt: 2 }}
        >
          Yes, Delete
        </MDButton>
        <MDButton
          variant="contained"
          color="default"
          onClick={() => setIsDeleteModalOpen(false)}
          sx={{ mt: 2 }}
        >
          Cancel
        </MDButton>
      </Box>
    </Modal>
    )
  };
};

export default RequestTable;
