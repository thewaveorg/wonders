import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import LandingPage from './pages/tabs/landing';
import SettingsPage from './pages/tabs/settings';
import WidgetsPage from './pages/tabs/widgets';

import { Navbar } from "./components/Navbar";

import './App.global.css';
import './styles/normalize.css';

export default () => {
  return (
    <>
      {/*<Titlebar/>*/}
      <HashRouter>
        <Navbar/>
        <Switch>
          <Route exact path="/" component={ () => <LandingPage />} />
          <Route path="/settings" component={() => <SettingsPage />} />
          <Route path="/widgets" component={() => <WidgetsPage />} />
        </Switch>
      </HashRouter>
    </>
  )
};
