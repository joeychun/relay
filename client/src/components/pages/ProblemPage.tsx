import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../Sidebar";
import { Typography, TextField, Button } from "@mui/material";
import ProblemDisplayer from "../ProblemDisplayer";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #faf9f6;
  color: #000000;
`;

const StatusContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StatusTitle = styled(Typography)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StatusTable = styled.table`
  width: 100%;
`;

const StatusRow = styled.tr`
  text-align: center;
`;

const StatusCell = styled.td`
  padding: 8px;
`;

const ProblemContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProblemText = styled(Typography)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SizedProblemDisplayer = styled(ProblemDisplayer)`
  width: 70%;
  overflow-wrap: normal;
`;

const StyledTextField = styled(TextField)`
  width: 20%;
  margin-bottom: 20px;
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

const EmptyDiv = styled.div`
  height: 20px;
`;

const ProblemPage = ({ problemText, image, prevAnswer }) => {
  const [userAnswer, setUserAnswer] = useState("");

  const handleSubmit = () => {
    // Handle form submission, e.g., submit the user's answer to the server
    console.log("User submitted answer:", userAnswer);
  };

  // TODO: ADD state for if not in team here. maybe you can see the problem but there's no space to put in the answer?
  // and it says something like to start solving, create or join a team and button to lobby

  return (
    <Container>
      <StatusContainer>
        <StatusTitle variant="h6">Answer Submission Status</StatusTitle>
        <StatusTable>
          <tbody>
            <StatusRow>
              <StatusCell>UserA</StatusCell>
              <StatusCell>UserB</StatusCell>
              <StatusCell>UserC</StatusCell>
            </StatusRow>
            <StatusRow>
              <StatusCell>✅</StatusCell>
              <StatusCell>✅</StatusCell>
              <StatusCell>✅</StatusCell>
            </StatusRow>
          </tbody>
        </StatusTable>
      </StatusContainer>
      <ProblemContainer>
        <SizedProblemDisplayer
          text={<ProblemText variant="h5">{problemText}</ProblemText>}
          image={image}
        />
        {prevAnswer && (
          <Typography variant="body1">Answer provided by teammate: {prevAnswer}</Typography>
        )}
        <EmptyDiv />
        <StyledTextField
          multiline
          rows={1}
          variant="outlined"
          placeholder="Type your answer here..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        <EmptyDiv />
        <SubmitButton variant="contained" onClick={handleSubmit}>
          Submit
        </SubmitButton>
      </ProblemContainer>
      <Sidebar />
    </Container>
  );
};

export default ProblemPage;
