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
import Box from "@material-ui/core/Box";

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
  return (
    <BrowserRouter>
      {loading && <LoaderComponent />}

      <ButtonAppBar
        languages={languages}
        logged_in={logged_in}
        changeLanguage={changeLanguage}
        currentLanguage={current}
        handleLogout={handleLogout}
      />
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
    </BrowserRouter>
  );
};
