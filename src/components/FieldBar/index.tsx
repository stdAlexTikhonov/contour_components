import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { IProps, POSITIONS_TYPE } from "./types";
import { useStyles } from "./styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const FieldBar: React.FC<IProps> = ({ show, position, facts, dims }) => {
  const classes = useStyles();
  let pos = position.split("-")[0] as POSITIONS_TYPE;
  pos = pos === "row" ? "column" : "row";

  const onHandleDrag = (e: any) => {
    if (e.source.droppableId === "dims") {
      const [item] = dims.splice(e.source.index, 1);
      dims.splice(e.destination.index, 0, item);
    } else {
      const [item] = facts.splice(e.source.index, 1);
      facts.splice(e.destination.index, 0, item);
      // clone.splice(e.destination.index, 0, item);
      // setFacts(clone);
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
                  dense={false}
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
                          <ListItemIcon>
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
                  dense={false}
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
                          <ListItemIcon>
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
