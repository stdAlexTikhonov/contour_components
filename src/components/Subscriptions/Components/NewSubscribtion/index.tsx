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

import { useStyles } from "../../styles";
import ThemeProvider from "../../../CustomDropdown/ThemeProvider";
import { CustomRadio } from "../../../CustomDropdown/CustomRadio";

type IProps = {
  code?: string;
  caption?: string;
  format?: string;
  isPrivate?: boolean;
  periodicity?: string;
  emails?: string;
  users?: string;
  views?: string;
};

export interface DialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

export type SimpleDialogProps = DialogProps & IProps;

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, open } = props;
  const subscription: any = React.createRef();
  const [value, setValue] = React.useState("pdf");
  const [age, setAge] = React.useState("");

  const handleClose = () => {
    onClose("");
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string);
  };

  return (
    <ThemeProvider>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">New Subscription</DialogTitle>
        <div className={classes.container}>
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
                <TextField id="filled-basic" label="Caption" />
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{ paddingTop: 20 }}>
                  Format
                </FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="format1"
                  value={value}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: 20,
                  }}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="1"
                    control={<CustomRadio />}
                    label="MS Excel"
                  />
                  <FormControlLabel
                    value="2"
                    control={<CustomRadio />}
                    label="PDF"
                  />
                  <FormControlLabel
                    value="3"
                    control={<CustomRadio />}
                    label="URL"
                  />
                  <FormControlLabel
                    value="4"
                    control={<CustomRadio />}
                    label="MS PowerPoint"
                  />
                  <FormControlLabel
                    value="5"
                    control={<CustomRadio />}
                    label="HTML"
                  />
                  <FormControlLabel
                    value="6"
                    control={<CustomRadio />}
                    label="Image"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Period
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={age}
                  onChange={handleChangeSelect}
                  label="Period"
                >
                  <MenuItem value={10}>One time</MenuItem>
                  <MenuItem value={20}>Hourly</MenuItem>
                  <MenuItem value={30}>Daily</MenuItem>
                  <MenuItem value={40}>Weekly</MenuItem>
                  <MenuItem value={50}>Mounthly</MenuItem>
                  <MenuItem value={60}>Quarterly</MenuItem>
                  <MenuItem value={70}>Annualy </MenuItem>
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
                  />
                </FormControl>
              </FormGroup>
              <FormControl className={classes.formControl}>
                <TextField id="filled-basic" label="Add e-mail" type="email" />
              </FormControl>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingTop: 10,
                }}
              >
                <Button style={{ outline: "none" }} onClick={handleClose}>
                  Send now
                </Button>
                <Button style={{ outline: "none" }} onClick={handleClose}>
                  Subscribe
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Dialog>
    </ThemeProvider>
  );
}

export const NewSubscription: React.FC<IProps> = ({
  code,
  caption,
  users,
  emails,
  periodicity,
  isPrivate,
  format,
  views,
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
      <Button
        style={{
          outline: "none",
          minWidth: "unset",
        }}
        onClick={handleClickOpen}
      >
        Add
      </Button>
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
};
