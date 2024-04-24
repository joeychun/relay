import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "../Sidebar";
import { Typography, TextField, Button, CircularProgress, Box } from "@mui/material";
import ProblemDisplayer from "../ProblemDisplayer";
import { Flex } from "rebass/styled-components";
import { SubproblemData, subproblemAttemptResponseType } from "../../../../shared/apiTypes";
import { get } from "../../utilities";
import { SubproblemCategory } from "../../../../server/models/Problem";

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

type ProblemPageProps = {
  userId?: string;
};

const ProblemPage = (props: ProblemPageProps) => {
  const userId = props.userId;

  const [userAnswer, setUserAnswer] = useState("");
  const [subproblemAttempt, setSubproblemAttempt] = useState<subproblemAttemptResponseType | null>(
    null
  );
  // TODO: add a real question here
  const [randomSubproblem, setRandomSubproblem] = useState<SubproblemData>({
    question: "What is pi?",
    category: SubproblemCategory.Other,
  });

  const handleSubmit = (userAnswer: string) => {
    // Handle form submission, e.g., submit the user's answer to the server
    console.log("User submitted answer:", userAnswer);
  };

  // load answers
  useEffect(() => {
    try {
      if (!!userId) {
        get(`/api/subproblemAttempt`, {}).then((res: subproblemAttemptResponseType) => {
          setSubproblemAttempt(res);
        });
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  }, [userId]);

  useEffect(() => {
    try {
      if (!!userId) {
        get(`/api/subproblemAttempt`, {}).then((res: subproblemAttemptResponseType) => {
          setSubproblemAttempt(res);
        });
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  }, [userId]);

  useEffect(() => {
    try {
      if (!subproblemAttempt && !randomSubproblem) {
        get(`/api/randomSubproblem`, {}).then((res: SubproblemData) => {
          setRandomSubproblem(res);
        });
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  }, [userId]);

  if (!subproblemAttempt && !randomSubproblem) {
    return <CircularProgress />;
  }

  // TODO: ADD state for if not in team here. maybe you can see the problem but there's no space to put in the answer?
  // and it says something like to start solving, create or join a team and button to lobby

  return (
    <Container>
      {!!subproblemAttempt && (
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
      )}
      <Flex
        width="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ gap: 3 }}
      >
        {!!subproblemAttempt ? (
          <ProblemText variant="h5">{subproblemAttempt.subproblemData.question}</ProblemText>
        ) : (
          <ProblemText variant="h5">{randomSubproblem.question}</ProblemText>
        )}
        {!!subproblemAttempt &&
          subproblemAttempt.mySubproblemIndex != -1 &&
          (subproblemAttempt.mySubproblemIndex == 0 ? (
            <Typography variant="body1">You are the first to go!</Typography>
          ) : (
            <Typography variant="body1">
              Answer provided by teammate:{" "}
              {subproblemAttempt.subproblemAttempts[subproblemAttempt.mySubproblemIndex - 1]}
            </Typography>
          ))}
        {/* {subproblemAttempt?.subproblemAttempts?[subproblemAttempt?.mySubproblemIndex - 1]} */}

        {/* <SubmitButton variant="contained" onClick={handleSubmit}>
          Submit
        </SubmitButton> */}

        {!subproblemAttempt ? (
          <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ gap: 3 }}
          >
            <Typography variant="body1">
              You are not logged in. Log in and join a team to start playing.
            </Typography>
            <Button
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login
            </Button>
          </Flex>
        ) : (
          <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ gap: 3 }}
          >
            <TextField
              margin="dense"
              type="text"
              fullWidth
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(event) => {
                const newVal = event.target.value;
                setUserAnswer(newVal);
              }}
              autoFocus
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  if (userAnswer.length < 1) return;
                  handleSubmit(userAnswer);
                }
              }}
            />
            <Button onClick={() => handleSubmit(userAnswer)}>Submit</Button>
            <Typography variant="body1">
              Last submission:{" "}
              {subproblemAttempt.subproblemAttempts[subproblemAttempt.mySubproblemIndex].answer ??
                "No submission yet."}
            </Typography>
          </Flex>
        )}
      </Flex>

      <Sidebar />
    </Container>
  );
};

export default ProblemPage;
