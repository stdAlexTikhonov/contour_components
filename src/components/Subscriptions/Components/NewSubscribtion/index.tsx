import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import ListItemText from "@material-ui/core/ListItemText";
import { useStyles } from "../../styles";
import ThemeProvider from "../../../CustomDropdown/ThemeProvider";
import { CustomRadio } from "../../../CustomDropdown/CustomRadio";
import { CustomCheckbox } from "../../../CustomDropdown/CustomCheckbox";

type IProps = {
  code_?: string;
  caption_?: string;
  format_?: string;
  isPrivate_?: boolean;
  periodicity_?: any;
  emails_?: string;
  users_?: string;
  views_?: string;
};

export interface DialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

export type SimpleDialogProps = DialogProps & IProps;

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const {
    onClose,
    open,
    code_,
    caption_,
    format_,
    isPrivate_,
    periodicity_,
    emails_,
    users_,
    views_,
  } = props;
  const subscription: any = React.createRef();
  const [caption, setCaption] = React.useState(caption_);
  const [format, setFormat] = React.useState(format_ || "xls");
  const [isPrivate, setPrivate] = React.useState(isPrivate_);
  const [emails, setEmails] = React.useState(emails_);
  const [users, setUsers] = React.useState(users_);
  const [views, setViews] = React.useState(views_);
  const [type, setType] = React.useState(periodicity_ ? periodicity_.type : "");
  const [date, setDate] = React.useState(periodicity_ ? periodicity_.date : "");
  const [time, setTime] = React.useState(periodicity_ ? periodicity_.time : "");
  const [minutes, setMinutes] = React.useState(
    periodicity_ ? periodicity_.minuteOfHour : ""
  );
  const [dow, setDow] = React.useState(
    periodicity_ ? periodicity_.dayOfWeek : ""
  );
  const [dom, setDom] = React.useState(
    periodicity_ ? periodicity_.dayOfMonth : ""
  );
  const [moq, setMoq] = React.useState(
    periodicity_ ? periodicity_.monthOfQuarter : ""
  );
  const [month, setMonth] = React.useState(
    periodicity_ ? periodicity_.month : ""
  );

  const handleClose = () => {
    onClose("");
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormat((event.target as HTMLInputElement).value);
  };

  const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };

  return (
    <ThemeProvider>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">New Subscription</DialogTitle>
        <div className={classes.new_subscription}>
          <form className={classes.root} noValidate={true} autoComplete="off">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column",
                width: 500,
              }}
            >
              <FormControl className={classes.formControl}>
                <TextField
                  id="filled-basic"
                  label="Caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  style={{ paddingTop: 20, paddingLeft: 10 }}
                >
                  Format
                </FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="format1"
                  value={format}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: 20,
                  }}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="xls"
                    control={<CustomRadio />}
                    label="MS Excel"
                  />
                  <FormControlLabel
                    value="pdf"
                    control={<CustomRadio />}
                    label="PDF"
                  />
                  <FormControlLabel
                    value="url"
                    control={<CustomRadio />}
                    label="URL"
                  />
                  <FormControlLabel
                    value="ppt"
                    control={<CustomRadio />}
                    label="MS PowerPoint"
                  />
                  <FormControlLabel
                    value="html"
                    control={<CustomRadio />}
                    label="HTML"
                  />
                  <FormControlLabel
                    value="IMAGE"
                    control={<CustomRadio />}
                    label="Image"
                  />
                  {/* xli */}
                </RadioGroup>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Period
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={type}
                  onChange={handleChangeSelect}
                  label="Period"
                >
                  <MenuItem value={"OneTime"}>One time</MenuItem>
                  <MenuItem value={"Hourly"}>Hourly</MenuItem>
                  <MenuItem value={"Daily"}>Daily</MenuItem>
                  <MenuItem value={"Weekly"}>Weekly</MenuItem>
                  <MenuItem value={"Monthly"}>Mounthly</MenuItem>
                  <MenuItem value={"Quarterly"}>Quarterly</MenuItem>
                  <MenuItem value={"Annually"}>Annualy </MenuItem>
                </Select>
              </FormControl>
              <FormGroup row>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="date"
                    label="Date"
                    type="date"
                    defaultValue="2017-05-24"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => console.log(e.target.value)}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="time"
                    label="Time"
                    type="time"
                    defaultValue="07:30"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    onChange={(e) => console.log(e.target.value)}
                  />
                </FormControl>
              </FormGroup>
              <FormControl className={classes.formControl}>
                <TextField
                  id="filled-basic"
                  label="Add e-mail"
                  type="email"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                />
              </FormControl>

              <FormControlLabel
                style={{ paddingLeft: 20 }}
                control={
                  <CustomCheckbox
                    edge="start"
                    onClick={(e) => setPrivate(!isPrivate)}
                    checked={!isPrivate}
                    tabIndex={-1}
                    inputProps={{ "aria-labelledby": "someid" }}
                  />
                }
                label="Public"
              />
            </div>
          </form>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: 10,
          }}
        >
          <Button style={{ outline: "none" }} onClick={handleClose}>
            Send now
          </Button>
          <Button style={{ outline: "none" }} onClick={handleClose}>
            Subscribe
          </Button>
        </div>
      </Dialog>
    </ThemeProvider>
  );
}

export const NewSubscription: React.FC<IProps> = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        style={{
          outline: "none",
          minWidth: "unset",
        }}
        onClick={handleClickOpen}
      >
        Add
      </Button>
      <SimpleDialog open={open} {...props} onClose={handleClose} />
    </div>
  );
};
