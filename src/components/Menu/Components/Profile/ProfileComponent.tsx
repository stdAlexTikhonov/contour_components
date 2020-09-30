import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import { IProps } from "./types";
import {
  PROFILE,
  FIRST_NAME,
  LAST_NAME,
  FULL_NAME,
  EMAIL,
  OK,
  CANCEL,
} from "../../../../utils/constants";
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
  const firstNameRef: any = React.createRef();
  const lastNameRef: any = React.createRef();
  const fullNameRef: any = React.createRef();
  const emailRef: any = React.createRef();

  const [firstName, setFirstName] = useState(first_name);
  const [lastName, setLastName] = useState(last_name);
  const [fullName, setFullName] = useState(name);
  const [email, setEmail] = useState(email_);

  useEffect(() => {
    setFirstName(first_name);
    setLastName(last_name);
    setFullName(name);
    setEmail(email_);
  }, [first_name, last_name, name, email_]);

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
      <DialogTitle id="simple-dialog-title">{PROFILE}</DialogTitle>
      <div className={classes.container}>
        <form className={classes.root} noValidate={true} autoComplete="off">
          <TextField
            id="filled-basic"
            label={FIRST_NAME}
            variant="outlined"
            inputRef={firstNameRef}
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />

          <TextField
            id="outlined-basic"
            label={LAST_NAME}
            variant="outlined"
            onChange={(e) => setLastName(e.target.value)}
            inputRef={lastNameRef}
            value={lastName}
          />

          <TextField
            id="outlined-basic"
            label={FULL_NAME}
            variant="outlined"
            onChange={(e) => setFullName(e.target.value)}
            inputRef={fullNameRef}
            value={fullName}
          />

          <TextField
            id="outlined-basic"
            label={EMAIL}
            variant="outlined"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            inputRef={emailRef}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              style={{
                outline: "none",
                minWidth: "unset",
              }}
            >
              {OK}
            </Button>
            <Button style={{ outline: "none" }} onClick={handleClose}>
              {CANCEL}
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
      <ListItemText primary={PROFILE} onClick={handleClickOpen} />
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
