import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToPropsTabs } from "./types";
import { MarginsOrientationComponent } from "./MarginsOrientationComponent";

const mapStateToProps = (state: AppState): LinkStateToPropsTabs => ({
  print_page: state.report.print_page,
});

export const MarginsOrientation = connect(mapStateToProps)(
  MarginsOrientationComponent
);
