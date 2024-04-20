import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Sidebar from '../Sidebar';

const Container = styled.div`
  display: flex;
  background-color: #faf9f6;
  color: #000000;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
`;

const StyledButton = styled(Button)`
  && {
    width: 45%;
    height: 80px;
    margin-bottom: 16px;
    font-size: 1.5rem;
    background-color: #ffd166;
    color: #000000;
    border-radius: 10px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
    &:hover {
      background-color: #ffd700;
    }
  }
`;

const Icon = styled.span`
  font-size: 2rem;
  margin-right: 8px;
`;

const LobbyPage = () => {
  return (
    <Container>
      <ButtonContainer>
        <ButtonGroup>
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
          >
            Create Team
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<GroupAddIcon />}
          >
            Join Team
          </StyledButton>
        </ButtonGroup>
      </ButtonContainer>
      <Sidebar />
    </Container>
  );
};

export default LobbyPage;
