import '@abraham/reflection';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { container, DependencyContainer } from "tsyringe";

import { App } from './services/App';
import { SettingsManager } from './services/SettingsManager';

export class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

export class Program {
  public services: DependencyContainer;

  constructor() {
    this.services = container;

    this.start();
  }

  private start() {
    this.services.resolve(SettingsManager).start();
    this.services.resolve(App).start();
  }
}

export default new Program();

