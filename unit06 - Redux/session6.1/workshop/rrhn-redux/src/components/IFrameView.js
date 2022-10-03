import React from 'react';
import parseUrl from 'url-parse';


export class IFrameView extends React.Component {
  render() {
    if( ! this.props.url) {
      return null; // nothing to render if we don't have a url.
    }

    // Github shows a nasty modal saying it's page may not be shown in an iframe.
    // So we'll allow modals for anyone but Github.
    let sandboxAttr = "allow-forms allow-popups allow-scripts allow-same-origin"
    if( ! parseUrl(this.props.url).hostname.toLowerCase().endsWith("github.com")) {
      sandboxAttr += " allow-modals";
    }

    return <iframe className="IFrameView" src={this.props.url} frameBorder="0" sandbox={sandboxAttr} title="iframeView"></iframe>
  }
}
