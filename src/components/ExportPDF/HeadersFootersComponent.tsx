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
  const [age, setAge] = React.useState("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string);
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

  const CustomSelect: React.FC<{ title: string }> = ({ title }) => (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">{title}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={age}
        onChange={handleChange}
      >
        <MenuItem value={10}>Заголовок</MenuItem>
        <MenuItem value={20}>Дата/Время</MenuItem>
        <MenuItem value={30}>Страница #</MenuItem>
        <MenuItem value={30}>Страница # из #</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <div className={classes.container}>
      <FormControl className={classes.formControl}>
        <FormControlLabel
          control={
            <Checkbox
              checked={colontitules}
              onChange={handleChangeCheckboxes2}
              name="colontitules"
            />
          }
          label="Headers/Footers"
        />
        <FormGroup
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <CustomSelect title={"Left"} />
          <CustomSelect title={"Center"} />
          <CustomSelect title={"Right"} />
        </FormGroup>
        <FormGroup
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <CustomSelect title={"Left"} />
          <CustomSelect title={"Center"} />
          <CustomSelect title={"Right"} />
        </FormGroup>
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
