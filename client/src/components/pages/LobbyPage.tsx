import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { Flex } from "rebass/styled-components";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
} from "@mui/material";
import { get, post } from "../../utilities";
import {
  Team,
  TeamWithInfo,
  createTeamRequestBodyType,
  joinTeamRequestBodyType,
  teamResponseType,
  userDataResponseType,
} from "../../../../shared/apiTypes";

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

type JoinOrCreateTeamProps = {
  viewState: "join" | "create" | null;
  onClose: () => void;
  handleJoinTeam: (code: string) => Promise<void>;
  handleCreateTeam: (name: string) => Promise<void>;
};

const JoinOrCreateTeamModal = (props: JoinOrCreateTeamProps) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  return (
    <Dialog open={!!props.viewState} onClose={props.onClose}>
      {props.viewState == "join" ? (
        <>
          <DialogTitle>Join team</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Team join code"
              type="number"
              fullWidth
              value={code}
              onChange={(event) => {
                // event.persist();
                setCode(event.target.value.replace(/\D/g, ""));
              }}
              autoFocus
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  if (code.length < 1) return;
                  props.handleJoinTeam(code).then(() => {
                    props.onClose();
                  });
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                props.handleJoinTeam(code).then(() => {
                  props.onClose();
                });
              }}
              disabled={code.length < 1}
              color="primary"
            >
              {`Let's go`}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Create team</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Team name"
              type="text"
              fullWidth
              value={name}
              onChange={(event) => {
                // event.persist();
                setName(event.target.value);
              }}
              autoFocus
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  if (name.length < 1) return;
                  props.handleCreateTeam(name).then(() => {
                    props.onClose();
                  });
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                props.handleCreateTeam(name).then(() => {
                  props.onClose();
                });
              }}
              disabled={name.length < 1}
              color="primary"
            >
              {`Let's go`}
            </Button>
          </DialogActions>{" "}
        </>
      )}
    </Dialog>
  );
};

type LobbyPageProps = {
  userId?: string;
  teamInfo: TeamWithInfo | null;
};

const LobbyPage = (props: LobbyPageProps) => {
  const userId = props.userId;
  const [viewState, setViewState] = useState<"join" | "create" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const teamInfo = props.teamInfo;

  // TODO: right now, errors crash the api but should be returning 404/400 instead of throwing errors

  const joinTeam = (code: string) => {
    if (!userId) return Promise.resolve();
    const body: joinTeamRequestBodyType = {
      code,
    };
    console.log("Submitting code:", code);
    return post("/api/joinTeam", body)
      .then((data) => {
        window.location.href = "/team-recruit";
      })
      .catch((e) => {
        setErrorMsg("A team with that code doesn't exist.");
        // setErrorMsg(e); TODO: return more descriptive error msgs from the api
      });
  };

  const createTeam = (name: string) => {
    if (!userId) return Promise.resolve();
    const body: createTeamRequestBodyType = {
      name,
    };
    return post("/api/createTeam", body)
      .then((data) => {
        window.location.href = "/team-recruit";
      })
      .catch((e) => {
        setErrorMsg("You already have a team.");
        // setErrorMsg(e); TODO: return more descriptive error msgs from the api
      });
  };

  if (!userId) {
    window.location.href = "/login";
  }
  console.log("TEAM INFO IN LOBBY", teamInfo);
  if (!!teamInfo) {
    // home icon on sidebar should go to /lobby if you don't have a team, and team-recruit if you do and it's recruiting, and /team if you do and it's active
    // TODO: Better styling for state of lobby page if you're already part of a team."
    // add button to problem page?
    // improve msg
    return (
      <Flex backgroundColor="#faf9f6" color="black">
        <Flex justifyContent="center" alignItems="center" height="100vh" width="100%">
          <Flex justifyContent="space-between" alignItems="center" width="50%">
            <Typography variant="body1">{`You're already part of a team. Head over to start playing!`}</Typography>
          </Flex>
        </Flex>
        <Sidebar />
      </Flex>
    );
  }
  return (
    <Flex backgroundColor="#faf9f6" color="black">
      <Flex justifyContent="center" alignItems="center" height="100vh" width="100%">
        <Flex flexDirection="column" alignItems="center">
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="150%">
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => {
                setViewState("create");
                setErrorMsg("");
              }} // TODO: change it to something like <Link>
            >
              Create Team
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<GroupAddIcon />}
              onClick={() => {
                setViewState("join");
                setErrorMsg("");
              }}
            >
              Join Team
            </StyledButton>
          </Flex>
          {errorMsg && (
            <Typography variant="body1" color="red">
              {errorMsg}
            </Typography>
          )}
        </Flex>
      </Flex>
      <Sidebar />
      <JoinOrCreateTeamModal
        onClose={() => {
          setViewState(null);
        }}
        viewState={viewState}
        handleJoinTeam={joinTeam}
        handleCreateTeam={createTeam}
      />
    </Flex>
  );
};

export default LobbyPage;
