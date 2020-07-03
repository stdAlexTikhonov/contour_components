import React, { useState, useEffect } from "react";
import { IProps, POSITIONS_TYPE } from "./types";
import { useParams } from "react-router-dom";
import { useStyles } from "./styles";
import { DragDropContext } from "react-beautiful-dnd";
import Box from "@material-ui/core/Box";
import { CustomDropdown } from "../CustomDropdown";
import SimpleBar from "simplebar-react";
import { ChartPlaceholder } from "../ChartPlaceholder";
import Button from "@material-ui/core/Button";
import { sliceWord } from "../../utils/helpers";
import { CustomRadioPaddingRight } from "../CustomDropdown/CustomRadio";
import { CustomCheckboxPaddingRight } from "../CustomDropdown/CustomCheckbox";
import { SET_DIM_FILTER, SET_FACTS } from "../../utils/constants";
import { getData } from "../../utils/api";

declare global {
  interface Window {
    // add you custom properties and methods
    contourChart: any;
  }
}

export const FiltersComponent: React.FC<IProps> = ({
  show,
  position,
  view,
  slice,
  facts,
  filters,
  visibleFacts,
  multipleFacts,
  language,
  report: report_code,
  chart,
  filterChange,
  meta_index,
  cubes,
  session,
  settingCubeSession,
}) => {
  const { report, project, solution } = useParams();
  const cube_report = report_code || report;
  const cube_id = slice + cube_report;
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [expand, setExpand] = useState(false);
  const [filterItems, setFilterItems] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(-1);
  const [multyExpanded, setMultyExpanded] = useState(false);
  const [checked, setExpandChecked] = useState<string[]>(
    facts
      .filter((item: any) => visibleFacts.includes(item.code))
      .map((fact: any) => fact.Caption)
  );
  let pos = position.split("-")[0] as POSITIONS_TYPE;
  pos = pos === "row" ? "column" : "row";

  const onHandleDrag = () => console.log("drag end");

  const handleToggle = (value: string) => async () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setExpandChecked(newChecked);

    if (selectedFilter === 0) {
      //Fact
      console.log("Hello");
      let facts_for_server = filterItems
        .filter((item: any) => newChecked.includes(item.value))
        .map((item: any) => item.code);

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
      filterChange(cubes[cube_id]);
      settingCubeSession(cube_id, data.cubeSession);
    } else {
      //Filter
      const filters_for_server = filterItems.reduce(
        (a, b) => (a += newChecked.includes(b.value) ? "0" : "1"),
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
        code: filters[selectedFilter - 1].code,
        filter: filters_for_server,
        cubeSession: cubes[cube_id],
      });
      filterChange(cubes[cube_id]);
      settingCubeSession(cube_id, data.cubeSession);
    }
  };

  const handleRadio = (value: string) => async () => {
    setExpandChecked([value]);

    if (selectedFilter === 0) {
      //Fact
      let facts_for_server = filterItems
        .filter((item: any) => value === item.value)
        .map((item: any) => item.code);

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
      filterChange(cubes[cube_id]);
      settingCubeSession(cube_id, data.cubeSession);
    } else {
      const filters_for_server = filterItems.reduce(
        (a, b) => (a += value === b.value ? "0" : "1"),
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
        code: filters[selectedFilter - 1].code,
        filter: filters_for_server,
        cubeSession: cubes[cube_id],
      });
      filterChange(cubes[cube_id]);
      settingCubeSession(cube_id, data.cubeSession);
    }
  };

  const renderItems = () => (
    <>
      <CustomDropdown
        items={facts.map((fact: any) => ({
          value: fact.Caption,
          code: fact.code,
        }))}
        label={language === "ru" ? "Факты" : "Facts"}
        multy={multipleFacts}
        selected={facts
          .filter((item: any) => visibleFacts.includes(item.code))
          .map((fact: any) => fact.Caption)}
        _async={false}
        filterChange={filterChange}
        meta_index={meta_index}
        filter_index={0}
        expand_func={setExpand}
        selectFilter={setSelectedFilter}
        selected_filter={selectedFilter}
        setFilterItems={setFilterItems}
        setMultyExpanded={setMultyExpanded}
        setExpandChecked={setExpandChecked}
        f_checked={checked}
        cube_id={cube_id}
      />
      {expand && selectedFilter === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: pos,
            alignItems: "flex-start",
          }}
        >
          {filterItems.length > 0 &&
            filterItems.map((item: any) => (
              <Button
                key={item.code}
                aria-describedby={item.code}
                size="small"
                style={{
                  outline: "none",
                  textTransform: "capitalize",
                  fontWeight: "normal",
                }}
              >
                {multipleFacts ? (
                  <CustomCheckboxPaddingRight
                    checked={checked.indexOf(item.value) !== -1}
                    onClick={handleToggle(item.value)}
                    disabled={item.disabled}
                  />
                ) : (
                  <CustomRadioPaddingRight
                    checked={
                      checked.length === 1
                        ? checked.indexOf(item.value) !== -1
                        : checked[0] === item.value
                    }
                    onChange={handleRadio(item.value)}
                    disabled={item.disabled}
                  />
                )}
                <div
                  style={{
                    textAlign: pos === "row" ? "center" : "left",
                    width: "100%",
                  }}
                >
                  {sliceWord(item.value)}
                </div>
              </Button>
            ))}
        </div>
      )}
      {filters.map((item: any, index: number) => (
        <>
          <CustomDropdown
            items={[]}
            label={item.Caption}
            multy={true}
            selected={[]}
            _async={true}
            slice={slice}
            view={view}
            code={item.code}
            report={report_code}
            descending={item.Descending}
            filterChange={filterChange}
            meta_index={meta_index}
            filter_index={index + 1}
            expand_func={setExpand}
            selectFilter={setSelectedFilter}
            selected_filter={selectedFilter}
            setFilterItems={setFilterItems}
            setMultyExpanded={setMultyExpanded}
            f_checked={checked}
            setExpandChecked={setExpandChecked}
            cube_id={cube_id}
          />
          {expand && selectedFilter === index + 1 && (
            <div
              style={{
                display: "flex",
                flexDirection: pos,
                alignItems: "flex-start",
              }}
            >
              {filterItems.length > 0 &&
                filterItems.map((item: any) => (
                  <Button
                    key={item.code}
                    aria-describedby={item.code}
                    size="small"
                    style={{
                      outline: "none",
                      textTransform: "capitalize",
                      fontWeight: "normal",
                    }}
                  >
                    {multyExpanded ? (
                      <CustomCheckboxPaddingRight
                        onClick={handleToggle(item.value)}
                        checked={checked.indexOf(item.value) !== -1}
                        disabled={item.disabled}
                      />
                    ) : (
                      <CustomRadioPaddingRight
                        checked={
                          checked.length === 1
                            ? checked.indexOf(item.value) !== -1
                            : checked[0] === item.value
                        }
                        disabled={item.disabled}
                        onChange={handleRadio(item.value)}
                      />
                    )}
                    <div
                      style={{
                        textAlign: pos === "row" ? "center" : "left",
                        width: "100%",
                      }}
                    >
                      {sliceWord(item.value)}
                    </div>
                  </Button>
                ))}
            </div>
          )}
        </>
      ))}
    </>
  );

  const simpleWrapper = () => (
    <div style={{ display: "flex", flexDirection: "row" }}>{renderItems()}</div>
  );

  useEffect(() => {
    if (chart) {
      // contourChart(chart.id, chart, {});
      try {
        window.contourChart(chart.id, chart, {});
        setError(false);
      } catch (e) {
        console.log(e);
        setError(true);
      }
    }
  }, [chart]);

  return (
    <DragDropContext onDragEnd={onHandleDrag}>
      <Box
        className={classes.root}
        style={{ flexDirection: position, overflow: "hidden" }}
      >
        <Box
          className={classes.aside}
          style={{
            display: show ? "flex" : "none",
            flexDirection: pos,
            height: pos === "row" ? 38 : "100%",
          }}
        >
          <SimpleBar
            style={{
              maxHeight: "100%",
              width: pos === "row" ? "100%" : 115,
            }}
          >
            {pos === "row" ? simpleWrapper() : renderItems()}
          </SimpleBar>
        </Box>
        {chart ? (
          error ? (
            <ChartPlaceholder title={"Chart is not avalible."} />
          ) : (
            <Box className={classes.main} id={chart.id} />
          )
        ) : (
          <ChartPlaceholder title={"No chart data."} />
        )}
      </Box>
    </DragDropContext>
  );
};
