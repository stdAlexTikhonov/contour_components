import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { IProps } from "./types";
import { SET_FACTS } from "../../utils/constants";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FactComponent: React.FC<IProps> = ({
  handleDataQuery,
  items,
  slice,
  view,
  session,
  language,
  visibleFacts,
}) => {
  const { solution, project, report } = useParams();
  const [selectAll, setSelectAll] = useState(false);
  const selected = items.filter((item: any) =>
    visibleFacts.includes(item.code)
  );
  const [options, setOptions] = useState(
    items.map((item: any) => item.Caption)
  );
  const [val, setVal] = useState(selected.map((item: any) => item.Caption));

  const handleChange = (event: object, value: any, reason: string) => {
    setVal(value);
    const facts_filtered = items.filter((item: any) => value.includes(item));

    const facts_for_server = facts_filtered.map((item: any) => item.code);

    // // Установка фильтра на сервере
    handleDataQuery({
      method: SET_FACTS,
      session,
      language,
      solution,
      project,
      report,
      slice,
      view,
      visibleFacts: facts_for_server,
    });
  };

  useEffect(() => {
    let facts_for_server = [];
    if (selectAll) {
      setVal(options);
      facts_for_server = items.map((item: any) => item.code);
    } else {
      setVal([]);
    }

    handleDataQuery({
      method: SET_FACTS,
      session,
      language,
      solution,
      project,
      report,
      slice,
      view,
      visibleFacts: facts_for_server,
    });
  }, [selectAll]);

  return (
    <Autocomplete
      multiple
      id="size-small-outlined"
      size="small"
      renderTags={() => false}
      onChange={handleChange}
      value={val}
      options={options as string[]}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </React.Fragment>
      )}
      style={{ minWidth: 275, overflow: "hidden", padding: 5 }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Факты"
          placeholder="Type here"
          InputProps={{
            ...params.InputProps,
            endAdornment: params.InputProps.endAdornment,
          }}
        />
      )}
    />
  );
};
