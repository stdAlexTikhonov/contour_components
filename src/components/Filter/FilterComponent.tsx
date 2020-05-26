import React, { useState } from "react";
import { useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { IProps } from "./types";

import { GET_DIM_FILTER, SET_DIM_FILTER } from "../../utils/constants";

export const FilterComponent: React.FC<IProps> = ({
  label,
  code,
  selected_filter,
  slice,
  view,
  language,
  session,
  resetSelectedFilter,
  handleDataQuery,
}) => {
  const [value, setValue] = useState("");
  const [values, setValues] = useState<Array<string>>([]);
  const [clicked, setClicked] = useState(false);
  const classes = useStyles();

  const { solution, project, report } = useParams();
  const { filters } = selected_filter ? selected_filter : { filters: "" };

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const val = event.target.value as string;
    setValue(val);

    //Костыль - выпилить
    const { captions } = selected_filter ? selected_filter : { captions: [""] };
    if (values.length === 0 && captions.length > 0) setValues(captions);

    let filter = values.map((item: any) => (item === val ? 1 : 0)).join("");
    let filter1 = captions.map((item: any) => (item === val ? 1 : 0)).join("");

    //Установка фильтра на сервере
    await handleDataQuery({
      method: SET_DIM_FILTER,
      language,
      session,
      solution,
      project,
      report,
      slice,
      view,
      code,
      filter: filter ? filter : filter1,
    });
  };

  const handleClick = async (e: any) => {
    await handleDataQuery({
      method: GET_DIM_FILTER,
      language,
      session,
      solution,
      project,
      report,
      slice,
      view,
      code,
    });

    setClicked(true);
  };

  const handleClose = () => {
    setClicked(false);
    resetSelectedFilter();
  };

  //Костыль - выпилить
  const arr = values.length === 0 ? selected_filter?.captions : values;

  return (
    <div onClick={(e) => handleClick(e)}>
      <FormControl key={code} className={classes.formControl}>
        <InputLabel id={"demo-simple-select-label" + code}>{label}</InputLabel>
        <Select
          labelId={"demo-simple-select-label" + code}
          value={value}
          onChange={handleChange}
          onClose={() => {
            handleClose();
          }}
        >
          {clicked &&
            arr &&
            arr.map((val, i) => {
              const replaced = val.replace(/&nbsp;/g, " ");
              return (
                <MenuItem key={replaced} value={replaced}>
                  {replaced}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
};
