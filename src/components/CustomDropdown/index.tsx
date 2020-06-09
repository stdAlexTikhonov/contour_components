import * as React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Downshift from "downshift";
import { generateUID } from "../../utils/helpers";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 275,
      backgroundColor: theme.palette.background.paper,
      margin: "5px 0",
      borderRadius: 3,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      fontSize: "1rem",
      color: "black",
      fontWeight: 400,
    },
  })
);

let items: any[] = [];

for (let i = 0; i < 100; i++) {
  items.push({ value: generateUID() });
}

export const CustomDropdown = () => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState<string[]>([]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Downshift
      onChange={(selection) =>
        alert(
          selection ? `You selected ${selection.value}` : "Selection Cleared"
        )
      }
      itemToString={(item) => (item ? item.value : "")}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps,
      }) => (
        <div style={{ paddingTop: 5 }}>
          <TextField
            size="small"
            style={{ minWidth: 275 }}
            {...getRootProps({ refKey: "xxx" }, { suppressRefError: true })}
            InputLabelProps={{ ...getLabelProps() }}
            id="outlined-basic"
            InputProps={{ ...getInputProps() }}
            label="Outlined"
            variant="outlined"
          />
          {isOpen ? (
            <List
              className={classes.root}
              {...getMenuProps()}
              style={{
                listStyle: "none",
                maxHeight: "40vh",
                overflow: "scroll",
              }}
            >
              {items
                .filter(
                  (item) => !inputValue || item.value.includes(inputValue)
                )
                .map((item, index) => {
                  const labelId = `checkbox-list-label-${item.value}`;
                  return (
                    <ListItem
                      key={item.value}
                      {...getItemProps({
                        index,
                        item,
                      })}
                      role={undefined}
                      dense
                      button
                      onClick={handleToggle(item.value)}
                    >
                      <ListItemIcon style={{ minWidth: "auto" }}>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(item.value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          color="primary"
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={item.value} />
                    </ListItem>
                  );
                })}
            </List>
          ) : null}
        </div>
      )}
    </Downshift>
  );
};
