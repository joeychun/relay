import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Sidebar from "../Sidebar";
import {
  NUM_PROBLEMS,
  RelayProblemResult,
  Team,
  TeamWithInfo,
  setTeamNameRequestBodyType,
  teamResponseType,
  teamWithInfoResponseType,
} from "../../../../shared/apiTypes";
import { ConstructionOutlined } from "@mui/icons-material";
import { Flex } from "rebass/styled-components";
import { TeamStatus } from "../../../../server/models/Team";
import { CircularProgress, Typography } from "@mui/material";
import ProblemDisplayModal from "../modules/ProblemDisplayModal";
import { get, post } from "../../utilities";
import EditValueModal from "../modules/EditValueModal";

const Container = styled.div`
  min-height: 100vh;
  background-color: #faf9f6;
  color: #000000;
  display: flex;
  flex-grow: 1;
  justify-content: center; /* Align content to the start */
  align-items: center; /* Align content to the start */
  flex-direction: column;
  overflow: auto; /* Enable scrolling if content overflows */
`;

const Content = styled.main`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const InnerContainer = styled.div`
  width: 850px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const ComponentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TeamComponentWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const StatsComponentWrapper = styled.div`
  width: 100%;
`;

const TeamContainer = styled.div`
  display: flex;
  width: 370px;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 72px;
`;

const TeamInfoContainer = styled.div`
  // display: flex;
  width: calc(100% - 60px);
  background-color: #ffffff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0px;
`;

const UserName = styled.div`
  font-family: Roboto;
  font-weight: 300;
  font-size: 20px;
  margin-bottom: 12px;
  text-align: left;
  display: flex;
  align-items: center;
`;

const EditableTeamName = styled(TextField)`
  && {
    input {
      font-size: 1.5rem !important;
    }
    margin-bottom: 12px;
    text-align: left;
    display: flex;
    align-items: center;
  }
`;

const UserNameHeader = styled.div`
  font-family: Roboto;
  font-size: 28px;
  margin-top: 12px;
  text-align: left;
`;

const BulletPoint = styled.div`
  margin-left: 8px;
  padding-left: 8px;
`;

const StatsContainer = styled.div`
  margin-top: 0px;
  width: 370px;
  height: auto;
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
`;

const RelayTableRow = styled(TableRow)`
  && {
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    &:hover {
      background-color: #eeeeee;
      cursor: pointer;
    }
  }
`;

const EmojiCell = styled.th`
  width: 50px;
  padding: 12px 8px;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const TableCell = styled.td`
  padding: 12px 8px;
  font-size: 18px;
  display: flex;
  align-items: center;
  flex: 1;
`;

const TableCellHeader = styled(TableCell)`
  font-weight: 700;
  font-size: 24px;
`;

const TableCellR = styled(TableCell)`
  justify-content: flex-end;
`;

const DropdownContainer = styled.div`
  width: 100%;
  max-width: 850px;
  margin-top: 24px;
  position: relative;
  display: flex;
`;

const DropdownHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownIcon = styled.svg`
  margin-left: 10px;
`;

const DropdownContent = styled.div`
  display: flex;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const DropdownOpen = styled(DropdownContent)`
  display: block;
`;

const StyledButton2 = styled(Button)`
  && {
    width: 35%;
    height: 50px;
    margin-top: 16px;
    margin-bottom: 16px;
    font-size: 1rem;
    background-color: #ffd166;
    color: #000000;
    border-radius: 10px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
    &:hover {
      background-color: #ffd700;
    }
  }
`;

type TeamRecruitingPageProps = {
  userId?: string;
};

