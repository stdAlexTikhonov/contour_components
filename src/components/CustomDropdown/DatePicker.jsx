import React, { useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import MultipleDatePicker from "../MultipleDatePicker";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { useStyles } from "./styles";
import ThemeProvider from "./ThemeProvider";
import moment from "moment";

export const DatePicker = ({
  serverDates,
  minDate,
  maxDate,
  filters,
  dates: datesFromServer,
  onSubmit: setFiltersOnServer,
}) => {
  const shouldShowComponent = minDate && maxDate;
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [dates, setDates] = useState(serverDates);
  const onCancel = useCallback(() => setOpen(false), [setOpen]);
  const onSubmit = useCallback(
    (dates) => {
      const dates_formatted = dates.map((item) =>
        moment(item).format("M/D/YY")
      );
      const filters_for_server = datesFromServer
        .map((item) => (dates_formatted.includes(item) ? 0 : 1))
        .join("");
      setFiltersOnServer(filters_for_server);
      setDates(dates);
      setOpen(false);
    },
    [datesFromServer]
  );

  return (
    <ThemeProvider>
      {shouldShowComponent && (
        <MultipleDatePicker
          open={open}
          selectedDates={dates}
          minDate={minDate.toString()}
          maxDate={maxDate.toString()}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      )}
    </ThemeProvider>
  );
};
