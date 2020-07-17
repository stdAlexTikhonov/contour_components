import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { ListProps } from "./type";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: 400,
      maxWidth: 300,
      backgroundColor: theme.palette.background.paper,
    },
  })
);

export const VirtualizedList: React.FC<ListProps> = ({ items }) => {
  const classes = useStyles();

  function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;

    return (
      <ListItem button style={style} key={index}>
        <ListItemText primary={items[index]} />
      </ListItem>
    );
  }

  return (
    <div className={classes.root}>
      <FixedSizeList
        height={400}
        width={260}
        itemSize={46}
        itemCount={items.length}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
};
