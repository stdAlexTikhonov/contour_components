import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { IProps } from "./types";
import { StyledMenu, StyledMenuItem } from "./StyledComponents";
import { useMediaQuery } from "@material-ui/core";
import { isMobile } from "../../utils/helpers";
import { useStyles } from "./styles";
import { RegistrationForm } from "../Registration";

export const NewRegistration: React.FC<IProps> = ({ logged_in }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [opened, setOpened] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpened(true);
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
        {/* <LanguageIcon style={{ paddingRight: 5 }} /> */}

        {!(isMobile || isSlimScreen) && "Register"}
        {!(isMobile || isSlimScreen) && <ExpandMoreIcon />}
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted={true}
        open={opened}
        onClose={handleClose}
      >
        <RegistrationForm />
      </StyledMenu>
    </div>
  );
};
