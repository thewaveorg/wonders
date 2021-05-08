import React from 'react';

// tabs
import Landing from "./tabs/landing";
import Settings from "./tabs/settings";
import Widgets from "./tabs/widgets";


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

    return (
      <>
        <div className="homeMain">{this.renderTab(tab)}</div>
      </>
    );
  }

  renderTab(tab: string) {
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