const TeamPage = (props: TeamRecruitingPageProps) => {
  const userId = props.userId;
  const [teamInfo, setTeamInfo] = useState<TeamWithInfo | null>(null);
  const [recentProblems, setRecentProblems] = useState<RelayProblemResult[]>([]);
  const [teamIsLoaded, setTeamIsLoaded] = useState<boolean>(false);
  const [isProblemDisplayModalOpen, setIsProblemDisplayOpen] = useState<boolean>(false);
  const [displayProblemIndex, setDisplayProblemIndex] = useState(-1);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(true);
  const [isEditTeamNameModalOpen, setIsEditTeamNameModalOpen] = useState(false);

  function generateResultString(problemResult: RelayProblemResult): string {
    const { subproblems, subproblemAttemptsWithUsers } = problemResult;
    let resultString = "";

    subproblems.forEach((subproblem, index) => {
      const subproblemAttempt = subproblemAttemptsWithUsers[index];
      if (!subproblemAttempt.answer) {
        resultString += "❌";
      } else if (subproblemAttempt.answer === subproblem.answer) {
        resultString += "✅";
      } else {
        resultString += "❌";
      }
    });

    return resultString;
  }

  // load current team
  const loadTeamData = () => {
    if (!!userId) {
      get(`/api/team`, {})
        .then((res: teamWithInfoResponseType) => {
          setTeamInfo(res.teamInfo);
          setRecentProblems(
            !!res.recentProblems ? res.recentProblems.filter((rp) => rp.status === "revealed") : []
          );
          setTeamIsLoaded(true);
          setDisplayProblemIndex(-1);
        })
        .catch((error) => {
          console.error("Error fetching team:", error);
        });
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [userId]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  if (!userId) {
    window.location.href = "/login";
  }

  if (!teamIsLoaded) {
    return <CircularProgress />;
  }

  const handleSubmitNewTeamName = (name: string) => {
    if (!userId || !teamInfo?._id) return Promise.resolve();
    const body: setTeamNameRequestBodyType = {
      name,
      teamId: teamInfo._id,
    };
    console.log("Submitting new name:", name);
    return post("/api/setTeamName", body).then(() => {
      loadTeamData();
    });
  };

  if (!teamInfo) {
    return (
      <Flex backgroundColor="#faf9f6" color="black" flexDirection="column">
        {" "}
        {/* Changed flexDirection to column */}
        <Flex justifyContent="center" alignItems="center" height="100vh" width="100%">
          {" "}
          {/* Decreased height to 80vh */}
          <Flex flexDirection="column" alignItems="center">
            {" "}
            {/* Changed flexDirection to column */}
            <Typography variant="h5">You don't have a team. Go back to lobby:</Typography>
            <StyledButton2
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/lobby")}
            >
              Lobby Page
            </StyledButton2>
          </Flex>
        </Flex>
        <Sidebar />
      </Flex>
    );
  }

  if (teamInfo.status === TeamStatus.Recruiting) {
    return (
      <Flex backgroundColor="#faf9f6" color="black" flexDirection="column">
        {" "}
        {/* Changed flexDirection to column */}
        <Flex justifyContent="center" alignItems="center" height="100vh" width="100%">
          {" "}
          {/* Decreased height to 80vh */}
          <Flex flexDirection="column" alignItems="center">
            {" "}
            {/* Changed flexDirection to column */}
            <Typography variant="h5">
              Your team is under recruiting! Get a full team first:
            </Typography>
            <StyledButton2
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/team-recruit")}
            >
              Recruiting Page
            </StyledButton2>
          </Flex>
        </Flex>
        <Sidebar />
      </Flex>
    );
  }

  const startDateObj = teamInfo.dateStarted ? new Date(teamInfo.dateStarted) : null;

  const TeamComponent = () => (
    <TeamContainer>
      <TeamInfoContainer>
        <Flex sx={{ gap: 2 }}>
          <Typography variant="h5">{teamInfo.name ?? "No name yet."}</Typography>
          <Button
            onClick={() => {
              setIsEditTeamNameModalOpen(true);
            }}
          >
            <EditIcon color="primary" />
          </Button>
        </Flex>
        <ul>
          {teamInfo.users.map((teammate, index) => (
            <li key={index}>
              <UserName>{teammate.name ?? `Anon ${index}`}</UserName>
            </li>
          ))}
        </ul>
      </TeamInfoContainer>
    </TeamContainer>
  );

  const StatsComponent = () => (
    <StatsContainer>
      <Table>
        {/* <thead>
        <TableRow>
          <EmojiCell></EmojiCell>
          <TableCellHeader>Stats</TableCellHeader>
          <TableCell></TableCell>
        </TableRow>
      </thead> */}
        <tbody>
          {!!startDateObj && (
            <TableRow>
              <EmojiCell>🕒</EmojiCell>
              <TableCell>Active since</TableCell>
              <TableCellR>
                <b>
                  {startDateObj.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </b>
              </TableCellR>
            </TableRow>
          )}

          <TableRow>
            <EmojiCell>🕒</EmojiCell>
            <TableCell>Latest Streak</TableCell>
            <TableCellR>
              <b>{teamInfo.currentStreak}</b>
            </TableCellR>
          </TableRow>
          <TableRow>
            <EmojiCell>🔥</EmojiCell>
            <TableCell>Longest Streak</TableCell>
            <TableCellR>
              <b>{teamInfo.longestStreak}</b>
            </TableCellR>
          </TableRow>
          {recentProblems.length > 0 && (
            <TableRow>
              <EmojiCell>❓</EmojiCell>
              <TableCell>Latest Results</TableCell>
              <TableCellR>{generateResultString(recentProblems[0])}</TableCellR>
            </TableRow>
          )}
        </tbody>
      </Table>
    </StatsContainer>
  );

  const ProblemsComponent = () => (
    <DropdownContainer>
      <DropdownContent>
        {recentProblems.length == 0 ? (
          <b>Nothing yet.</b>
        ) : (
          <Table>
            <thead>
              <TableRow>
                {/* <TableCell>Relay Date</TableCell>
              <TableCell>Results</TableCell> */}
                <h2 style={{ marginLeft: "auto", marginRight: "auto" }}>Recent Problems</h2>
              </TableRow>
            </thead>
            <tbody>
              <TableRow>
                <TableCell>
                  <b>Relay Date</b>
                </TableCell>
                <TableCell>
                  <b>Results</b>
                </TableCell>
              </TableRow>
              {recentProblems.map((problemResult, index) => {
                return (
                  <RelayTableRow
                    key={index}
                    onClick={() => {
                      setDisplayProblemIndex(index);
                      setIsProblemDisplayOpen(!isProblemDisplayModalOpen);
                    }}
                  >
                    <TableCell>
                      {new Date(problemResult.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{generateResultString(problemResult)}</TableCell>
                  </RelayTableRow>
                );
              })}
            </tbody>
          </Table>
        )}
      </DropdownContent>
    </DropdownContainer>
  );

  return (
    <Container>
      <Content>
        <InnerContainer>
          <ComponentsWrapper>
            <TeamComponentWrapper>
              <TeamComponent />
            </TeamComponentWrapper>
            <StatsComponentWrapper>
              <StatsComponent />
            </StatsComponentWrapper>
          </ComponentsWrapper>
          <ProblemsComponent />
        </InnerContainer>
        <ProblemDisplayModal
          problemToShow={displayProblemIndex == -1 ? null : recentProblems[displayProblemIndex]}
          // date={}
          onClose={() => {
            setIsProblemDisplayOpen(false);
          }}
          open={isProblemDisplayModalOpen}
        />
      </Content>
      <Sidebar />
      <EditValueModal
        curVal={teamInfo.name}
        title="Edit team name"
        maxLength={16}
        onClose={() => {
          setIsEditTeamNameModalOpen(false);
        }}
        open={isEditTeamNameModalOpen}
        handleEditVal={handleSubmitNewTeamName}
      />
    </Container>
  );
};

export default TeamPage;
