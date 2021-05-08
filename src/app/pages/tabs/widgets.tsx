import React, { Component } from "react";
export default class Widgets extends Component {
  state: any;
  constructor(props: any) {
    super(props);
    this.state = {
      widgets: []
    }
  }
render() {
  console.log(this.state)
  return (
    <>
      <div />
      <div
        id="content-wrapper"
        className="electron-drag"
        style={{ height: '100%', width: '100%' }}
      >
        <p style={{ fontSize: '4.25rem' }}>WIP</p>
      </div>
    </>
  );
}
}
