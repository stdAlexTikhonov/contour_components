import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(3),
    },
    formControl2: {
      margin: theme.spacing(3),
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "8ch",
      },
    },
  })
);

export const MarginsOrientationComponent = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState("portrait");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <>
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
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            id="standard-number"
            label="Left"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="standard-number"
            label="Right"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <TextField
          id="standard-number"
          label="Bottom"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FormControl>
    </>
  );
};
