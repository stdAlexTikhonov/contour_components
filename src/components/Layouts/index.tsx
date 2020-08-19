import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LayoutsComponent } from "./LayoutsComponent";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
  layouts: state.report.layouts,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToProps => ({
  setLayout: async (data_for_query: DataForQuery, layouts?: any) => {
    const layoutData = await getData(data_for_query);

    if (layoutData.success) {
      console.log(layoutData);
    }
  },
});

export const Layouts = connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutsComponent);
