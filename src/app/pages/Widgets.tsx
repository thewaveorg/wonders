import React from "react";
const { ipcRenderer } = window.require("electron");
import constants from "../../api/Constants";

import {WidgetCard} from "../components/WidgetCard";

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
