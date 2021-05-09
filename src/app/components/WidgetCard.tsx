import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
const { ipcRenderer } = window.require('electron-better-ipc');

import Switch from 'react-switch';

import Constants from '../../api/Constants';
import { Widget } from '../../api/Widget';

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

  const messages = Constants.ipcMessages;

/*
  useEffect(() => {
    ipcRenderer.callMain(messages.GET_ACTIVE_WIDGET, widget.id).then((w: any) => {
      setWidgetEnabled(!!w);
    });
  });
*/
  const onClick = async (checked: boolean) => {
    setWidgetEnabled(checked);
    ipcRenderer.callMain(isWidgetEnabled ? messages.DEACTIVATE_WIDGET : messages.ACTIVATE_WIDGET, widget.id)

  }

  return (
    <WidgetBox id={widget.id}>
      <WidgetHeader>
        <WidgetTitle>{widget.name}</WidgetTitle>
        <Switch
          checkedIcon={false}
          uncheckedIcon={false}
          onChange={onClick}
          checked={isWidgetEnabled}
        />
      </WidgetHeader>
    </WidgetBox>
  );
};
