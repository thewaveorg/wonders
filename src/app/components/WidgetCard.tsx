import React, { useState } from 'react';
import styled from 'styled-components';
const { ipcRenderer } = window.require('electron-better-ipc');

import Switch from 'react-switch';

import Constants from '../../api/Constants';
import { Widget } from '../../api/Widget';

const WidgetBox = styled.div`
  height: auto;
  width: 80%;
  background-color: var(--different-background-color);
  padding: 12px;
  border-radius: 10px;
  border: 1.5px solid var(--border-color);
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
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-color);
`;

const WidgetTitle = styled.h1`
  font-family: 'Inter';
  font-size: 3rem;
  font-weight: 700;
  margin-left: 0.5%;
  padding-top: 0px;
`;

const WidgetInformation = styled.div`
  margin: 1%;
  width: 98%;
  margin-top: 20px;
`;

/* Main Component */

interface IWidgetCard {
  widget: Widget;
}

export const WidgetCard: React.FC<IWidgetCard> = ({ widget }) => {
  const [isWidgetEnabled, setWidgetEnabled] = useState(widget.enabled ?? false);
  const messages = Constants.ipcMessages;

  const onClick = async (checked: boolean) => {
    setWidgetEnabled(checked);
    ipcRenderer
      .callMain(messages.GET_ACTIVE_WIDGET, widget.id)
      .then(async (w: any) => {
        if (!!w) {
          await ipcRenderer.callMain(messages.DEACTIVATE_WIDGET, widget.id);
          setWidgetEnabled(false);
        } else {
          await ipcRenderer.callMain(messages.ACTIVATE_WIDGET, widget.id);
          setWidgetEnabled(true);
        }
      });
  };
  return (
    <WidgetBox id={widget.id}>
      <WidgetHeader>
        <WidgetTitle>{widget.name}</WidgetTitle>
        <Switch
          checkedIcon={false}
          uncheckedIcon={false}
          onChange={onClick}
          checked={isWidgetEnabled}
          onColor="#FF5A00"
        />
      </WidgetHeader>
      <WidgetInformation>
        {/* @ts-ignore SHUT */}
        <p>Description: {widget.description}</p>
        {/* @ts-ignore THE */}
        <p>Author: {widget.author}</p>
        {/* @ts-ignore UP */}
        <p>Version: {widget.version}</p>
      </WidgetInformation>
    </WidgetBox>
  );
};
