import { DashboardComponent } from "./DashboardComponent";
import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToProps } from "./types";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  dashboard: state.report.dashboard,
});
export const Dashboard = connect(mapStateToProps)(DashboardComponent);
