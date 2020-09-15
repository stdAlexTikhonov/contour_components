import React, { useState } from "react";
import { Props } from "./types";
import { useStyles } from "./styles";
import IconButton from "@material-ui/core/IconButton";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import ZoomInIcon from "@material-ui/icons/ZoomIn";

export const MapControl: React.FC<Props> = ({ width, height, coords }) => {
  const [cursor, setCursor] = useState(false);
  const classes = useStyles();

  let startPositionX = 0;
  let startPositionY = 0;

  const mouseDownHandler = (e: any) => {
    startPositionX = e.clientX;
    startPositionY = e.clientY;
  };

  const mouseUpHandler = (e: any) => {
    const diffX = e.clientX - startPositionX;
    const diffY = e.clientY - startPositionY;

    const coeffX = diffX / width;
    const coeffY = diffY / height;
    console.log(coords);
  };
  return (
    <div
      className={classes.root}
      style={{
        width,
        height,
        cursor: cursor ? "crosshair" : "move",
      }}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
    >
      <IconButton
        aria-label="delete"
        className={classes.btn}
        onClick={() => setCursor(false)}
      >
        <OpenWithIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="delete"
        className={classes.btn}
        onClick={() => setCursor(true)}
      >
        <ZoomInIcon fontSize="small" />
      </IconButton>
    </div>
  );
};
