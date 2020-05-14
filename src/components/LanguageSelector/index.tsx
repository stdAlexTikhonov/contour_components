import React from "react";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { IProps } from "./types";
import { StyledMenu, StyledMenuItem } from "./StyledComponents";

import LanguageIcon from "@material-ui/icons/Language";

export const LanguageSelector: React.FC<IProps> = ({
  items,
  changeLanguage,
  language,
  languages,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        color="primary"
        style={{ color: "white" }}
        onClick={handleClick}
      >
        <LanguageIcon style={{ paddingRight: 5 }} />
        {language}
        <ExpandMoreIcon />
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted={true}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {items.map((item, i) => (
          <StyledMenuItem
            key={i}
            onClick={() => {
              changeLanguage(item);
              setAnchorEl(null);
            }}
          >
            <ListItemText primary={languages[item]} />
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </div>
  );
};
