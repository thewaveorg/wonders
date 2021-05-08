import React from 'react';
import styled from "styled-components";

// Styles
const TitlebarStyle = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  margin: 0px;
  padding-left: 1%;
  padding-top: 1%;
  width: 99%;
  height: 30px;
  -webkit-user-select: none;
  -webkit-app-region: drag;

    & p.title {
        margin: 0;
        float: left;
        clear: both;
        font-weight: bold;
        /* font-style: italic; */
    }

    & .traffic-lights {
        float: right;
        margin: auto 15px auto 0;
    }
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
    background-color: #ff0000;
    border-color: #ff0000;

    &:hover, &::active, &:focus {
        background-color: #770000;
    };
`;

const YellowTrafficLight = styled(TrafficLight)`
    background-color: #ffff00;
    border-color: #ffff00;

    &:hover, &::active, &:focus {
        background-color: #777700;
    };
`;

const GreenTrafficLight = styled(TrafficLight)`
    background-color: #00ff00;
    border-color: #00ff00;

    &:hover, &::active, &:focus {
        background-color: #007700;
    };
`;

/* Main Component */


export const Titlebar: React.FC = () => {
    return (
        <TitlebarStyle>
            <p className="title">Wonders!</p>
            <div className="traffic-lights">
                <RedTrafficLight onClick={() => window.close()} />
                <YellowTrafficLight onClick={() => window.moveTo( -100000, -100000 )} />
                <GreenTrafficLight />
            </div>
        </TitlebarStyle>
    );
};