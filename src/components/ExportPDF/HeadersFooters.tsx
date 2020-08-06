import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToPropsTabs } from "./types";
import { HeadersFootersComponent } from "./HeadersFootersComponent";

const mapStateToProps = (state: AppState): LinkStateToPropsTabs => ({
  print_page: state.report.print_page,
});

export const HeadersFooters = connect(mapStateToProps)(HeadersFootersComponent);
