import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Sidebar from "../Sidebar";
import AddIcon from "@mui/icons-material/AddToPhotos";
import ConnectIcon from "@mui/icons-material/ConnectWithoutContact";
import {
  NUM_PROBLEMS,
  Team,
  TeamWithInfo,
  setTeamNameRequestBodyType,
  teamResponseType,
  teamWithInfoResponseType,
} from "../../../../shared/apiTypes";
import { Flex } from "rebass/styled-components";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
} from "@mui/material";
import copy from "copy-to-clipboard";
import { TeamStatus } from "../../../../server/models/Team";
import { get, post } from "../../utilities";
import EditValueModal from "../modules/EditValueModal";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #faf9f6;
  color: #000000;
`;

const Content = styled.main`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 36px;
`;

const TeamInfoContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  height: 190px;
  padding: 30px;
  padding-right: 100px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 36px;
`;

const CustomButton = styled(Button)`
  && {
    width: 200px;
    height: 60px;
    margin-top: 8px;
    margin-bottom: 8px;
    font-size: 1.5rem;
    background-color: #ffd166;
    color: #000000;
    border-radius: 10px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
    &:hover {
      background-color: #ffd700;
    }
    &:disabled {
      background-color: #ebebe4;
      box-shadow: none;
    }
  }
`;
// TODO: don't use styled for button but just use the rebass/styled-components so that disabled styling works properly

const RedText = styled.div`
  color: red;
  font-size: 20px;
  margin-top: 16px;
  margin-bottom: 16px;
  a {
    color: red;
  }
`;

const Clickable = styled.div`
  && {
    display: inline-block;
    &:hover {
      cursor: pointer;
    }
    &:hover::after {
      content: "Copy to Clipboard";
      position: absolute;
      left: 50%; /* Center horizontally */
      transform: translate(35%, -80%);
      background-color: rgba(0, 0, 0, 0.4);
      color: white;
      padding: 5px;
      border-radius: 5px;
      font-size: 0.8rem;
      white-space: nowrap;
    }
  }
`;

const BulletPoint = styled.div`
  margin-left: 8px;
  padding-left: 8px;
`;

const StyledButton2 = styled(Button)`
  && {
    width: 30%;
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

const TeamRecruitingPage = (props: TeamRecruitingPageProps) => {
  const userId = props.userId;
  const [errorMsg, setErrorMsg] = useState("");
  const [teamInfo, setTeamInfo] = useState<TeamWithInfo | null>(null);
  const [teamIsLoaded, setTeamIsLoaded] = useState<boolean>(false);
  // TODO (later): add a refresh of team data?

  const [showRedText, setShowRedText] = useState(false);
  const [isEditTeamNameModalOpen, setIsEditTeamNameModalOpen] = useState(false);

  // load current team
  const loadTeamData = () => {
    if (!!userId) {
      get(`/api/team`, {})
        .then((res: teamWithInfoResponseType) => {
          setTeamInfo(res.teamInfo);
          setTeamIsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching team:", error);
        });
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [userId]);

  const handleRecruitButtonClick = () => {
    setShowRedText(true);
  };

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

  if (!userId) {
    window.location.href = "/login";
  }

  if (!teamIsLoaded) {
    return <CircularProgress />;
  }

  if (!teamInfo) {
    // TODO: style this better
    // TODO: add button to go to lobby page
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
              You don't have a team yet. Create or join a team first:
            </Typography>
            {/* Add button to problem page */}
            <StyledButton2
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/lobby")}
            >
              Back to Lobby
            </StyledButton2>
          </Flex>
        </Flex>
        <Sidebar />
      </Flex>
    );
  }
  // TODO: extra - have share team code copy to clipboard. right now it's a link but is broken

  if (teamInfo.status == TeamStatus.Active) {
    return (
      <Flex backgroundColor="#faf9f6" color="black" flexDirection="column">
        {/* Changed flexDirection to column */}
        <Flex justifyContent="center" alignItems="center" height="100vh" width="100%">
          {/* Decreased height to 80vh */}
          <Flex flexDirection="column" alignItems="center">
            {/* Changed flexDirection to column */}
            <Typography variant="h5">Your team is active! Go to the team page:</Typography>
            {/* Add button to problem page */}
            <StyledButton2
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/team")}
            >
              Team Page
            </StyledButton2>
          </Flex>
        </Flex>
        <Sidebar />
      </Flex>
    );
  }

  const teamSize = teamInfo.users.length;

  return (
    <Container>
      <Content>
        {showRedText && <RedText>&nbsp;</RedText>}
        <InnerContainer>
          <TeamContainer>
            <TeamInfoContainer>
              {/* <EditableTeamName
                value={teamInfo.name ?? "No name yet."}
                variant="standard"
                onChange={handleTeamNameChange}
                InputProps={{
                  endAdornment: <EditIcon color="primary" style={{ cursor: "pointer" }} />,
                }}
              /> */}
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
          <ButtonContainer>
            <CustomButton
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleRecruitButtonClick}
              disabled={teamSize >= NUM_PROBLEMS}
            >
              Recruit
            </CustomButton>
            <CustomButton
              variant="contained"
              color="primary"
              startIcon={<ConnectIcon />}
              disabled={teamSize < NUM_PROBLEMS}
            >
              Relay!
            </CustomButton>
          </ButtonContainer>
        </InnerContainer>
        {showRedText && (
          <RedText>
            Share Team Code:&nbsp;
            <Clickable onClick={() => copy(teamInfo.code)}>
              <u>{teamInfo.code}</u>
            </Clickable>
          </RedText>
        )}
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

export default TeamRecruitingPage;
