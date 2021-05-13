import React from "react";
import styled from 'styled-components';

const ToggleContainer = styled.div`
	width: 70px;
  background-color: #FF5A00;
  cursor: pointer;
  user-select: none;
  border-radius: 3px;
  padding: 2px;
  height: 32px;
  position: relative;

	&.disabled {
  	background-color: #707070;
  	left: 2px;
	}
`;

const DialogButton = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: bold;
  cursor: pointer;
  background-color: #ffffff;
  color: white;
  padding: 8px 12px;
  border-radius: 18px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  min-width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  min-width: unset;
  border-radius: 3px;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  position: absolute;
  left: 34px;
  transition: all 0.3s ease;
`;


interface IToggleButtonProps {
	selected: boolean;
	toggleSelected: () => void;
}

export const ToggleButton: React.FC<IToggleButtonProps> = ({ selected, toggleSelected }) => {
  return (
    <ToggleContainer onClick={toggleSelected} className={(selected ? "" : "disabled")}>
      <DialogButton />
    </ToggleContainer>
  );
}