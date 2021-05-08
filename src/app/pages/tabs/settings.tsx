
import React, {Component} from "react";

export default class Settings extends Component {
  props: any;
  state: any;
  constructor(props: any) {
    super(props);
    this.props = props;
  }




  render() {
    // const { widgets, enable, disable } = this.props;
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

