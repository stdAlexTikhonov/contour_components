import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { setLoading, resetLoading } from "../../actions/loading";
import { setItems } from "../../actions/items";
import { setView } from "../../actions/view";
import { setProjectStylesheet } from "../../actions/project";
import {
  setReportType,
  setTabItem,
  setTabs,
  setDashboard,
} from "../../actions/report";
import { LinkDispatchToProps, LinkStateToProps } from "./types";
import { CardsComponent } from "./Cards";
import { setBreadcrumbs } from "../../actions/breadcrumbs";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    dispatch(setLoading());
    const data = await getData(data_for_query);
    if (data.success) {
      data.path && dispatch(setBreadcrumbs(data.path));
      if (data.stylesheet) {
        dispatch(setProjectStylesheet(data.stylesheet));
      } else {
        dispatch(setItems(data.items));
        dispatch(setView(data.appearance.view));
      }
    }
    dispatch(resetLoading());
  },
  handleClick: () => {
    dispatch(setReportType(null));
    dispatch(setTabItem(null));
    dispatch(setTabs(null));
    dispatch(setDashboard(null));
  },
});

export const Cards = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardsComponent);
