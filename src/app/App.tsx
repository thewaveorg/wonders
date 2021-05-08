import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import LandingPage from './pages/Landing';
import SettingsPage from './pages/Settings';
import WidgetsPage from './pages/Widgets';

import { Navbar } from "./components/Navbar";
import { Titlebar } from './components/Titlebar';

import './App.global.css';
import './styles/normalize.css';

export default () => {
  return (
    <>
      <HashRouter>
        <Navbar/>
        <Switch>
          <Route exact path="/" component={() => <LandingPage/>} />
          <Route path="/settings" component={() => <SettingsPage/>} />
          <Route path="/widgets" component={() => <WidgetsPage/>} />
        </Switch>
      </HashRouter>
    </>
  )
};