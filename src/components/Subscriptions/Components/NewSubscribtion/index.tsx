import React, { useEffect } from "react";
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
import List from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useStyles } from "../../styles";
import ThemeProvider from "../../../CustomDropdown/ThemeProvider";
import { CustomRadio } from "../../../CustomDropdown/CustomRadio";
import { CustomCheckbox } from "../../../CustomDropdown/CustomCheckbox";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import { checkOLAP, chunkBySlice } from "../../../../utils/helpers";
import Collapse from "@material-ui/core/Collapse";
import StarBorder from "@material-ui/icons/StarBorder";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

type IProps = {
  code_?: string;
  caption_?: string;
  format_?: string;
  isPrivate_?: boolean;
  periodicity_?: any;
  emails_?: string;
  users_?: string;
  views_?: any;
};

export interface DialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

export type SimpleDialogProps = DialogProps & IProps;

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();

  const [open_nested, setOpen] = React.useState(true);

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

  let periodicity = {
    ...periodicity_,
  };

  const subscription: any = React.createRef();
  const [caption, setCaption] = React.useState(caption_);
  const [format, setFormat] = React.useState(format_ || "xls");
  const [isPrivate, setPrivate] = React.useState(isPrivate_);
  const [emails, setEmails] = React.useState(emails_);
  const [users, setUsers] = React.useState(users_);
  const [views, setViews] = React.useState(chunkBySlice(views_));
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

  useEffect(() => {
    periodicity.time = time;
    periodicity.date = date;
    periodicity.type = type;
    periodicity.minuteOfHour = minutes;
    periodicity.dayOfWeek = dow;
    periodicity.dayOfMonth = dom;
    periodicity.monthOfQuarter = moq;
    periodicity.month = month;
  }, [date, time]);

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

  const handleSliceClick = (slice: string) => {
    const new_views = views.map((el) => ({
      ...el,
      [`selected`]: el.slice === slice ? !el.selected : el.selected,
      [`data`]: el.data.map((elem: any) => ({
        ...elem,
        [`selected`]: el.slice === slice ? !el.selected : el.selected,
      })),
    }));
    setViews(new_views);
  };

  const handleViewClick = (slice: string, view: string) => {
    const new_views = views.map((el) => ({
      ...el,
      [`data`]: el.data.map((elem: any) => ({
        ...elem,
        [`selected`]:
          el.slice === slice && elem.view === view
            ? !elem.selected
            : elem.selected,
      })),
    }));
    setViews(new_views);
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
              {1 == 1 && (
                <FormControl className={classes.formControl}>
                  <FormLabel component="legend" style={{ paddingTop: 20 }}>
                    List of views:
                  </FormLabel>

                  <List
                    component="nav"
                    aria-label="main mailbox folders"
                    style={{ height: 150, overflow: "auto" }}
                  >
                    {views.map((el: any, i: number) => (
                      <div key={el.slice}>
                        <ListItem
                          button
                          onClick={() => handleSliceClick(el.slice)}
                        >
                          <CustomCheckbox
                            edge="start"
                            tabIndex={-1}
                            checked={el.selected}
                            inputProps={{ "aria-labelledby": "someid" }}
                          />
                          <ListItemText primary={el.slice} />
                        </ListItem>
                        <Collapse in={el.open} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {el.data.map((item: any) => (
                              <ListItem
                                button
                                key={item.slice + item.view}
                                className={classes.nested}
                                onClick={() =>
                                  handleViewClick(item.slice, item.view)
                                }
                              >
                                <CustomCheckbox
                                  edge="start"
                                  tabIndex={-1}
                                  checked={item.selected}
                                  inputProps={{ "aria-labelledby": "someid" }}
                                />
                                <ListItemIcon>
                                  <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary={item.caption} />
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </div>
                    ))}
                  </List>
                </FormControl>
              )}
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
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setDate(e.target.value);
                      setDow(date.getDay() + 1);
                      setDom(date.getDate());
                      setMonth(date.getMonth() + 1);
                      setMoq((date.getMonth() % 3) + 1);
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
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(":");
                      setMinutes(m);
                      setTime(e.target.value);
                    }}
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
