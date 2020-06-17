import React, { useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import MultipleDatePicker from "../MultipleDatePicker";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { useStyles } from "./styles";
import ThemeProvider from "./ThemeProvider";

export const DatePicker = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [dates, setDates] = useState(null);
  const onCancel = useCallback(() => setOpen(false), [setOpen]);
  const onSubmit = useCallback(
    (dates) => {
      setDates(dates);
      setOpen(false);
    },
    [setDates]
  );

  return (
    <ThemeProvider>
      <div style={{ padding: 5, position: "relative " }}>
        <TextField
          size="small"
          style={{ minWidth: 265 }}
          id="outlined-basic"
          label={"Date"}
          variant="outlined"
        />
        <IconButton
          aria-label="delete"
          className={classes.margin}
          size="small"
          style={{ outline: "none", position: "absolute" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </IconButton>
      </div>
      <MultipleDatePicker
        open={open}
        selectedDates={dates}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </ThemeProvider>
  );
};
