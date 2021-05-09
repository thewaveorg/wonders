import React from "react";
import styled from "styled-components";
const { ipcRenderer } = window.require("electron-better-ipc");

import { WidgetCard } from "../components/WidgetCard";

import constants from "../../api/Constants";

const CardWrapper = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row;
`;

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
        <h1 style={{ fontSize: '4.25rem', paddingBottom: '.1em' }}>No widgets available.</h1>
        <p style={{ fontSize: '2.125rem' }}>Are you sure you have any widgets installed?</p>
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
