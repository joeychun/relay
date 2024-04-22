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

type EditNameProps = {
  curUsername: string;
  open: boolean;
  onClose: () => void;
  handleEditName: (code: string) => Promise<void>;
};

const EditNameModal = (props: EditNameProps) => {
  const [newName, setNewName] = useState(props.curUsername);
  const [usernameError, setUsernameError] = useState(false);
  console.log("name rn from editmodal:", newName);

  useEffect(() => {
    try {
      setNewName(props.curUsername);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [props.curUsername]);

  return (
    <Dialog open={props.open} onClose={props.onClose} >
      <DialogTitle>Edit name</DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <TextField
          margin="dense"
          label="New display name"
          type="text"
          fullWidth
          value={newName}
          onChange={(event) => {
            const newUsername = event.target.value;
            setNewName(newUsername);
            setUsernameError(newUsername.length > 16);
          }}
          autoFocus
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              if (newName.length < 1) return;
              props.handleEditName(newName).then(() => {
                props.onClose();
              });
            }
          }}
          error={usernameError} // Set error prop based on usernameError state
          helperText={usernameError ? 'Update Failure: Username cannot exceed 16 characters' : ''} // Display error message if usernameError is true
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.handleEditName(newName).then(() => {
              props.onClose();
            });
          }}
          disabled={newName.length < 1 || usernameError}
          color="primary"
        >
          {`Let's go`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNameModal;
