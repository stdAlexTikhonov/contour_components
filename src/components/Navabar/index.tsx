import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useStyles } from "./styles";

export const ButtonAppBar: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            :)
          </Typography>

          <Button color="inherit">
            English <ExpandMoreIcon color="inherit" />
          </Button>
          <Button color="inherit">Login</Button>
          <Button color="inherit">Logout</Button>
          <Button color="inherit">Register</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
