import '@abraham/reflection';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { container, DependencyContainer } from "tsyringe";

import { App } from './services/App';
import { WindowManager } from './services/WindowManager';
import { WondersAPI } from './services/WondersAPI';

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

    this.configureServices();
    this.start();
  }

  private start() {
    this.services.resolve(App).start();
  }

  private configureServices() {
    // this.services.register(WindowManager, { useClass: WindowManager });
    // this.services.register(WondersAPI, { useClass: WondersAPI });
    // this.services.register(App, { useClass: App });
  }
}

export default new Program();

