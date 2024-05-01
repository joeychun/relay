import React, { useState, useEffect } from "react";
import { post, get } from "../../utilities";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

import {
  User,
  TypedRequestBody,
  userDataResponseType,
  setUserNameRequestBodyType,
  UserInfo,
} from "../../../../shared/apiTypes";
import { Flex, Text } from "rebass/styled-components";
import { Box, Grid, CircularProgress, Button, TextField, Typography } from "@mui/material";
import EditValueModal from "../modules/EditValueModal";
import Sidebar from "../Sidebar";

type ProfilePageProps = {
  userId?: string;
};

const ProfilePage = (props: ProfilePageProps) => {
  const userId = props.userId;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditValueModalOpen, setIsEditValueModalOpen] = useState(false);

  const editName = (name: string) => {
    if (!userId) return Promise.resolve();
    const body: setUserNameRequestBodyType = {
      name,
    };
    console.log("Submitting new name:", name);
    return post("/api/username", body).then(() => {
      loadUser();
    });
  };

  const loadUser = () => {
    if (!userId) {
      console.log("No user id to load");
      return Promise.resolve();
    }
    get(`/api/user`, {})
      .then((res: userDataResponseType) => {
        console.log("res", res);
        setUserInfo(res.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  useEffect(() => {
    loadUser();
  }, [userId]);

  if (!userId) {
    window.location.href = "/login";
  }

  if (!userInfo) {
    return <CircularProgress />;
  }

  return (
    <Flex flexDirection="column" backgroundColor="#faf9f6" minHeight={"100vh"}>
      <Box marginTop="calc(100vh / 6)" marginLeft="calc(100vw / 6)">
        <Typography marginBottom="10px" variant="h4">
          Username: <b>{userInfo.name ?? "Anonymous"}</b>
        </Typography>
        <Button
          sx={{
            borderRadius: "10px",
            backgroundColor: "#ffd166",
            color: "black",
          }}
          onClick={() => {
            setIsEditValueModalOpen(true);
          }}
        >
          Edit username
        </Button>
      </Box>
      <EditValueModal
        curVal={userInfo.name ?? ""}
        title="Edit username"
        maxLength={16}
        onClose={() => {
          setIsEditValueModalOpen(false);
        }}
        open={isEditValueModalOpen}
        handleEditVal={editName}
      />
      <Sidebar />
    </Flex>
  );
};

export default ProfilePage;
