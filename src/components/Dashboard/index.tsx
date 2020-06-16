import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import { IProps } from "./types";
import { useStyles } from "./styles";
import { Loader } from "../Loader/Loader";
import { View } from "../View";

export const Dashboard: React.FC<IProps> = ({ dashboard, metadata }) => {
  const classes = useStyles();

  useEffect(() => {
    console.log(metadata);
    //   cells.sort((a: any, b: any) =>
    //   a.row === b.row ? a.col - b.col : a.row - b.row
    // );
  }, [metadata]);

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
          <View metadata={{ ...metadata[i], ...dashboard.cells[i] }} />
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
