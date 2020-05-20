import { TabsComponent } from "./TabsComponent";
import { connect } from "react-redux";
import { LinkStateToProps } from "./types";
import { AppState } from "../../store/config_store";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  tabs: state.report.tabs,
});

export const Tabs = connect(mapStateToProps)(TabsComponent);
