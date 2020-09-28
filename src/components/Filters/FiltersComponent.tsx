import React, { useState, useEffect, Fragment } from "react";
import { IProps, POSITIONS_TYPE } from "./types";
import { useParams } from "react-router-dom";
import { useStyles } from "./styles";
import { DragDropContext } from "react-beautiful-dnd";
import Box from "@material-ui/core/Box";
import { CustomDropdown } from "../CustomDropdown";
import SimpleBar from "simplebar-react";
import { ChartPlaceholder } from "../ChartPlaceholder";
import { SET_DIM_FILTER, SET_FACTS } from "../../utils/constants";
import { getElement } from "../../utils/helpers";
import { getData } from "../../utils/api";
import { ExpandedFilter } from "../ExpandedFilter";
import ReactHypergrid from "../../lib/OLAP/Hypergrid";
import { MapControl } from "../MapControl";

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
  settingCheckedItems,
  checked,
  selected_filter,
  expanded,
  filter_items,
  multiple,
  setMapControl,
  width,
  height,
  coords,
  setCoords,
  attributes,
  rows,
  columns,
  grid_filters,
}) => {
  console.log(width);
  console.log(height);
  const { report, project, solution } = useParams();
  const cube_report = report_code || report;
  const cube_id = slice + cube_report;
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [mapX, setMapX] = useState(0);
  const [mapY, setMapY] = useState(0);
  const [scale, setScale] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("0px 0pz");

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

    settingCheckedItems(newChecked);

    if (selected_filter === 0) {
      //Fact
      let facts_for_server = filter_items
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
      const filters_for_server = filter_items.reduce(
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
        code: filters[selected_filter - 1].code,
        filter: filters_for_server,
        cubeSession: cubes[cube_id],
      });
      filterChange(cubes[cube_id]);
      settingCubeSession(cube_id, data.cubeSession);
    }
  };

  const handleRadio = (value: string) => async () => {
    settingCheckedItems([value]);
    if (selected_filter === 0) {
      //Fact
      let facts_for_server = filter_items
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
      const filters_for_server = filter_items.reduce(
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
        code: filters[selected_filter - 1].code,
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
        cube_id={cube_id}
      />
      {expanded && selected_filter === 0 && (
        <ExpandedFilter
          button={false}
          direction={pos}
          handleToggle={handleToggle}
          handleRadio={handleRadio}
          checked={checked}
          multiple={multipleFacts}
        />
      )}
      {filters.map((item: any, index: number) => (
        <Fragment key={item.code}>
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
            cube_id={cube_id}
          />
          {expanded && selected_filter === index + 1 && (
            <ExpandedFilter
              button={false}
              direction={pos}
              handleToggle={handleToggle}
              handleRadio={handleRadio}
              checked={checked}
              multiple={multiple}
            />
          )}
        </Fragment>
      ))}
    </>
  );

  const simpleWrapper = () => (
    <div style={{ display: "flex", flexDirection: "row" }}>{renderItems()}</div>
  );

  const checkIndex = (arr: any, code: string) =>
    arr.map((item: any) => item.code).indexOf(code);

  const getDimensionButton = (props: any) => {
    const filter = grid_filters.find(
      (item: any) => item.code === props.data.code
    );
    const index_filter = checkIndex(grid_filters, props.data.code);

    const row = rows.find((item: any) => item.code === props.data.code);
    const index_row = checkIndex(rows, props.data.code);

    const column = columns.find((item: any) => item.code === props.data.code);
    const index_column = checkIndex(columns, props.data.code);

    const attr = attributes.find((item: any) => item.code === props.data.code);
    const index_attr = checkIndex(attributes, props.data.code);

    const itog = filter || row || column || attr;

    const index = index_filter || index_row || index_column || index_attr;

    return itog ? (
      <CustomDropdown
        items={[]}
        label={itog.Caption}
        multy={true}
        selected={[]}
        _async={true}
        slice={slice}
        view={view}
        code={itog.code}
        report={report_code}
        descending={itog.Descending}
        filterChange={filterChange}
        meta_index={meta_index}
        filter_index={index + 1}
        cube_id={cube_id}
        grid_filter={[...columns, ...attributes, ...filters, ...rows]}
      />
    ) : (
      <div>{props.data.code}</div>
    );
  };

  useEffect(() => {
    if (chart) {
      try {
        if (chart.ChartType !== "grid" && chart.ChartType !== "old_map") {
          window.contourChart(chart.id, chart, {});
        }

        setError(false);
      } catch (e) {
        setError(true);
      }
      if (chart.header)
        document.getElementById(chart.id + "_header")!.innerHTML = getElement(
          chart.header
        );

      if (chart.footer)
        document.getElementById(chart.id + "_footer")!.innerHTML = getElement(
          chart.footer
        );
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

        <Box
          className={classes.main}
          id={chart && chart.id}
          style={{ display: "flex", overflow: "hidden", height: height }}
        >
          {chart && chart.ChartType === "grid" ? (
            <ReactHypergrid
              gridData={chart}
              dimComponent={getDimensionButton}
            />
          ) : // <div>Hello</div>
          chart && chart.ChartType === "old_map" ? (
            <div
              id={chart && chart.id + "old_map"}
              className={classes.map}
              style={{
                width: width,
                height: height,
                top: mapY,
                left: mapX,
                transform: `scale(${scale})`,
                transformOrigin: transformOrigin,
              }}
            />
          ) : (
            <ChartPlaceholder
              title={error ? "Chart is not avalible." : "No chart data."}
            />
          )}

          {setMapControl && (
            <MapControl
              width={width}
              height={height}
              coords={coords}
              setCoords={setCoords}
              setMapX={setMapX}
              setMapY={setMapY}
              setScale={setScale}
              setTransformOrigin={setTransformOrigin}
            />
          )}
        </Box>
      </Box>
    </DragDropContext>
  );
};
