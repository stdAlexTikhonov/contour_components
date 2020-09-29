import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useStyles } from "./styles";
import { LanguageSelector } from "../LanguageSelector";
import { LoginPopup } from "../LoginPopup";
import { RegistrationPopup } from "../RegistartionPopup";
import HomeIcon from "@material-ui/icons/Home";
import { IProps } from "./types";
import { SimpleBreadcrumbs } from "../Breadcrumbs";

import { Menu } from "../Menu";

export const ButtonAppBar: React.FC<IProps> = ({
  languages,
  logged_in,
  changeLanguage,
  currentLanguage,
}) => {
  const classes = useStyles();
  const items = Object.keys(languages);

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ backgroundColor: "#003366" }}>
        <Toolbar>
          <div className={classes.title}>
            <a href="/" className={classes.linkStyle}>
              <HomeIcon />
            </a>
            <SimpleBreadcrumbs />
          </div>
          <LanguageSelector
            items={items.slice(1, items.length)}
            languages={languages}
            changeLanguage={changeLanguage}
            language={currentLanguage}
          />

          {logged_in ? <Menu /> : <LoginPopup />}
          {!logged_in && <RegistrationPopup />}
        </Toolbar>
      </AppBar>
    </div>
  );
};
