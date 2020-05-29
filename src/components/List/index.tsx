import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { IProps } from "./types";
import { Droppable, Draggable } from "react-beautiful-dnd";

export const ListComponent: React.FC<IProps> = ({ title, code, items }) => (
  <>
    <b>{title}</b>
    <Droppable droppableId={code}>
      {(provided) => (
        <List dense={true} {...provided.droppableProps} ref={provided.innerRef}>
          {items.map((item: any, i: number) => (
            <Draggable key={item.code} draggableId={item.code} index={i}>
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
  </>
);
