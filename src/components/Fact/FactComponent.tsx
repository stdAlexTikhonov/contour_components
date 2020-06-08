import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { IProps } from "./types";
import { SET_FACTS } from "../../utils/constants";
import { sleep } from "../../utils/helpers";

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
  const my_ref = useRef<any>();
  const { solution, project, report } = useParams();
  const [selectAll, setSelectAll] = useState(
    visibleFacts.length === items.length
  );
  const [open, setOpen] = React.useState(false);
  const selected = items.filter((item: any) =>
    visibleFacts.includes(item.code)
  );
  const [options, setOptions] = useState([
    "Select All",
    ...items.map((item: any) => item.Caption),
  ]);
  const [val, setVal] = useState(selected.map((item: any) => item.Caption));
  const [factsForQuery, setFactsForQuery] = useState<string[]>([]);

  const handleClick = () => my_ref.current.click();

  const FilterControlPanel = () => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button onClick={handleClick}>Ok</Button>
      <Button>Cancel</Button>
    </div>
  );

  const handleChange = (event: object, value: any, reason: string) => {
    //Проверка - есть ли в списке Select All
    // const check_select_all = value.includes("Select All");

    //Проверка - соответствует ли чекбокс select All предыдущему состоянию
    // const flag = check_select_all !== selectAll;
    // if (flag) setSelectAll(check_select_all);
    // else {

    setVal(value);
    const facts_filtered = items.filter((item: any) =>
      value.includes(item.Caption)
    );

    const facts_for_server = facts_filtered.map((item: any) => item.code);

    // // Установка фильтра на сервере
    // handleDataQuery({
    //   method: SET_FACTS,
    //   session,
    //   language,
    //   solution,
    //   project,
    //   report,
    //   slice,
    //   view,
    //   visibleFacts: facts_for_server,
    // });
    setFactsForQuery(facts_for_server);
  };

  useEffect(() => {
    let facts_for_server = [];
    if (selectAll) {
      setVal(options);
      facts_for_server = items.map((item: any) => item.code);
    } else setVal([]);

    setFactsForQuery(facts_for_server);
  }, [selectAll]);

  return (
    <>
      <Autocomplete
        multiple
        size="small"
        open={open}
        renderTags={() => false}
        onChange={handleChange}
        value={val}
        options={options as string[]}
        onOpen={async () => {
          setOpen(true);
          await sleep(500);
          const popper = document.getElementsByClassName(
            "MuiAutocomplete-popper"
          )[0];
          // popper.appendChild(controlPanel);
          const controlPanel = document.createElement("div");
          controlPanel.style.width = "100%";
          ReactDOM.render(FilterControlPanel(), controlPanel);
          popper.appendChild(controlPanel);
        }}
        onClose={(event: object, reason: string) => {
          if (reason === "toggleInput") setOpen(false);
        }}
        renderOption={(option, { selected }) => (
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
        )}
        style={{
          minWidth: 275,
          maxWidth: 275,
          minHeight: 50,
          overflow: "hidden",
          padding: 5,
        }}
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

      <Button
        style={{ position: "absolute", top: 0, left: 0 }}
        ref={my_ref}
        onClick={() => {
          handleDataQuery({
            method: SET_FACTS,
            session,
            language,
            solution,
            project,
            report,
            slice,
            view,
            visibleFacts: factsForQuery,
          });
        }}
      ></Button>
    </>
  );
};
