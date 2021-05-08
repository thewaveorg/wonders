import React from "react";

import { Page } from "../components/Page";

export const Landing: React.FC = () => {
  return (
    <>
      <Page>
        <h1 style={{ fontSize: '3rem' }}>Welcome to Wonders!</h1>
        <p style={{ fontSize: '1.25rem' }}>
          A widget and desktop customization platform powered by Electron!
        </p>
      </Page>
    </>
  );
}
