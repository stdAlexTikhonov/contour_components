import React from "react";
import Box from "@material-ui/core/Box";
import { IProps } from "./types";
import { useStyles } from "./styles";

export const FieldBar: React.FC<IProps> = ({ show, position }) => {
  const classes = useStyles();
  console.log(position);
  return (
    <Box className={classes.root} style={{ flexDirection: position }}>
      <Box
        className={classes.aside}
        style={{ display: show ? "block" : "none" }}
      />
      <Box className={classes.main} />
    </Box>
  );
};
