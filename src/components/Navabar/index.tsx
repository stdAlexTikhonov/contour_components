import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useStyles } from "./styles";
import { LanguageSelector } from "../LanguageSelector";
import { Login } from "../Login";
import { Registration } from "../Registartion";
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
  const [selected, setSelected] = useState<null | boolean>(null);

  const handleClick = (select: boolean | null) => {
    setSelected(select);
  };

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
          <div onClick={() => handleClick(null)}>
            {" "}
            <LanguageSelector
              items={items.slice(1, items.length)}
              languages={languages}
              changeLanguage={changeLanguage}
              language={currentLanguage}
            />
          </div>
          {logged_in ? (
            <Menu />
          ) : (
            <div onClick={() => handleClick(true)}>
              <Login selected={selected} />
            </div>
          )}
          {!logged_in && (
            <div onClick={() => handleClick(false)}>
              <Registration selected={selected} />
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
