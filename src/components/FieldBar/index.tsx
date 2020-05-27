import React from "react";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";

export const FieldBar: React.FC<IProps> = ({ show, position, facts, dims }) => {
  const classes = useStyles();
  let pos = position.split("-")[0] as POSITIONS_TYPE;
  pos = pos === "row" ? "column" : "row";
  return (
    <Box className={classes.root} style={{ flexDirection: position }}>
      <Box
        className={classes.aside}
        style={{ display: show ? "flex" : "none", flexDirection: pos }}
      >
        <Box
          className={classes.aside}
          style={{ display: "block", overflow: "scroll" }}
        >
          <b>Факты</b>
          <List dense={false}>
            {facts.map((item: any) => (
              <ListItem key={item.code}>
                <ListItemIcon>
                  <DragIndicatorIcon />
                </ListItemIcon>
                <ListItemText primary={item.Caption} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box className={classes.main} style={{ overflow: "scroll" }}>
          <b>Измерения</b>
          <List dense={false}>
            {dims.map((item: any) => (
              <ListItem key={item.code}>
                <ListItemIcon>
                  <DragIndicatorIcon />
                </ListItemIcon>
                <ListItemText primary={item.Caption} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Box className={classes.main} />
    </Box>
  );
};
