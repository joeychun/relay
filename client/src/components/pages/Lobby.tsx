/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import Sidebar from '../Sidebar';

const drawerWidth = 180;

const styles = {
  root: css`
    display: flex;
    background-color: #faf9f6;
    color: #000000;
  `,
  buttonContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
  `,
  buttonGroup: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
  `,
  button: css`
    width: 45%;
    height: 80px;
    margin-bottom: 16px;
    font-size: 1.5rem;
    background-color: #ffd166;
    color: #000000;
    border-radius: 10px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
    &:hover {
      background-color: #ffd700;
    }
  `,
  icon: css`
    font-size: 2rem;
    margin-right: 8px;
  `,
  drawer: css`
    width: ${drawerWidth}px;
    flex-shrink: 0;
  `,
  drawerPaper: css`
    width: ${drawerWidth}px;
    background-color: #ffffff;
    color: #000000;
  `,
};

const LobbyPage = () => {
  return (
    <div css={styles.root}>
      <div css={styles.buttonContainer}>
        <div css={styles.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            css={styles.button}
            startIcon={<AddCircleIcon css={styles.icon} />}
          >
            Create Team
          </Button>
          <Button
            variant="contained"
            color="primary"
            css={styles.button}
            startIcon={<GroupAddIcon css={styles.icon} />}
          >
            Join Team
          </Button>
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default LobbyPage;
