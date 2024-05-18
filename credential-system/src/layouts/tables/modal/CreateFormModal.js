import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDButton from "components/MDButton";

const CreateFormModal = ({
    isOpen,
    handleClose,
    handleFieldChange,
    createdData,
    credentials,
    users,
    handleCreateFormSubmit
    }) => {
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
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
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'fit-content',
            }}
            >
            <Typography variant="h3" component="h2" align="center" sx={{ mb: 2 }}>
                Create Request
            </Typography>
        <form>
        <div sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold'}}>
                    Name:
                </Typography>
                <Select
                    name="name"
                    value={createdData.name || ""}
                    onChange={handleFieldChange}
                    fullWidth
                    required
                    sx={{
                        mb: 1,
                        mt: 1,
                        fontSize: '0.875rem',
                        height: '37px',
                        '& select': {
                            padding: '10px',
                        }
                    }}
                >
                    {users
                        .filter(user => {
                                console.log('Filtering user:', user);
                                return user.usertype === "student" || user.usertype === "alumni";
                            })
                        .map((user) => (
                            <MenuItem key={user._id} value={user.name}>
                                {user.name}
                            </MenuItem>
                    ))}
                </Select>
            </div>

            <div sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold'}}>
                    Credentials Requested:
                </Typography>
                <Select
                    name="credentials"
                    value={createdData.credentials || []}
                    onChange={handleFieldChange}
                    fullWidth
                    multiple
                    required
                    sx={{
                    mb: 1,
                    mt: 1,
                    fontSize: '0.875rem',
                    height: '37px',
                    '& select': {
                        padding: '10px',
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
                    name="total_pay"
                    value={createdData.total_pay}
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
                value={createdData.status}
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
                    value={createdData.claim_date}
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
                value={createdData.claimed}
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
                onClick={handleCreateFormSubmit}
                size="small"
                sx={{
                    alignSelf: 'flex-start',
                    mt: 1,
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
);
};

export default CreateFormModal;
