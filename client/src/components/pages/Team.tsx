// /** @jsx jsx */
// import { css, jsx } from '@emotion/react';
// import React from 'react';
// import Sidebar from '../Sidebar'; // Import the Sidebar component from a separate file

// const drawerWidth = 180;

// const styles = {
//   root: css`
//     display: flex;
//     min-height: 100vh;
//     background-color: #faf9f6;
//     color: #000000;
//   `,
//   content: css`
//     flex-grow: 1;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
//   `,
//   container: css`
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//   `,
//   teamContainer: css`
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     margin-right: 72px;
//   `,
//   userNameHeader: css`
//     font-family: Roboto;
//     font-size: 28px;
//     margin-top: 12px;
//     text-align: left;
//   `,
//   userName: css`
//     font-family: Roboto;
//     font-size: 24px;
//     margin-bottom: 12px;
//     text-align: left;
//   `,
//   buttonContainer: css`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-left: 72px;
//   `,
//   button: css`
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
//   `,
//   bulletpoint: css`
//     margin-left: 8px;  
//     padding-left: 8px;
//   `,
//   statsContainer: css`
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//   `,
//   statsLabel: css`
//     font-family: Roboto;
//     font-size: 24px;
//     margin-top: 12px;
//     text-align: left;
//   `,
//   teamInfoContainer: css`
//     background-color: #ffffff;
//     border-radius: 8px;
//     padding: 30px;
//     padding-right: 100px;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//     margin-bottom: 20px;
//   `,
//   teamMember: css`
//     display: flex;
//     align-items: center;
//     margin-bottom: 8px;
//     font-family: Roboto;
//     font-size: 18px;
//   `,
//   table: css`
//     border-collapse: collapse;
//     width: 100%;
//   `,
//   tableRow: css`
//     border-bottom: 1px solid #ddd;
//     display: flex;
//     align-items: center;
//   `,
//   tableCell: css`
//     padding: 12px;
//     font-size: 20px;
//     display: flex;
//     align-items: center;
//   `,
// };

// const TeamPage = () => {

//   // Sample data for demonstration
//   const teammates = ["User 1", "User 2", "User 3"];
//   const latestStreak = 5;
//   const longestStreak = 8;
//   const recentAnswers = [
//     { problem: "Problem 1", result: "Correct" },
//     { problem: "Problem 2", result: "Incorrect" },
//     { problem: "Problem 3", result: "Correct" }
//   ];
//   const lastRevealedProblem = "Success! You solved the problem efficiently.";

//   return (
//     <div css={styles.root}>
//       <main css={styles.content}>
//         <div css={styles.container}>
//           <div css={styles.teamContainer}>
//             <div css={styles.teamInfoContainer}>
//               <div css={styles.userNameHeader}><b><u>Team</u></b></div>
//               <ul css={styles.bulletpoint}>
//                 {teammates.map((teammate, index) => (
//                   <li key={index}><div css={styles.userName}>{teammate}</div></li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div css={styles.statsContainer}>
//             <table css={styles.table}>
//               <thead>
//                 <tr css={styles.tableRow}>
//                   <th css={styles.tableCell}>Stats</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr css={styles.tableRow}>
//                   <td css={styles.tableCell}>🕒 Latest Streak</td>
//                   <td css={styles.tableCell}>{latestStreak}</td>
//                 </tr>
//                 <tr css={styles.tableRow}>
//                   <td css={styles.tableCell}>🔥 Longest Streak</td>
//                   <td css={styles.tableCell}>{longestStreak}</td>
//                 </tr>
//                 {recentAnswers.map((answer, index) => (
//                   <tr key={index} css={styles.tableRow}>
//                     <td css={styles.tableCell}>{answer.problem}</td>
//                     <td css={styles.tableCell}>{answer.result}</td>
//                   </tr>
//                 ))}
//                 <tr css={styles.tableRow}>
//                   <td css={styles.tableCell}>Last Revealed Problem</td>
//                   <td css={styles.tableCell}>{lastRevealedProblem}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//       <Sidebar />
//     </div>
//   );
// };
// 
// export default TeamPage;
// ---------------------------------- DIVIDER ----------------------------------------------
// /** @jsx jsx */
// import { css, jsx } from '@emotion/react';
// import React from 'react';
// import Sidebar from '../Sidebar'; // Import the Sidebar component from a separate file

