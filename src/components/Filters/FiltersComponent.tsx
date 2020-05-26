import React, { useState } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { Filter } from "../Filter";

export const FiltersComponent: React.FC<IProps> = ({ metadata }) => {
  const classes = useStyles();
  const [fact, setFact] = useState("");

  const handleFact = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFact(event.target.value as string);
  };

  const { slice, view } = metadata;

  return (
    <div className={classes.selectEmpty}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Facts</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          value={fact}
          onChange={handleFact}
        >
          {metadata.facts &&
            metadata.facts.items?.map((item: any) => (
              <MenuItem key={item.code} value={item.code}>
                {item.Caption}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {metadata.filter_dim &&
        metadata.filter_dim.items.map((item: any) => (
          <Filter
            key={item.code}
            label={item.Caption}
            code={item.code}
            slice={slice}
            view={view}
          />
        ))}
    </div>
  );
};
