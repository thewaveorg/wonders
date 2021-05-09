import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const { ipcRenderer } = window.require("electron-better-ipc");

import constants from "../../api/Constants";

const ipcMessages = constants.ipcMessages;

/* Styles */
const NavStyle = styled.div`
  display: flex;
	flex-wrap: wrap;
	background-color: var(--main-background-color);
	border-bottom: 1px solid var(--border-color);
  justify-content: space-between;
  max-height: 40px;

  /* Border with a margin */
  /*
  &::after {
    content: "";
    position: relative;
    left: 1%;
    bottom: 0;
    height: 0px;
    width: 98%;
    border-bottom: 1px solid var(--border-color);
  }
  */
`;

const NavLinkStyle = styled(NavLink)`
  color: #ffffff;
  cursor: pointer;
  font-family: 'Karla';
  font-size: 1em;
  font-weight: 300;
  margin: 0 0 0 0;
  padding: 10px 10px;
  text-align: center;
  height: 100%;
  width: 80px;

  transition: .125s ease;

  &:hover {
    background-color: rgba(255, 255, 255, .1);
  }

  & a {
    color: #ffffff;
  }
`;

const TrafficLights = styled.div`
  align-self: center;
  margin: 0 1.25% 0 0;
`;

const TrafficLight = styled.button`
  width: 14px;
  margin-left: 10px;
  height: 14px;
  padding: 0;
  border: 1px solid;
  border-radius: 50%;
  float: right;
  -webkit-app-region: no-drag;

  &:focus {
    outline: none;
    border: none;
  }
`;

const RedTrafficLight = styled(TrafficLight)`
  background-color: #FF605C;
  border-color: #FF605C;

  &:hover, &:focus {
    background-color: #770000;
  };

  &:active {
    background-color: #550000;
  }
`;

const YellowTrafficLight = styled(TrafficLight)`
  background-color: #FFBD44;
  border-color: #FFBD44;

  &:hover, &:focus {
    background-color: #774400;
  };

  &:active {
    background-color: #552200;
  }
`;

const GreenTrafficLight = styled(TrafficLight)`
  background-color: #00CA4E;
  border-color: #00CA4E;

  &:hover, &:focus {
    background-color: #007700;
  };

  &:active {
    background-color: #005500;
  }
`;

const ElectronDrag = styled.div`
  flex-grow: 1;
  -webkit-app-region: drag;
`;


/* Main Component */
interface INavbarProps {
  [key: string]: any
}

export const Navbar = React.forwardRef<HTMLDivElement, INavbarProps>((_, ref) => {
  const activeStyle = { color: '#888' };

  return (
    <NavStyle ref={ref}>
      <NavLinkStyle activeStyle={activeStyle} to="/" exact style={{ marginLeft: '0' }}>Home</NavLinkStyle>
      <NavLinkStyle activeStyle={activeStyle} to="/widgets">Widgets</NavLinkStyle>
      <NavLinkStyle activeStyle={activeStyle} to="/settings">Settings</NavLinkStyle>
      <ElectronDrag/>
      <TrafficLights>
        <RedTrafficLight
          onClick={ () => ipcRenderer.callMain(ipcMessages.CLOSE_MAIN_WINDOW) }
        />
        <YellowTrafficLight
          onClick={ () => ipcRenderer.callMain(ipcMessages.MAXIMIZE_MAIN_WINDOW) }
        />
        <GreenTrafficLight
          onClick={ () => ipcRenderer.callMain(ipcMessages.MINIMIZE_MAIN_WINDOW) }
        />
      </TrafficLights>
    </NavStyle>
  );
});