// const drawerWidth = 180;

// const styles = {
//   root: css`
//     display: flex;
//     min-height: 100vh;
//     background-color: #faf9f6;
//     color: #000000;
//   `,
//   content: css`
//     flex-grow: 1;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
//   `,
//   container: css`
//     display: flex;
//     flex-direction: row;
//     align-items: flex-start;
//   `,
//   teamContainer: css`
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     margin-right: 72px;
//   `,
//   userNameHeader: css`
//     font-family: Roboto;
//     font-size: 28px;
//     margin-top: 12px;
//     text-align: left;
//   `,
//   userName: css`
//     font-family: Roboto;
//     font-size: 24px;
//     margin-bottom: 12px;
//     text-align: left;
//   `,
//   buttonContainer: css`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-left: 72px;
//   `,
//   button: css`
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
//   `,
//   bulletpoint: css`
//     margin-left: 8px;  
//     padding-left: 8px;
//   `,
//   statsContainer: css`
//     margin-top: 20px;
//   `,
//   statsLabel: css`
//     font-family: Roboto;
//     font-size: 24px;
//     margin-top: 12px;
//     text-align: left;
//   `,
//   teamInfoContainer: css`
//     background-color: #ffffff;
//     border-radius: 8px;
//     padding: 30px;
//     padding-right: 100px;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//     margin-bottom: 20px;
//   `,
//   table: css`
//     border-collapse: collapse;
//     width: 100%;
//     background-color: #ffffff;
//   `,
//   tableRow: css`
//     border-bottom: 1px solid #ddd;
//     display: flex;
//     align-items: center;
//   `,
//   tableCell: css`
//     padding: 12px;
//     font-size: 20px;
//     display: flex;
//     align-items: center;
//     flex: 1;
//   `,
// };

// const TeamPage = () => {

//   // Sample data for demonstration
//   const teammates = ["User 1", "User 2", "User 3"];
//   const latestStreak = 5;
//   const longestStreak = 8;
//   const recentAnswers = [
//     { problem: "Problem 1", result: "Correct" },
//     { problem: "Problem 2", result: "Incorrect" },
//     { problem: "Problem 3", result: "Correct" }
//   ];
//   const lastRevealedProblem = "Success! You solved the problem efficiently.";

//   return (
//     <div css={styles.root}>
//       <main css={styles.content}>
//         <div css={styles.container}>
//           <div css={styles.teamContainer}>
//             <div css={styles.teamInfoContainer}>
//               <div css={styles.userNameHeader}><b><u>Team</u></b></div>
//               <ul css={styles.bulletpoint}>
//                 {teammates.map((teammate, index) => (
//                   <li key={index}><div css={styles.userName}>{teammate}</div></li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div css={styles.statsContainer}>
//             <table css={styles.table}>
//               <thead>
//                 <tr css={styles.tableRow}>
//                   <th css={styles.tableCell}>Stats</th>
//                   <th css={styles.tableCell}></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr css={styles.tableRow}>
//                   <td css={styles.tableCell}>🕒</td>
//                   <td css={styles.tableCell}>Latest Streak</td>
//                   <td css={styles.tableCell}>{latestStreak}</td>
//                 </tr>
//                 <tr css={styles.tableRow}>
//                   <td css={styles.tableCell}>🔥</td>
//                   <td css={styles.tableCell}>Longest Streak</td>
//                   <td css={styles.tableCell}>{longestStreak}</td>
//                 </tr>
//                 {/* {recentAnswers.map((answer, index) => (
//                   <tr key={index} css={styles.tableRow}>
//                     <td css={styles.tableCell}>{answer.problem}</td>
//                     <td css={styles.tableCell}>{answer.result}</td>
//                   </tr>
//                 ))} */}
//                 <tr css={styles.tableRow}>
//                   <td css={styles.tableCell}>🤓</td>
//                   <td css={styles.tableCell}>Last Revealed Problem</td>
//                   <td css={styles.tableCell}>{lastRevealedProblem}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//       <Sidebar />
//     </div>
//   );
// };

