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

export const NewLogin: React.FC<IProps> = ({ logged_in }) => {
  const refLogin = useRef<HTMLInputElement | undefined>();
  const refPassword = useRef<HTMLInputElement | undefined>();
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

          {!(isMobile || isSlimScreen) && "Login"}
          {!(isMobile || isSlimScreen) && <ExpandMoreIcon />}
        </Button>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted={true}
          open={opened}
          onClose={handleClose}
        >
          <form className={classes.root} noValidate={true} autoComplete="off">
            <TextField
              id="filled-basic"
              label="Login"
              variant="outlined"
              inputRef={refLogin}
            />

            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
              inputRef={refPassword}
            />

            <Button
              variant="contained"
              color="primary"
              disabled={logged_in}
              onClick={() => alert(1)}
              // onClick={() => handleLogin(refLogin.current, refPassword.current)}
            >
              Login
            </Button>
          </form>
        </StyledMenu>
      </div>
    </ThemeProvider>
  );
};
