import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Sidebar from "../Sidebar";
import AddIcon from "@mui/icons-material/AddToPhotos";
import ConnectIcon from "@mui/icons-material/ConnectWithoutContact";
import { NUM_PROBLEMS, Team, TeamWithInfo, teamResponseType } from "../../../../shared/apiTypes";
import { Flex } from "rebass/styled-components";
import { Typography } from "@mui/material";
import { TeamStatus } from "../../../../server/models/Team";

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

const BulletPoint = styled.div`
  margin-left: 8px;
  padding-left: 8px;
`;

type TeamRecruitingPageProps = {
  userId?: string;
  teamInfo: TeamWithInfo | null;
};

const TeamRecruitingPage = (props: TeamRecruitingPageProps) => {
  const userId = props.userId;
  const [errorMsg, setErrorMsg] = useState("");
  const teamInfo = props.teamInfo;
  // TODO (later): add a refresh of team data?

  const [showRedText, setShowRedText] = useState(false);
  const [teamName, setTeamName] = useState("Team Name");

  const handleRecruitButtonClick = () => {
    setShowRedText(true);
  };

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
    // TODO: add a function on the backend to update team name
    // TODO: make update team name the same as update username, don't use styled
  };

  if (!userId) {
    window.location.href = "/login";
  }
  if (!teamInfo) {
    // TODO: style this better
    // TODO: add button to go to lobby page
    return (
      <Flex backgroundColor="#faf9f6" color="black">
        <Flex justifyContent="center" alignItems="center" height="100vh" width="100%">
          <Flex justifyContent="space-between" alignItems="center" width="50%">
            <Typography variant="body1">{`You don't have a team yet. Create or join a team first!`}</Typography>
          </Flex>
        </Flex>
        <Sidebar />
      </Flex>
    );
  }
  // TODO: extra - have share team code copy to clipboard. right now it's a link but is broken

  if (teamInfo.status == TeamStatus.Active) {
    return (
      <Flex backgroundColor="#faf9f6" color="black">
        <Flex justifyContent="center" alignItems="center" height="100vh" width="100%">
          <Flex justifyContent="space-between" alignItems="center" width="50%">
            <Typography variant="body1">{`You already have a team. Go to the team page!`}</Typography>
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
        {showRedText && (
          <RedText>
            &nbsp;
            <br /> &nbsp;
          </RedText>
        )}
        <InnerContainer>
          <TeamContainer>
            <TeamInfoContainer>
              <EditableTeamName
                value={teamInfo.name ?? "No name yet."}
                variant="standard"
                onChange={handleTeamNameChange}
                InputProps={{
                  endAdornment: <EditIcon color="primary" style={{ cursor: "pointer" }} />,
                }}
              />
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
            Share Team Code: {teamInfo.code}
          </RedText>
        )}
      </Content>
      <Sidebar />
    </Container>
  );
};

export default TeamRecruitingPage;
