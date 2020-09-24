import React from "react";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import IconButton from "@material-ui/core/IconButton";
import { NewSubscription } from "./Components/NewSubscribtion";
import { IProps } from "./types";
import { REPORT_SUBSCRIPTIONS } from "../../utils/constants";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useStyles } from "./styles";
import { AnyAction } from "redux";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  subscriptions: any;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, open, subscriptions } = props;
  const subscription: any = React.createRef();

  const handleClose = () => {
    onClose("");
  };

  const handleListItemClick = (value: string) => {
    console.log(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Subscriptions</DialogTitle>
      <List>
        {subscriptions &&
          subscriptions.map((item: AnyAction) => (
            <ListItem
              button
              onClick={() => handleListItemClick(item.code)}
              key={item.code}
            >
              <ListItemText primary={item.caption} />
            </ListItem>
          ))}
      </List>
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

export const SubscriptionsComponent: React.FC<IProps> = ({
  handleDataQuery,
  session,
  language,
  report: report_from_state,
  subscriptions,
}) => {
  const [open, setOpen] = React.useState(false);
  const { solution, project, report: report_from_params } = useParams();
  const report = report_from_state || report_from_params;
  const handleClickOpen = () => {
    setOpen(true);
    handleDataQuery({
      method: REPORT_SUBSCRIPTIONS,
      language,
      session,
      solution,
      project,
      report,
    });
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
      <SimpleDialog
        open={open}
        onClose={handleClose}
        subscriptions={subscriptions}
      />
    </div>
  );
};
