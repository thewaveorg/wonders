import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const { ipcRenderer } = window.require("electron");

import constants from "../../util/constants";

/* Styles */
const NavStyle = styled.div`
  display: flex;
	flex-wrap: wrap;
	background-color: var(--main-background-color);
	/* border-bottom: 1px solid var(--border-color); */
  justify-content: space-between;

  &::after {
    content : "";
    position: relative;
    left: 1%;
    bottom: 0;
    height: 0px;
    width: 98%;
    border-bottom: 1px solid var(--border-color);
  }
`;

const NavLinkStyle = styled(NavLink)`
  color: #ffffff;
  cursor: pointer;
  font-family: 'Karla';
  font-size: 1em;
  font-weight: 100;
  margin: 0 0 0 16px;
  padding: 10px 10px;
  text-align: center;

  &:hover {
    background-color: rgba(255, 255, 255, .1);
  }

  & a {
    color: #ffffff;
  }
`;

const TrafficLights = styled.div`
  align-self: center;
  margin: 0 16px 0 0;
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
  ref: React.MutableRefObject<HTMLDivElement> | React.RefObject<HTMLDivElement>;
}

export const Navbar: React.FC<INavbarProps> = ({ ref }) => {
  const activeStyle = { color: '#bbb' };

  return (
    <NavStyle ref={ref}>
      <NavLinkStyle activeStyle={activeStyle} to="/" style={{ marginLeft: '1%' }}>Home</NavLinkStyle>
      <NavLinkStyle activeStyle={activeStyle} to="/widgets">Widgets</NavLinkStyle>
      <NavLinkStyle activeStyle={activeStyle} to="/settings">Settings</NavLinkStyle>
      <ElectronDrag/>
      <TrafficLights>
        <RedTrafficLight onClick={() => ipcRenderer.send(constants.CLOSE_MAIN_WINDOW)} />
        <YellowTrafficLight onClick={() => ipcRenderer.send(constants.MAXIMIZE_MAIN_WINDOW)} />
        <GreenTrafficLight onClick={() => ipcRenderer.send(constants.MINIMIZE_MAIN_WINDOW)} />
      </TrafficLights>
    </NavStyle>
  );
}
