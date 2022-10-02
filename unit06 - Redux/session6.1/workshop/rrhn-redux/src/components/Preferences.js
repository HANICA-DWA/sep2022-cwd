import React from 'react';
import * as ReactRedux from 'react-redux';

import { Logo } from './Logo';

import { editListSizeAction, editColorAction,
         closePrefsAction, closeAndApplyPrefsAction } from '../reducers';

//============================================================================
//  The React component that renders the UI for the PreferencesDialog
//----------------------------------------------------------------------------

class PreferencesDialogUI extends React.Component {
  render() {
    const listSizeHandler = evt => this.props.doEditListSize(evt.target.value);
    const colorHandler    = evt => this.props.doEditColor(evt.target.value);
    const okHandler       =  () => this.props.doCloseAndApplyPrefs();

    let colorOptions = ["orange","green","brown"].map(
      (name) => <option key={name}>{name}</option>
    )

    let warning = "";
    if( isNaN(parseInt(this.props.listSize)) ){
      warning = "Please enter a number."
    } else if( parseInt(this.props.listSize) < 1) {
      warning = "Please enter a number larger than 0."
    } else if( parseInt(this.props.listSize) > 500 ) {
      warning = "RrHN can't show more than 500 stories."
    }
    if( warning ) {
      warning = <div className="warning">{warning}</div>
    }

    const cssClasses = "PreferencesDialog " + this.props.color;

    return <div className={cssClasses}>
      <header><Logo title="Settings"/></header>
      <label htmlFor="listSizeField">
        Show <input type="number" id="listSizeField" value={this.props.listSize} onChange={listSizeHandler}/> items in the list.
      </label>
      {warning}
      <label htmlFor="colorField">
        color: <select id="colorField" value={this.props.color} onChange={colorHandler}>
                 {colorOptions}
               </select>
      </label>
      <div className="dialogButtons">
        <button onClick={okHandler}>OK</button>
        <button onClick={this.props.doCancelPrefs}>Cancel</button>
      </div>
    </div>
  }
}
//============================================================================
//  Connecting the PreferencesDialogUI to the Redux Store results in a new
//  React component that can talk to the Store, and provide the UI-component
//  with both data-props and props containing functions to change the store.
//----------------------------------------------------------------------------

// What pieces of the Redux Store should be passed to the PreferencesDialogUI as
// data-props?
function mapStateToProps(state) {
  return {
    // TODO:  add the props that PreferencesDialogUI needs
  }
}

// What functions does the PreferencesDialogUI need to change the App state?
// Note how all functions merely create an Action (using a parameter if needed)
//   that they then send to the reducers by calling the Redux-supplied function 'dispatch'.
function mapDispatchToProps(dispatch) {
  return {
    // TODO:  add the dispatched action-creators that PreferencesDialogUI needs
  }
}

// Here a new React component is created that will contain the PreferencesDialogUI,
// and supply it with all the data and functions as props.
// This connected version of the PreferencesDialog component is the one we
// export to the rest of the app.
export const PreferencesDialog =
  ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PreferencesDialogUI);

//============================================================================
//  Just a little icon from https://github.com/encharm/Font-Awesome-SVG-PNG
//----------------------------------------------------------------------------

export function SettingsIcon() {
  return <svg width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
    <path d="M1152 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm512-109v222q0 12-8 23t-20 13l-185 28q-19 54-39 91 35 50 107 138 10 12 10 25t-9 23q-27 37-99 108t-94 71q-12 0-26-9l-138-108q-44 23-91 38-16 136-29 186-7 28-36 28h-222q-14 0-24.5-8.5t-11.5-21.5l-28-184q-49-16-90-37l-141 107q-10 9-25 9-14 0-25-11-126-114-165-168-7-10-7-23 0-12 8-23 15-21 51-66.5t54-70.5q-27-50-41-99l-183-27q-13-2-21-12.5t-8-23.5v-222q0-12 8-23t19-13l186-28q14-46 39-92-40-57-107-138-10-12-10-24 0-10 9-23 26-36 98.5-107.5t94.5-71.5q13 0 26 10l138 107q44-23 91-38 16-136 29-186 7-28 36-28h222q14 0 24.5 8.5t11.5 21.5l28 184q49 16 90 37l142-107q9-9 24-9 13 0 25 10 129 119 165 170 7 8 7 22 0 12-8 23-15 21-51 66.5t-54 70.5q26 50 41 98l183 28q13 2 21 12.5t8 23.5z"/>
  </svg>
}
