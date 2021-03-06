import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  authedUser,
  loading,
  languages,
  items,
  breadcrumbs,
  view,
  report,
  cubes,
  filters,
  project,
} from "../reducers";

import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";

export const rootReducer = combineReducers({
  auth: authedUser,
  loading,
  languages,
  items,
  breadcrumbs,
  view,
  report,
  cubes,
  filters,
  project,
});

export type AppState = ReturnType<typeof rootReducer>;

const composeEnhancers = composeWithDevTools({});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
