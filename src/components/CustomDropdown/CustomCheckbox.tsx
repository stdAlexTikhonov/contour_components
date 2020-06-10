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
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);
