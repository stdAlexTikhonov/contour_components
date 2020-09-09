import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { IProps } from "./types";
import { useStyles } from "./styles";
import { Loader } from "../Loader/Loader";
import { View } from "../View";
import { useMediaQuery } from "@material-ui/core";

export const Dashboard: React.FC<IProps> = ({ dashboard, metadata }) => {
  const classes = useStyles();
  const [dataForView, setDataForView] = useState<any[] | null>(null);
  const isSlimScreen = useMediaQuery("(max-width: 600px");

  useEffect(() => {
    if (metadata && dashboard) {
      let data = [];
      for (let i = 0; i < metadata.length; i++)
        data.push({ ...dashboard!.cells[i], ...metadata[i] });

      data.sort((a: any, b: any) =>
        a.row === b.row ? a.col - b.col : a.row - b.row
      );
      setDataForView(data);
    }
  }, [metadata]);

  return dataForView
    ? dataForView.map((item: any, i: number) => (
        <Box
          key={i}
          className={classes.block}
          width={isSlimScreen ? "100%" : item.w}
          height={item.h_px}
          style={{ float: item.float }}
        >
          <View
            metadata={item}
            index={i}
            width={item.w_px}
            height={item.h_px}
          />
        </Box>
      ))
    : dashboard &&
        dashboard!.cells.map((item: any, i: number) => (
          <Box
            key={i}
            className={classes.block}
            width={isSlimScreen ? "100%" : item.w}
            height={item.h + item.hcu}
            style={{ float: item.float }}
          >
            {/* <View metadata={{ ...metadata[i], ...dashboard.cells[i] }} /> */}

            <Box display="flex" height="100%">
              <Box margin="auto">
                <Loader />
              </Box>
            </Box>
          </Box>
        ));
};
