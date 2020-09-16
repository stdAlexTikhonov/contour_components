import React, { useState, useEffect } from "react";
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
  setMapX,
  setMapY,
}) => {
  const [area, setArea] = useState(false);
  const [areaWidth, setAreaWidth] = useState(0);
  const [areaHeight, setAreaHeight] = useState(0);
  const [mousePressed, setMousePressed] = useState(false);
  const classes = useStyles();

  const [startPositionX, setStartPositionX] = useState(0);
  const [startPositionY, setStartPositionY] = useState(0);

  useEffect(() => {
    setMapX(0);
    setMapY(0);
  }, [coords]);

  const mouseDownHandler = (e: any) => {
    setMousePressed(true);
    if (area) {
      let rect = e.target.getBoundingClientRect();

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
    const coeffX = (coords[2] - coords[0]) / width;
    const coeffY = (coords[3] - coords[1]) / height;

    if (area) {
      setMousePressed(false);

      //Расчёты
      const diffX = width - (startPositionX + areaWidth);
      const diffY = height - (startPositionY + areaHeight);
      const new_left_position = coords[0] + startPositionX * coeffX;
      const new_top_position = coords[1] - startPositionY * coeffY;
      const new_right_position = coords[2] + startPositionX * coeffX; //+ diffX * coeffX;
      const new_bottom_position = coords[3] - startPositionY * coeffY; //+ diffY * coeffY;

      setCoords([
        new_left_position,
        new_top_position,
        new_right_position,
        new_bottom_position,
      ]);

      setAreaWidth(0);
      setAreaHeight(0);
    } else {
      const diffX = e.clientX - startPositionX;
      const diffY = e.clientY - startPositionY;

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
    if (mousePressed) {
      if (area) {
        let rect = e.target.getBoundingClientRect();
        setAreaWidth(e.clientX - rect.left - startPositionX);
        setAreaHeight(e.clientY - rect.top - startPositionY);
      } else {
        setMapX(e.clientX - startPositionX);
        setMapY(e.clientY - startPositionY);
      }
    }
  };
  return (
    <div className={classes.root}>
      <div
        style={{
          width,
          height,
          cursor: area ? "crosshair" : "move",
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
          setArea(false);
        }}
      >
        <OpenWithIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="delete"
        className={classes.btn}
        style={{ left: 0, top: 35 }}
        onClick={(e) => {
          setArea(true);
        }}
      >
        <ZoomInIcon fontSize="small" />
      </IconButton>
      {area && (
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
