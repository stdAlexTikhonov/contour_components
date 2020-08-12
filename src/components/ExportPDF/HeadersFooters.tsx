import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToPropsTabs, LinkDispatchToPropsTabs } from "./types";
import { HeadersFootersComponent } from "./HeadersFootersComponent";
import { setPrintPage } from "../../actions/report";
import { pringPage } from "../../types/reducers";

const mapStateToProps = (state: AppState): LinkStateToPropsTabs => ({
  print_page: state.report.print_page,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToPropsTabs => ({
  settingPrintPage: (props: pringPage) => {
    dispatch(setPrintPage(props));
  },
});

export const HeadersFooters = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeadersFootersComponent);
