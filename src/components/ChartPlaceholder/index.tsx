import React from "react";
import Box from "@material-ui/core/Box";

export type IProps = {
  title: string;
};

export const ChartPlaceholder: React.FC<IProps> = ({ title }) => (
  <Box
    display="flex"
    width="100%"
    height="100%"
    style={{ background: "#F5F5F5" }}
  >
    <b style={{ margin: "auto", color: "#757575" }}>{title}</b>
  </Box>
);
