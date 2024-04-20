// import React, { Fragment, useState } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid';
// import Drawer from '@material-ui/core/Drawer';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import GroupAddIcon from '@material-ui/icons/GroupAdd';
// import TrophyIcon from '@material-ui/icons/EmojiEvents';
// import QuestionMarkIcon from '@material-ui/icons/HelpOutline';

// const drawerWidth = 140;

// const useStyles = makeStyles((theme) => ({
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//     backgroundColor: '#FFFFFF',
//     color: '#000000',
//   },
//   toolbar: theme.mixins.toolbar,
//   instructionsContainer: {
//     position: 'relative',
//     display: 'inline-block', // Added this line
//   },
//   instructions: {
//     width: '200px',
//     position: 'absolute',
//     top: 'calc(80% + 10px)', // Adjusted this line
//     left: '80%',
//     transform: 'translateX(-50%)',
//     backgroundColor: 'white',
//     padding: '10px',
//     zIndex: 1000,
//     boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//   },
// }));

// const Sidebar = () => {
//   const classes = useStyles();
//   const [showInstructions, setShowInstructions] = useState(false);

//   const handleAccountClick = () => {
//     // Redirect to '/profile' page
//     window.location.href = '/profile';
//   };

//   const handleTrophyClick = () => {
//     // Redirect to '/team' page
//     window.location.href = '/team';
//   };

//   const handleQuestionMarkHover = () => {
//     // Show instructions
//     setShowInstructions(true);
//   };

//   const handleQuestionMarkLeave = () => {
//     // Hide instructions
//     setShowInstructions(false);
//   };

//   return (
//     <Fragment>
//       <Drawer
//         className={classes.drawer}
//         variant="permanent"
//         classes={{
//           paper: classes.drawerPaper,
//         }}
//         anchor="right"
//       >
//         <div className={classes.toolbar} />
//         <Button onClick={handleAccountClick}>
//           <AccountCircleIcon style={{ fontSize: 50, margin: '20px auto', display: 'block' }} />
//         </Button>
//         <Button onClick={handleTrophyClick}>
//           <TrophyIcon style={{ fontSize: 50, margin: '20px auto', display: 'block' }} />
//         </Button>
//         <div style={{ flexGrow: 1 }}></div>
//         <div className={classes.instructionsContainer}>
//           <QuestionMarkIcon
//             style={{ fontSize: 50, margin: '20px auto', display: 'block', cursor: 'help' }}
//             onMouseEnter={handleQuestionMarkHover}
//             onMouseLeave={handleQuestionMarkLeave}
//           />
//         </div>
//       </Drawer>
//       <div
//         className={classes.instructions}
//         style={{ display: (showInstructions ? 'block' : 'none') }}
//       >
//         This is where you can find instructions. TODO
//     </div>
//     </Fragment>
//   );
// };

// export default Sidebar;


import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import TrophyIcon from '@material-ui/icons/EmojiEvents';
import QuestionMarkIcon from '@material-ui/icons/HelpOutline';
import HomeIcon from '@material-ui/icons/Home';

const drawerWidth = 140;

const useStyles = makeStyles((theme) => ({
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
  instructionsContainer: {
    position: 'relative',
    display: 'inline-block', // Added this line
  },
  instructions: {
    width: '200px',
    position: 'absolute',
    top: 'calc(80% + 10px)', // Adjusted this line
    left: '80%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '10px',
    zIndex: 1000,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleAccountClick = () => {
    // Redirect to '/profile' page
    window.location.href = '/profile';
  };

  const handleTrophyClick = () => {
    // Redirect to '/team' page
    window.location.href = '/team';
  };

  const handleHomeClick = () => {
    // Redirect to '/lobby' page
    window.location.href = '/lobby';
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
    <Fragment>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="right"
      >
        <div className={classes.toolbar} />
        <Button onClick={handleHomeClick}>
          <HomeIcon style={{ fontSize: 50, margin: '20px auto', display: 'block' }} />
        </Button>
        <Button onClick={handleAccountClick}>
          <AccountCircleIcon style={{ fontSize: 50, margin: '20px auto', display: 'block' }} />
        </Button>
        <Button onClick={handleTrophyClick}>
          <TrophyIcon style={{ fontSize: 50, margin: '20px auto', display: 'block' }} />
        </Button>
        <div style={{ flexGrow: 1 }}></div>
        <div className={classes.instructionsContainer}>
          <QuestionMarkIcon
            style={{ fontSize: 50, margin: '20px auto', display: 'block', cursor: 'help' }}
            onMouseEnter={handleQuestionMarkHover}
            onMouseLeave={handleQuestionMarkLeave}
          />
        </div>
      </Drawer>
      <div
        className={classes.instructions}
        style={{ display: (showInstructions ? 'block' : 'none') }}
      >
        This is where you can find instructions. TODO
      </div>
    </Fragment>
  );
};

export default Sidebar;
