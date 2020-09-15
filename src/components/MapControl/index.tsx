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
  const [areaWidth, setAreaWidth] = useState(0);
  const [areaHeight, setAreaHeight] = useState(0);
  const [mousePressed, setMousePressed] = useState(false);
  const classes = useStyles();

  const [startPositionX, setStartPositionX] = useState(0);
  const [startPositionY, setStartPositionY] = useState(0);

  const mouseDownHandler = (e: any) => {
    if (cursor) {
      let rect = e.target.getBoundingClientRect();
      setMousePressed(true);
      setStartPositionX(e.clientX - rect.left);
      setStartPositionY(e.clientY - rect.top);
      setAreaWidth(0);
      setAreaHeight(0);
    } else {
      setStartPositionX(e.clientX);
      setStartPositionY(e.clientY);
    }
  };

  const mouseUpHandler = (e: any) => {
    if (cursor) {
      setMousePressed(false);
      setAreaWidth(0);
      setAreaHeight(0);
    } else {
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
    }
  };

  const mouseMoveHandler = (e: any) => {
    if (cursor && mousePressed) {
      let rect = e.target.getBoundingClientRect();
      setAreaWidth(e.clientX - rect.left - startPositionX);
      setAreaHeight(e.clientY - rect.top - startPositionY);
    }
  };
  return (
    <div className={classes.root}>
      <div
        style={{
          width,
          height,
          cursor: cursor ? "crosshair" : "move",
        }}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
      />
      <IconButton
        aria-label="delete"
        className={classes.btn}
        style={{ left: 0, top: 0 }}
        onClick={(e) => {
          setCursor(false);
        }}
      >
        <OpenWithIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="delete"
        className={classes.btn}
        style={{ left: 0, top: 35 }}
        onClick={(e) => {
          setCursor(true);
        }}
      >
        <ZoomInIcon fontSize="small" />
      </IconButton>
      {cursor && (
        <div
          style={{
            position: "absolute",
            top: startPositionY,
            left: startPositionX,
            width: areaWidth,
            height: areaHeight,
            display: areaWidth === 0 ? "none" : "block",
            border: "1px dotted black",
            background: "rgba(0, 0, 255, 0.2)",
          }}
        />
      )}
    </div>
  );
};