// export default TeamPage;

// -------------------------- DIVIDER ---------------------------------

// /** @jsx jsx */
// import { css, jsx } from '@emotion/react';
// import React from 'react';
// import Sidebar from '../Sidebar'; // Import the Sidebar component from a separate file

// const drawerWidth = 180;

// const styles = {
//   root: css`
//     display: flex;
//     min-height: 100vh;
//     background-color: #faf9f6;
//     color: #000000;
//   `,
//   content: css`
//     flex-grow: 1;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
//   `,
//   container: css`
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//   `,
//   teamContainer: css`
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     margin-right: 72px;
//   `,
//   userNameHeader: css`
//     font-family: Roboto;
//     font-size: 28px;
//     margin-top: 12px;
//     text-align: left;
//   `,
//   userName: css`
//     font-family: Roboto;
//     font-size: 24px;
//     margin-bottom: 12px;
//     text-align: left;
//   `,
//   bulletpoint: css`
//     margin-left: 8px;  
//     padding-left: 8px;
//   `,
//   statsContainer: css`
//     margin-top: 0px;
//   `,
//   teamInfoContainer: css`
//     background-color: #ffffff;
//     border-radius: 8px;
//     padding: 30px;
//     padding-right: 100px;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//     margin-bottom: 0px;
//   `,
//   table: css`
//     border-collapse: collapse;
//     width: 150%;
//     background-color: #ffffff;
//   `,
//   tableRow: css`
//     border-bottom: 1px solid #ddd;
//     display: flex;
//     align-items: center;
//   `,
//   tableCell: css`
//     padding: 12px 8px; /* Adjusted padding here */
//     font-size: 20px;
//     display: flex;
//     align-items: center;
//     flex: 1;
//   `,
// };

// const TeamPage = () => {

//   // Sample data for demonstration
//   const teammates = ["User 1", "User 2", "User 3"];
//   const latestStreak = 5;
//   const longestStreak = 8;
//   const lastRevealedProblem = "Success! You solved the problem efficiently.";

//   return (
//     <div css={styles.root}>
//       <main css={styles.content}>
//         <div css={styles.container}>
//           <div css={styles.teamContainer}>
//             <div css={styles.teamInfoContainer}>
//               <div css={styles.userNameHeader}><b><u>Team</u></b></div>
//               <ul css={styles.bulletpoint}>
//                 {teammates.map((teammate, index) => (
//                   <li key={index}><div css={styles.userName}>{teammate}</div></li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div css={styles.statsContainer}>
//             <table css={styles.table}>
//               <thead>
//                 <tr css={styles.tableRow}>
//                   <th css={styles.tableCell}>Stats</th>
//                   <th css={styles.tableCell}></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr css={styles.tableRow}>
//                   <td css={styles.tableCell}>🕒 &nbsp;&nbsp; Latest Streak</td>
//                   <td css={styles.tableCell}>{latestStreak}</td>
//                 </tr>
//                 <tr css={styles.tableRow}>
//                   <td css={styles.tableCell}>🔥 &nbsp;&nbsp; Longest Streak</td>
//                   <td css={styles.tableCell}>{longestStreak}</td>
//                 </tr>
//                 <tr css={styles.tableRow}>
//                   <td css={styles.tableCell}>❓ &nbsp;&nbsp; Latest Performance</td>
//                   <td css={styles.tableCell}>✅✅✅</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//       <Sidebar />
//     </div>
//   );
// };

