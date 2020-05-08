import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { CustomizedMenus } from "../CustomizedMenus";

interface IProps {
  languages: { [index: string]: string };
}

export const ButtonAppBar: React.FC<IProps> = ({ languages }) => {
  const classes = useStyles();
  const items = Object.values(languages);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            :)
          </Typography>

          <CustomizedMenus items={items.slice(1, items.length)} />
          <Button color="inherit">Login</Button>
          <Button color="inherit">Logout</Button>
          <Button color="inherit">Register</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
