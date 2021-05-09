import React from 'react';
import styled from 'styled-components';

const WidgetBox = styled.div`
  width: 80%;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 12px;
  margin-top: 20px;
`;

const WidgetTitle = styled.div`
  width: 98%;
  margin-left: 0.5%;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding: 5px;
  padding-top: 0px;
`;

export const WidgetCard: React.FC<{ widget: any }> = (props: any) => {
  const { widget } = props;
  console.log(widget);
  return (
    <>
      <WidgetBox>
        <WidgetTitle>
          <p>{widget.name}</p>
        </WidgetTitle>
      </WidgetBox>
    </>
  );
};
