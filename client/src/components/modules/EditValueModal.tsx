import React, { useState, useEffect } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
} from "@mui/material";

type EditValueProps = {
  curVal: string;
  open: boolean;
  onClose: () => void;
  handleEditVal: (newVal: string) => Promise<void>;
  title: string;
  maxLength?: number;
};

const EditValueModal = (props: EditValueProps) => {
  const [val, setVal] = useState(props.curVal);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    try {
      setVal(props.curVal);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [props.curVal]);

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <TextField
          margin="dense"
          type="text"
          fullWidth
          value={val}
          onChange={(event) => {
            const newVal = event.target.value;
            setVal(newVal);
            if (!!props.maxLength) {
              setShowError(newVal.length > props.maxLength);
            }
          }}
          autoFocus
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              if (val.length < 1) return;
              props.handleEditVal(val).then(() => {
                props.onClose();
              });
            }
          }}
          error={showError}
          helperText={showError ? "Update Failure: Too long" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.handleEditVal(val).then(() => {
              props.onClose();
            });
          }}
          disabled={val.length < 1 || showError}
          color="primary"
        >
          {`Let's go`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditValueModal;
