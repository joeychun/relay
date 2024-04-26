import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import { socket } from "../client-socket";
import User from "../../../shared/User";
import "../utilities.css";

import Lobby from "./pages/LobbyPage";
import TeamPage from "./pages/TeamPage"; // TODO: update all filenames to ..Page.tsx
import Problem from "./pages/ProblemPage";
import AdminPage from "./pages/AdminPage";
import Profile from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import { CircularProgress } from "@mui/material";
import TeamRecruitingPage from "./pages/TeamRecruitingPage";
import {
  Team,
  teamResponseType,
  TeamWithInfo,
  teamWithInfoResponseType,
} from "../../../shared/apiTypes";

const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [loginChecked, setLoginChecked] = useState<boolean>(false);

  useEffect(() => {
    get("/api/whoami")
      .then((user: User) => {
        if (user._id) {
          // TRhey are registed in the database and currently logged in.
          setUserId(user._id);
        }
      })
      .then(() =>
        socket.on("connect", () => {
          post("/api/initsocket", { socketid: socket.id });
        })
      )
      .finally(() => setLoginChecked(true));
  }, []);

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken as string) as { name: string; email: string };
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  const example = {
    problemText:
      "When $x$ is the answer provided by your teammate, what is $2+x$? When $x$ is the answer provided by your teammate, what is $2+x$? ",
    image: "https://mathworld.wolfram.com/images/eps-svg/SimsonLine_1000.svg",
  };

  if (!loginChecked) {
    return <CircularProgress />;
  }

  // NOTE:
  // All the pages need to have the props extended via RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Skeleton handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
          }
          path="/"
        />
        {/* <Route path="/me" element={<UserPage userId={userId} />} /> */}
        <Route
          path="/login"
          element={
            <LoginPage handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
          }
        />
        <Route path="/lobby" element={<Lobby userId={userId} />} />
        <Route path="/profile" element={<Profile userId={userId} />} />
        <Route path="/admin" element={<AdminPage userId={userId} />} />
        <Route path="/team" element={<TeamPage userId={userId} />} />
        <Route path="/team-recruit" element={<TeamRecruitingPage userId={userId} />} />
        <Route path="/problem" element={<Problem userId={userId} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
