import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

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

  &:focus {
    color: #00CA4E;
  }

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
  ref: React.RefObject<HTMLDivElement>;
}

export const Navbar: React.FC<INavbarProps> = ({ ref }) => {
  return (
    <NavStyle ref={ref}>
      <NavLinkStyle style={{ marginLeft: '1%' }} activeStyle={{ color: '#bbb'}} to="/">Home</NavLinkStyle>
      <NavLinkStyle activeStyle={{ color: '#bbb'}} to="/widgets">Widgets</NavLinkStyle>
      <NavLinkStyle activeStyle={{ color: '#bbb'}} to="/settings">Settings</NavLinkStyle>
      <ElectronDrag/>
      <TrafficLights>
        <RedTrafficLight onClick={() => window.close()} />
        <YellowTrafficLight onClick={() => window.moveTo( -100000, -100000 )} />
        <GreenTrafficLight />
      </TrafficLights>
    </NavStyle>
  );
}