// export default TeamPage;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useState } from 'react';
import Sidebar from '../Sidebar'; // Import the Sidebar component from a separate file

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
    align-items: flex-start;
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
  bulletpoint: css`
    margin-left: 8px;  
    padding-left: 8px;
  `,
  statsContainer: css`
    margin-top: 0px;
  `,
  teamInfoContainer: css`
    background-color: #ffffff;
    border-radius: 8px;
    padding: 30px;
    padding-right: 100px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 0px;
  `,
  table: css`
    border-collapse: collapse;
    width: 100%;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  `,
  tableRow: css`
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
  `,
  emojiCell: css`
    width: 50px; /* Adjust the width of the emoji column */
    padding: 12px 8px; /* Adjusted padding here */
    font-size: 20px;
    display: flex;
    align-items: center;
  `,
  tableCell: css`
    padding: 12px 8px; /* Adjusted padding here */
    font-size: 20px;
    display: flex;
    align-items: center;
    flex: 1;
  `,
  tableCellR: css`
    padding: 12px 8px; /* Adjusted padding here */
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
  `,

  dropdownContainer: css`
  width: 100%;
  max-width: 620px;
  margin-top: 24px;
  position: relative;
`,
  dropdownHeader: css`
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
`,
  dropdownIcon: css`
  margin-left: 10px;
`,
  dropdownContent: css`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`,
  dropdownOpen: css`
  display: block;
`,
};

const TeamPage = () => {

  // Sample data for demonstration
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
    <div css={styles.root}>
      <main css={styles.content}>
        <div css={styles.container}>
          <div css={styles.teamContainer}>
            <div css={styles.teamInfoContainer}>
              <div css={styles.userNameHeader}><b><u>Team</u></b></div>
              <ul css={styles.bulletpoint}>
                {teammates.map((teammate, index) => (
                  <li key={index}><div css={styles.userName}>{teammate}</div></li>
                ))}
              </ul>
            </div>
          </div>

          <div css={styles.statsContainer}>
            <table css={styles.table}>
              <thead>
                <tr css={styles.tableRow}>
                  <th css={styles.emojiCell}></th>
                  <th css={styles.tableCell}><b>Stats</b></th>
                  <th css={styles.tableCell}></th>
                </tr>
              </thead>
              <tbody>
                <tr css={styles.tableRow}>
                  <td css={styles.emojiCell}>🕒</td>
                  <td css={styles.tableCell}>Latest Streak</td>
                  <td css={styles.tableCellR}><b>{latestStreak}</b></td>
                </tr>
                <tr css={styles.tableRow}>
                  <td css={styles.emojiCell}>🔥</td>
                  <td css={styles.tableCell}>Longest Streak</td>
                  <td css={styles.tableCellR}><b>{longestStreak}</b></td>
                </tr>
                <tr css={styles.tableRow}>
                  <td css={styles.emojiCell}>❓</td>
                  <td css={styles.tableCell}>Latest Performance</td>
                  <td css={styles.tableCellR}>✅✅❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div css={styles.dropdownContainer}>
          <div css={styles.dropdownHeader} onClick={toggleDropdown}>
            Recent Problems
              <svg css={styles.dropdownIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
          <div css={[styles.dropdownContent, isDropdownOpen && styles.dropdownOpen]}>
            <table css={styles.table}>
              <thead>
                <tr css={styles.tableRow}>
                  <th css={styles.tableCell}>Problem</th>
                  <th css={styles.tableCell}>Correct Answer</th>
                  <th css={styles.tableCell}>User's Answer</th>
                </tr>
              </thead>
              <tbody>
                {recentProblems.map((problem, index) => (
                  <tr key={index} css={styles.tableRow}>
                    <td css={styles.tableCell}>{problem.problem}</td>
                    <td css={styles.tableCell}>{problem.correctAnswer}</td>
                    <td css={styles.tableCell}>{problem.userAnswer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Sidebar />
    </div>
  );
};

export default TeamPage;
