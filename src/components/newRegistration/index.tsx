import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { IProps } from "./types";
import { StyledMenu, StyledMenuItem } from "./StyledComponents";
import { useMediaQuery } from "@material-ui/core";
import { isMobile } from "../../utils/helpers";
import { useStyles } from "./styles";
import ThemeProvider from "../CustomDropdown/ThemeProvider";

export const NewRegistration: React.FC<IProps> = ({ logged_in }) => {
  const refLogin = useRef<HTMLInputElement | undefined>();
  const refPassword = useRef<HTMLInputElement | undefined>();
  const refFirstname = useRef<HTMLInputElement | undefined>();
  const refSurname = useRef<HTMLInputElement | undefined>();
  const refEmail = useRef<HTMLInputElement | undefined>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [opened, setOpened] = React.useState(false);
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpened(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpened(false);
  };

  const isSlimScreen = useMediaQuery("(max-width: 600px");

  return (
    <ThemeProvider>
      <div>
        <Button
          aria-controls="customized-menu"
          aria-haspopup="true"
          color="primary"
          style={{ color: "white", minWidth: "unset", outline: "none" }}
          onClick={handleClick}
        >
          {/* <LanguageIcon style={{ paddingRight: 5 }} /> */}

          {!(isMobile || isSlimScreen) && "Registration"}
          {!(isMobile || isSlimScreen) && <ExpandMoreIcon />}
        </Button>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted={true}
          open={opened}
          onClose={handleClose}
        >
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="filled-basic"
              label="Login"
              variant="outlined"
              inputRef={refLogin}
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              inputRef={refPassword}
            />
            <TextField
              id="outlined-basic-1"
              label="Firstname"
              variant="outlined"
              inputRef={refFirstname}
            />
            <TextField
              id="outlined-basic-2"
              label="Surname"
              variant="outlined"
              inputRef={refSurname}
            />
            <TextField
              id="outlined-basic-3"
              label="Email"
              variant="outlined"
              inputRef={refEmail}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: "#003366" }}
              onClick={() => alert(1)}
              // props.handleRegister(
              //   refLogin.current,
              //   refPassword.current,
              //   refFirstname.current,
              //   refSurname.current,
              //   refEmail.current
              // )
            >
              Register
            </Button>
          </form>
        </StyledMenu>
      </div>
    </ThemeProvider>
  );
};
