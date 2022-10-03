import React from "react";
import ReactDOM from "react-dom";

import * as Redux from "redux";
import * as ReactRedux from "react-redux";
import { mainReducer } from "./reducers";

import { App } from "./components/App";

import "./main.css";

// The logger middleware is adapted from code out of http://www.pro-react.com/materials/ch06-alt-redux.pdf.
// We use it because it is also useful to see the redux-actions happening in the normal console
// (together with error-messages).
const logger = (store) => (next) => (action) => {
  console.log("ACTION:", action.type, action);
  let result = next(action);
  console.log("STATE AFTER ACTION:", action.type, store.getState());
  return result;
};

// There are a few different ways you can connect the Redux App to the Redux DevTools.
// This code (adapted from https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup)
// is the version you need if you use Redux middleware:
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
const theStore = Redux.createStore(
  mainReducer,
  composeEnhancers(Redux.applyMiddleware(logger))
);

// const theStore = Redux.createStore(mainReducer);

const mainComponent = (
  <ReactRedux.Provider store={theStore}>
    <App />
  </ReactRedux.Provider>
);

ReactDOM.render(mainComponent, document.getElementById("react-root"));
