import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { AppActions } from "../../types/actions";
import LanguageIcon from "@material-ui/icons/Language";

interface Props {
  items: string[];
  changeLanguage: (lang: string) => AppActions;
  language: string;
  languages: { [index: string]: string };
}

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export const CustomizedMenus: React.FC<Props> = ({
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
