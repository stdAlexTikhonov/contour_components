import { LinkStateToProps } from "./types";
import { AppState } from "../../store/config_store";
import { connect } from "react-redux";
import { FactComponent } from "./FactComponent";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
});

export const Fact = connect(mapStateToProps)(FactComponent);
