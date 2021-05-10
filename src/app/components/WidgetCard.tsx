import React, { useState } from 'react';
import styled from 'styled-components';
const { ipcRenderer } = window.require('electron-better-ipc');

import Switch from 'react-switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';

import Constants from '../../api/Constants';
import { Widget } from '../../api/Widget';

/* Styles */
const WidgetBox = styled.div`
  height: fit-content;
  min-width: 33%;
  flex: 1;
  background-color: var(--different-background-color);
  padding: 12px;
  border-radius: 10px;
  border: 1.5px solid var(--border-color);
  margin: 1rem;
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
  border-bottom: 1px solid var(--border-color);
`;

const WidgetTitle = styled.h1`
  font-family: 'Inter';
  font-size: 3rem;
  font-weight: 700;
  margin-left: 0.5%;
  padding: 1rem;
  flex: 1;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  /* This creates a gradient for long widget names. */
  background-color: #fff;
  background-image: linear-gradient(90deg, #fff, #fff 50%, var(--different-background-color));
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent; 
  -moz-text-fill-color: transparent;
`;

const WidgetInformation = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 1%;
  width: 98%;
  margin-top: 20px;

  & p {
    padding: 0 1rem 0 1rem;
    width: fit-content;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const WidgetDescription = styled.p`
  color: rgba(255, 255, 255, .5);
  flex-grow: 1;
  font-family: 'Karla';
  font-size: 1rem;
  text-align: center;
  min-width: 50%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-bottom: .25rem !important;
`;

const WidgetOtherInfo = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  border-left: 1px solid var(--border-color);

  & p {
    padding: 0 1rem 0.25rem 1rem;
  }
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
        <WidgetDescription>{widget.description}</WidgetDescription>
        <WidgetOtherInfo>
          {/* @ts-ignore THE */}
          <p><b>@</b> {widget.author}</p>
          {/* @ts-ignore UP */}
          <p><FontAwesomeIcon icon={faCodeBranch}/> {widget.version}</p>
        </WidgetOtherInfo>
      </WidgetInformation>
    </WidgetBox>
  );
};
