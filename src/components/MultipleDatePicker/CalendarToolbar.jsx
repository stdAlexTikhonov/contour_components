import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  Typography,
  withStyles,
  TextField,
} from "@material-ui/core";
import LeftIcon from "@material-ui/icons/ArrowLeft";
import RightIcon from "@material-ui/icons/ArrowRight";
import moment from "moment";
import { capitalizeFirstLetter } from "./utils";

const styles = (theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    margin: `${theme.spacing(1)}px 0`,
  },
});

class CalendarToolbar extends Component {
  static propTypes = {
    displayDate: PropTypes.object.isRequired,
    nextMonth: PropTypes.bool,
    onMonthChange: PropTypes.func,
    onUserYearChange: PropTypes.func,
    onYearChange: PropTypes.func,
    prevMonth: PropTypes.bool,
  };

  state = {
    value: "2020",
    clicked: false,
  };

  static defaultProps = {
    nextMonth: true,
    prevMonth: true,
  };

  handleTouchTapPrevMonth = (e) => {
    e.preventDefault();
    if (this.props.onMonthChange) {
      this.props.onMonthChange(-1);
    }
  };

  handleTouchTapNextMonth = (e) => {
    e.preventDefault();
    if (this.props.onMonthChange) {
      this.props.onMonthChange(1);
    }
  };

  handleTouchTapNextYear = (e) => {
    e.preventDefault();
    if (this.props.onYearChange) {
      this.props.onYearChange(1);
    }
  };

  handleTouchTapPrevYear = (e) => {
    e.preventDefault();
    if (this.props.onYearChange) {
      this.props.onYearChange(-1);
    }
  };

  handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length !== 0 && isNaN(parseInt(val))) return false;
    else {
      if (this.props.onUserYearChange && val.length === 4) {
        this.props.onUserYearChange(val);
      }
      this.setState((prev) => ({ value: val }));
    }
  };

  render() {
    const { classes, displayDate } = this.props;
    const { clicked, value } = this.state;

    const dateTimeFormattedMonth = moment(displayDate).format("MMMM");
    const dateTimeFormattedYear = moment(displayDate).format("YYYY");
    // const dateTimeFormatted = new dateTimeFormat('en-US', {
    //   month: 'long',
    //   year: 'numeric'
    // }).format(displayDate)

    return (
      <div className={classes.root}>
        <IconButton
          disabled={!this.props.prevMonth}
          onClick={this.handleTouchTapPrevYear}
        >
          <LeftIcon />
        </IconButton>
        <Typography variant="subtitle1">
          <TextField
            inputProps={{ style: { textAlign: "center" } }}
            value={
              clicked ? value : capitalizeFirstLetter(dateTimeFormattedYear)
            }
            onClick={() => this.setState({ clicked: true })}
            onChange={this.handleInputChange}
            onBlur={() => this.setState({ clicked: false })}
          />
        </Typography>
        <IconButton
          disabled={!this.props.nextMonth}
          onClick={this.handleTouchTapNextYear}
        >
          <RightIcon />
        </IconButton>
        <IconButton
          disabled={!this.props.prevMonth}
          onClick={this.handleTouchTapPrevMonth}
        >
          <LeftIcon />
        </IconButton>
        <Typography variant="subtitle1">
          {capitalizeFirstLetter(dateTimeFormattedMonth)}
        </Typography>
        <IconButton
          disabled={!this.props.nextMonth}
          onClick={this.handleTouchTapNextMonth}
        >
          <RightIcon />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles)(CalendarToolbar);
