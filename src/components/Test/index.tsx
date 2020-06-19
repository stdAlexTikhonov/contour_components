import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    text: {
      textTransform: "capitalize",
      textDecoration: "underline",
    },
  })
);

export interface LayoutProps {
  children: React.ReactNode;
  label: string;
}

export default function SimplePopover(props: LayoutProps) {
  const classes = useStyles();
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
    <div>
      <Button aria-describedby={id} onClick={handleClick} size="small">
        <span className={classes.text}>{props.label}</span>
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
