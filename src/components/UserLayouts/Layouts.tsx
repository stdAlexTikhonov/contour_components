import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

export const Layouts: React.FC<{ label?: string }> = ({ label }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {label ? (
        <Button
          aria-controls="customized-menu"
          aria-haspopup="true"
          color="primary"
          style={{ color: "white", minWidth: "unset", outline: "none" }}
          onClick={handleClick}
        >
          {label}
          <ExpandMoreIcon />
        </Button>
      ) : (
        <IconButton
          size="small"
          style={{ outline: "none" }}
          aria-label="delete"
          onClick={handleClick}
        >
          <ExpandMoreIcon />
        </IconButton>
      )}

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Cold summer of 1953</MenuItem>
        <MenuItem onClick={handleClose}>Winter in 2nd World War</MenuItem>
      </Menu>
    </div>
  );
};
