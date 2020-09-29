import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useMediaQuery } from "@material-ui/core";
import { isMobile } from "../../utils/helpers";
import { Login } from ".";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { LOGIN } from "../../utils/constants";
import Popper from "@material-ui/core/Popper";
import { useStyles } from "./styles";
import Fade from "@material-ui/core/Fade";
import { IProps } from "./types";

export const LoginComponent: React.FC<IProps> = ({
  handleLogin,
  logged_in,
  selected, //true === then open
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [opened, setOpened] = React.useState(false);
  const classes = useStyles();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpened(!opened);
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    selected === true ? setOpened(true) : setOpened(false);
  }, [selected]);

  const isSlimScreen = useMediaQuery("(max-width: 600px");

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        color="primary"
        style={{ color: "white", minWidth: "unset", outline: "none" }}
        onClick={handleClick}
      >
        {/* <LanguageIcon style={{ paddingRight: 5 }} /> */}

        {isMobile || isSlimScreen ? (
          <AccountCircleIcon />
        ) : (
          <>
            {LOGIN}
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <Popper
        id="customized-login"
        anchorEl={anchorEl}
        open={opened}
        className={classes.popper}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div className={classes.paper}>
              <div className={classes.container}>
                <form
                  className={classes.root}
                  noValidate={true}
                  autoComplete="off"
                >
                  <TextField
                    id="filled-basic"
                    label="Login"
                    variant="outlined"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />

                  <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    disabled={logged_in}
                    onClick={() => handleLogin(login, password)}
                  >
                    Login
                  </Button>
                </form>
              </div>
            </div>
          </Fade>
        )}
      </Popper>
    </div>
  );
};
