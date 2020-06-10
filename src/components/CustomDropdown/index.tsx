import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToProps } from "./types";
import { CustomDropdownComponent } from "./CustomDropdownComponent";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
});

export const CustomDropdown = connect(mapStateToProps)(CustomDropdownComponent);
