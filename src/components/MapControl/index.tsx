import React, { useState } from "react";
import { Props } from "./types";
import { useStyles } from "./styles";
import IconButton from "@material-ui/core/IconButton";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import ZoomInIcon from "@material-ui/icons/ZoomIn";

export const MapControl: React.FC<Props> = ({
  width,
  height,
  coords,
  setCoords,
}) => {
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

    const coeffX = (coords[2] - coords[0]) / width;
    const coeffY = (coords[3] - coords[1]) / height;

    const new_left_position = coords[0] - diffX * coeffX;
    const new_top_position = coords[1] + diffY * coeffY;
    const new_right_position = coords[2] - diffX * coeffX;
    const new_bottom_position = coords[3] + diffY * coeffY;

    setCoords([
      new_left_position,
      new_top_position,
      new_right_position,
      new_bottom_position,
    ]);
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setCursor(false);
        }}
      >
        <OpenWithIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="delete"
        className={classes.btn}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setCursor(true);
        }}
      >
        <ZoomInIcon fontSize="small" />
      </IconButton>
    </div>
  );
};
