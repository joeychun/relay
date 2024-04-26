import React, { useState } from "react";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import QuestionMarkIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import { Flex } from "rebass/styled-components";

const drawerWidth = 140;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
}));

const ButtonsContainer = styled(Flex)({
  flexDirection: "column",
});

const InstructionsContainer = styled(Flex)({
  position: "relative",
  display: "block", // Change display to block
  textAlign: "center", // Center the icon horizontally
  marginTop: "auto", // Push the icon to the bottom
});

const Instructions = styled("div")({
  width: "200px",
  position: "absolute",
  top: "calc(80% + 10px)",
  left: "80%",
  transform: "translateX(-50%)",
  backgroundColor: "white",
  padding: "10px",
  zIndex: 1000,
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
});

type SidebarProps = {
  userId?: string;
};

const Sidebar = (props: SidebarProps) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleRedirectButton = (route: string) => {
    window.location.href = route;
  };

  const handleQuestionMarkHover = () => {
    // Show instructions
    setShowInstructions(true);
  };

  const handleQuestionMarkLeave = () => {
    // Hide instructions
    setShowInstructions(false);
  };

  return (
    <>
      <StyledDrawer variant="permanent" anchor="right">
        <Flex flexDirection="column" style={{ width: drawerWidth }}>
          <ButtonsContainer>
            <Button
              onClick={() => {
                handleRedirectButton("/lobby");
              }}
            >
              <HomeIcon
                sx={{
                  color: "black",
                  fontSize: 50,
                  width: "100%",
                  margin: "20px auto",
                  display: "block",
                }}
              />
            </Button>
            <Button
              onClick={() => {
                handleRedirectButton("/profile");
              }}
            >
              <AccountCircleIcon
                sx={{ color: "black", fontSize: 50, margin: "20px auto", display: "block" }}
              />
            </Button>
            <Button
              onClick={() => {
                handleRedirectButton("/team-recruit");
              }}
            >
              <GroupAddIcon
                sx={{ color: "black", fontSize: 50, margin: "20px auto", display: "block" }}
              />
            </Button>
            <Button
              onClick={() => {
                handleRedirectButton("/team");
              }}
            >
              <TrophyIcon
                sx={{ color: "black", fontSize: 50, margin: "20px auto", display: "block" }}
              />
            </Button>
          </ButtonsContainer>
          {/* <div style={{ flexGrow: 1, marginBottom: "auto" }}></div> */}
          <Flex sx={{ display: "block", marginTop: "auto" }}>
            <QuestionMarkIcon
              sx={{ fontSize: 50, margin: "20px auto", display: "block", cursor: "help" }}
              onMouseEnter={handleQuestionMarkHover}
              onMouseLeave={handleQuestionMarkLeave}
            />
          </Flex>
        </Flex>
      </StyledDrawer>
      <Instructions style={{ display: showInstructions ? "block" : "none" }}>
        This is where you can find instructions. TODO
      </Instructions>
    </>
  );
};

export default Sidebar;
