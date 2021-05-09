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
    ipcRenderer.on(constants.ipcChannels.MAIN_CHANNEL_ASYNC, (_, ar) => {
      if (!Array.isArray(ar))
        return;

      let messageType = ar.shift();
      if (messageType == constants.ipcMessages.RECEIVE_WIDGETS)
        setWidgets(ar[0]);
    })

    ipcRenderer.send(constants.ipcChannels.MAIN_CHANNEL_ASYNC, [ constants.ipcMessages.GET_WIDGETS ]);
  }, [])


  return (
    <>
      {widgets.map((f) => <WidgetCard widget={f} />)}
    </>
  );
}
