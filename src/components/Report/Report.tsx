import React from "react";
import { IProps } from "./types";
import { useStyles } from "./styles";

export const ReportComponent: React.FC<IProps> = ({
  items,
  session,
  language,
}) => {
  const classes = useStyles();
  return <div className={classes.root}>This is report</div>;
};
