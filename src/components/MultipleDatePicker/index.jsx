import React, { useReducer, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import DateUtilities from "./utils";
import Calendar from "./Calendar";
import { Dialog } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { findAllInRenderedTree } from "react-dom/test-utils";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: 482,
    maxHeight: 482,
    display: "flex",
  },
}));

function initState(selectedDates) {
  return {
    selectedDates: selectedDates ? [...selectedDates] : [],
    minDate: null,
    maxDate: null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "setSelectedDates":
      return { ...state, selectedDates: action.payload };
    case "setInitialValues":
      return { ...action.payload };
    default:
      return new Error("wrong action type in multiple date picker reducer");
  }
}

const MultipleDatePicker = ({
  open,
  minDate: minDateServer,
  maxDate: maxDateServer,
  readOnly,
  onCancel,
  onSubmit,
  selectedDates: outerSelectedDates,
  cancelButtonText,
  submitButtonText = "OK",
  selectedDatesTitle = "Selected Dates",
  multiple,
}) => {
  if (cancelButtonText == null) {
    cancelButtonText = readOnly ? "Dismiss" : "Cancel";
  }

  const [{ selectedDates, minDate, maxDate }, dispatch] = useReducer(
    reducer,
    outerSelectedDates,
    initState
  );

  const classes = useStyles();

  const onSelect = useCallback(
    (day) => {
      if (readOnly) return;

      if (DateUtilities.dateIn(selectedDates, day)) {
        dispatch({
          type: "setSelectedDates",
          payload: selectedDates.filter(
            (date) => !DateUtilities.isSameDay(date, day)
          ),
        });
      } else if (multiple) {
        dispatch({
          type: "setSelectedDates",
          payload: [...selectedDates, day],
        });
      } else {
        dispatch({
          type: "setSelectedDates",
          payload: [day],
        });
      }
    },
    [selectedDates, dispatch, readOnly]
  );

  const onRemoveAtIndex = useCallback(
    (index) => {
      if (readOnly) return;
      const newDates = [...selectedDates];
      if (index > -1) {
        newDates.splice(index, 1);
      }

      dispatch({ type: "setSelectedDates", payload: newDates });
    },
    [selectedDates, dispatch, readOnly]
  );

  const dismiss = useCallback(() => {
    dispatch({ type: "setSelectedDates", payload: [] });
    onCancel();
  }, [dispatch, onCancel]);

  const handleCancel = useCallback(
    (e) => {
      onCancel();
      e.preventDefault();
      dismiss();
    },
    [dismiss]
  );

  const handleOk = useCallback(
    (e) => {
      e.preventDefault();
      if (readOnly) return;
      onSubmit(selectedDates);
    },
    [onSubmit, selectedDates, readOnly]
  );

  useEffect(() => {
    if (open) {
      dispatch({
        type: "setInitialValues",
        payload: {
          selectedDates: outerSelectedDates != null ? outerSelectedDates : [],
          minDate: new Date(minDateServer),
          maxDate: new Date(maxDateServer),
        },
      });
    }
  }, [open, outerSelectedDates]);

  return (
    <Dialog
      open={open}
      classes={{ paper: classes.dialogPaper }}
      onBackdropClick={handleCancel}
    >
      {/* <DialogContent> */}
      <Calendar
        initialDate={selectedDates[0]}
        selectedDates={selectedDates}
        onSelect={onSelect}
        onRemoveAtIndex={onRemoveAtIndex}
        minDate={minDate}
        maxDate={maxDate}
        onCancel={handleCancel}
        onOk={handleOk}
        readOnly={readOnly}
        cancelButtonText={cancelButtonText}
        submitButtonText={submitButtonText}
        selectedDatesTitle={selectedDatesTitle}
      />
      {/* </DialogContent> */}
    </Dialog>
  );
};

MultipleDatePicker.propTypes = {
  open: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedDates: PropTypes.array,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  selectedDatesTitle: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
};

export default MultipleDatePicker;
