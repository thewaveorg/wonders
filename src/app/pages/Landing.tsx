import React from 'react';
import styled from 'styled-components';

import { AnimationContainer } from '../components/AnimationContainer';

const GradientText = styled.span`
  background: var(--wonders-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Landing: React.FC = () => {
  return (
    <AnimationContainer style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: '4rem', paddingBottom: '1rem' }}>Welcome to <GradientText>Wonders!</GradientText></h1>
      <p style={{ fontSize: '1.25rem' }}>
        A widget and desktop customization platform powered by Electron!
      </p>
    </AnimationContainer>
  );
}
