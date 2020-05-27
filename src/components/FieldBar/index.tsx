import React from "react";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import { IProps } from "./types";
import { useStyles } from "./styles";

export const FieldBar: React.FC<IProps> = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root} style={{ flexDirection: "column-reverse" }}>
      <Box className={classes.aside} />
      <Divider />
      <Box className={classes.main} />
    </Box>
  );
};
