import React from "react";
import styled from "styled-components";
const { ipcRenderer } = window.require("electron-better-ipc");

import { WidgetCard } from "../components/WidgetCard";

import constants from "../../api/Constants";
import { IWidgetInfo } from "../../api/IWidgetInfo";

const ButtonContainer = styled.div`
  height: fit-content;
  width: auto;
  padding: 1rem 1rem 0 1rem;
`;

const OptionButton = styled.button`
  align-items: center;
	background: var(--different-background-color);
  border: 1px solid var(--border-color);
	border-radius: 4px;
	color: #fff;
	display: inline-flex;
	font-family: 'Inter';
	font-size: .75em;
	font-weight: 50;
	justify-content: center;
	line-height: 1;
	padding: .5rem .75rem;
	text-align: center;
	text-decoration: none;
	transition: .07s linear;
	user-select: none;
	vertical-align: middle;
  margin: 0 1rem 0 0;

	&:active {
		filter: brightness(60%);
	}

	&:focus {
		outline: none;
	}
`;

const WidgetCardContainer = styled.div`
  height: fit-content;
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

const PageWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
`;

/* Main Component */
export const Widgets: React.FC = () => {
  const [ widgets, setWidgets ] = React.useState<object[]>([]);

  const loadWidgets = () => {
    ipcRenderer.callMain(constants.ipcMessages.GET_WIDGETS).then((ws: any) => {
      setWidgets(ws);
      console.log(`GET_WIDGETS: Loaded ${widgets.length} widgets.`);
      console.log(ws);
    });
  }

  const enableAll = () => {
    ipcRenderer.callMain(constants.ipcMessages.ENABLE_ALL_WIDGETS).then((ws: any) => {
      setWidgets(ws);
      console.log(`ENABLE_ALL refresh: Loaded ${widgets.length} widgets.`);
      console.log(ws);
    });
  }

  const disableAll = () => {
    ipcRenderer.callMain(constants.ipcMessages.DISABLE_ALL_WIDGETS).then((ws: any) => {
      setWidgets(ws);
      console.log(`DISABLE_ALL refresh: Loaded ${widgets.length} widgets.`);
      console.log(ws);
    });
  }

  React.useEffect(() => {
    ipcRenderer.callMain(constants.ipcMessages.GET_WIDGETS).then((ws: any) => {
      setWidgets(ws);
      console.log(`Initial GET_WIDGETS: Loaded ${widgets.length} widgets.`);
      console.log(ws);
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
      <PageWrapper>
        <ButtonContainer>
          <OptionButton onClick={() => enableAll()}>Enable All</OptionButton>
          <OptionButton onClick={() => disableAll()}>Disable All</OptionButton>
          <OptionButton onClick={() => loadWidgets()}>Reload</OptionButton>
        </ButtonContainer>
        <WidgetCardContainer>
          { widgets.map((f: any) => <WidgetCard key={f.id} widget={f} />) }
        </WidgetCardContainer>
      </PageWrapper>
    );
  }
}
