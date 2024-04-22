import React, { useState, useEffect } from "react";
import { post, get } from "../../utilities";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

import {
  User,
  TypedRequestBody,
  userDataResponseType,
  setUserNameRequestBodyType,
} from "../../../../shared/apiTypes";
import { Flex, Text } from "rebass/styled-components";

import styled from 'styled-components';

import { socket } from "../../client-socket";
import { Box, Grid, CircularProgress, Button, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import EditNameModal from "../modules/EditNameModal";
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

type UserPageProps = {
  userId?: string;
};

const UserPage = (props: UserPageProps) => {
  const userId = props.userId;
  const [username, setUsername] = useState("");
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [inputtedUsername, setInputtedUsername] = useState<string>("");

  const editName = (name: string) => {
    if (!userId) return Promise.resolve();
    const body: setUserNameRequestBodyType = {
      name
    };
    console.log("Submitting new name:", name);
    return post("/api/username", body).then((data: userDataResponseType) => {
      console.log("updating username");
      setUsername(data.name);
    });
  };

  // console.log("User id in userpage", props.userId);
  // console.log("User id in userpage 2", userId);

  const loadUser = () => {
    if (!userId) {
      console.log("No user id to load");
      return Promise.resolve();
    }
    get(`/api/user`, {}).then((res: userDataResponseType) => {
      console.log(
        "username returned",
        res.name
      );
      setUsername(res.name);
    });
  };

  useEffect(() => {
    try {
      loadUser();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [userId]);

  if (!props.userId) {
    return (<Grid container width="100%" direction="column">
      <Typography variant='h3'>You are not logged in. Take me back to the login.</Typography>
      <Button
        fullWidth
        color="primary"
        onClick={() => {
          window.location.href = "/login";
        }}
      >
        Take me!
      </Button>
    </Grid>)
  }


  return (
    <Grid container width="100%" direction="column">

      <Text>Username: {username ?? 'Anonymous'}</Text>
      <Box width="250px" padding="20px">
        <Button
          fullWidth
          color="primary"
          onClick={() => {
            setIsEditNameModalOpen(true);
          }}
        >
          Edit username
      </Button>
      </Box>
      <EditNameModal
        curUsername={username}
        onClose={() => {
          setIsEditNameModalOpen(false);
        }}
        open={isEditNameModalOpen}
        handleEditName={editName}
      />
    </Grid>
  );
};

export default UserPage;
