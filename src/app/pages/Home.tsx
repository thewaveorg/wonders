import React from "react";

export default class extends React.Component {
  state: any;
  constructor(props: any) {
    super(props);
    this.state = {
      tab: "home",
    };
  }

  render(): any {
    const { tab } = this.state;

    return (
      <>
        <div className="tabs">
          <div className="tab" onClick={() => this.switchTab("home")}>
            <p className="tabName">Home</p>
          </div>
          <div className="tab" onClick={() => this.switchTab("settings")}>
            <p className="tabName">Settings</p>
          </div>
          <div id="window-handle" className="electron-drag"/>
        </div>
        <div className="homeMain">
          {this.renderTab(tab)}
        </div>
      </>
    );
  }

  switchTab(tab: string) {
    this.setState({ tab: tab });
  }

  renderTab(tab: string) {
    switch (tab) {
      case "home":
        return this.renderHome();
      case "settings":
        return this.renderSettings();
      default:
        return this.renderError();
    }
  }

  renderSettings() {
    return (
      <>
        <div>
        </div>
        <div
          id="content-wrapper"
          style={{ height: "100%", width: "100%" }}
        >
          <p style={{ fontSize: "4.25rem" }}>
            WIP
          </p>
        </div>
      </>
    );
  }

  renderHome() {
    return (
      <>
        <div>
        </div>
        <div
          id="content-wrapper"
          className="electron-drag"
          style={{ height: "100%", width: "100%" }}
        >
          <h1 style={{ fontSize: "3rem" }}>Welcome to Wonders!</h1>
          <p style={{ fontSize: "1.25rem" }}>
            A widget and desktop customization platform powered by Electron!
          </p>
        </div>
      </>
    );
  }

  renderError() {
    return (
      <h1>wtf did you do</h1>
    );
  }
}

// export default () => {
// return (
//   <>
//     <div>
//     </div>
//     <div
//       id="content-wrapper"
//       className="electron-drag"
//       style={{ height: "100%", width: "100%" }}
//     >
//       <h1 style={{ fontSize: "3rem" }}>Welcome to Wonders!</h1>
//       <p style={{ fontSize: "1.25rem" }}>
//         A widget and desktop customization platform powered by Electron!
//       </p>
//     </div>
//   </>
// );
// };
