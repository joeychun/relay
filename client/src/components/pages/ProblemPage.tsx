import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "../Sidebar";
import { Typography, TextField, Button, CircularProgress, Box, Tooltip } from "@mui/material";
import ProblemDisplayer from "../ProblemDisplayer";
import { Flex } from "rebass/styled-components";
import {
  NUM_PROBLEMS,
  SubproblemAttemptsData,
  SubproblemData,
  submitSubproblemAttemptRequestBodyType,
  subproblemAttemptRequestBodyType,
  subproblemAttemptResponseType,
} from "../../../../shared/apiTypes";
import { get, post } from "../../utilities";
import { SubproblemCategory } from "../../../../server/models/Problem";
import { MathJax } from "better-react-mathjax";

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

const StyledButton2 = styled(Button)`
  && {
    width: 20%;
    height: 50px;
    margin-top: 16px;
    margin-bottom: 16px;
    font-size: 14px;
    background-color: #ffd166;
    color: #000000;
    border-radius: 10px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
    &:hover {
      background-color: #ffd700;
    }
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
  const [subproblemAttempt, setSubproblemAttempt] = useState<SubproblemAttemptsData | null>(null);
  const [emailMessage, setEmailMessage] = useState("");

  // TODO: add a real question here
  const [randomSubproblem, setRandomSubproblem] = useState<SubproblemData>({
    question: "What is pi?",
    category: SubproblemCategory.Other,
    previousAnswer: undefined,
  });

  const loadSubproblemData = () => {
    if (!!userId) {
      get(`/api/subproblemAttempt`, {})
        .then((res: subproblemAttemptResponseType) => {
          if (!!res.data) {
            const data = res.data;
            if (
              data.mySubproblemIndex < 0 ||
              (data.mySubproblemIndex >= 0 && data.subproblemAttempts.length != NUM_PROBLEMS)
            ) {
              throw new Error("Subproblem attempts wrong");
            }
            setSubproblemAttempt(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching subproblem data:", error);
        });
    }
  };

  // load attempt
  useEffect(() => {
    loadSubproblemData();
  }, [userId]);

  useEffect(() => {
    try {
      if (!subproblemAttempt) {
        console.log("getting random subproblem");
        get(`/api/randomSubproblem`, {}).then((res: { subproblemData: SubproblemData | null }) => {
          if (!!res.subproblemData) {
            setRandomSubproblem(res.subproblemData);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  }, [userId]);

  if (!userId) {
    // show a dummy
    return (
      <Container>
        <Flex
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ gap: 3 }}
        >
          <ProblemText variant="h5">
            <MathJax inline dynamic>
              {randomSubproblem.question}
            </MathJax>
          </ProblemText>
          {randomSubproblem.previousAnswer && (
            <Typography variant="body1">
              Answer to use as input: {randomSubproblem.previousAnswer}
            </Typography>
          )}
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
        </Flex>
        <Sidebar />
      </Container>
    );
  }

  if (!subproblemAttempt && !randomSubproblem) {
    return <CircularProgress />;
  }

  if (!subproblemAttempt) {
    return (
      <Container>
        <Flex
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ gap: 3 }}
        >
          <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ gap: 3 }}
          >
            <Typography variant="body1" alignContent={"center"} textAlign={"center"}>
              {`You're all caught up on problems! For now, enjoy this random past problem, or head over to the team page to see your team's statistics.`}
            </Typography>
            <ProblemText variant="h5">
              <MathJax inline dynamic>
                {randomSubproblem.question}
              </MathJax>
            </ProblemText>

            {randomSubproblem.previousAnswer && (
              <Typography variant="body1">
                Answer to use as input: {randomSubproblem.previousAnswer}
              </Typography>
            )}

            {/* <Button
              onClick={() => {
                window.location.href = "/team";
              }}
            >
              Take me to the team page!
            </Button> */}
            <StyledButton2
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/team")}
            >
              Take me to the team page!
            </StyledButton2>
          </Flex>
        </Flex>
        <Sidebar />
      </Container>
    );
  }

  const mySubproblemIndex = subproblemAttempt.mySubproblemIndex;
  const allSubproblemAttempts = subproblemAttempt.subproblemAttempts;
  const problemData = subproblemAttempt.subproblemData;
  const myAttempt = allSubproblemAttempts[mySubproblemIndex];
  const previousAttempt =
    mySubproblemIndex > 0 ? allSubproblemAttempts[mySubproblemIndex - 1] : null;
  console.log(mySubproblemIndex, allSubproblemAttempts, problemData, myAttempt, previousAttempt);

  const handleSubmit = (userAnswer: string) => {
    // Handle form submission, e.g., submit the user's answer to the server
    console.log("User submitted answer:", userAnswer);
    if (!userId) return Promise.resolve();
    const body: submitSubproblemAttemptRequestBodyType = {
      subproblemAttemptId: myAttempt._id,
      answer: userAnswer,
    };
    return post("/api/submitAnswer", body).then(() => {
      loadSubproblemData();
    });
  };

  const handleSendBack = (subproblemAttemptId: string) => {
    console.log("Sending back:", subproblemAttemptId);
    if (!userId) return Promise.resolve();
    const body: subproblemAttemptRequestBodyType = {
      subproblemAttemptId,
    };
    return post("/api/sendBack", body)
      .then(() => {
        setEmailMessage("Your teammate has been notified.");
        loadSubproblemData();
      })
      .catch((error) => {
        console.error("Error sending email", error);
      });
  };

  // TODO: make a username module
  return (
    <Container>
      <StatusContainer>
        <StatusTitle variant="h6">Answer Submission Status</StatusTitle>
        <StatusTable>
          <tbody>
            <StatusRow>
              {allSubproblemAttempts.map((attempt, index) => (
                <StatusCell>{attempt.assignedUser.name ?? "Anonymous"}</StatusCell>
              ))}
            </StatusRow>
            <StatusRow>
              {allSubproblemAttempts.map((attempt) => (
                <StatusCell>{attempt.answer ? "✅" : "⏳"}</StatusCell>
              ))}
            </StatusRow>
          </tbody>
        </StatusTable>
      </StatusContainer>
      <Flex
        width="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ gap: 3 }}
      >
        <ProblemText variant="h5">
          <MathJax inline dynamic>
            {problemData.question}
          </MathJax>
        </ProblemText>

        {!previousAttempt ? (
          <Typography variant="body1">You are the first to go!</Typography>
        ) : (
          <Typography variant="body1">
            Answer provided by teammate: {previousAttempt.answer ?? "No answer yet."}
          </Typography>
        )}

        <Flex
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ gap: 3 }}
        >
          <Box width="250px">
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
          </Box>
          <Button variant="contained" onClick={() => handleSubmit(userAnswer)}>
            Submit
          </Button>

          <Typography variant="body1">
            Last submission: {myAttempt?.answer ?? "No submission yet."}
          </Typography>

          {!!previousAttempt && (
            <Flex mt={10} flexDirection="column" sx={{ gap: 1 }} alignItems="center">
              <Typography variant="caption">
                Something seem wrong with the answers your teammate sent? Ask them to check again!
              </Typography>
              <Box>
                <Button>Send back</Button>
                {/* <Tooltip
                  title={
                    !!previousAttempt.sentBack ? `Your teammate has already been notified!` : ""
                  }
                >
                  <span>
                    <Button
                      disabled={!!previousAttempt.sentBack}
                      onClick={() => handleSendBack(previousAttempt._id)}
                    >
                      Send back
                    </Button>
                  </span>
                </Tooltip> */}
              </Box>
              {!!emailMessage && <Typography variant="caption">{emailMessage}</Typography>}
            </Flex>
          )}
        </Flex>
      </Flex>

      <Sidebar />
    </Container>
  );
};

export default ProblemPage;
