import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToProps } from "./types";
import { TreeComponent } from "./TreeComponent";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
});

export const Tree = connect(mapStateToProps)(TreeComponent);
