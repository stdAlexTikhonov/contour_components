import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { CustomRadio } from "../../../CustomDropdown/CustomRadio";
import { CustomCheckbox } from "../../../CustomDropdown/CustomCheckbox";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import {
  checkOLAP,
  chunkBySlice,
  getListOfViews,
} from "../../../../utils/helpers";
import Collapse from "@material-ui/core/Collapse";
import StarBorder from "@material-ui/icons/StarBorder";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { IProps } from "./types";
import {
  SAVE_SUBSCRIPTION,
  GET_SUBSCRIPTION,
} from "../../../../utils/constants";

export interface DialogProps {
  open: boolean;
  onClose: (value: string) => void;
  data_from_server: any;
}

export type SimpleDialogProps = DialogProps & IProps;

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();

  const {
    onClose,
    open,
    data_from_server,
    periodicity_,
    list_of_views: views_,
    session,
    language,
    report: report_from_state,
    handleDataQuery,
    selected_subscription,
    tabs,
  } = props;

  const { solution, project, report: report_from_params } = useParams();

  views_ && views_.sort((a: any, b: any) => (b.slice > a.slice ? -1 : 1));

  let periodicity = {
    ...periodicity_,
  };

  const {
    Caption,
    Format,
    Private,
    periodicity: periodicity_from_server,
    AdditionalEmails,
    views: views_from_server,
  } = data_from_server
    ? data_from_server
    : {
        Caption: null,
        Format: null,
        Private: null,
        periodicity: null,
        AdditionalEmails: null,
        views: null,
      };

  const subscription: any = React.createRef();
  const [caption, setCaption] = React.useState("");
  const [format, setFormat] = React.useState("xls");
  const [isPrivate, setPrivate] = React.useState(false);
  const [emails, setEmails] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [views, setViews] = React.useState(chunkBySlice(views_, tabs));
  const [type, setType] = React.useState(periodicity_ ? periodicity_.type : "");
  const [date, setDate] = React.useState(periodicity_ ? periodicity_.date : "");
  const [time, setTime] = React.useState(periodicity_ ? periodicity_.time : "");
  const [minutes, setMinutes] = React.useState(
    periodicity_ ? periodicity_.minuteOfHour : 0
  );
  const [dow, setDow] = React.useState(
    periodicity_ ? periodicity_.dayOfWeek : 0
  );
  const [dom, setDom] = React.useState(
    periodicity_ ? periodicity_.dayOfMonth : 0
  );
  const [moq, setMoq] = React.useState(
    periodicity_ ? periodicity_.monthOfQuarter : 0
  );
  const [month, setMonth] = React.useState(
    periodicity_ ? periodicity_.month : 0
  );

  useEffect(() => {
    setCaption(Caption);
  }, [Caption]);

  useEffect(() => {
    setFormat(Format);
  }, [Format]);

  useEffect(() => {
    setPrivate(Private);
  }, [Private]);

  useEffect(() => {
    setEmails(AdditionalEmails);
  }, [AdditionalEmails]);

  useEffect(() => {
    if (periodicity_from_server) {
      periodicity_from_server.type && setType(periodicity_from_server.type);
      periodicity_from_server.time && setTime(periodicity_from_server.time);
      periodicity_from_server.minuteOfHour &&
        setMinutes(periodicity_from_server.minuteOfHour);
      periodicity_from_server.dayOfWeek &&
        setDow(periodicity_from_server.dayOfWeek);
      periodicity_from_server.dayOfMonth &&
        setDom(periodicity_from_server.dayOfMonth);
      periodicity_from_server.monthOfQuarter &&
        setMoq(periodicity_from_server.monthOfQuarter);
      periodicity_from_server.month && setMonth(periodicity_from_server.month);
    }
  }, [periodicity_from_server]);

  useEffect(() => {
    if (views_from_server) {
      const transformed = views_from_server.map(
        (item: string) => item.split("/")[0]
      );
      const tr_server_views: { [index: string]: any } = {};

      views_from_server.forEach((combo: any) => {
        const [slice_x, view_x] = combo.split("/");
        tr_server_views[slice_x] = tr_server_views[slice_x]
          ? [...tr_server_views[slice_x], view_x]
          : [view_x];
      });

      const new_views = views.map((el) => ({
        ...el,
        [`selected`]: transformed.includes(el.slice),
        [`data`]: el.data.map((elem: any) => ({
          ...elem,
          [`selected`]:
            transformed.includes(elem.slice) &&
            tr_server_views[elem.slice].includes(elem.view),
        })),
      }));
      setViews(new_views);
    }
  }, [views_from_server]);

  const handleClose = () => {
    onClose("");
  };

  const handleSave = () => {
    onClose("");
    periodicity.time = time;
    periodicity.date = date;
    periodicity.type = type;
    periodicity.minuteOfHour = parseInt(minutes);
    periodicity.dayOfWeek = dow;
    periodicity.dayOfMonth = dom;
    periodicity.monthOfQuarter = moq;
    periodicity.month = month;

    const query_object = {
      method: SAVE_SUBSCRIPTION,
      report: report_from_state || report_from_params,
      session,
      solution,
      project,
      language,
      caption,
      format,
      isPrivate,
      periodicity,
      views: getListOfViews(views),
      emails,
    };

    const query_object_with_code = Object.assign(query_object, {
      code: selected_subscription,
    });

    handleDataQuery(
      selected_subscription ? query_object_with_code : query_object
    );
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
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        {!selected_subscription && "New"} Subscription
      </DialogTitle>
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

            {checkOLAP(views) && (
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
                        />
                        <ListItemIcon style={{ minWidth: 30 }}>
                          <LayersIcon />
                        </ListItemIcon>
                        <ListItemText primary={el.caption} />
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
                              />
                              <ListItemIcon style={{ minWidth: 30 }}>
                                <BarChartIcon />
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
                  value={time}
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
                  checked={isPrivate}
                  tabIndex={-1}
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
        <Button style={{ outline: "none" }} onClick={handleSave}>
          Subscribe
        </Button>
      </div>
    </Dialog>
  );
}

export const NewSubscriptionComponent: React.FC<IProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  const [dataFromServer, setDataFromServer] = React.useState<any>(null);
  const { solution, project, report: report_from_params } = useParams();
  const {
    edit,
    selected_subscription,
    session,
    report: report_from_state,
    language,
    handleDataQuery,
  } = props;

  const handleClickOpen = async () => {
    if (edit && selected_subscription) {
      const query_object = {
        method: GET_SUBSCRIPTION,
        report: report_from_state || report_from_params,
        session,
        solution,
        project,
        language,
        code: selected_subscription,
      };

      const res: any = await handleDataQuery(query_object);

      setDataFromServer(res);
      setOpen(true);
    }
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
        disabled={edit && selected_subscription === null}
      >
        {edit ? "Edit" : "Add"}
      </Button>
      <SimpleDialog
        open={open}
        {...props}
        data_from_server={dataFromServer}
        onClose={handleClose}
      />
    </div>
  );
};
