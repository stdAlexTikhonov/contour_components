import React, { useState, useEffect } from "react";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";
import { DragDropContext } from "react-beautiful-dnd";
import Box from "@material-ui/core/Box";
import { CustomDropdown } from "../CustomDropdown";
import SimpleBar from "simplebar-react";
import { ChartPlaceholder } from "../ChartPlaceholder";

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
  report,
  chart,
  filterChange,
  meta_index,
}) => {
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [expand, setExpand] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);
  let pos = position.split("-")[0] as POSITIONS_TYPE;
  pos = pos === "row" ? "column" : "row";

  const onHandleDrag = () => console.log("drag end");

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
      />

      {filters.map((item: any, index: number) => (
        <>
          <CustomDropdown
            key={item.code}
            items={[]}
            label={item.Caption}
            multy={true}
            selected={[]}
            _async={true}
            slice={slice}
            view={view}
            code={item.code}
            report={report}
            descending={item.Descending}
            filterChange={filterChange}
            meta_index={meta_index}
            filter_index={index + 1}
            expand_func={setExpand}
            selectFilter={setSelectedFilter}
            selected_filter={selectedFilter}
          />
          {expand && selectedFilter === index + 1 && (
            <div
              style={{ width: "100%", height: 35, background: "lightgreen" }}
            ></div>
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
          }}
        >
          <SimpleBar
            style={{
              maxHeight: "100%",
              width: pos === "row" ? "100%" : 105,
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
