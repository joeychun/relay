import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
} from "@mui/material";
import { RelayProblemResult } from "../../../../shared/apiTypes";
import { MathJax } from 'better-react-mathjax';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  font-size: 18px;
`

const TableBody = styled.tbody`
  font-size: 15px;
`

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  // display: flex;
  // align-items: center;
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
  align-items: center;
`;

const TableCellFirst = styled(TableCell)`
  width: 65%;
`;

const TableCellSecond = styled(TableCell)`
  width: 15%;
  text-align: center;
`;

const TableCellThird = styled(TableCell)`
  width: 20%;
  text-align: center;
`;

const TableCellHeader = styled(TableCell)`
  font-weight: 700;
  font-size: 24px;
`;

const TableCellR = styled(TableCell)`
  justify-content: flex-end;
`;

type ProblemDisplayProps = {
  open: boolean;
  onClose: () => void;
  problemToShow: RelayProblemResult | null;
};

const ProblemDisplayModal = (props: ProblemDisplayProps) => {
  const problemToShow = props.problemToShow;

  if (!problemToShow) {
    return <></>;
  }

  const dateStr = new Date(problemToShow.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={props.open} onClose={props.onClose} sx={{ width: "100%" }}>
      <DialogTitle>{`Problems for ${dateStr}`}</DialogTitle>
      <DialogContent sx={{ width: "550px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellFirst>Problem</TableCellFirst>
              <TableCellSecond>Correct Answer</TableCellSecond>
              <TableCellSecond>User</TableCellSecond>
              <TableCellThird>User's Answer</TableCellThird>
            </TableRow>
          </TableHead>
          <TableBody>
            {problemToShow.subproblemAttemptsWithUsers.map((attempt, index) => {
              const groundTruthSubproblem = problemToShow.subproblems[index];
              return (
                <TableRow key={index}>
                  <TableCellFirst><MathJax inline>{groundTruthSubproblem.question}</MathJax></TableCellFirst>
                  {/* <TableCellFirst><MathJax inline>{"What is \\(3^{999}\\)"}</MathJax></TableCellFirst> */}
                  <TableCellSecond><b>{groundTruthSubproblem.answer}</b></TableCellSecond>
                  <TableCellSecond>{attempt.assignedUser.name ?? "Anon"}</TableCellSecond>
                  <TableCellThird>
                    {attempt.answer ?? "Blank"}{" "}
                    {groundTruthSubproblem.answer == attempt.answer ? "✅" : "❌"}
                  </TableCellThird>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.onClose();
          }}
          color="primary"
        >
          {`Close`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProblemDisplayModal;
