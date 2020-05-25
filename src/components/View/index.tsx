import React from "react";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { Filters } from "../Filters";

export const View: React.FC<IProps> = ({ metadata }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.item}>
        <b>{metadata.caption}</b>
        <Filters metadata={metadata} />
      </Grid>
    </Grid>
  );
};
