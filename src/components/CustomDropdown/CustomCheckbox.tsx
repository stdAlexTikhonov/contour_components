import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { COLOR } from "../../utils/constants";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

export const CustomCheckbox = withStyles({
  root: {
    color: COLOR,
    "&$checked": {
      color: COLOR,
    },
  },
  checked: {},
  disabled: {
    color: "#757575",
    "&$checked": {
      color: "#757575",
    },
  },
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);
