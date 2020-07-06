import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { IProps } from "./types";
import { useStyles } from "./styles";
import { Loader } from "../Loader/Loader";
import { View } from "../View";

export const Dashboard: React.FC<IProps> = ({ dashboard, metadata }) => {
  const classes = useStyles();
  const [dataForView, setDataForView] = useState<any[] | null>(null);

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
          width={item.w}
          height={item.h + item.hcu}
          style={{ float: item.float }}
        >
          <View metadata={item} index={i} />
        </Box>
      ))
    : dashboard &&
        dashboard!.cells.map((item: any, i: number) => (
          <Box
            key={i}
            className={classes.block}
            width={item.w}
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
