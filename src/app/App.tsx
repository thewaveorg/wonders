import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import {Landing as LandingPage} from './pages/Landing';
import {Settings as SettingsPage} from './pages/Settings';
import { Widgets as WidgetsPage } from './pages/Widgets';

import { Navbar } from "./components/Navbar";

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