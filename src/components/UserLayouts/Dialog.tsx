import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";
import {
  SAVE_AS,
  SAVE_TEMPLATE,
  LAYOUT_NAME,
  SAVE,
} from "../../utils/constants";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export interface SimpleDialogProps {
  open: boolean;
  saveAs: (name: string) => void;
  onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const refName = useRef<HTMLInputElement | undefined>();
  const classes = useStyles();
  const { onClose, open, saveAs } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    saveAs(value);
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">{SAVE_TEMPLATE}</DialogTitle>
      <TextField
        id="outlined-basic"
        label={LAYOUT_NAME}
        variant="outlined"
        style={{ margin: 20, width: 300, marginTop: 0 }}
        inputRef={refName}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ margin: 20, marginTop: 0 }}
        onClick={() =>
          handleListItemClick(refName.current ? refName.current.value : "")
        }
      >
        {SAVE}
      </Button>
    </Dialog>
  );
}

export const SaveAs: React.FC<{ onSaveAs: (name: string) => void }> = ({
  onSaveAs,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Typography variant="subtitle1" onClick={handleClickOpen}>
        {SAVE_AS}
      </Typography>

      <SimpleDialog open={open} onClose={handleClose} saveAs={onSaveAs} />
    </>
  );
};
