import React from "react";
import Box from "@material-ui/core/Box";
import { IProps } from "./types";
import { useStyles } from "./styles";

export const DashboardComponent: React.FC<IProps> = ({ dashboard }) => {
  const classes = useStyles();

  return (
    dashboard &&
    dashboard!.cells.map((item: any, i: number) => (
      <Box
        key={i}
        className={classes.block}
        width={item.w}
        height={item.h + item.hcu}
        style={{ float: item.float }}
      >
        1
      </Box>
    ))
  );
};
