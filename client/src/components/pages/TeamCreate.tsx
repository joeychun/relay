/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Sidebar from '../Sidebar';
import AddIcon from '@mui/icons-material/AddToPhotos';
import ConnectIcon from '@mui/icons-material/ConnectWithoutContact';

const drawerWidth = 180;

const styles = {
  root: css`
    display: flex;
    min-height: 100vh;
    background-color: #faf9f6;
    color: #000000;
  `,
  content: css`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `,
  container: css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  teamContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 72px;
  `,
  userNameHeader: css`
    font-family: Roboto;
    font-size: 28px;
    margin-top: 12px;
    text-align: left;
  `,
  userName: css`
    font-family: Roboto;
    font-size: 24px;
    margin-bottom: 12px;
    text-align: left;
  `,
  buttonContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 72px;
  `,
  button: css`
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
  `,
  redText: css`
    color: red;
    font-size: 20px;
    margin-top: 16px;
    margin-bottom: 16px;
    a {
      color: red;
    }
  `,
  bulletpoint: css`
    margin-left: 8px;  
    padding-left: 8px;
  `,
};

const TeamPage = ({ teamSize }) => { // For now, it's put as teamSize. Later a list of Users should be passed as a prop.
  const [showRedText, setShowRedText] = useState(false); // State to manage the visibility of the red text/link

  const handleRecruitButtonClick = () => {
    setShowRedText(true); // Show the red text/link when the "Recruit" button is clicked
  };

  return (
    <div css={styles.root}>
      <main css={styles.content}>
        {showRedText && (
          <div css={styles.redText}>&nbsp;<br /> &nbsp;</div> // For alignment
        )}
        <div css={styles.container}>
          <div css={styles.teamContainer}>
            <div css={styles.userNameHeader}><b><u>Team</u></b></div>
            <ul css={styles.bulletpoint}>
              <li><div css={styles.userName}>User 1aaa</div></li>
              <li><div css={styles.userName}>User 2</div></li>
              <li><div css={styles.userName}>User 3</div></li>
            </ul>
          </div>
          <div css={styles.buttonContainer}>
            {teamSize < 3 ?
              <Button
                variant="contained"
                color="primary"
                css={styles.button}
                startIcon={<AddIcon />}
                onClick={handleRecruitButtonClick} // Call handleRecruitButtonClick when "Recruit" button is clicked
              >
                Recruit
            </Button>
              :
              <Button disabled
                variant="contained"
                color="primary"
                css={styles.button}
                startIcon={<AddIcon />}
              >
                Recruit
            </Button>
            }
            {teamSize < 3 ?
              <Button disabled
                variant="contained"
                color="primary"
                css={styles.button}
                startIcon={<ConnectIcon />}
              >
                Relay!
            </Button>
              :
              <Button
                variant="contained"
                color="primary"
                css={styles.button}
                startIcon={<ConnectIcon />}
              >
                Relay!
            </Button>
            }
          </div>
        </div>
        {/* Red text/link */}
        {showRedText && (
          <div css={styles.redText}>
            Share Invitation Link: <a href="#">asdf</a>
            <br />
              Or, Share Team Code: <a href="#">asdf</a>
          </div>
        )}
      </main>
      <Sidebar />
    </div>
  );
};

export default TeamPage;
