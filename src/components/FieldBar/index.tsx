import { FieldBarComponent } from "./FieldBar";
import { connect } from "react-redux";
import { AppState } from "../../store/config_store";

import { AppActions } from "../../types/actions";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { LinkStateToProps, LinkDispatchToProps } from "./types";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const data = await getData(data_for_query);

    console.log(data);
  },
});

export const FieldBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldBarComponent);
