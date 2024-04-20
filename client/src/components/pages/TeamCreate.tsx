// import React, { useState } from 'react';
// import styled from 'styled-components';
// import Button from '@mui/material/Button';
// import Sidebar from '../Sidebar';
// import AddIcon from '@mui/icons-material/AddToPhotos';
// import ConnectIcon from '@mui/icons-material/ConnectWithoutContact';

// const drawerWidth = 180;

// const Container = styled.div`
//   display: flex;
//   min-height: 100vh;
//   background-color: #faf9f6;
//   color: #000000;
// `;

// const Content = styled.main`
//   flex-grow: 1;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
// `;

// const InnerContainer = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
// `;

// const TeamContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   margin-right: 36px;
// `;

// const TeamInfoContainer = styled.div`
//   background-color: #ffffff;
//   border-radius: 8px;
//   height: 190px;
//   padding: 30px;
//   padding-right: 100px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   margin-bottom: 20px;
// `;

// const UserNameHeader = styled.div`
//   font-family: Roboto;
//   font-size: 28px;
//   margin-top: 12px;
//   text-align: left;
// `;

// const UserName = styled.div`
//   font-family: Roboto;
//   font-size: 24px;
//   margin-bottom: 12px;
//   text-align: left;
// `;

// const ButtonContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-left: 36px;
// `;

// const CustomButton = styled(Button)`
//   && {
//     width: 200px;
//     height: 60px;
//     margin-top: 8px;
//     margin-bottom: 8px;
//     font-size: 1.5rem;
//     background-color: #ffd166;
//     color: #000000;
//     border-radius: 10px;
//     box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
//     &:hover {
//       background-color: #ffd700;
//     }
//   }
// `;

// const RedText = styled.div`
//   color: red;
//   font-size: 20px;
//   margin-top: 16px;
//   margin-bottom: 16px;
//   a {
//     color: red;
//   }
// `;

// const BulletPoint = styled.div`
//   margin-left: 8px;  
//   padding-left: 8px;
// `;

// const TeamCreatePage = ({ teamSize }) => {
//   const [showRedText, setShowRedText] = useState(false);
//   const teammates = ["User 1", "User 2", "User 3"];

//   const handleRecruitButtonClick = () => {
//     setShowRedText(true);
//   };

//   return (
//     <Container>
//       <Content>
//         {showRedText && <RedText>&nbsp;<br /> &nbsp;</RedText>}
//         <InnerContainer>
//           <TeamContainer>
//             <TeamInfoContainer>
//               <UserNameHeader><b><u>Team</u></b></UserNameHeader>
//               <ul>
//                 {teammates.map((teammate, index) => (
//                   <li key={index}><UserName>{teammate}</UserName></li>
//                 ))}
//               </ul>
//             </TeamInfoContainer>
//           </TeamContainer>
//           <ButtonContainer>
//             {teamSize < 3 ?
//               <CustomButton
//                 variant="contained"
//                 color="primary"
//                 startIcon={<AddIcon />}
//                 onClick={handleRecruitButtonClick}
//               >
//                 Recruit
//               </CustomButton>
//               :
//               <CustomButton disabled variant="contained" color="primary" startIcon={<AddIcon />}>
//                 Recruit
//               </CustomButton>
//             }
//             {teamSize < 3 ?
//               <CustomButton disabled variant="contained" color="primary" startIcon={<ConnectIcon />}>
//                 Relay!
//               </CustomButton>
//               :
//               <CustomButton variant="contained" color="primary" startIcon={<ConnectIcon />}>
//                 Relay!
//               </CustomButton>
//             }
//           </ButtonContainer>
//         </InnerContainer>
//         {showRedText && (
//           <RedText>
//             Share Invitation Link: <a href="#">asdf</a>
//             <br />
//             Or, Share Team Code: <a href="#">asdf</a>
//           </RedText>
//         )}
//       </Content>
//       <Sidebar />
//     </Container>
//   );
// };

// export default TeamCreatePage;


import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../Sidebar';
import AddIcon from '@mui/icons-material/AddToPhotos';
import ConnectIcon from '@mui/icons-material/ConnectWithoutContact';

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
  align-items: center;
`;

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 36px;
`;

const TeamInfoContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  height: 190px;
  padding: 30px;
  padding-right: 100px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const UserName = styled.div`
  font-family: Roboto;
  font-weight: 300;
  font-size: 20px;
  margin-bottom: 12px;
  text-align: left;
  display: flex;
  align-items: center;
`;

const EditableTeamName = styled(TextField)`
  && {
    input {
      font-size: 1.5rem !important;
    }
    margin-bottom: 12px;
    text-align: left;
    display: flex;
    align-items: center;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 36px;
`;

const CustomButton = styled(Button)`
  && {
    width: 200px;
    height: 60px;
    margin-top: 8px;
    margin-bottom: 8px;
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

const RedText = styled.div`
  color: red;
  font-size: 20px;
  margin-top: 16px;
  margin-bottom: 16px;
  a {
    color: red;
  }
`;

const BulletPoint = styled.div`
  margin-left: 8px;
  padding-left: 8px;
`;

const TeamCreatePage = ({ teamSize }) => {
  const [showRedText, setShowRedText] = useState(false);
  const [teamName, setTeamName] = useState('Team Name');
  const teammates = ["User 1", "User 2", "User 3"];

  const handleRecruitButtonClick = () => {
    setShowRedText(true);
  };

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  return (
    <Container>
      <Content>
        {showRedText && <RedText>&nbsp;<br /> &nbsp;</RedText>}
        <InnerContainer>
          <TeamContainer>
            <TeamInfoContainer>
              <EditableTeamName
                value={teamName}
                variant="standard"
                onChange={handleTeamNameChange}
                InputProps={{
                  endAdornment: (
                    <EditIcon color="primary" style={{ cursor: 'pointer' }} />
                  ),
                }}
              />
              <ul>
                {teammates.map((teammate, index) => (
                  <li key={index}><UserName>{teammate}</UserName></li>
                ))}
              </ul>
            </TeamInfoContainer>
          </TeamContainer>
          <ButtonContainer>
            {teamSize < 3 ?
              <CustomButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleRecruitButtonClick}
              >
                Recruit
              </CustomButton>
              :
              <CustomButton disabled variant="contained" color="primary" startIcon={<AddIcon />}>
                Recruit
              </CustomButton>
            }
            {teamSize < 3 ?
              <CustomButton disabled variant="contained" color="primary" startIcon={<ConnectIcon />}>
                Relay!
              </CustomButton>
              :
              <CustomButton variant="contained" color="primary" startIcon={<ConnectIcon />}>
                Relay!
              </CustomButton>
            }
          </ButtonContainer>
        </InnerContainer>
        {showRedText && (
          <RedText>
            Share Invitation Link: <a href="#">asdf</a>
            <br />
            Or, Share Team Code: <a href="#">asdf</a>
          </RedText>
        )}
      </Content>
      <Sidebar />
    </Container>
  );
};

export default TeamCreatePage;
