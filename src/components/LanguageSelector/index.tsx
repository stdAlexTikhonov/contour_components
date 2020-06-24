import React from "react";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { IProps } from "./types";
import { StyledMenu, StyledMenuItem } from "./StyledComponents";
import { useMediaQuery } from "@material-ui/core";
import { isMobile } from "../../utils/helpers";
import LanguageIcon from "@material-ui/icons/Language";

export const LanguageSelector: React.FC<IProps> = ({
  items,
  changeLanguage,
  language,
  languages,
}) => {
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
        <LanguageIcon style={{ paddingRight: 5 }} />

        {!(isMobile || isSlimScreen) && language}
        {!(isMobile || isSlimScreen) && <ExpandMoreIcon />}
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted={true}
        open={opened}
        onClose={handleClose}
      >
        {items.map((item, i) => (
          <StyledMenuItem
            key={i}
            onClick={() => {
              changeLanguage(item);
            }}
          >
            <ListItemText primary={languages[item]} />
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </div>
  );
};
