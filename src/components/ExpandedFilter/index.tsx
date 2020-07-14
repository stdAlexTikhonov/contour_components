import { connect } from "react-redux";
import { ExpandedFilterComponent } from "./ExpandedFilterComponent";
import { LinkStateToProps } from "./types";
import { AppState } from "../../store/config_store";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  filter_items: state.filters.items,
});

export const ExpandedFilter = connect(mapStateToProps)(ExpandedFilterComponent);
