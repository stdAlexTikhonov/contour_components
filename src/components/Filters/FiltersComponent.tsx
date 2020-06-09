import React from "react";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";
import { DragDropContext } from "react-beautiful-dnd";
import Box from "@material-ui/core/Box";
import { AsyncFilter } from "../AsyncFilter";
import { Fact } from "../Fact";
import { CustomDropdown } from "../CustomDropdown";
import SimpleBar from "simplebar-react";
import { generateUID } from "../../utils/helpers";

export const FiltersComponent: React.FC<IProps> = ({
  show,
  position,
  view,
  slice,
  facts,
  filters,
  visibleFacts,
  report,
}) => {
  const classes = useStyles();
  let pos = position.split("-")[0] as POSITIONS_TYPE;
  pos = pos === "row" ? "column" : "row";

  const onHandleDrag = () => console.log("drag end");

  let itemsX: any[] = [];

  for (let i = 0; i < 100; i++) {
    itemsX.push({ value: generateUID() });
  }

  const renderItems = () => (
    <>
      <Fact
        slice={slice}
        view={view}
        visibleFacts={visibleFacts}
        items={facts}
      />
      <CustomDropdown items={itemsX} label={"Test"} />
      {filters.map((item: any) => (
        <AsyncFilter
          key={item.code}
          label={item.Caption}
          code={item.code}
          slice={slice}
          view={view}
          report={report}
        />
      ))}
    </>
  );

  const simpleWrapper = () => (
    <div style={{ display: "flex", flexDirection: "row" }}>{renderItems()}</div>
  );

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
              width: pos === "row" ? "100%" : "275px",
            }}
          >
            {pos === "row" ? simpleWrapper() : renderItems()}
          </SimpleBar>
        </Box>
        <Box className={classes.main} />
      </Box>
    </DragDropContext>
  );
};
