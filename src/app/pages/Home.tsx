import React from 'react';

// tabs
import Landing from "./Landing";
import Settings from "./Settings";
import Widgets from "./Widgets";


export default class Home extends React.Component {
  state: any;
  props: any;
  constructor(props: any) {
    super(props);
    this.props = props;
    this.state = {
      tab: 'home',
    };
  }

  render(): any {
    const { tab } = this.props;
    switch (tab) {
      case 'home':
        return <Landing />
      case 'settings':
        return <Settings />
      case 'widgets':
        return <Widgets />
      default:
        return <h1>wtf did you do</h1>
    }
  }
}
