import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { LanguageSelector } from "../LanguageSelector";
import HomeIcon from "@material-ui/icons/Home";
import { IProps } from "./types";
import { SimpleBreadcrumbs } from "../Breadcrumbs";

export const ButtonAppBar: React.FC<IProps> = ({
  languages,
  logged_in,
  changeLanguage,
  currentLanguage,
  handleLogout,
}) => {
  const classes = useStyles();
  const items = Object.keys(languages);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <a href="/" className={classes.linkStyle}>
              <HomeIcon />
            </a>
          </Typography>

          <LanguageSelector
            items={items.slice(1, items.length)}
            languages={languages}
            changeLanguage={changeLanguage}
            language={currentLanguage}
          />
          <Button color="inherit" onClick={() => logged_in && handleLogout()}>
            <Link to="/login" className={classes.linkStyle}>
              {logged_in ? "Logout" : "Login"}
            </Link>
          </Button>
          {!logged_in && (
            <Button color="inherit">
              <Link to="/register" className={classes.linkStyle}>
                Register
              </Link>
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <SimpleBreadcrumbs />
    </div>
  );
};
