import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

/* Styles */
const NavStyle = styled.div`
  display: flex;
	flex-wrap: wrap;
	background-color: var(--main-background-color);
	border-bottom: 1px solid var(--border-color);
  justify-content: space-between;
`;

const NavLinkStyle = styled(NavLink)`
  color: #ffffff;
  cursor: pointer;
  font-family: 'Karla';
  font-size: 1em;
  margin-left: 16px;
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
  margin: 0 10px 0 0;
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

    &:hover, &::active, &:focus {
        background-color: #770000;
    };
`;

const YellowTrafficLight = styled(TrafficLight)`
    background-color: #FFBD44;
    border-color: #FFBD44;

    &:hover, &::active, &:focus {
        background-color: #777700;
    };
`;

const GreenTrafficLight = styled(TrafficLight)`
    background-color: #00CA4E;
    border-color: #00CA4E;

    &:hover, &::active, &:focus {
        background-color: #007700;
    };
`;

const ElectronDrag = styled.div`
  flex-grow: 1;
  -webkit-app-region: drag;
`;


/* Main Component */
export const Navbar: React.FC = () => {
  return (
    <NavStyle>
      <NavLinkStyle to="/">Home</NavLinkStyle>
      <NavLinkStyle to="/widgets">Widgets</NavLinkStyle>
      <NavLinkStyle to="/settings">Settings</NavLinkStyle>
      <ElectronDrag/>
      <TrafficLights>
        <RedTrafficLight onClick={() => window.close()} />
        <YellowTrafficLight onClick={() => window.moveTo( -100000, -100000 )} />
        <GreenTrafficLight />
      </TrafficLights>
    </NavStyle>
  );
}
