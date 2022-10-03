import React from "react";
import * as ReactRedux from "react-redux";

import { ItemList } from "./ItemList";
import { IFrameView } from "./IFrameView";
import { PreferencesDialog } from "./Preferences";

//============================================================================
//  The React component that renders the UI for the entire App.
//----------------------------------------------------------------------------

class AppUI extends React.Component {
  render() {
    let contentPanel;
    if (this.props.showingPrefs) {
      contentPanel = (
        <div id="ContentPanel" className="preferences">
          <PreferencesDialog />
        </div>
      );
    } else if (
      this.props.selectedItem !== null &&
      this.props.selectedItem !== undefined
    ) {
      contentPanel = (
        <div id="ContentPanel" className="item">
          <IFrameView url={this.props.selectedItem.url} />
        </div>
      );
    } else {
      contentPanel = (
        <div id="ContentPanel" className="empty">
          <h2>No item selected yet.</h2>
          <p>Select an item in the colum on the left.</p>
        </div>
      );
    }
    const cssClasses = "App " + this.props.color;
    return (
      <div className={cssClasses}>
        <div id="ListPanel">
          <ItemList />
        </div>
        {contentPanel}
      </div>
    );
  }
}

//============================================================================
//  Connecting the ItemListUI to the Redux Store results in a new
//  React component that can talk to the Store, and provide the UI-component
//  with the data-props it needs.
//    Note how we don't ask for data or actions that are needed for its
//  children (ItemList and IFrameView). The ItemList will have its own
//  connection to the store. The IFrameView can be supplied its URL from
//  the data that the AppUI needs anyway (the SelectedItem).
//    Also note that the App does not need any functions to change the state.
//  Only the ItemList and the PreferencesDialog change parts of the state in
//  the Redux store.
//----------------------------------------------------------------------------

function mapStateToProps(state) {
  return {
    selectedItem: state.hnItems.selectedItem,
    showingPrefs: state.prefs.showingPrefs,
    color: state.prefs.currentColor
  };
}

export const App = ReactRedux.connect(mapStateToProps)(AppUI);
