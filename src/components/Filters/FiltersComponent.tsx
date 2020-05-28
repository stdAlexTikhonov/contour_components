import React, { useState } from "react";
import { useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { Filter } from "../Filter";
import { SET_FACTS } from "../../utils/constants";

export const FiltersComponent: React.FC<IProps> = ({
  metadata,
  session,
  language,
  handleDataQuery,
}) => {
  const classes = useStyles();
  const [facts, setFacts] = useState<Array<string>>([]);
  const { slice, view } = metadata;
  const { solution, project, report } = useParams();

  const handleFact = (event: React.ChangeEvent<{ value: unknown }>) => {
    const val = event.target.value as Array<string>;
    setFacts(val);
    handleDataQuery({
      session,
      language,
      method: SET_FACTS,
      solution,
      project,
      report,
      slice,
      view,
      visibleFacts: val,
    });
  };

  return (
    <div className={classes.selectEmpty}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Facts</InputLabel>
        <Select
          multiple
          labelId="demo-simple-select-label"
          value={facts}
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
      {metadata.filters &&
        metadata.filters.map((item: any) => (
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
