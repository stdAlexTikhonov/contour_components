/* eslint-disable no-use-before-define */

import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { IProps } from "./types";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FactComponent: React.FC<IProps> = ({ items }) => {
  return (
    <Autocomplete
      multiple
      id="size-small-outlined"
      size="small"
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
          label="Checkboxes"
          placeholder="Favorites"
        />
      )}
    />
  );
};
