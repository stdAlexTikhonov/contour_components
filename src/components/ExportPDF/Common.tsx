import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToPropsTabs, LinkDispatchToPropsTabs } from "./types";
import { CommonComponent } from "./CommonComponent";
import { pringPage } from "../../types/reducers";
import { setPrintPage } from "../../actions/report";

const mapStateToProps = (state: AppState): LinkStateToPropsTabs => ({
  print_page: state.report.print_page,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToPropsTabs => ({
  settingPrintPage: (props: pringPage) => {
    dispatch(setPrintPage(props));
  },
});

export const Common = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommonComponent);
