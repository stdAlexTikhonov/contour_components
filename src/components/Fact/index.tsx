import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppState } from "../../store/config_store";
import { connect } from "react-redux";
import { FactComponent } from "./FactComponent";
import { AppActions } from "../../types/actions";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const data = await getData(data_for_query);
    if (data.success) console.log("OK.200");
  },
});

export const Fact = connect(mapStateToProps, mapDispatchToProps)(FactComponent);
