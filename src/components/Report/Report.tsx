import React, { useEffect } from "react";
import { IProps } from "./types";
import { useParams } from "react-router-dom";
import { useStyles } from "./styles";
import { REPORT, ITEMS, DASH_VIEW_META } from "../../utils/constants";
import { Tabs } from "../Tabs";
import { Dashboard } from "../Dashboard";

export const ReportComponent: React.FC<IProps> = ({
  tabs,
  session,
  language,
  report: report_from_state,
  report_type,
  tab_item,
  metadata,
  dashboard,
  report_caption,
  handleDataQuery,
}) => {
  const { solution, project, report: report_from_params } = useParams();
  const report = report_from_state || report_from_params;
  const method =
    report_type === null
      ? REPORT
      : report_type === "dashboard" && metadata === null
      ? DASH_VIEW_META
      : ITEMS;
  const type = tab_item;

  const classes = useStyles();

  //session необходима при перезагруке страницы
  useEffect(() => {
    const data_for_query = {
      solution,
      session,
      language,
      project,
      report,
      method,
      type,
    };

    report && handleDataQuery(data_for_query); //получаем данные только если установлен репорт код
  }, [report, method, session, language]);

  return report ? (
    <>
      {report_caption && (
        <div className={classes.caption}>{report_caption}</div>
      )}
      {tabs && report_type !== "dashboard" && (
        <Tabs tabs={tabs} session={session} language={language} />
      )}
      {report_type === "dashboard" && (
        <Dashboard dashboard={dashboard} metadata={metadata} />
      )}
    </>
  ) : null;
};
