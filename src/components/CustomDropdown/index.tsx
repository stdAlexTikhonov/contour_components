import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Downshift from "downshift";
import { generateUID } from "../../utils/helpers";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import SimpleBar from "simplebar-react";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { SelectAll } from "./SelectAll";
import { useStyles } from "./styles";

interface IProps {
  items: any[];
  label: string;
}

export const CustomDropdown: React.FC<IProps> = ({ items, label }) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState<string[]>([]);
  const [dropDown, setDropDown] = React.useState(false);
  const [selectAll, setSelectAll] = React.useState(false);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleOk = () => {
    console.log(checked);
    setDropDown(false);
  };

  const handleCancel = () => {
    console.log(checked);
    setDropDown(false);
  };

  const handleDropDown = () => setDropDown(!dropDown);

  return (
    <Downshift itemToString={(item) => (item ? item.value : "")}>
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
            // {...getRootProps({}, { suppressRefError: true })}
            InputLabelProps={{ ...getLabelProps() }}
            id="outlined-basic"
            InputProps={{ ...getInputProps() }}
            label={label}
            variant="outlined"
          />
          <Collapse in={dropDown || isOpen}>
            <div className={classes.root}>
              <SelectAll selected={selectAll} click={setSelectAll} />
              <Divider />
              <SimpleBar style={{ maxHeight: "40vh" }}>
                <List
                  {...getMenuProps()}
                  style={{
                    listStyle: "none",
                  }}
                >
                  {items
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
                            <Checkbox
                              edge="start"
                              checked={checked.indexOf(item.value) !== -1}
                              tabIndex={-1}
                              disableRipple
                              color="primary"
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={item.value} />
                        </ListItem>
                      );
                    })}
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
            {isOpen || dropDown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </div>
      )}
    </Downshift>
  );
};
