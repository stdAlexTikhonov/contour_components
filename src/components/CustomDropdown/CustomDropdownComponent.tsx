import React from "react";
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
import CustomList from "./CustomList";
import { DatePicker } from "./DatePicker";
import ThemeProvider from "./ThemeProvider";
import { ControlButtons } from "./ControlButtons";

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
  cube_session,
  cubes,
  meta_index,
  filter_index,
  selected_filter,
  f_checked,
  settingCubeSession,
  expand_func,
  selectFilter,
  setFilterItems,
  setMultyExpanded,
  setExpandChecked,
  cube_id,
}) => {
  const { solution, project, report } = useParams();
  const cube_report = report_code || report;
  const classes = useStyles();
  const [isDate, setIsDate] = React.useState<boolean>(false);
  const [dropDown, setDropDown] = React.useState(false);
  const [minDate, setMinDate] = React.useState(null);
  const [filters, setFilters] = React.useState(null);
  const [maxDate, setMaxDate] = React.useState(null);
  const [selectAll, setSelectAll] = React.useState(
    selected.length === items.length
  );
  const [factsForServer, setFactsForServer] = React.useState(selected);
  const [selectedFromServer, setSelectedFromServer] = React.useState<string[]>(
    []
  );
  const [localItems, setItems] = React.useState<any[]>(items);
  const [visibleItems, setVisibleItems] = React.useState<any[]>(items);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<boolean>(false);
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
    const currentIndex = f_checked.indexOf(value);
    const newChecked = [...f_checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setSelectAll(newChecked.length === localItems.length);

    setExpandChecked(newChecked);
  };

  const handleInversion = () => {
    const data = localItems.map((item: any) => item.value);
    const inverted = data.filter((item: string) => !f_checked.includes(item));

    setExpandChecked(inverted);
    setSelectAll(data.length === inverted.length);
  };

  const handleSort = () => {
    setSort(!sort);

    visible ? visibleItems.reverse() : localItems.reverse();
  };

  const handleRadio = (value: string) => () => {
    setExpandChecked([value]);
  };

  const setFilterOnServer = (user_filters: string) => {
    getData({
      method: SET_DIM_FILTER,
      language,
      session,
      solution,
      project,
      report: report_code || report,
      slice,
      view,
      code,
      filter: user_filters,
      cubeSession: cubes[cube_id],
    });

    setAnchorEl(null);
  };

  const handleOk = async () => {
    let cubeSession;
    if (_async) {
      //Filter
      const filters_for_server = localItems.reduce(
        (a, b) => (a += f_checked.includes(b.value) ? "0" : "1"),
        ""
      );

      const data = await getData({
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
        cubeSession: cubes[cube_id],
      });

      setSelectedFromServer(f_checked);
      console.log(data);
      cubeSession = data.cubeSession;
      settingCubeSession(cube_id, data.cubeSession);
      // console.log(filters_for_server);
    } else {
      //Fact
      let facts_for_server = localItems
        .filter((item: any) => f_checked.includes(item.value))
        .map((item: any) => item.code);

      if (multiple) {
        setFactsForServer(f_checked);
      } else {
        setFactsForServer(f_checked);
        facts_for_server = f_checked;
      }

      const data = await getData({
        method: SET_FACTS,
        session,
        language,
        solution,
        project,
        report: report_code || report,
        slice,
        view,
        visibleFacts: facts_for_server,
        cubeSession: cubes[cube_id],
      });

      console.log(data);
      cubeSession = data.cubeSession;
      settingCubeSession(cube_id, data.cubeSession);
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
        setExpandChecked(selectedFromServer);
        setSelectAll(selectedFromServer.length === localItems.length);
      } else {
        setExpandChecked([selectedFromServer[0]]);
      }
    } else {
      //Fact
      if (multiple) {
        setExpandChecked(factsForServer);
        setSelectAll(localItems.length === factsForServer.length);
      } else {
        setExpandChecked(factsForServer[0]);
      }
    }

    setDropDown(false);
    setAnchorEl(null);
  };

  const handleExpand = () => {
    setExpanded(!expanded);
    !expanded ? selectFilter(filter_index) : selectFilter(-1);
    expand_func(!expanded);
    setFilterItems(localItems);
  };

  const showHidden = () => {
    setVisible(!visible);
  };

  const handleDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    (async () => {
      if (_async) {
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
          cubeSession: cubes[cube_id],
        });

        const selected_from_server = data.Filters.split("")
          .map((item: string, i: number) =>
            item === "0" ? data.Captions[i].replace(/&nbsp;/g, " ") : null
          )
          .filter((item: string | null) => item);

        setSelectedFromServer(selected_from_server);
        if (data.MultipleValues) setExpandChecked(selected_from_server);
        else setExpandChecked([selected_from_server[0]]);

        setMultiple(data.MultipleValues);
        setMultyExpanded(data.MultipleValues);
        //const regex = RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
        //const check_data = regex.test(data.Captions[0]);
        const check_date = data.type === "Date";
        setIsDate(check_date);

        if (check_date) {
          setFilters(data.Filters);
          const data_transfrom = data.Captions.map(
            (item: string) => new Date(item)
          );

          data_transfrom.sort((a: any, b: any) => (a < b ? -1 : 1));

          setMinDate(data_transfrom[0]);
          setMaxDate(data_transfrom[data_transfrom.length - 1]);
        }

        const items = data.Captions.map((item: any, i: number) => ({
          value: item.replace(/&nbsp;/g, " "),
          disabled: data.Hidden[i] === "1",
          index: i,
          image: data.images && data.images[i],
        }));

        setItems(items);

        const visible = items.filter((item: any) => !item.disabled);
        setVisibleItems(visible);

        const notAll = visible.some(
          (item: any) => !selected_from_server.includes(item.value)
        );

        setSelectAll(!notAll);

        setLoading(false);
      } else {
        await sleep(100);
        setLoading(false);

        //Проверка: если нет фактов в выбранном фильтре
        if (f_checked.length !== 0 && !selected.includes(f_checked[0]))
          setExpandChecked(selected);
      }

      setDropDown(!dropDown);
    })();
    setExpanded(filter_index === selected_filter);
  };

  const handleSelectAll = (value: boolean) => {
    setSelectAll(value);
    const disabled = localItems.filter((item: any) => item.disabled);
    const checked_disabled = disabled.filter((item) =>
      f_checked.includes(item.value)
    );

    const not_disabled = localItems.filter((item: any) => !item.disabled);

    const newChecked = value
      ? [
          ...not_disabled.map((item) => item.value),
          ...checked_disabled.map((item) => item.value),
        ]
      : checked_disabled.map((item) => item.value);

    setExpandChecked(newChecked);
  };

  const word = label;

  return (
    <div style={{ textAlign: "left" }}>
      <Button
        aria-describedby={id}
        onClick={handleClick}
        size="small"
        style={{
          outline: "none",
          textTransform: "capitalize",
          fontWeight: "normal",
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
              serverDates={f_checked.map((item) => new Date(item))}
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
                const whichItems = visible ? visibleItems : localItems;

                const filtered = whichItems.filter(
                  (item) => !inputValue || item.value.includes(inputValue)
                );

                const height =
                  filtered.length < 6
                    ? 40 * filtered.length + 85 + +Boolean(multiple) * 40
                    : 325 + +Boolean(multiple) * 40;

                return (
                  <div
                    style={{
                      padding: 5,
                      position: "relative",
                      minHeight: isOpen ? height : "auto",
                    }}
                  >
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
                                checked={f_checked}
                              />
                            )}
                            <Divider />
                            <ControlButtons
                              expanded={expanded}
                              visible={visible}
                              multiple={multiple}
                              sort={sort}
                              handleSort={handleSort}
                              handleCancel={handleCancel}
                              handleExpand={handleExpand}
                              handleOk={handleOk}
                              handleInversion={handleInversion}
                              showHidden={showHidden}
                              enableExpand={localItems.length < 20}
                            />
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
