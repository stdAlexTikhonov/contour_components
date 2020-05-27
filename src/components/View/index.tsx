import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { Filters } from "../Filters";
import { FieldBar } from "../FieldBar";
import IconButton from "@material-ui/core/IconButton";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { POSITIONS } from "../../utils/constants";
import { POSITIONS_TYPE } from "../FieldBar/types";

export const View: React.FC<IProps> = ({ metadata }) => {
  const classes = useStyles();
  const [fieldBar, setFieldBar] = useState(false);
  const [fieldBarPosition, setFieldBarPosition] = useState(0);

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
          {fieldBar && (
            <IconButton
              size="small"
              aria-label="delete"
              onClick={() =>
                setFieldBarPosition(
                  fieldBarPosition === 3 ? 0 : fieldBarPosition + 1
                )
              }
            >
              <AutorenewIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <b className={classes.title}>{metadata.caption}</b>

        <Filters metadata={metadata} />

        <FieldBar
          show={fieldBar}
          position={POSITIONS[fieldBarPosition] as POSITIONS_TYPE}
        />
      </Grid>
    </Grid>
  );
};
