import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { COLOR } from "../../utils/constants";
import Radio, { RadioProps } from "@material-ui/core/Radio";

export const CustomRadio = withStyles({
  root: {
    color: COLOR,
    "&$checked": {
      color: COLOR,
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

export const CustomRadioPaddingRight = withStyles({
  root: {
    color: COLOR,
    padding: 0,
    paddingRight: 5,
    "&$checked": {
      color: COLOR,
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);
