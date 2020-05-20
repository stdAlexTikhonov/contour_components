import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { TreeComponent } from "./TreeComponent";
import {
  setReport,
  setReportType,
  setTabItem,
  setTabs,
} from "../../actions/report";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleReportClick: (code: string) => {
    dispatch(setReport(code));
    dispatch(setReportType(null));
    dispatch(setTabItem(null));
    dispatch(setTabs(null));
  },
});

export const Tree = connect(mapStateToProps, mapDispatchToProps)(TreeComponent);
