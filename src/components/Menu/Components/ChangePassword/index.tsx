import React from "react";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import {
  CHANGE_PSW,
  OK,
  CANCEL,
  OLD_PSW,
  NEW_PSW,
  CONFIRM_PSW,
} from "../../../../utils/constants";

import { useStyles } from "./styles";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, open } = props;
  const old: any = React.createRef();
  const new_: any = React.createRef();
  const confirm: any = React.createRef();

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
      <DialogTitle id="simple-dialog-title">{CHANGE_PSW}</DialogTitle>
      <div className={classes.container}>
        <form className={classes.root} noValidate={true} autoComplete="off">
          <TextField
            id="filled-basic"
            label={OLD_PSW}
            variant="outlined"
            type="password"
            inputRef={old}
          />

          <TextField
            id="outlined-basic"
            label={NEW_PSW}
            variant="outlined"
            type="password"
            inputRef={new_}
          />

          <TextField
            id="outlined-basic"
            label={CONFIRM_PSW}
            variant="outlined"
            type="password"
            inputRef={confirm}
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

export const ChangePassword = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div>
      <ListItemText primary={CHANGE_PSW} onClick={handleClickOpen} />
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
};
