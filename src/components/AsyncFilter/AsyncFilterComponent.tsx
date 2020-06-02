// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import fetch from "cross-fetch";
import React from "react";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { GET_DIM_FILTER, SET_DIM_FILTER } from "../../utils/constants";
import { IProps } from "./types";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export const AsyncFilterComponent: React.FC<IProps> = ({
  handleDataQuery,
  resetSelectedFilter,
  slice,
  view,
  session,
  language,
  code,
  selected_filter,
  label,
}) => {
  const { solution, project, report } = useParams();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch(
        "https://country.register.gov.uk/records.json?page-size=5000"
      );

      const data_for_query = {
        method: GET_DIM_FILTER,
        session,
        solution,
        language,
        project,
        report,
        slice,
        view,
        code,
      };

      if (selected_filter === null) await handleDataQuery(data_for_query);
      // await sleep(1e3); // For demo purposes.
      const countries = await response.json();

      if (active) {
        setOptions(selected_filter ? selected_filter.captions : []);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, selected_filter]);

  return (
    <Autocomplete
      id="size-small-outlined"
      size="small"
      limitTags={2}
      multiple
      style={{ width: 275 }}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
        resetSelectedFilter();
      }}
      getOptionSelected={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options}
      loading={loading}
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
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};
