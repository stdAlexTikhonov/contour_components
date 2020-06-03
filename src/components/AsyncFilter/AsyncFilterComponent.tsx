// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { GET_DIM_FILTER, SET_DIM_FILTER } from "../../utils/constants";
import { replaceAt } from "../../utils/helpers";
import { IProps, dataType } from "./types";

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
  setFilter,
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
  const [filters, setFilters] = React.useState<string>("");
  const [disabled, setDisabled] = React.useState<string[]>([]);
  const [val, setVal] = React.useState<string[]>([]);
  const loading = open && options.length === 0;

  const handleChange = (
    event: object,
    value: string[] | null,
    reason: string
  ) => {
    const new_val = value && options.filter((item) => value.includes(item));
    new_val && setVal(new_val);

    const filters_for_server = options.reduce(
      (a, b) => (a += new_val?.includes(b) ? "0" : "1"),
      ""
    );

    // Установка фильтра на сервере

    setFilter({
      method: SET_DIM_FILTER,
      language,
      session,
      solution,
      project,
      report,
      slice,
      view,
      code,
      filter: filters_for_server,
    });
  };

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
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

      const data: dataType = await handleDataQuery(data_for_query);

      if (active) {
        setOptions(data.captions);
        setFilters(data.filters);
        const dsb = data.captions.filter(
          (item: string, i: number) => data.disabled[i] === "1"
        );
        setDisabled(dsb);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    const new_val = options.filter((item, i) => filters[i] === "0");
    setVal(new_val);
  }, [filters]);

  return (
    <Autocomplete
      value={val}
      id="size-small-outlined"
      size="small"
      open={open}
      limitTags={2}
      multiple
      style={{ width: 275, overflow: "hidden" }}
      onChange={handleChange}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={(event: object, reason: string) => {
        if (reason === "blur" || reason === "toggleInput") setOpen(false);
        resetSelectedFilter();
      }}
      getOptionSelected={(option, value) => {
        return option === value;
      }}
      getOptionDisabled={(option: string) => disabled.includes(option)}
      getOptionLabel={(option: string) => option}
      options={options as string[]}
      loading={loading}
      renderOption={(option, { selected }) => {
        return (
          <React.Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </React.Fragment>
        );
      }}
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
