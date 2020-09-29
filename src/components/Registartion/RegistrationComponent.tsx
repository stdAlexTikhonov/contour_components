import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useMediaQuery } from "@material-ui/core";
import { isMobile } from "../../utils/helpers";
import AddIcon from "@material-ui/icons/Add";
import { REGISTER } from "../../utils/constants";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import { useStyles } from "./styles";
import { IProps } from "./types";

export const RegistrationComponent: React.FC<IProps> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [opened, setOpened] = React.useState(false);
  const classes = useStyles();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpened(!opened);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpened(false);
  };

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
        {isMobile || isSlimScreen ? (
          <AddIcon />
        ) : (
          <>
            {REGISTER}
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <Popper
        id="register"
        anchorEl={anchorEl}
        open={opened}
        className={classes.popper}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div className={classes.paper}>
              <div className={classes.container}>
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    id="filled-basic"
                    label="Login"
                    variant="outlined"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />
                  <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <TextField
                    id="outlined-basic-1"
                    label="Firstname"
                    variant="outlined"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                  <TextField
                    id="outlined-basic-2"
                    label="Surname"
                    variant="outlined"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                  <TextField
                    id="outlined-basic-3"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      props.handleRegister(
                        login,
                        password,
                        firstname,
                        surname,
                        email
                      )
                    }
                  >
                    Register
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
