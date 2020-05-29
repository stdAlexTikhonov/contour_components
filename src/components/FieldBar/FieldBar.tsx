import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";
import { DragDropContext } from "react-beautiful-dnd";
import { Filters } from "../Filters";
import {
  SET_FACT_POSISIOTNS,
  SET_DIM_POSITIONS,
  START_CUBE_SESSION,
} from "../../utils/constants";
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
  cube_session,
  handleDataQuery,
}) => {
  const classes = useStyles();
  const [local_filters, setLocalFilters] = useState(filters);
  let pos = position.split("-")[0] as POSITIONS_TYPE;
  pos = pos === "row" ? "column" : "row";

  const { solution, project, report } = useParams();

  const getItem = (id: string, index: number) => {
    switch (id) {
      case "filters": {
        const item = filters.splice(index, 1);
        setLocalFilters(filters.slice());
        return item;
      }
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
        setLocalFilters(filters.slice());
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
    if (e.source.droppableId === "facts")
      putItem("facts", e.destination.index, item);
    else if (
      e.destination.droppableId === "facts" &&
      e.source.droppableId !== "facts"
    ) {
      putItem(e.source.droppableId, e.source.index, item);
    } else putItem(e.destination.droppableId, e.destination.index, item);

    // if (cube_session === undefined)
    //   handleDataQuery({
    //     method: START_CUBE_SESSION,
    //     session,
    //     solution,
    //     project,
    //     report,
    //   });

    if (e.source.droppableId === "facts") {
      const facts_for_server = facts.map((item: any) => item.code);
      handleDataQuery({
        method: SET_FACT_POSISIOTNS,
        session,
        language,
        solution,
        project,
        report,
        slice,
        view,
        facts: facts_for_server,
        cubeSession: cube_session,
      });
    } else {
      const rows_fs = rows.map((item: any) => item.code);
      const columns_fs = columns.map((item: any) => item.code);
      const filters_fs = filters.map((item: any) => item.code);
      const attr_fs = attributes.map((item: any) => item.code);
      handleDataQuery({
        method: SET_DIM_POSITIONS,
        session,
        language,
        solution,
        project,
        report,
        slice,
        view,
        rows: rows_fs,
        columns: columns_fs,
        filters: filters_fs,
        attributes: attr_fs,
        cubeSession: cube_session,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onHandleDrag}>
      <Filters
        slice={slice}
        view={view}
        facts={facts.items}
        filters={local_filters}
      />
      <Box
        className={classes.root}
        style={{ flexDirection: position, overflow: "hidden" }}
      >
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
            <ListComponent title="Фильтры" code="filters" items={filters} />
            <Divider />

            <ListComponent title="Колонки" code="columns" items={columns} />
            <Divider />

            <ListComponent title="Строки" code="rows" items={rows} />
            <Divider />

            <ListComponent
              title="Атрибуты"
              code="attributes"
              items={attributes}
            />
            <Divider />
          </Box>
        </Box>
        <Box className={classes.main} />
      </Box>
    </DragDropContext>
  );
};
