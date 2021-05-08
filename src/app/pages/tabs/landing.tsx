import React, {Component} from "react";
export default class Landing extends Component {
  render() {
    return (
      <>
        <div />
        <div
          id="content-wrapper"
          className="electron-drag"
          style={{ height: '100%', width: '100%' }}
        >
          <h1 style={{ fontSize: '3rem' }}>Welcome to Wonders!</h1>
          <p style={{ fontSize: '1.25rem' }}>
            A widget and desktop customization platform powered by Electron!
          </p>
        </div>
      </>
    );
  }
}
