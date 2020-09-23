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

const emails = ["Subscription1", "Subscription2"];

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  list_of_views: any;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, open, list_of_views } = props;
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
      <List>
        {emails.map((email) => (
          <ListItem
            button
            onClick={() => handleListItemClick(email)}
            key={email}
          >
            <ListItemText primary={email} />
          </ListItem>
        ))}
      </List>
      <div className={classes.container}>
        <form className={classes.root} noValidate={true} autoComplete="off">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <NewSubscription views_={list_of_views} />
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
  list_of_views,
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
        list_of_views={list_of_views}
      />
    </div>
  );
};
