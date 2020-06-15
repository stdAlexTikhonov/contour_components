import React from "react";
import { List } from "react-virtualized";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

// List data as an array of strings
const list = [
  1790,
  // And so on...
];

let year = 1791;

while (year < 2019) {
  year++;
  list.push(year);
}

export type row = {
  key: any;
  index: number;
  isScrolling: boolean;
  isVisible: boolean;
  style: any;
};

function rowRenderer({
  key, // Unique key within array of rows
  index, // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible, // This row is visible within the List (eg it is not an overscanned row)
  style, // Style object to be applied to row (to position it)
}: row) {
  const my_style = {
    ...style,
    padding: 15,
  };
  return (
    <ListItem
      key={key}
      role={undefined}
      style={my_style}
      button
      onClick={() => alert(list[index])}
    >
      <ListItemIcon style={{ minWidth: "auto" }}>
        <Checkbox
          edge="start"
          checked={false}
          tabIndex={-1}
          disableRipple
          color="primary"
          inputProps={{ "aria-labelledby": "" + list[index] }}
        />
      </ListItemIcon>
      <ListItemText id={"" + list[index]} primary={list[index]} />
    </ListItem>
  );
}

// Render your list
export const Test = () => (
  <List
    width={300}
    height={300}
    rowCount={list.length}
    rowHeight={40}
    rowRenderer={rowRenderer}
  />
);
