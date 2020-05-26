import React, { useState } from "react";
import { useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useStyles } from "./styles";
import { IProps, LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppState } from "../../store/config_store";
import { connect } from "react-redux";
import { AppActions } from "../../types/actions";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { getDimFilter } from "../../actions/report";
import { GET_DIM_FILTER } from "../../utils/constants";

export const FilterComponent: React.FC<IProps> = ({
  label,
  code,
  selected_filter,
  slice,
  view,
  language,
  session,
  resetSelectedFilter,
  handleDataQuery,
}) => {
  const [value, setValue] = useState("");
  const [values, setValues] = useState<Array<string>>([]);
  const [clicked, setClicked] = useState(false);
  const classes = useStyles();

  const { solution, project, report } = useParams();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);

    //Костыль - выпилить
    const { captions } = selected_filter ? selected_filter : { captions: [] };
    if (values.length === 0 && captions.length > 0) setValues(captions);
  };

  const handleClick = async (e: any) => {
    await handleDataQuery({
      method: GET_DIM_FILTER,
      language,
      session,
      solution,
      project,
      report,
      slice,
      view,
      code,
    });

    setClicked(true);
  };

  const handleClose = () => {
    setClicked(false);
    resetSelectedFilter();
  };

  //Костыль - выпилить
  const arr = values.length === 0 ? selected_filter?.captions : values;

  return (
    <div onClick={(e) => handleClick(e)}>
      <FormControl key={code} className={classes.formControl}>
        <InputLabel id={"demo-simple-select-label" + code}>{label}</InputLabel>
        <Select
          labelId={"demo-simple-select-label" + code}
          value={value}
          onChange={handleChange}
          onClose={() => {
            handleClose();
          }}
        >
          {clicked &&
            arr &&
            arr.map((val) => {
              const replaced = val.replace(/&nbsp;/g, " ");
              return (
                <MenuItem key={replaced} value={replaced}>
                  {replaced}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
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

    dispatch(getDimFilter(data_transformed));
  },
  resetSelectedFilter: () => {
    dispatch(getDimFilter(null));
  },
});

export const Filter = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterComponent);
