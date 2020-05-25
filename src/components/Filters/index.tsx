import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";

import { IProps } from "./types";

export const Filters: React.FC<IProps> = ({ metadata }) => {
  const classes = useStyles();
  const [age, setAge] = React.useState("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string);
  };

  return (
    <div className={classes.selectEmpty}>
      <FormControl className={classes.formControl}>
        <InputLabel
          id="demo-simple-select-label"
          className={age === "" ? classes.test1 : classes.test}
        >
          Facts
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
        >
          {metadata.facts &&
            metadata.facts.items.map((item: any) => (
              <MenuItem key={item.code} value={item.code}>
                {item.Caption}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {metadata.filter_dim &&
        metadata.filter_dim.items.map((item: any) => (
          <FormControl key={item.code} className={classes.formControl}>
            <InputLabel
              id="demo-simple-select-label"
              className={age === "" ? classes.test1 : classes.test}
            >
              {item.Caption}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              onChange={handleChange}
            >
              <MenuItem value={"none"}>None</MenuItem>
            </Select>
          </FormControl>
        ))}
    </div>
  );
};
