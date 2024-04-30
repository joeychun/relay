/* CONSIDER GETTING: @mui/material */

import React, { useEffect } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";

//TODO(weblab student): REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "490724076666-g4vf4bbngcqu6v3qgtrcpiokm5a3cusd.apps.googleusercontent.com";

type Props = {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};
const LogOut = (props: Props) => {
  const { handleLogin, handleLogout } = props;
  const userId = props.userId;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {props.userId ? (
        <button
          onClick={() => {
            googleLogout();
            handleLogout();
          }}
        >
          Logout
        </button>
      ) : (
        <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Error Logging in")} />
      )}
    </GoogleOAuthProvider>
  );
};

export default LogOut;