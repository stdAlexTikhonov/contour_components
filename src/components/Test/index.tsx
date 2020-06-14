import React from "react";
import { List } from "react-virtualized";

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
  return (
    <div key={key} style={style}>
      {list[index]}
    </div>
  );
}

// Render your list
export const Test = () => (
  <List
    width={300}
    height={300}
    rowCount={list.length}
    rowHeight={20}
    rowRenderer={rowRenderer}
  />
);
