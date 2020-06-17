import { connect } from "react-redux";
import { ViewComponent } from "./ViewComponent";
import { AppState } from "../../store/config_store";
import { LinkStateToProps } from "./types";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
});

export const View = connect(mapStateToProps)(ViewComponent);
