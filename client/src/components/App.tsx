import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import { socket } from "../client-socket";
import User from "../../../shared/User";
import "../utilities.css";

import Lobby from "./pages/Lobby";
import TeamCreate from "./pages/TeamCreate";
import Team from "./pages/Team";
import Problem from "./pages/Problem";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

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
      );
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
    problemText: "When $x$ is the answer provided by your teammate, what is $2+x$? When $x$ is the answer provided by your teammate, what is $2+x$? ",
    image: "https://mathworld.wolfram.com/images/eps-svg/SimsonLine_1000.svg"
  }

  console.log("USERID", userId);

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
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/profile" element={<Profile userId={userId} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team-create" element={<TeamCreate teamSize={2} />} />
        <Route path="/problem" element={<Problem problemText={example.problemText} image={null} prevAnswer={3} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
