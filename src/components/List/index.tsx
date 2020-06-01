import { connect } from "react-redux";
import { ListComponent } from "./ListComponent";
import { ThunkDispatch } from "redux-thunk";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppState } from "../../store/config_store";
import { AppActions } from "../../types/actions";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  cube_session: state.report.cube_session,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const data = await getData(data_for_query);
    if (data.success) console.log("OK.200");
    //   if (data.success) dispatch(setCubeSession(data.cubeSession));
    //   console.log(data);
  },
});

export const List = connect(mapStateToProps, mapDispatchToProps)(ListComponent);
