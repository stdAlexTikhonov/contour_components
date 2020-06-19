import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export interface LayoutProps {
  children: React.ReactNode;
  label: string;
}

export default function SimplePopover(props: LayoutProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div style={{ textAlign: "left" }}>
      <Button
        aria-describedby={id}
        onClick={handleClick}
        size="small"
        style={{
          outline: "none",
          width: "100%",
          textTransform: "capitalize",
        }}
        endIcon={<ArrowDropDownIcon />}
      >
        <div style={{ width: "100%", textAlign: "left" }}>{props.label}</div>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {props.children}
      </Popover>
    </div>
  );
}
