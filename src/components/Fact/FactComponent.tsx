import React from "react";
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
}) => {
  const { solution, project, report } = useParams();

  const handleChange = (event: object, value: any, reason: string) => {
    const facts_for_server = value.map((item: any) => item.code);

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

  return (
    <Autocomplete
      multiple
      id="size-small-outlined"
      size="small"
      onChange={handleChange}
      options={items}
      disableCloseOnSelect
      getOptionLabel={(option: any) => option.Caption}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.Caption}
        </React.Fragment>
      )}
      style={{ width: 275, overflow: "hidden" }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Факты"
          placeholder="Type here"
        />
      )}
    />
  );
};
