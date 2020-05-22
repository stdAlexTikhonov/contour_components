import React from "react";
import Box from "@material-ui/core/Box";
import { IProps } from "./types";
import { useStyles } from "./styles";
import { Loader } from "../Loader/Loader";

export const DashboardComponent: React.FC<IProps> = ({
  dashboard,
  metadata,
}) => {
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
        {metadata ? (
          metadata[i].caption
        ) : (
          <Box display="flex" height="100%">
            <Box margin="auto">
              <Loader />
            </Box>
          </Box>
        )}
      </Box>
    ))
  );
};
