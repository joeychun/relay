import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../Sidebar';

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
  align-items: flex-start;
`;

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 72px;
`;

const TeamInfoContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 30px;
  padding-right: 100px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0px;
`;

const UserNameHeader = styled.div`
  font-family: Roboto;
  font-size: 28px;
  margin-top: 12px;
  text-align: left;
`;

const UserName = styled.div`
  font-family: Roboto;
  font-size: 24px;
  margin-bottom: 12px;
  text-align: left;
`;

const BulletPoint = styled.div`
  margin-left: 8px;  
  padding-left: 8px;
`;

const StatsContainer = styled.div`
  margin-top: 0px;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
`;

const EmojiCell = styled.th`
  width: 50px;
  padding: 12px 8px;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const TableCell = styled.td`
  padding: 12px 8px;
  font-size: 20px;
  display: flex;
  align-items: center;
  flex: 1;
`;

const TableCellR = styled(TableCell)`
  justify-content: flex-end;
`;

const DropdownContainer = styled.div`
  width: 100%;
  max-width: 620px;
  margin-top: 24px;
  position: relative;
`;

const DropdownHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownIcon = styled.svg`
  margin-left: 10px;
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const DropdownOpen = styled(DropdownContent)`
  display: block;
`;

const TeamPage = () => {
  const teammates = ["User 1", "User 2", "User 3"];
  const latestStreak = 5;
  const longestStreak = 8;

  const recentProblems = [
    { problem: "Problem 1", correctAnswer: "3", userAnswer: "3 ✅" },
    { problem: "Problem 2", correctAnswer: "7", userAnswer: "7 ✅" },
    { problem: "Problem 3", correctAnswer: "9", userAnswer: "2 ❌" },
  ];

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <Container>
      <Content>
        <InnerContainer>
          <TeamContainer>
            <TeamInfoContainer>
              <UserNameHeader><b><u>Team</u></b></UserNameHeader>
              <ul>
                {teammates.map((teammate, index) => (
                  <li key={index}><UserName>{teammate}</UserName></li>
                ))}
              </ul>
            </TeamInfoContainer>
          </TeamContainer>

          <StatsContainer>
            <Table>
              <thead>
                <TableRow>
                  <EmojiCell></EmojiCell>
                  <TableCell><b>Stats</b></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </thead>
              <tbody>
                <TableRow>
                  <EmojiCell>🕒</EmojiCell>
                  <TableCell>Latest Streak</TableCell>
                  <TableCellR><b>{latestStreak}</b></TableCellR>
                </TableRow>
                <TableRow>
                  <EmojiCell>🔥</EmojiCell>
                  <TableCell>Longest Streak</TableCell>
                  <TableCellR><b>{longestStreak}</b></TableCellR>
                </TableRow>
                <TableRow>
                  <EmojiCell>❓</EmojiCell>
                  <TableCell>Latest Performance</TableCell>
                  <TableCellR>✅✅❌</TableCellR>
                </TableRow>
              </tbody>
            </Table>
          </StatsContainer>
        </InnerContainer>

        <DropdownContainer>
          <DropdownHeader onClick={toggleDropdown}>
            Recent Problems
            <DropdownIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M7 10l5 5 5-5z" />
            </DropdownIcon>
          </DropdownHeader>
          <DropdownContent style={{ display: isDropdownOpen ? 'block' : 'none' }}>
            <Table>
              <thead>
                <TableRow>
                  <TableCell>Problem</TableCell>
                  <TableCell>Correct Answer</TableCell>
                  <TableCell>User's Answer</TableCell>
                </TableRow>
              </thead>
              <tbody>
                {recentProblems.map((problem, index) => (
                  <TableRow key={index}>
                    <TableCell>{problem.problem}</TableCell>
                    <TableCell>{problem.correctAnswer}</TableCell>
                    <TableCell>{problem.userAnswer}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </DropdownContent>
        </DropdownContainer>
      </Content>
      <Sidebar />
    </Container>
  );
};

export default TeamPage;
