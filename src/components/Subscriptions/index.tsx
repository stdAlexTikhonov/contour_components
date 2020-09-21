import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import IconButton from "@material-ui/core/IconButton";
import { NewSubscription } from "./Components/NewSubscribtion";

import { useStyles } from "./styles";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, open } = props;
  const subscription: any = React.createRef();

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
      <DialogTitle id="simple-dialog-title">Subscriptions</DialogTitle>
      <div className={classes.container}>
        <form className={classes.root} noValidate={true} autoComplete="off">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <NewSubscription />
            <Button style={{ outline: "none" }} onClick={handleClose} disabled>
              Edit
            </Button>
            <Button style={{ outline: "none" }} onClick={handleClose} disabled>
              Unsubscribe
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

export const Subscriptions = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        size="small"
        style={{ outline: "none" }}
        aria-label="delete"
        onClick={handleClickOpen}
      >
        <MailOutlineIcon />
      </IconButton>
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
};
