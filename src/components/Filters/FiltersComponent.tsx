import React, { useState, useEffect } from "react";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";
import { DragDropContext } from "react-beautiful-dnd";
import Box from "@material-ui/core/Box";
import { CustomDropdown } from "../CustomDropdown";
import SimpleBar from "simplebar-react";
import { sleep } from "../../utils/helpers";
import Popover from "../Test";

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
}) => {
  const classes = useStyles();
  const [scroll, setScroll] = useState(true);
  let pos = position.split("-")[0] as POSITIONS_TYPE;
  pos = pos === "row" ? "column" : "row";

  const onHandleDrag = () => console.log("drag end");

  const renderItems = () => (
    <>
      <Popover label={language === "ru" ? "Факты" : "Facts"}>
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
        />
      </Popover>
      {filters.map((item: any) => (
        <Popover label={item.Caption} key={item.code}>
          <CustomDropdown
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
          />
        </Popover>
      ))}
    </>
  );

  const simpleWrapper = () => (
    <div style={{ display: "flex", flexDirection: "row" }}>{renderItems()}</div>
  );

  const handleClick = async () => {
    setScroll(false);
    await sleep(500);
    setScroll(true);
  };

  useEffect(() => {
    if (chart) {
      // contourChart(chart.id, chart, {});
      //window.contourChart(chart.id, chart, {});
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
          onClick={handleClick}
        >
          <SimpleBar
            style={{
              maxHeight: "100%",
              width: pos === "row" ? "100%" : 100,
              overflow: scroll ? "unset" : "hidden",
            }}
          >
            {pos === "row" ? simpleWrapper() : renderItems()}
          </SimpleBar>
        </Box>
        {chart && <Box className={classes.main} id={chart.id} />}
      </Box>
    </DragDropContext>
  );
};
