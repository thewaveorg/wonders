import React, { useLayoutEffect, useRef, useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Landing as LandingPage } from './pages/Landing';
import { Settings as SettingsPage } from './pages/Settings';
import { Widgets as WidgetsPage } from './pages/Widgets';

import { Navbar } from "./components/Navbar";
import { Page } from './components/Page';

import './ReactApp.global.css';
import './styles/normalize.css';


export default () => {
  const navbarRef = useRef<HTMLDivElement>();
  const [navbarHeight, setNavbarHeight] = useState(39);

  useLayoutEffect(() => {
    if (!navbarRef.current)
      return;

    setNavbarHeight(navbarRef.current!.offsetHeight);
  }, [ ]);

  return (
    <>
      <HashRouter>
        {/* @ts-ignore shut the up */}
        <Navbar ref={navbarRef}/>
        <Page style={{ height: `calc(100% - ${navbarHeight}px)` }}>
          <Switch>
            <Route exact path="/" component={() => <LandingPage/>} />
            <Route path="/settings" component={() => <SettingsPage/>} />
            <Route path="/widgets" component={() => <WidgetsPage/>} />
          </Switch>
        </Page>
      </HashRouter>
    </>
  )
};
