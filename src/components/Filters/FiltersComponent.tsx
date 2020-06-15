import React from "react";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";
import { DragDropContext } from "react-beautiful-dnd";
import Box from "@material-ui/core/Box";
import { CustomDropdown } from "../CustomDropdown";
import SimpleBar from "simplebar-react";

export const FiltersComponent: React.FC<IProps> = ({
  show,
  position,
  view,
  slice,
  facts,
  filters,
  visibleFacts,
  multipleFacts,
  report,
}) => {
  const classes = useStyles();
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
        label={"Факты"}
        multy={multipleFacts}
        selected={facts
          .filter((item: any) => visibleFacts.includes(item.code))
          .map((fact: any) => fact.Caption)}
        _async={false}
      />
      {filters.map((item: any) => (
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
              paddingTop: 3,
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
