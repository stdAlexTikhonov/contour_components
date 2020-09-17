import React from "react";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";

import { useStyles } from "./styles";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, open } = props;
  const firstName: any = React.createRef();
  const lastName: any = React.createRef();
  const fullName: any = React.createRef();
  const email: any = React.createRef();

  const handleClose = () => {
    onClose("");
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Profile</DialogTitle>
      <div className={classes.container}>
        <form className={classes.root} noValidate={true} autoComplete="off">
          <TextField
            id="filled-basic"
            label="First Name"
            variant="outlined"
            inputRef={firstName}
          />

          <TextField
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            type="password"
            inputRef={lastName}
          />

          <TextField
            id="outlined-basic"
            label="Full Name"
            variant="outlined"
            type="password"
            inputRef={fullName}
          />

          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            type="email"
            inputRef={email}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              style={{
                outline: "none",
                minWidth: "unset",
              }}
            >
              Ok
            </Button>
            <Button style={{ outline: "none" }} onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

export const Profile = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div>
      <ListItemText primary={"Profile"} onClick={handleClickOpen} />
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
};
