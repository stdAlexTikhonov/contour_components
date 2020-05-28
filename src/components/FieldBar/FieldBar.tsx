import React from "react";
import { useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SET_FACT_POSISIOTNS } from "../../utils/constants";

export const FieldBarComponent: React.FC<IProps> = ({
  show,
  position,
  facts,
  dims,
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

  const onHandleDrag = (e: any) => {
    if (e.source.droppableId === "dims") {
      const [item] = dims.splice(e.source.index, 1);
      dims.splice(e.destination.index, 0, item);
    } else {
      const [item] = facts.splice(e.source.index, 1);
      facts.splice(e.destination.index, 0, item);
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
      });
    }
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
            <b>Факты</b>
            <Droppable droppableId="facts">
              {(provided) => (
                <List
                  dense={true}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {facts.map((item: any, i: number) => (
                    <Draggable
                      key={item.code}
                      draggableId={item.code}
                      index={i}
                    >
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ListItemIcon style={{ minWidth: 0 }}>
                            <DragIndicatorIcon />
                          </ListItemIcon>
                          <ListItemText primary={item.Caption} />
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </Box>
          <Box className={classes.main} style={{ overflow: "scroll" }}>
            <b>Измерения</b>
            <Droppable droppableId="dims">
              {(provided) => (
                <List
                  dense={true}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {dims.map((item: any, i: number) => (
                    <Draggable
                      key={item.code}
                      draggableId={item.code}
                      index={i}
                    >
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ListItemIcon style={{ minWidth: 0 }}>
                            <DragIndicatorIcon />
                          </ListItemIcon>
                          <ListItemText primary={item.Caption} />
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </Box>
        </Box>
        <Box className={classes.main} />
      </Box>
    </DragDropContext>
  );
};
