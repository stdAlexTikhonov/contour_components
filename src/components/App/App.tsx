import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ButtonAppBar } from "../Navabar";
import { Cards } from "../Cards";
import { Report } from "../Report";
import { LoaderComponent } from "../Loader/index";
import { IProps } from "./types";
import { Project } from "../Project";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { importScript } from "../../utils/helpers";

export const AppComponent: React.FC<IProps> = ({
  loading,
  getInitialData,
  languages,
  logged_in,
  changeLanguage,
  current,
  handleLogout,
}) => {
  useEffect(() => {
    (async () => {
      await importScript("/libs/colorbrewer.v1.min.js");
      await importScript("/libs/d3.v5.min.js");
      await importScript("/libs/echarts.min.js");
      await importScript("/libs/echarts-functions.js");
      await importScript("/libs/echarts-wordcloud.min.js");
      await importScript("/libs/ecStat.min.js");
      await importScript("/libs/russia_1e-7sr.js");
      await importScript("/libs/topojson.v1.min.js");
      await importScript("/libs/world-110m.v1.js");
      await importScript("/libs/contourcharts.js");
    })();

    getInitialData();
  }, []);

  const trigger = useScrollTrigger();

  return (
    <BrowserRouter>
      {loading && <LoaderComponent />}
      <Slide in={!trigger}>
        <AppBar>
          <ButtonAppBar
            languages={languages}
            logged_in={logged_in}
            changeLanguage={changeLanguage}
            currentLanguage={current}
            handleLogout={handleLogout}
          />
        </AppBar>
      </Slide>
      <Toolbar />
      <Box>
        <Switch>
          <Route path="/" exact component={Cards} />
          <Route path={"/:solution/"} exact component={Cards} />
          <Route path={"/:solution/:folder"} exact component={Cards} />
          <Route
            path={"/:solution/project/:project"}
            exact
            component={Project}
          />
          <Route
            path={"/:solution/project/:project/:p_folder"}
            exact
            component={Project}
          />
          <Route
            path={"/:solution/project/:project/report/:report"}
            exact
            component={Report}
          />
        </Switch>
      </Box>
    </BrowserRouter>
  );
};
