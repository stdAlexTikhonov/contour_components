import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, open } = props;

  const handleClose = () => {};

  const handleListItemClick = (value: string) => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Save template</DialogTitle>
      <TextField
        id="outlined-basic"
        label="Layout name"
        variant="outlined"
        style={{ margin: 20, width: 300, marginTop: 0 }}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ margin: 20, marginTop: 0 }}
        onClick={() => handleListItemClick("1")}
      >
        Save
      </Button>
    </Dialog>
  );
}

export const SaveAs = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography variant="subtitle1" onClick={handleClickOpen}>
        Save as...
      </Typography>

      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
};
