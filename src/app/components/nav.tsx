import React, { Component } from "react";


export default class Nav extends Component {
  props: any;
  constructor(props: any) {
    super(props);
    this.props = props;
  }

  render() {
    const { cb, active } = this.props;
    return (
      <>
          <div className="tabs">
          <div className={`tab ${active === "home" ? "tabActive" : ""}`} onClick={() => cb('home')}>
            <p className="tabName">Home</p>
          </div>
          <div className={`tab ${active === "widgets" ? "tabActive" : ""}`} onClick={() => cb('widgets')}>
            <p className="tabName">Widgets</p>
          </div>
          <div className={`tab ${active === "settings" ? "tabActive" : ""}`} onClick={() => cb('settings')}>
            <p className="tabName">Settings</p>
          </div>
        </div>
      </>
    )
  }
}
