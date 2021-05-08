import React, { Component } from "react";


export default class Nav extends Component {
  props: any;
  constructor(props: any) {
    super(props);
    this.props = props;
  }

  render() {
    const { cb } = this.props;
    return (
      <>
          <div className="tabs">
          <div className="tab" onClick={() => cb('home')}>
            <p className="tabName">Home</p>
          </div>
          <div className="tab" onClick={() => cb('widgets')}>
            <p className="tabName">Widgets</p>
          </div>
          <div className="tab" onClick={() => cb('settings')}>
            <p className="tabName">Settings</p>
          </div>
        </div>
      </>
    )
  }
}
