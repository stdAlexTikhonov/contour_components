import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import { useStyles } from "./styles";
import { TabProps } from "./types";
import { CustomRadio } from "../CustomDropdown/CustomRadio";
import {
  PORTRAIT,
  LANDSCAPE,
  ORIENTATION,
  MARGINS,
  MARGIN_BOTTOM,
  MARGIN_LEFT,
  MARGIN_TOP,
  MARGIN_RIGHT,
} from "../../utils/constants";

export const MarginsOrientationComponent: React.FC<TabProps> = ({
  print_page,
  settingPrintPage,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(
    print_page?.Portrait ? "portrait" : "landscape"
  );
  const [top, setTop] = React.useState(print_page?.Margins[0]);
  const [right, setRight] = React.useState(print_page?.Margins[1]);
  const [bottom, setBottom] = React.useState(print_page?.Margins[2]);
  const [left, setLeft] = React.useState(print_page?.Margins[3]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = (event.target as HTMLInputElement).value;
    setValue(val);
    const isPortrait = val === "portrait";
    print_page.Portrait = isPortrait;
    settingPrintPage(print_page);
  };

  return (
    <div className={classes.container}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">{ORIENTATION}</FormLabel>
        <RadioGroup
          aria-label="scale"
          name="scale1"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value="portrait"
            control={<CustomRadio />}
            label={PORTRAIT}
          />
          <FormControlLabel
            value="landscape"
            control={<CustomRadio />}
            label={LANDSCAPE}
          />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl2}>
        <FormLabel component="legend">{MARGINS}</FormLabel>
        <TextField
          id="standard-number"
          label={MARGIN_TOP}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            setTop(+e.target.value);
            print_page.Margins[0] = +e.target.value;
            settingPrintPage(print_page);
          }}
          value={top}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            id="standard-number"
            label={MARGIN_LEFT}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={left}
            onChange={(e) => {
              setLeft(+e.target.value);
              print_page.Margins[3] = +e.target.value;
              settingPrintPage(print_page);
            }}
          />
          <TextField
            id="standard-number"
            label={MARGIN_RIGHT}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={right}
            onChange={(e) => {
              setRight(+e.target.value);
              print_page.Margins[1] = +e.target.value;
              settingPrintPage(print_page);
            }}
          />
        </div>
        <TextField
          id="standard-number"
          label={MARGIN_BOTTOM}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={bottom}
          onChange={(e) => {
            setBottom(+e.target.value);
            print_page.Margins[2] = +e.target.value;
            settingPrintPage(print_page);
          }}
        />
      </FormControl>
    </div>
  );
};
