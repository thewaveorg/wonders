import React from "react";
import styled from "styled-components";
const { ipcRenderer } = window.require("electron");

import { WidgetCard } from "../components/WidgetCard";

import constants from "../../api/Constants";
import { getIpcArguments } from "../../utils/getIpcArguments";

const CardWrapper = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row;
`;

export const Widgets: React.FC = () => {
  const [ widgets, setWidgets ] = React.useState<object[]>([]);

  React.useEffect(() => {
    ipcRenderer.once(constants.ipcChannels.MAIN_CHANNEL_ASYNC, (_, ar) => {
      const { messageType, args } = getIpcArguments(ar);

      if (messageType != constants.ipcMessages.RECEIVE_WIDGETS)
        return;

      setWidgets(args as Array<any>);
    })

    ipcRenderer.send(constants.ipcChannels.MAIN_CHANNEL_ASYNC, [ constants.ipcMessages.GET_WIDGETS ]);
  }, [])
  console.log(widgets);

  if(widgets.length === 0) {
    return (
      <>
      <h1 style={{ fontSize: '4.25rem', paddingBottom: '.1em', textAlign: "center" }}>No Widgets Available</h1>
      <p style={{ fontSize: '2.125rem', textAlign: "center" }}>Are you sure you have any widgets installed?</p>
      </>
    )
  } else {
    return (
      <>
        {widgets.map((f: any) => <WidgetCard key={f.id} widget={f} />)}
      </>
    );
  }
}
