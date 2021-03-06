import React, { useState, useCallback } from "react";
import MultipleDatePicker from "../MultipleDatePicker";
import { useStyles } from "./styles";
import moment from "moment";

export const DatePicker = ({
  serverDates,
  minDate,
  maxDate,
  filters,
  dates: datesFromServer,
  onSubmit: setFiltersOnServer,
  onCancel: setPopoverNull,
  multiple,
}) => {
  const shouldShowComponent = minDate && maxDate;
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [dates, setDates] = useState(serverDates);

  const onCancel = useCallback(() => {
    setOpen(false);
    setPopoverNull();
  }, [setOpen]);
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
    shouldShowComponent && (
      <MultipleDatePicker
        open={open}
        selectedDates={dates}
        minDate={minDate.toString()}
        maxDate={maxDate.toString()}
        onCancel={onCancel}
        onSubmit={onSubmit}
        multiple={multiple}
      />
    )
  );
};
