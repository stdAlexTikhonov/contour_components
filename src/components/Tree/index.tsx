import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { TreeComponent } from "./TreeComponent";
import {
  setReport,
  setReportType,
  setTabItem,
  setTabs,
  setDashboard,
} from "../../actions/report";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
  view: state.view,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleReportClick: (code: string) => {
    dispatch(setReport(code));
    dispatch(setReportType(null));
    dispatch(setTabItem(null));
    dispatch(setTabs(null));
    dispatch(setDashboard(null));
  },
});

export const Tree = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TreeComponent)
);
