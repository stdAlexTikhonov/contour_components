import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { CustomizedMenus } from "../CustomizedMenus";
import { AppActions } from "../../types/actions";

interface IProps {
  languages: { [index: string]: string };
  logged_in: boolean;
  changeLanguage: (lang: string) => AppActions;
  currentLanguage: string;
}

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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            :)
          </Typography>

          <CustomizedMenus
            items={items.slice(1, items.length)}
            languages={languages}
            changeLanguage={changeLanguage}
            language={currentLanguage}
          />
          <Button color="inherit">
            <Link to="/login" className={classes.linkStyle}>
              {logged_in ? "Logout" : "Login"}
            </Link>
          </Button>
          <Button color="inherit">Register</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
