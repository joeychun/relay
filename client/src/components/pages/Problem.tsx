/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { Typography, TextField, Button } from '@mui/material';

const styles = {
  root: css`
    display: flex;
    min-height: 100vh;
    background-color: #faf9f6;
    color: #000000;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `,
  problemContainer: css`
    max-width: 600px;
    text-align: center;
    margin-bottom: 20px;
  `,
  problemText: css`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  `,
  textArea: css`
    width: 20%;
    height: 60px;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 8px;
    // border: 1px solid #ccc;
    resize: none;
    box-sizing: border-box;
  `,
  submitButton: css`
    padding: 8px 16px;
    background-color: #ffd166;
    color: #000000;
    font-size: 1rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
  `,
};

const ProblemPage = ({ problem, prevAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');

  const handleSubmit = () => {
    // Handle form submission, e.g., submit the user's answer to the server
    console.log('User submitted answer:', userAnswer);
  };

  return (
    <div css={styles.root}>
      <div css={styles.problemContainer}>
        <Typography variant="h5" css={styles.problemText}>{problem}</Typography>
        {prevAnswer && (
          <Typography variant="body1">Answer provided by teammate: {prevAnswer}</Typography>
        )}
      </div>
      <TextField
        multiline
        rows={1}
        variant="outlined"
        placeholder="Type your answer here..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        css={styles.textArea}
      />
      <Button variant="contained" onClick={handleSubmit} css={styles.submitButton}>
        Submit
      </Button>
      <Sidebar />
    </div>
  );
};

export default ProblemPage;
