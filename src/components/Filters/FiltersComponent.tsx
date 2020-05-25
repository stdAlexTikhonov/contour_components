import React from "react";
import { useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { GET_DIM_FILTER } from "../../utils/constants";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { IProps } from "./types";

export const FiltersComponent: React.FC<IProps> = ({
  metadata,
  language,
  session,
  handleDataQuery,
  selected_filter,
}) => {
  const classes = useStyles();
  const [age, setAge] = React.useState("");
  const { solution, project, report } = useParams();
  const val = "";

  const handleClick = async (code: string) => {
    await handleDataQuery({
      method: GET_DIM_FILTER,
      language,
      session,
      solution,
      project,
      report,
      slice: metadata.slice,
      view: metadata.view,
      code,
    });
  };
  const handleChange = (
    code: string | null,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setAge(event.target.value as string);
  };

  return (
    <div className={classes.selectEmpty}>
      <FormControl className={classes.formControl}>
        <InputLabel
          id="demo-simple-select-label"
          className={age === "" ? classes.test1 : classes.test}
        >
          Facts
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={(value) => handleChange(null, value)}
        >
          {metadata.facts &&
            metadata.facts.items.map((item: any) => (
              <MenuItem key={item.code} value={item.code}>
                {item.Caption}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {metadata.filter_dim &&
        metadata.filter_dim.items.map((item: any) => (
          <FormControl key={item.code} className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">
              {item.Caption}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={val}
              onChange={(value) => handleChange(item.code, value)}
              onOpen={() => handleClick(item.code)}
            >
              <MenuItem key={item} value={"None"}>
                {"Loading..."}
              </MenuItem>
            </Select>
          </FormControl>
        ))}
    </div>
  );
};
