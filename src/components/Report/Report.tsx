import React, { useEffect } from "react";
import { IProps } from "./types";
import { useParams } from "react-router-dom";
import { useStyles } from "./styles";
import { REPORT, ITEMS } from "../../utils/constants";
import { Tabs } from "../Tabs";
import { Dashboard } from "../Dashboard";

export const ReportComponent: React.FC<IProps> = ({
  items,
  session,
  language,
  report: report_from_state,
  report_type,
  tab_item,
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
    method: report_type === null ? REPORT : ITEMS,
    type: tab_item || null,
  };

  useEffect(() => {
    handleDataQuery(data_for_query);
  });

  return (
    <div className={classes.root}>
      {tab_item && <Tabs />} {report_type === "dashboard" && <Dashboard />}
    </div>
  );
};
