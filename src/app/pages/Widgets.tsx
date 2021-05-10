import React from "react";
import styled from "styled-components";
const { ipcRenderer } = window.require("electron-better-ipc");

import { WidgetCard } from "../components/WidgetCard";

import constants from "../../api/Constants";


const WidgetCardContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: min-content;
  grid-auto-flow: dense;
  grid-auto-rows: min-content;
  grid-row-gap: 0;

  @media only screen and (min-width : 1330px) {
    & {
      grid-template-columns: repeat(3, 1fr);
    }
  }
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
        <h1 style={{ fontSize: '4rem', paddingBottom: '1rem' }}>No widgets available.</h1>
        <p style={{ fontSize: '1.25rem' }}>Are you sure you have any widgets installed?</p>
      </>
    );
  } else {
    return (
      <WidgetCardContainer>
        { widgets.map((f: any) => <WidgetCard key={f.id} widget={f} />) }
      </WidgetCardContainer>
    );
  }
}
