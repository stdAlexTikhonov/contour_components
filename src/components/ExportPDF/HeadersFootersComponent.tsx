import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { LinkStateToPropsTabs } from "./types";

export const HeadersFootersComponent: React.FC<LinkStateToPropsTabs> = ({
  print_page,
}) => {
  const classes = useStyles();
  const [visible, setVisible] = React.useState(print_page?.HeaderFooterVisible);

  const handleVisability = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisible(event.target.checked);
  };

  const [state, setState] = React.useState({
    columns: true,
    rows: false,
    title: false,
    header: false,
    footer: false,
  });

  const [group, setGroup] = React.useState({
    colontitules: false,
    changeScale: false,
  });

  const handleChangeCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleChangeCheckboxes2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroup({ ...group, [event.target.name]: event.target.checked });
  };

  const { columns, rows, title, header, footer } = state;
  const { colontitules, changeScale } = group;

  const CustomSelect: React.FC<{ title: string }> = ({ title }) => {
    const [age, setAge] = React.useState("");

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setAge(event.target.value as string);
    };

    return (
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
        <Select
          labelId={"demo-simple-select-label" + title}
          id={"demo-simple-select" + title}
          value={age}
          onChange={handleChange}
          style={{ minWidth: 120 }}
        >
          <MenuItem value={10}>Title</MenuItem>
          <MenuItem value={20}>Date/Time</MenuItem>
          <MenuItem value={30}>Page #</MenuItem>
          <MenuItem value={40}>Page # of #</MenuItem>
        </Select>
      </FormControl>
    );
  };

  return (
    <div className={classes.container}>
      <FormControl className={classes.formControl}>
        <FormControlLabel
          control={
            <Checkbox
              checked={visible}
              onChange={handleVisability}
              name="visability"
            />
          }
          label="Headers/Footers"
        />
        {visible && (
          <>
            <FormGroup
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <CustomSelect title={"Top/Left"} />
              <CustomSelect title={"Top/Center"} />
              <CustomSelect title={"Top/Right"} />
            </FormGroup>
            <FormGroup
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <CustomSelect title={"Bottom/Left"} />
              <CustomSelect title={"Bottom/Center"} />
              <CustomSelect title={"Bottom/Right"} />
            </FormGroup>
          </>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={changeScale}
              onChange={handleChangeCheckboxes2}
              name="changeScale"
            />
          }
          label="Change scale along with the document"
        />
      </FormControl>
    </div>
  );
};
