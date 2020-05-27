import React from "react";
import Box from "@material-ui/core/Box";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";

export const FieldBar: React.FC<IProps> = ({ show, position }) => {
  const classes = useStyles();
  let pos = position.split("-")[0] as POSITIONS_TYPE;
  pos = pos === "row" ? "column" : "row";
  return (
    <Box className={classes.root} style={{ flexDirection: position }}>
      <Box
        className={classes.aside}
        style={{ display: show ? "flex" : "none", flexDirection: pos }}
      >
        <Box className={classes.aside} style={{ display: "block" }}>
          <b>Факты</b>
        </Box>
        <Box className={classes.main}>
          <b>Измерения</b>
        </Box>
      </Box>
      <Box className={classes.main} />
    </Box>
  );
};
