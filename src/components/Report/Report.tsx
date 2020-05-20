import React from "react";
import { IProps } from "./types";
import { useParams } from "react-router-dom";
import { useStyles } from "./styles";

export const ReportComponent: React.FC<IProps> = ({
  items,
  session,
  language,
  report,
}) => {
  const { solution, project, report: report_from_params } = useParams();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      This is report {report ? report : report_from_params}
    </div>
  );
};
