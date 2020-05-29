import React from "react";
import { useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SET_FACT_POSISIOTNS } from "../../utils/constants";
import { ListComponent } from "../List";

export const FieldBarComponent: React.FC<IProps> = ({
  show,
  position,
  facts,
  session,
  language,
  slice,
  view,
  columns,
  rows,
  filters,
  attributes,
  handleDataQuery,
}) => {
  const classes = useStyles();
  let pos = position.split("-")[0] as POSITIONS_TYPE;
  pos = pos === "row" ? "column" : "row";

  const { solution, project, report } = useParams();

  const getItem = (id: string, index: number) => {
    switch (id) {
      case "filters":
        return filters.splice(index, 1);
      case "columns":
        return columns.splice(index, 1);
      case "rows":
        return rows.splice(index, 1);
      case "attributes":
        return attributes.splice(index, 1);
      case "facts":
        return facts.splice(index, 1);
    }
  };

  const putItem = (id: string, index: number, item: any) => {
    switch (id) {
      case "filters":
        filters.splice(index, 0, item);
        break;
      case "columns":
        columns.splice(index, 0, item);
        break;
      case "rows":
        rows.splice(index, 0, item);
        break;
      case "attributes":
        attributes.splice(index, 0, item);
        break;
      case "facts":
        facts.splice(index, 0, item);
        break;
    }
  };

  const onHandleDrag = (e: any) => {
    const [item] = getItem(e.source.droppableId, e.source.index);
    putItem(e.destination.droppableId, e.destination.index, item);

    // const facts_for_server = facts.map((item: any) => item.code);
    // handleDataQuery({
    //   method: SET_FACT_POSISIOTNS,
    //   session,
    //   language,
    //   solution,
    //   project,
    //   report,
    //   slice,
    //   view,
    //   facts: facts_for_server,
    // });
  };

  return (
    <DragDropContext onDragEnd={onHandleDrag}>
      <Box className={classes.root} style={{ flexDirection: position }}>
        <Box
          className={classes.aside}
          style={{ display: show ? "flex" : "none", flexDirection: pos }}
        >
          <Box
            className={classes.aside}
            style={{ display: "block", overflow: "scroll" }}
          >
            <ListComponent code="facts" title="Факты" items={facts} />
          </Box>
          <Box className={classes.main} style={{ overflow: "scroll" }}>
            {filters.length > 0 && (
              <>
                <ListComponent title="Фильтры" code="filters" items={filters} />
                <Divider />
              </>
            )}
            {columns.length && (
              <>
                <ListComponent title="Колонки" code="columns" items={columns} />
                <Divider />
              </>
            )}
            {rows.length > 0 && (
              <>
                <ListComponent title="Строки" code="rows" items={rows} />
                <Divider />
              </>
            )}
            {attributes.length > 0 && (
              <>
                <ListComponent
                  title="Атрибуты"
                  code="attributes"
                  items={attributes}
                />
                <Divider />
              </>
            )}
          </Box>
        </Box>
        <Box className={classes.main} />
      </Box>
    </DragDropContext>
  );
};
