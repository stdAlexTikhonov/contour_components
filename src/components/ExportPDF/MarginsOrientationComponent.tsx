import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import { useStyles } from "./styles";
import { LinkStateToPropsTabs } from "./types";

export const MarginsOrientationComponent: React.FC<LinkStateToPropsTabs> = ({
  print_page,
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
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <div className={classes.container}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Orientation</FormLabel>
        <RadioGroup
          aria-label="scale"
          name="scale1"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value="portrait"
            control={<Radio />}
            label="Portrait"
          />
          <FormControlLabel
            value="landscape"
            control={<Radio />}
            label="Landscape"
          />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl2}>
        <FormLabel component="legend">Margins</FormLabel>
        <TextField
          id="standard-number"
          label="Top"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setTop(+e.target.value)}
          value={top}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            id="standard-number"
            label="Left"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={right}
            onChange={(e) => setRight(+e.target.value)}
          />
          <TextField
            id="standard-number"
            label="Right"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={bottom}
            onChange={(e) => setBottom(+e.target.value)}
          />
        </div>
        <TextField
          id="standard-number"
          label="Bottom"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={left}
          onChange={(e) => setLeft(+e.target.value)}
        />
      </FormControl>
    </div>
  );
};
