import React, { useEffect } from "react";
import { IProps } from "./types";
import { useParams } from "react-router-dom";
import { useStyles } from "./styles";
import { REPORT, ITEMS, DASH_VIEW_META, STYLE } from "../../utils/constants";

import {
  combineStylesheets,
  convertCaptionStylesheetRules,
} from "../../utils/helpers";
import { Tabs } from "../Tabs";
import { Dashboard } from "../Dashboard";
import { Export } from "../ExportPDF";
import { UserLayouts } from "../UserLayouts";

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
  report_stylesheet,
  project_stylesheet,
  handleDataQuery,
}) => {
  const [localStylesheet, setLocalStylesheet] = React.useState<any>(null);
  const { solution, project, report: report_from_params } = useParams();
  const report = report_from_state || report_from_params;
  let method =
    report_type === null
      ? REPORT
      : report_stylesheet === null
      ? STYLE
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

  useEffect(() => {
    const stylesheet =
      project_stylesheet &&
      report_stylesheet &&
      combineStylesheets(project_stylesheet, report_stylesheet);

    const converted =
      stylesheet && convertCaptionStylesheetRules(stylesheet.GridCaptionStyle);

    converted && setLocalStylesheet(converted!);
  }, [report_stylesheet]);

  return report ? (
    <>
      {report_caption && (
        <div
          className={classes.reportHeader}
          style={{ background: localStylesheet && localStylesheet.background }}
        >
          <div className={classes.caption} style={localStylesheet}>
            {report_caption}
          </div>
          <UserLayouts />
          <Export />
        </div>
      )}
      {tabs && report_type !== "dashboard" && <Tabs tabs={tabs} />}
      {report_type === "dashboard" && (
        <Dashboard dashboard={dashboard} metadata={metadata} />
      )}
    </>
  ) : null;
};
