import React from "react";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { StyledMenu } from "./StyledComponents";
import { useMediaQuery } from "@material-ui/core";
import { isMobile } from "../../utils/helpers";
import { RegistrationForm } from "../Registration";
import AddIcon from "@material-ui/icons/Add";
import { REGISTER } from "../../utils/constants";

type IProps = {};

export const RegistrationPopup: React.FC<IProps> = () => {
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
        {isMobile || isSlimScreen ? (
          <AddIcon />
        ) : (
          <>
            {REGISTER}
            <ExpandMoreIcon />
          </>
        )}
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
