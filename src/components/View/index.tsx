import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { Filters } from "../Filters";
import { FieldBar } from "../FieldBar";
import IconButton from "@material-ui/core/IconButton";
import KeyboardIcon from "@material-ui/icons/Keyboard";

export const View: React.FC<IProps> = ({ metadata }) => {
  const classes = useStyles();
  const [fieldBar, setFieldBar] = useState(false);
  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.item}>
        <Box justifyContent="flex-start" display="flex">
          <IconButton
            size="small"
            aria-label="delete"
            onClick={() => setFieldBar(!fieldBar)}
          >
            <KeyboardIcon fontSize="small" />
          </IconButton>
        </Box>
        <b className={classes.title}>{metadata.caption}</b>

        <Filters metadata={metadata} />

        <FieldBar show={fieldBar} />
      </Grid>
    </Grid>
  );
};
