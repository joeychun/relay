import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

import Sidebar from './../Sidebar';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#FAF9F6',
    color: '#000000',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '50%',
  },
  button: {
    width: '45%',
    height: '80px',
    marginBottom: theme.spacing(2),
    fontSize: '1.5rem',
    backgroundColor: '#FFD166',
    color: '#000000',
    borderRadius: '10px',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      backgroundColor: '#FFD700',
    },
  },
  icon: {
    fontSize: '20rem',
    marginRight: theme.spacing(1),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  toolbar: theme.mixins.toolbar,
}));

const LobbyPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.buttonContainer}>
        <div className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AddCircleIcon className={classes.icon} />}
          >
            Create Team
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<GroupAddIcon className={classes.icon} />}
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
