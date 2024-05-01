import React, { useState, useEffect } from "react";
import { GoogleLogin, CredentialResponse, GoogleOAuthProvider } from "@react-oauth/google";
import { Box, Grid, CircularProgress, Typography } from "@mui/material";

type LoginPageProps = {
  userId?: string;
  handleLogin: (res: CredentialResponse) => void;
  handleLogout: () => void;
};

const GOOGLE_CLIENT_ID = "490724076666-g4vf4bbngcqu6v3qgtrcpiokm5a3cusd.apps.googleusercontent.com";

const LoginPage = (props: LoginPageProps) => {
  const userId = props.userId;

  if (props.userId) {
    window.location.href = "/problem";
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Grid container width="100%" direction="column">
        <Typography variant="h2" align="center" fontWeight="bold" marginBottom="10px">
          Welcome to the relay game! Log in to begin.
        </Typography>
        <Box width="250px" padding="20px">
          <GoogleLogin onSuccess={props.handleLogin} onError={() => console.log("Login Failed")} />
        </Box>
      </Grid>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
