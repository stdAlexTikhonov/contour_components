import React, { useEffect } from "react";
import { IProps } from "./types";
import { useParams } from "react-router-dom";
import { useStyles } from "./styles";
import { REPORT, ITEMS } from "../../utils/constants";
import { Tabs } from "../Tabs";
import { Dashboard } from "../Dashboard";

export const ReportComponent: React.FC<IProps> = ({
  tabs,
  session,
  language,
  report: report_from_state,
  report_type,
  tab_item,
  handleDataQuery,
}) => {
  const { solution, project, report: report_from_params } = useParams();
  const report = report_from_state || report_from_params;
  const method = [null, "dashboard"].includes(report_type) ? REPORT : ITEMS; //не меняем метод если тип отчёта дашборд
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
  }, [report, method, session]);

  return report ? (
    <div className={classes.root}>
      {tabs && <Tabs />} {report_type === "dashboard" && <Dashboard />}
    </div>
  ) : null;
};
