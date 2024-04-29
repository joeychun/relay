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

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

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
  font-size: 18px;
  align-items: center;
`;

const TableCellFirst = styled(TableCell)`
  width: 70%;
`;

const TableCellSecond = styled(TableCell)`
  width: 15%;
  text-align: center;
`;

const TableCellThird = styled(TableCell)`
  width: 15%;
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
  // date: Date;
  // teamInfo: something;
};

const ProblemDisplayModal = (props: ProblemDisplayProps) => {
  const problemToShow = props.problemToShow;

  useEffect(() => {
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typeset()
    }
  }, [])

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
          <thead>
            <TableRow>
              <TableCellFirst>Problem</TableCellFirst>
              <TableCellSecond>Correct Answer</TableCellSecond>
              <TableCellThird>User</TableCellThird>
              <TableCellThird>User's Answer</TableCellThird>
            </TableRow>
          </thead>
          <tbody>
            {problemToShow.subproblemAttemptsWithUsers.map((attempt, index) => {
              const groundTruthSubproblem = problemToShow.subproblems[index];
              return (
                <TableRow key={index}>
                  <TableCellFirst>{groundTruthSubproblem.question}</TableCellFirst>
                  <TableCellSecond>{groundTruthSubproblem.answer}</TableCellSecond>
                  <TableCellThird>{attempt.assignedUser.name ?? "Anon"}</TableCellThird>
                  <TableCellThird>
                    {attempt.answer ?? "No answer."}{" "}
                    {groundTruthSubproblem.answer == attempt.answer ? "✅" : "❌"}
                  </TableCellThird>
                </TableRow>
              );
            })}
          </tbody>
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
