// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import IconButton from "@material-ui/core/IconButton";
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

const reactControlPanel = () => (
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <Button>Ok</Button>
    <Button>Cancel</Button>
  </div>
);

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
  report: report_code,
}) => {
  const { solution, project, report } = useParams();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<string>("");
  const [disabled, setDisabled] = React.useState<string[]>([]);
  const [val, setVal] = React.useState<string[]>([]);
  const loading = open && options.length === 0;
  const [selectAll, setSelectAll] = useState(false);
  const [sortDir, setSortDir] = useState(true);

  const handleChange = (
    event: object,
    value: string[] | null,
    reason: string
  ) => {
    //Проверка - есть ли в списке Select All
    const check_select_all = value && value.includes("Select All");

    //Проверка - соответствует ли чекбокс select All предыдущему состоянию
    const flag = check_select_all !== selectAll;
    if (flag && value) setSelectAll(check_select_all!);
    else {
      const new_val = value && options.filter((item) => value.includes(item));
      new_val && setVal(new_val);

      const sliced = options.slice(1);

      const filters_for_server = sliced.reduce(
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
        report: report_code || report,
        slice,
        view,
        code,
        filter: filters_for_server,
      });
    }
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
        report: report_code || report,
        slice,
        view,
        code,
      };

      const data: dataType = await handleDataQuery(data_for_query);

      if (active) {
        setOptions(["Select All", ...data.captions]);

        setFilters("S" + data.filters);
        const dsb = data.captions.filter(
          (item: string, i: number) => data.disabled[i] === "1"
        );
        setDisabled(dsb);
        //Проверка на то включены ли все значения
        const str = Array(data.filters.length).fill("0").join("");
        if (str === data.filters) setSelectAll(true);
      }

      const popper = document.getElementsByClassName(
        "MuiAutocomplete-popper"
      )[0];
      // popper.appendChild(controlPanel);
      const controlPanel = document.createElement("div");
      controlPanel.style.width = "100%";
      ReactDOM.render(reactControlPanel(), controlPanel);
      popper.appendChild(controlPanel);
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    const new_val = options.filter((item, i) => filters[i] === "0");
    setVal(new_val);
  }, [filters]);

  useEffect(() => {
    const sliced = options.slice(1);
    let filters_for_server = Array.from(sliced).fill("1").join("");
    if (selectAll) {
      setVal(options);
      filters_for_server = Array.from(sliced).fill("0").join("");
    } else setVal([]);

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
  }, [selectAll]);

  return (
    <Autocomplete
      value={val}
      size="small"
      open={open}
      renderTags={() => false}
      multiple
      style={{
        minWidth: 275,
        maxWidth: 275,
        minHeight: 50,
        overflow: "hidden",
        padding: 5,
      }}
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
              color="primary"
              inputProps={{ "aria-label": "secondary checkbox" }}
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
          placeholder="Type here"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  open && (
                    <IconButton
                      onClick={() => {
                        setSortDir(!sortDir);
                        const sortDirNum = sortDir ? 1 : -1;

                        val.sort((a, b) =>
                          a < b ? sortDirNum : -1 * sortDirNum
                        );
                      }}
                      color="primary"
                      size="small"
                      style={{
                        outline: "none",
                        transform: sortDir ? "rotate(90deg)" : "rotate(-90deg)",
                      }}
                      aria-label="sort"
                    >
                      <ArrowRightAltIcon />
                    </IconButton>
                  )
                )}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};
