import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Downshift from "downshift";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import SimpleBar from "simplebar-react";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { SelectAll } from "./SelectAll";
import { useStyles } from "./styles";
import { CustomCheckbox } from "./CustomCheckbox";
import { CustomRadio } from "./CustomRadio";
import { IProps } from "./types";
import { sleep } from "../../utils/helpers";
import { getData } from "../../utils/api";
import { GET_DIM_FILTER } from "../../utils/constants";
import CircularProgress from "@material-ui/core/CircularProgress";

export const CustomDropdownComponent: React.FC<IProps> = ({
  items,
  label,
  multy,
  selected,
  _async,
  code,
  slice,
  view,
  report: report_code,
  session,
  language,
}) => {
  const { solution, project, report } = useParams();
  const single = !multy;
  const classes = useStyles();
  const [checked, setChecked] = React.useState<string[]>(multy ? selected : []);
  const [dropDown, setDropDown] = React.useState(false);
  const [selectAll, setSelectAll] = React.useState(
    selected.length === items.length
  );
  const [localSelected, setSelected] = React.useState(
    single ? selected[0] : ""
  );
  const [localItems, setItems] = React.useState<any[]>(items);

  const [val, setVal] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [multiple, setMultiple] = React.useState(multy);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setSelectAll(newChecked.length === localItems.length);
    setChecked(newChecked);
  };

  const handleRadio = (value: string) => () => {
    console.log(value);
    setSelected(value);
  };

  const handleOk = () => {
    console.log(checked);
    setDropDown(false);
  };

  const handleCancel = () => {
    console.log(checked);
    setDropDown(false);
  };

  const handleDropDown = () => {
    (async () => {
      if (localItems.length === 0 && _async) {
        const data = await getData({
          method: GET_DIM_FILTER,
          session,
          solution,
          language,
          project,
          report: report_code || report,
          slice,
          view,
          code,
        });

        const selected_from_server = data.Filters.split("")
          .map((item: string, i: number) =>
            item === "0" ? data.Captions[i] : null
          )
          .filter((item: string | null) => item);

        setChecked(selected_from_server);
        setMultiple(data.MultipleValues);
        setSelectAll(selected_from_server.length === data.Captions.length);
        setItems(data.Captions.map((item: any) => ({ value: item })));
        setLoading(false);
      } else {
        await sleep(100);
        setLoading(false);
      }
    })();
    setDropDown(!dropDown);
  };

  const handleSelectAll = (value: boolean) => {
    setSelectAll(value);
    setChecked(value ? localItems.map((item) => item.value) : []);
  };

  useEffect(() => {}, []);

  return (
    <Downshift
      isOpen={dropDown}
      onInputValueChange={(value) => {
        setDropDown(true);
        setVal(value);
      }}
      onOuterClick={() => setDropDown(false)}
      itemToString={(item) => (item ? item.value : "")}
      inputValue={dropDown ? val : localSelected}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        getRootProps,
      }) => (
        <div style={{ padding: 5, position: "relative" }}>
          <TextField
            size="small"
            style={{ minWidth: 265 }}
            // {...getRootProps()}
            InputLabelProps={{
              ...getLabelProps(),
            }}
            id="outlined-basic"
            InputProps={{ ...getInputProps() }}
            label={label}
            variant="outlined"
          />
          <Collapse in={isOpen}>
            <div className={classes.root}>
              {multiple && (
                <SelectAll selected={selectAll} click={handleSelectAll} />
              )}
              <Divider />
              <SimpleBar style={{ maxHeight: "40vh" }}>
                <List
                  {...getMenuProps()}
                  style={{
                    listStyle: "none",
                  }}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    localItems
                      .filter(
                        (item) => !inputValue || item.value.includes(inputValue)
                      )
                      .map((item, index) => {
                        const labelId = `checkbox-list-label-${item.value}`;
                        return (
                          <ListItem
                            key={item.value}
                            {...getItemProps({
                              index,
                              item,
                            })}
                            role={undefined}
                            dense
                            button
                            onClick={handleToggle(item.value)}
                          >
                            <ListItemIcon style={{ minWidth: "auto" }}>
                              {multiple ? (
                                <CustomCheckbox
                                  edge="start"
                                  checked={checked.indexOf(item.value) !== -1}
                                  tabIndex={-1}
                                  disableRipple
                                  color="primary"
                                  inputProps={{ "aria-labelledby": labelId }}
                                />
                              ) : (
                                <CustomRadio
                                  checked={localSelected === item.value}
                                  onChange={handleRadio(item.value)}
                                  value={item.value}
                                  name="radio-button-demo"
                                  inputProps={{ "aria-label": item.value }}
                                />
                              )}
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={item.value} />
                          </ListItem>
                        );
                      })
                  )}
                </List>
              </SimpleBar>
              <Divider />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button style={{ outline: "none" }} onClick={handleOk}>
                  Ok
                </Button>
                <Button style={{ outline: "none" }} onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </Collapse>
          <IconButton
            aria-label="delete"
            className={classes.margin}
            size="small"
            style={{ outline: "none" }}
            onClick={handleDropDown}
          >
            {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </div>
      )}
    </Downshift>
  );
};
