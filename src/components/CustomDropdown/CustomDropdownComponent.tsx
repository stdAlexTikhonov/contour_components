import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Popover from "@material-ui/core/Popover";
import Downshift from "downshift";
import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { SelectAll } from "./SelectAll";
import { useStyles } from "./styles";
import { IProps } from "./types";
import { sleep, sliceWord } from "../../utils/helpers";
import { getData } from "../../utils/api";
import {
  GET_DIM_FILTER,
  SET_DIM_FILTER,
  SET_FACTS,
} from "../../utils/constants";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import CustomList from "./CustomList";
import { DatePicker } from "./DatePicker";
import ThemeProvider from "./ThemeProvider";

export const CustomDropdownComponent: React.FC<IProps> = ({
  items,
  label,
  multy,
  selected,
  _async,
  code,
  slice,
  view,
  report: report_code,
  session,
  language,
  descending,
  filterChange,
}) => {
  const { solution, project, report } = useParams();
  const single = !multy;
  const classes = useStyles();
  const [isDate, setIsDate] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<string[]>(selected);
  const [dropDown, setDropDown] = React.useState(false);
  const [minDate, setMinDate] = React.useState(null);
  const [filters, setFilters] = React.useState(null);
  const [maxDate, setMaxDate] = React.useState(null);
  const [selectAll, setSelectAll] = React.useState(
    selected.length === items.length
  );
  const [factsForServer, setFactsForServer] = React.useState(selected);
  const [localSelected, setSelected] = React.useState(
    single ? selected[0] : ""
  );
  const [selectedFromServer, setSelectedFromServer] = React.useState<string[]>(
    []
  );
  const [localItems, setItems] = React.useState<any[]>(items);

  const [val, setVal] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [multiple, setMultiple] = React.useState(multy);
  const [sort, setSort] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    handleDropDown(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleToggle = (value: string) => () => {
    if (multiple) {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setSelectAll(newChecked.length === localItems.length);
      setChecked(newChecked);
    } else {
      setChecked([value]);
    }
  };

  const handleInversion = () => {
    const data = localItems.map((item: any) => item.value);
    const inverted = data.filter((item: string) => !checked.includes(item));
    setChecked(inverted);
    setSelectAll(data.length === inverted.length);
  };

  const handleSort = () => {
    setSort(!sort);

    sort
      ? localItems.sort((a, b) => (a.value < b.value ? -1 : 1))
      : localItems.sort((a, b) => (a.value < b.value ? 1 : -1));
  };

  const handleRadio = (value: string) => () => {
    console.log(value);
    setSelected(value);
  };

  const setFilterOnServer = (user_filters: string) => {
    getData({
      method: SET_DIM_FILTER,
      language,
      session,
      solution,
      project,
      report,
      slice,
      view,
      code,
      filter: user_filters,
    });

    setAnchorEl(null);
  };

  const handleOk = async () => {
    let cubeSession;
    if (_async) {
      //Filter
      const filters_for_server = localItems.reduce(
        (a, b) => (a += checked.includes(b.value) ? "0" : "1"),
        ""
      );

      const data = await getData({
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

      setSelectedFromServer(checked);
      console.log(data);
      cubeSession = data.cubeSession;
      // console.log(filters_for_server);
    } else {
      //Fact
      let facts_for_server = localItems
        .filter((item: any) => checked.includes(item.value))
        .map((item: any) => item.code);

      if (multiple) {
        setFactsForServer(checked);
      } else {
        setFactsForServer([localSelected]);
        facts_for_server = [localSelected];
      }

      const data = await getData({
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

      console.log(data);
      cubeSession = data.cubeSession;
      //console.log(facts_for_server);
    }

    setDropDown(false);
    setAnchorEl(null);
    filterChange(cubeSession);
  };

  const handleCancel = () => {
    if (_async) {
      //Filter
      if (multiple) {
        setChecked(selectedFromServer);
        setSelectAll(selectedFromServer.length === localItems.length);
      } else {
        setSelected(selectedFromServer[0]);
      }
    } else {
      //Fact
      if (multiple) {
        setChecked(factsForServer);
        setSelectAll(localItems.length === factsForServer.length);
      } else setSelected(factsForServer[0]);
    }

    setDropDown(false);
    setAnchorEl(null);
  };

  const handleDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    (async () => {
      if (localItems.length === 0 && _async) {
        const data = await getData({
          method: GET_DIM_FILTER,
          session,
          solution,
          language,
          project,
          report: report_code || report,
          slice,
          view,
          code,
        });

        const selected_from_server = data.Filters.split("")
          .map((item: string, i: number) =>
            item === "0" ? data.Captions[i].replace(/&nbsp;/g, " ") : null
          )
          .filter((item: string | null) => item);

        setSelectedFromServer(selected_from_server);
        data.MultipleValues === false && setSelected(selected_from_server[0]);
        setChecked(selected_from_server);
        setMultiple(data.MultipleValues);
        setSelectAll(selected_from_server.length === data.Captions.length);

        const regex = RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
        const check_date = regex.test(data.Captions[0]);
        setIsDate(check_date);

        if (check_date) {
          setFilters(data.Filters);
          const data_transfrom = data.Captions.map(
            (item: string) => new Date(item)
          );

          data_transfrom.sort((a: any, b: any) => (a < b ? -1 : 1));

          setMinDate(data_transfrom[0]);
          setMaxDate(data_transfrom[data_transfrom.length - 1]);
        } else {
          descending
            ? data.Captions.sort((a: any, b: any) => (a < b ? 1 : -1))
            : data.Captions.sort((a: any, b: any) => (a < b ? -1 : 1));
        }

        setItems(
          data.Captions.map((item: any) => ({
            value: item.replace(/&nbsp;/g, " "),
          }))
        );

        setLoading(false);
      } else {
        await sleep(100);
        setLoading(false);
      }

      setDropDown(!dropDown);
    })();
  };

  const handleSelectAll = (value: boolean) => {
    setSelectAll(value);
    setChecked(value ? localItems.map((item) => item.value) : []);
  };

  const word = localSelected ? localSelected : label;

  return (
    <div style={{ textAlign: "left" }}>
      <Button
        aria-describedby={id}
        onClick={handleClick}
        size="small"
        style={{
          outline: "none",
          textTransform: "capitalize",
        }}
        endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        <div style={{ width: "100%", textAlign: "left" }}>
          {open ? word : sliceWord(word)}
        </div>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <ThemeProvider>
          {isDate ? (
            <DatePicker
              serverDates={checked.map((item) => new Date(item))}
              minDate={minDate}
              maxDate={maxDate}
              filters={filters}
              dates={localItems.map((item) => item.value)}
              onSubmit={setFilterOnServer}
              onCancel={() => setAnchorEl(null)}
            />
          ) : (
            <Downshift
              isOpen={dropDown && !isDate}
              onInputValueChange={(value) => {
                setDropDown(true);
                setVal(value);
              }}
              onOuterClick={() => setDropDown(false)}
              itemToString={(item) => (item ? item.value : "")}
              inputValue={val}
            >
              {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                isOpen,
                inputValue,
                getRootProps,
              }) => {
                const filtered = localItems.filter(
                  (item) => !inputValue || item.value.includes(inputValue)
                );
                return (
                  <div style={{ padding: 5, position: "relative" }}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        <TextField
                          size="small"
                          style={{ minWidth: 265 }}
                          // {...getRootProps()}
                          InputLabelProps={{
                            ...getLabelProps(),
                          }}
                          id="outlined-basic"
                          InputProps={{ ...getInputProps() }}
                          label={"Search"}
                          variant="outlined"
                        />
                        <Collapse in={isOpen}>
                          <div className={classes.root}>
                            {multiple && (
                              <SelectAll
                                selected={selectAll}
                                click={handleSelectAll}
                              />
                            )}
                            <Divider />
                            {filtered.length > 0 && (
                              <CustomList
                                width={265}
                                rowHeight={40}
                                items={filtered}
                                getMenuProps={getMenuProps}
                                getItemProps={getItemProps}
                                handleToggle={handleToggle}
                                multiple={multiple}
                                handleRadio={handleRadio}
                                checked={checked}
                                localSelected={localSelected}
                              />
                            )}
                            <Divider />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              {multiple && (
                                <Button
                                  style={{ outline: "none", minWidth: "unset" }}
                                  onClick={handleInversion}
                                >
                                  <AutorenewIcon />
                                </Button>
                              )}
                              <Button
                                style={{ outline: "none", minWidth: "unset" }}
                                onClick={handleSort}
                              >
                                <ArrowRightAltIcon
                                  style={{
                                    transform: sort
                                      ? "rotate(-90deg)"
                                      : "rotate(90deg)",
                                  }}
                                />
                              </Button>
                              <Button
                                style={{ outline: "none" }}
                                onClick={handleOk}
                              >
                                Ok
                              </Button>
                              <Button
                                style={{ outline: "none" }}
                                onClick={handleCancel}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </Collapse>
                      </>
                    )}
                  </div>
                );
              }}
            </Downshift>
          )}
        </ThemeProvider>
      </Popover>
    </div>
  );
};
