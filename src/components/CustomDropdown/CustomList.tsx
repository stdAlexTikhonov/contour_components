import React from "react";
import { List } from "react-virtualized";

export type row = {
  key: any;
  index: number;
  isScrolling: boolean;
  isVisible: boolean;
  style: any;
};

export type IProps = {
  width: number;
  height: number;
  rowHeight: number;
  items: any;
  getMenuProps: any;
};

export default class CustomList extends React.Component<IProps> {
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }: row) => {
    const item = this.props.items[index];
    return (
      <div key={key} style={style}>
        {item.value}
      </div>
    );
  };
  render() {
    return (
      <List
        {...this.props.getMenuProps()}
        width={this.props.width}
        height={this.props.height}
        rowHeight={this.props.rowHeight}
        rowRenderer={this.rowRenderer.bind(this)}
        rowCount={this.props.items.length}
      />
    );
  }
}
