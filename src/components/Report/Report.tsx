import React, { useEffect } from "react";
import { IProps } from "./types";
import { useParams } from "react-router-dom";
import { useStyles } from "./styles";
import { REPORT } from "../../utils/constants";

export const ReportComponent: React.FC<IProps> = ({
  items,
  session,
  language,
  report: report_from_state,
  handleDataQuery,
}) => {
  const { solution, project, report: report_from_params } = useParams();
  const report = report_from_state || report_from_params;
  const classes = useStyles();
  const data_for_query = {
    solution,
    session,
    language,
    project,
    report,
    method: REPORT,
  };

  useEffect(() => {
    handleDataQuery(data_for_query);
  });

  return (
    <div className={classes.root}>
      This is report {report ? report : report_from_params}
    </div>
  );
};
