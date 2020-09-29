import React from "react";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useMediaQuery } from "@material-ui/core";
import { isMobile } from "../../utils/helpers";
import { RegistrationForm } from "../Registration";
import AddIcon from "@material-ui/icons/Add";
import { REGISTER } from "../../utils/constants";
import Popper from "@material-ui/core/Popper";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: "1px solid #d3d4d5",
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      position: "relative",
      zIndex: 1150,
    },
  })
);

type IProps = {};

export const RegistrationPopup: React.FC<IProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [opened, setOpened] = React.useState(false);
  const classes = useStyles();

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
        className={classes.paper}
      >
        <RegistrationForm />
      </Popper>
    </div>
  );
};
