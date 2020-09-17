import React from "react";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { StyledMenu, StyledMenuItem } from "./StyledComponents";
import { useMediaQuery } from "@material-ui/core";
import { isMobile } from "../../utils/helpers";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { IProps } from "./types";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

export const MenuComponent: React.FC<IProps> = ({ handleLogout, name }) => {
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

        {isMobile || isSlimScreen ? <AccountCircleIcon /> : name}
        {<ExpandMoreIcon />}
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted={true}
        open={opened}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={() => handleLogout()}>
          <ListItemText primary={"User Info"} />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => handleLogout()}>
          <ListItemText primary={"Change Password"} />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => handleLogout()}>
          <ListItemText primary={"Subscribtions"} />
        </StyledMenuItem>
        <Divider />
        <StyledMenuItem onClick={() => handleLogout()}>
          <ListItemText primary={"Logout"} />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
};
