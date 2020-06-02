import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import Checkbox from "@material-ui/core/Checkbox";
import { Filter } from "../Filter";
import { IProps } from "./types";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { SET_FACTS } from "../../utils/constants";

export const ListComponent: React.FC<IProps> = ({
  title,
  code,
  items,
  slice,
  view,
  facts,
  visibleFacts,
  handleDataQuery,
  cube_session,
  language,
  session,
}) => {
  const { solution, project, report } = useParams();
  const [checked, setChecked] = useState(
    items.map((item: any) =>
      visibleFacts && visibleFacts.includes(item.code) ? 1 : 0
    )
  );

  const handleChange: any = (value: string) => () => {
    const codes = items.map((item: any) => item.code);
    const index = codes.indexOf(value);
    checked[index] = checked[index] === 1 ? 0 : 1;
    setChecked([...checked]);

    let facts_for_server = codes.filter(
      (item: any, i: number) => checked[i] === 1
    );

    handleDataQuery({
      method: SET_FACTS,
      session,
      language,
      solution,
      project,
      report,
      slice,
      view,
      visibleFacts: facts_for_server,
    });
  };

  return (
    <>
      <b style={{ padding: 5, display: "block" }}>{title}</b>
      <Droppable droppableId={code}>
        {(provided) => (
          <List
            dense={true}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
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
                    {facts ? (
                      <>
                        <ListItemText primary={item.Caption} />
                        <Checkbox
                          checked={checked[i] === 1}
                          value={item.code}
                          onChange={handleChange(item.code)}
                        />
                      </>
                    ) : (
                      <Filter
                        label={item.Caption}
                        code={item.code}
                        slice={slice}
                        view={view}
                      />
                    )}
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
};
