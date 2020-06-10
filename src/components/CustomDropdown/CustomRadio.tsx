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
