import React from "react";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { Filters } from "../Filters";

export const View: React.FC<IProps> = ({ title }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.item}>
        <b>{title}</b>
        <Filters />
      </Grid>
    </Grid>
  );
};
