import React from "react";
const { ipcRenderer } = window.require("electron-better-ipc");

import { WidgetCard } from "../components/WidgetCard";

import constants from "../../api/Constants";

export const Widgets: React.FC = () => {
  const [ widgets, setWidgets ] = React.useState<object[]>([]);

  React.useEffect(() => {
    ipcRenderer.callMain(constants.ipcMessages.GET_WIDGETS).then((widgets: any) => {
      setWidgets(widgets);
    });
  }, [])

  if(widgets.length === 0) {
    return (
      <>
        <h1 style={{ fontSize: '4rem', paddingBottom: '1rem' }}>No widgets available.</h1>
        <p style={{ fontSize: '1.25rem' }}>Are you sure you have any widgets installed?</p>
      </>
    );
  } else {
    return (
      <>
        { widgets.map((f: any) => <WidgetCard key={f.id} widget={f} />) }
      </>
    );
  }
}
