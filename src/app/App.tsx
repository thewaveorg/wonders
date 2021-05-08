import React, { useRef } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Landing as LandingPage } from './pages/Landing';
import { Settings as SettingsPage } from './pages/Settings';
import { Widgets as WidgetsPage } from './pages/Widgets';

import { Navbar } from "./components/Navbar";
import { Page } from './components/Page';

import { useResize } from './util/useResize';

import './App.global.css';
import './styles/normalize.css';


export default () => {
  const navbarRef = useRef<HTMLDivElement>();
  const height = useResize(navbarRef).height || 39;

  return (
    <>
      <HashRouter>
        <Navbar ref={navbarRef}/>
        <Page style={{ height: `calc(100% - ${height}px)` }}>
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
