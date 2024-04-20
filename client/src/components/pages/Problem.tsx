import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../Sidebar';
import { Typography, TextField, Button } from '@mui/material';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #faf9f6;
  color: #000000;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ProblemContainer = styled.div`
  max-width: 600px;
  text-align: center;
  margin-bottom: 20px;
`;

const ProblemText = styled(Typography)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  width: 20%;
  height: 60px;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  resize: none;
  box-sizing: border-box;
`;

const SubmitButton = styled(Button)`
  && {
    padding: 8px 16px;
    background-color: #ffd166;
    color: #000000;
    font-size: 1rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
  }
`;

const ProblemPage = ({ problem, prevAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');

  const handleSubmit = () => {
    // Handle form submission, e.g., submit the user's answer to the server
    console.log('User submitted answer:', userAnswer);
  };

  return (
    <Container>
      <ProblemContainer>
        <ProblemText variant="h5">{problem}</ProblemText>
        {prevAnswer && (
          <Typography variant="body1">Answer provided by teammate: {prevAnswer}</Typography>
        )}
      </ProblemContainer>
      <StyledTextField
        multiline
        rows={1}
        variant="outlined"
        placeholder="Type your answer here..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />
      <SubmitButton variant="contained" onClick={handleSubmit}>
        Submit
      </SubmitButton>
      <Sidebar />
    </Container>
  );
};

export default ProblemPage;
