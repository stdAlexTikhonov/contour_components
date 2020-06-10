import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { ContourComponentsCheckbox } from "./index";

interface IProps {
  selected: boolean;
  click: (val: boolean) => void;
}

export const SelectAll: React.FC<IProps> = ({ selected, click }) => (
  <ListItem
    key={"selectall"}
    role={undefined}
    dense
    button
    onClick={() => click(!selected)}
  >
    <ListItemIcon style={{ minWidth: "auto" }}>
      <ContourComponentsCheckbox
        edge="start"
        checked={selected}
        tabIndex={-1}
        disableRipple
        color="primary"
        inputProps={{ "aria-labelledby": "selectall" }}
      />
    </ListItemIcon>
    <ListItemText id={"selectall"} primary={"Select All"} />
  </ListItem>
);
