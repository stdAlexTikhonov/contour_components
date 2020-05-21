import { connect } from "react-redux";
import { BreadcrumbsComponent } from "./BreadcrumbsComponent";
import { AppState } from "../../store/config_store";
import { LinkStateToProps } from "./types";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  breadcrumbs: state.breadcrumbs,
});

export const SimpleBreadcrumbs = connect(mapStateToProps)(BreadcrumbsComponent);
