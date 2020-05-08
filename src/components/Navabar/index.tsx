import React from "react";
import AppBar from "@material-ui/core/AppBar";
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
}

export const ButtonAppBar: React.FC<IProps> = ({
  languages,
  logged_in,
  changeLanguage,
}) => {
  const classes = useStyles();
  const items = Object.values(languages);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            :)
          </Typography>

          <CustomizedMenus
            items={items.slice(1, items.length)}
            changeLanguage={changeLanguage}
          />
          <Button color="inherit">{logged_in ? "Logout" : "Login"}</Button>
          <Button color="inherit">Register</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
