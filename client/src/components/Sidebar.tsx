import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#FFFFFF', // Cream-colored sidebar background
    color: '#000000', // Black sidebar text color
  },
  toolbar: theme.mixins.toolbar,
}));

const LobbyPage = () => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="right"
    >
      <div className={classes.toolbar} />
      <AccountCircleIcon style={{ fontSize: 50, margin: '10px auto', display: 'block' }} />
      {/* Other sidebar content */}
    </Drawer>
  );
};

export default LobbyPage;
