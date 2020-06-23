import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ButtonAppBar } from "../Navabar";
import { Login } from "../Login";
import { Cards } from "../Cards";
import { Report } from "../Report";
import { RegistrationForm } from "../Registration";
import { LoaderComponent } from "../Loader/index";
import { IProps } from "./types";
import { Project } from "../Project";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ThemeProvider from "../CustomDropdown/ThemeProvider";

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
    getInitialData();
  }, []);

  const trigger = useScrollTrigger();
  console.log(trigger);
  return (
    <BrowserRouter>
      {loading && <LoaderComponent />}
      <ThemeProvider>
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
            <Route path={"/login"} component={Login} />
            <Route path={"/register"} component={RegistrationForm} />
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
      </ThemeProvider>
    </BrowserRouter>
  );
};
