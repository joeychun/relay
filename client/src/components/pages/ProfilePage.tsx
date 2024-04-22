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
import { Box, Grid, CircularProgress, Button, TextField, Typography } from "@mui/material";
import EditNameModal from "../modules/EditNameModal";
import Sidebar from "../Sidebar";

type ProfilePageProps = {
  userId?: string;
};

const ProfilePage = (props: ProfilePageProps) => {
  const userId = props.userId;
  const [username, setUsername] = useState("");
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [inputtedUsername, setInputtedUsername] = useState<string>("");

  const editName = (name: string) => {
    if (!userId) return Promise.resolve();
    const body: setUserNameRequestBodyType = {
      name,
    };
    console.log("Submitting new name:", name);
    return post("/api/username", body).then((data: userDataResponseType) => {
      console.log("updating username");
      setUsername(data.name);
    });
  };

  const loadUser = () => {
    if (!userId) {
      console.log("No user id to load");
      return Promise.resolve();
    }
    get(`/api/user`, {}).then((res: userDataResponseType) => {
      console.log("username returned", res.name);
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

  // TODO: add this to every page
  if (!userId) {
    window.location.href = "/login";
  }

  return (
    <Flex flexDirection="column" backgroundColor="#faf9f6" minHeight={"100vh"}>
      <Box marginTop="calc(100vh / 6)" marginLeft="calc(100vw / 6)">
        <Typography marginBottom="10px" variant="h4">
          Username: {username ?? "Anonymous"}
        </Typography>
        <Button
          sx={{
            borderRadius: "10px",
            backgroundColor: "#ffd166",
            color: "black",
          }}
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
      <Sidebar />
    </Flex>
  );
};

export default ProfilePage;
