import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { GET_DIM_FILTER } from "../../utils/constants";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { IProps } from "./types";

export const FiltersComponent: React.FC<IProps> = ({
  metadata,
  language,
  session,
  handleDataQuery,
  selected_filter,
  handleClose,
}) => {
  const classes = useStyles();
  const [fact, setFact] = useState("");
  const [filter, setFilter] = useState("");
  const { solution, project, report } = useParams();
  const val = "";

  const handleClick = async (id: string, code: string) => {
    setFilter(id + code);

    await handleDataQuery({
      method: GET_DIM_FILTER,
      language,
      session,
      solution,
      project,
      report,
      slice: metadata.slice,
      view: metadata.view,
      code,
    });
  };
  const handleFact = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFact(event.target.value as string);
  };

  return (
    <div className={classes.selectEmpty}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Facts</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
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
          <FormControl key={item.code} className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">
              {item.Caption}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id={metadata.id + item.code}
              value={val}
              onChange={(value) => console.log(value)}
              onOpen={() => handleClick(metadata.id, item.code)}
              onClose={() => {
                handleClose();
                setFilter("");
              }}
            >
              {filter === metadata.id + item.code &&
                selected_filter?.captions.map((val) => {
                  const replaced = val.replace(/&nbsp;/g, " ");
                  return (
                    <MenuItem key={replaced} value={replaced}>
                      {replaced}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        ))}
    </div>
  );
};
