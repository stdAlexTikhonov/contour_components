import React from "react";
import { List } from "react-virtualized";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { CustomCheckbox } from "./CustomCheckbox";
import { CustomRadio } from "./CustomRadio";

export type row = {
  key: any;
  index: number;
  isScrolling: boolean;
  isVisible: boolean;
  style: any;
};

export type IProps = {
  width: number;
  rowHeight: number;
  items: any;
  getMenuProps: any;
  getItemProps: any;
  handleToggle: any;
  multiple: boolean;
  handleRadio: any;
  checked: string[];
  localSelected: string;
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
    const labelId = `checkbox-list-label-${index}`;
    return (
      <ListItem
        key={key}
        {...this.props.getItemProps({
          index,
          item,
        })}
        role={undefined}
        style={style}
        dense={true}
        button={true}
        onClick={() => null}
      >
        <ListItemIcon style={{ minWidth: "auto" }}>
          {this.props.multiple ? (
            <CustomCheckbox
              edge="start"
              onClick={this.props.handleToggle(item.value)}
              checked={this.props.checked.indexOf(item.value) !== -1}
              tabIndex={-1}
              inputProps={{ "aria-labelledby": labelId }}
              disabled={item.disabled}
            />
          ) : (
            <CustomRadio
              checked={this.props.localSelected === item.value}
              onChange={this.props.handleRadio(item.value)}
              value={item.value}
              disabled={item.disabled}
              name="radio-button-demo"
              inputProps={{ "aria-label": item.value }}
            />
          )}
        </ListItemIcon>
        {item.image && (
          <img
            width={20}
            style={{ marginRight: 10 }}
            alt={"Flag"}
            src={"https://stat.world/biportal/" + item.image}
          />
        )}
        <ListItemText id={labelId} primary={item.value} />
      </ListItem>
    );
  };
  render() {
    return (
      <List
        {...this.props.getMenuProps()}
        width={this.props.width}
        height={
          this.props.items.length < 6
            ? this.props.rowHeight * this.props.items.length
            : 244
        }
        rowHeight={this.props.rowHeight}
        // tslint:disable-next-line: jsx-no-bind
        rowRenderer={this.rowRenderer.bind(this)}
        rowCount={this.props.items.length}
        style={{ outline: "none" }}
      />
    );
  }
}
