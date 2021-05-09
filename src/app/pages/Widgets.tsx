import React from "react";
import styled from "styled-components";
const { ipcRenderer } = window.require("electron");

import { WidgetCard } from "../components/WidgetCard";

import constants from "../../api/Constants";

const CardWrapper = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row;
`;

export const Widgets: React.FC = () => {

  const [ widgets, setWidgets ] = React.useState([])

  React.useEffect(() => {
    ipcRenderer.on(constants.ipcMessages.RECEIVE_WIDGETS, (_, ar) => {
      setWidgets(ar);
    })

    ipcRenderer.send(constants.ipcMessages.GET_WIDGETS)
  }, [])


  return (
    <>
      {widgets.map((f) => <WidgetCard widget={f} />)}
    </>
  );
}
