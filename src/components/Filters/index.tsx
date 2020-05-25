import React from "react";
import { AppState } from "../../store/config_store";
import { AppActions } from "../../types/actions";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { GET_DIM_FILTER } from "../../utils/constants";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { IProps, LinkStateToProps, LinkDispatchToProps } from "./types";
import { getDimFilter } from "../../actions/report";

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
            <InputLabel
              id="demo-simple-select-label"
              className={age === "" ? classes.test1 : classes.test}
            >
              {item.Caption}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              onChange={(value) => handleChange(item.code, value)}
              onOpen={() => handleClick(item.code)}
            >
              {selected_filter ? (
                selected_filter.captions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item.replace(/&nbsp;/g, " ")}
                  </MenuItem>
                ))
              ) : (
                <MenuItem key={item} value={"None"}>
                  {"Loading..."}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        ))}
    </div>
  );
};

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  selected_filter: state.report.selected_filter,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const data = await getData(data_for_query);

    const data_transformed = {
      captions: data.Captions,
      filters: data.Filters,
    };
    console.log("hello");
    dispatch(getDimFilter(data_transformed));
  },
});

export const Filters = connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersComponent);
