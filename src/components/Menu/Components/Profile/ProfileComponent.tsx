import React from "react";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import { IProps } from "./types";

import { useStyles } from "./styles";

export interface SimpleDialogProps {
  open: boolean;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  email_: string | null;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, open, first_name, last_name, name, email_ } = props;
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
            value={first_name}
          />

          <TextField
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            inputRef={lastName}
            value={last_name}
          />

          <TextField
            id="outlined-basic"
            label="Full Name"
            variant="outlined"
            inputRef={fullName}
            value={name}
          />

          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            type="email"
            value={email_}
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

export const ProfileComponent: React.FC<IProps> = ({
  name,
  last_name,
  first_name,
  email,
}) => {
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
      <SimpleDialog
        open={open}
        onClose={handleClose}
        first_name={first_name}
        last_name={last_name}
        name={name}
        email_={email}
      />
    </div>
  );
};
