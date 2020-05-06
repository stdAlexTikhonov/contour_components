import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import authedUser from "../reducers/authedUser";

export const rootReducer = combineReducers({
  auth: authedUser,
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(thunk));
