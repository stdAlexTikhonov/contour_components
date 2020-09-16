import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { LanguageSelector } from "../LanguageSelector";
import { NewLogin } from "../LoginWrapper";
import { NewRegistration } from "../RegistartionWrapper";
import HomeIcon from "@material-ui/icons/Home";
import { IProps } from "./types";
import { SimpleBreadcrumbs } from "../Breadcrumbs";
import { isMobile } from "../../utils/helpers";
import MoreIcon from "@material-ui/icons/MoreVert";
import { useMediaQuery } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {
  StyledMenu,
  StyledMenuItem,
} from "../LanguageSelector/StyledComponents";

export const ButtonAppBar: React.FC<IProps> = ({
  languages,
  logged_in,
  changeLanguage,
  currentLanguage,
  handleLogout,
}) => {
  const classes = useStyles();
  const items = Object.keys(languages);
  const isSlimScreen = useMediaQuery("(max-width: 600px");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          {/* {logged_in && <Layouts label={"User Layout"} />} */}
          <LanguageSelector
            items={items.slice(1, items.length)}
            languages={languages}
            changeLanguage={changeLanguage}
            language={currentLanguage}
          />

          {isMobile || isSlimScreen ? (
            <>
              <IconButton
                aria-controls="hidden-menu"
                aria-haspopup="true"
                onClick={handleClick}
                color="primary"
                style={{ color: "white", padding: 0, outline: "none" }}
              >
                <MoreIcon />
              </IconButton>
              <StyledMenu
                id="hidden-menu"
                anchorEl={anchorEl}
                keepMounted={true}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <StyledMenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    logged_in && handleLogout();
                  }}
                >
                  <Link to="/login" className={classes.menuLink}>
                    {logged_in ? "Logout" : "Login"}
                  </Link>
                </StyledMenuItem>
                {!logged_in && (
                  <StyledMenuItem
                    onClick={() => {
                      setAnchorEl(null);
                    }}
                  >
                    <Link to="/register" className={classes.menuLink}>
                      Register
                    </Link>
                  </StyledMenuItem>
                )}
              </StyledMenu>
            </>
          ) : (
            <>
              {logged_in ? (
                <Button
                  color="inherit"
                  onClick={() => logged_in && handleLogout()}
                >
                  Logout
                </Button>
              ) : (
                <NewLogin logged_in={logged_in} />
              )}

              {!logged_in && <NewRegistration logged_in={logged_in} />}
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
