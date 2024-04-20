import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material'; // Import TextField from Material-UI
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../Sidebar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #faf9f6;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 16px;
  align-self: flex-start; /* Align title to the left */
`;

const Positioner = styled.div`
  margin-top: calc(100vh / 6); /* Position at 1/3 from the top */
  margin-left: calc(100vw / 6); /* Position at 1/3 from the left */
`;

const InputLabel = styled.label`
  margin-bottom: 10px;
  align-self: flex-start; /* Align label to the left */
`;

// Use TextField component instead of input for UsernameInput
const StyledTextField = styled(TextField)`
  && {
  input {
    font-size: 1.25rem !important;
  }
  margin-bottom: 12px;
  text-align: left;
  display: flex;
  align-items: center;
  width: 250px;
  margin-bottom: 6px; /* Add some bottom margin for spacing */
  }
`;

const UpdateButton = styled(Button)`
  && {
    padding: 8px 16px;
    background-color: #ffd166;
    color: #000000;
    font-size: 1rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
    align-self: flex-start; /* Align button to the left */
    margin-top: 10px; /* Add some top margin for spacing */
  }
`;

const ProfilePage = () => {
  const currentUsername = 'current';
  const [username, setUsername] = useState(currentUsername);
  const [usernameError, setUsernameError] = useState(false);

  const handleChangeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setUsernameError(newUsername.length > 16);
  };

  const handleUpdateUsername = () => {
    // Logic to update the username
    console.log('Updated username:', username);
  };

  return (
    <Container>
      <Positioner>
        <Title>Username </Title>
        <InputLabel>
          <StyledTextField
            type="text"
            value={username}
            variant="standard"
            onChange={handleChangeUsername}
            InputProps={{
              endAdornment: (
                <EditIcon color="primary" style={{ cursor: 'pointer' }} />
              ),
            }}
            error={usernameError} // Set error prop based on usernameError state
            helperText={usernameError ? 'Update Failure: Username cannot exceed 16 characters' : ''} // Display error message if usernameError is true
          />
        </InputLabel>
        <br />
        {/* <UpdateButton onClick={handleUpdateUsername}>Update</UpdateButton> */}
      </Positioner>
      <Sidebar />
    </Container>
  );
};

export default ProfilePage;
