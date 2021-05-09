import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
const { ipcRenderer } = window.require('electron');

import Switch from 'react-switch';

import Constants from '../../api/Constants';
import { Widget } from '../../api/Widget';
import { getIpcArguments } from '../../utils/getIpcArguments';

const WidgetBox = styled.div`
  height: auto;
  width: 18rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 10px;
  margin-top: 20px;
`;

const WidgetHeader = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  padding: 0 0.25%;
`;

const WidgetTitle = styled.h1`
  font-family: 'Inter';
  font-size: 3rem;
  font-weight: 700;
  margin-left: 0.5%;
  padding-top: 0px;
`;

/* Main Component */

interface IWidgetCard {
  widget: Widget;
}

export const WidgetCard: React.FC<IWidgetCard> = ({ widget }) => {
  const [isWidgetEnabled, setWidgetEnabled] = useState(widget.enabled ?? false);

  const channel = Constants.ipcChannels.MAIN_CHANNEL_ASYNC;
  const messages = Constants.ipcMessages;

  
  useEffect(() => {
    ipcRenderer.on(channel, (_, a) => {
      const { messageType, args } = getIpcArguments(a);
  
      if (messageType != messages.RECEIVE_WIDGET_UPDATES)
        return;
  
      setWidgetEnabled(!!args![0]);
    });

    ipcRenderer.send(channel, [ messages.GET_ACTIVE_WIDGET, widget.id ]);
  });

  const onClick = (checked: boolean) => {
    setWidgetEnabled(checked);
    // Still have to implement the actual toggling.
  }

  console.log(widget);
  return (
    <WidgetBox id={widget.id}>
      <WidgetHeader>
        <WidgetTitle>{widget.name}</WidgetTitle>
        <Switch
          checkedIcon={false}
          uncheckedIcon={false}
          onChange={onClick}
          checked={isWidgetEnabled} />
      </WidgetHeader>
    </WidgetBox>
  );
};
