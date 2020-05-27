import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { Filters } from "../Filters";
import { FieldBar } from "../FieldBar";

export const View: React.FC<IProps> = ({ metadata }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.item}>
        <b className={classes.title}>{metadata.caption}</b>

        <Filters metadata={metadata} />

        <FieldBar />
      </Grid>
    </Grid>
  );
};
