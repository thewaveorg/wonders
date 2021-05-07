import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { readdirSync } from 'fs';
import path from 'path';
import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { PluginManager } from 'live-plugin-manager';

import { IWidget } from './api/IWidget';

export class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

type BrowserOptions = Electron.BrowserWindowConstructorOptions | undefined;

export class WondersAPI {
  public app: Electron.App = app;

  public ipcMain: Electron.IpcMain = ipcMain;

  public shell: Electron.Shell = shell;

  public mainWindow: BrowserWindow | null = null;

  public pluginManager: PluginManager = new PluginManager();

  public trayIcon: Tray | null = null;

  public widgets: Map<string, IWidget> = new Map();

  public windows: Map<string, BrowserWindow> = new Map();

  constructor() {
    this.start();
  }

  private start() {
    if (process.env.NODE_ENV === 'production') {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }

    this.registerEvents();
    this.loadWidgetsFromDirectory(path.resolve(__dirname, '../widgets'));
    this.createTrayIcon();
  }

  public async createWidgetWindowAsync(id: string, options: BrowserOptions | undefined): Promise<BrowserWindow> {
    await app.whenReady();

    // Override certain options.
    options = options ?? {};
    options.frame = false;
    options.skipTaskbar = true;

    const window = new BrowserWindow(options);
    this.windows.set(id, window);

    window.webContents.on('did-finish-load', () => {
      if (!window) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        window.minimize();
      } else {
        window.show();
        window.focus();
      }
    });

    window.on('closed', () => {
      this.windows.delete(id);
    });

    window.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });

    return window;
  }

  public async loadWidgetsFromDirectory(dir: string): Promise<void> {
    const widgetFolders: string[] = readdirSync(dir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() || dirent.isSymbolicLink())
      .map((folder) => path.resolve(dir, folder.name));

    console.log(widgetFolders);

    for (const wpath of widgetFolders) {
      await this.loadWidget(wpath);
    }
  }

  public async loadWidget(p: string): Promise<void> {
    let pluginInfo;
    try {
      pluginInfo = require(path.resolve(p, './wonders.json'));
    } catch {
      console.log(`Found no wonders.json at ${p}. Ignoring...`);
      return;
    }

    if (!pluginInfo) {
      console.log(`Failed to read wonders.json.`);
      return;
    }
    const imported = require(path.resolve(p, pluginInfo.entry));

    const widgetObjectFactory: any =
      typeof imported === 'function' ? imported : imported.WONDERS;

    if (typeof widgetObjectFactory !== 'function') {
      console.log("Widget doesn't have any start point for Wonders.");
      return;
    }

    const widgetObject = widgetObjectFactory(this);
    this.widgets.set(pluginInfo.name, widgetObject);
    widgetObject.start();
  }

  public async unloadWidget(name: string): Promise<void> {
    const widget = this.widgets.get(name);
    widget?.stop();
    this.widgets.delete(name);
    delete require.cache[name];
  }

  private async createMainWindow() {
    const RESOURCES_PATH = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../assets');

    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths);
    };

    await app.whenReady();
    this.mainWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      frame: false,
      transparent: true,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    this.mainWindow.loadURL(`file://${__dirname}/app/index.html`);

    this.mainWindow.webContents.on('did-finish-load', () => {
      if (!this.mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.mainWindow.minimize();
      } else {
        this.mainWindow.show();
        this.mainWindow.focus();
      }
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.mainWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });

    new AppUpdater();
  }

  private async createTrayIcon() {
    await app.whenReady();

    this.trayIcon = new Tray(path.resolve(__dirname, "../assets/icon.ico"));
    const contextMenu = Menu.buildFromTemplate([
      { label: "Open Settings", click: () => this.createMainWindow(), type: "normal" },
      { type: "separator" },
      { label: "Quit", click: () => this.app.quit(), type: "normal" }
    ]);

    this.trayIcon.setTitle("Wonders");
    this.trayIcon.setToolTip("Wonders");
    this.trayIcon.setContextMenu(contextMenu);

    this.trayIcon.on("click", () => this.createMainWindow());
    this.trayIcon.on("right-click", () => this.trayIcon?.popUpContextMenu());
  }

  private registerEvents() {
    app.on('window-all-closed', () => {
      // Maintain process.
    });

    app.on('activate', () => {
      if (this.mainWindow === null)
        this.createMainWindow();
    });
  }
}

export default new WondersAPI();
