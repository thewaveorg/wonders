import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { readdirSync } from 'fs';
import path from 'path';
// @ts-ignore
import { app, BrowserWindow, ipcMain, Menu, shell, Tray, ipcRenderer } from 'electron';
// @ts-ignore ignore so ts will quit yelling
import constants from "./util/constants";
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

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
  private app: Electron.App = app;
  private ipcMain: Electron.IpcMain = ipcMain;
  private shell: Electron.Shell = shell;
  private mainWindow: BrowserWindow | null = null;
  private trayIcon: Tray | null = null;
  private widgets: Map<string, IWidget> = new Map();
  private windows: Map<string, BrowserWindow> = new Map();

  private widgetsDirectory = "";

  constructor() {
    this.start();
  }

  public getApp(): Electron.App {
    return this.app;
  }

  public getIpc(): Electron.IpcMain {
    return this.ipcMain;
  }

  public getShell(): Electron.Shell {
    return this.shell;
  }

  public getRegisteredWidgets(): Map<string, IWidget> {
    return this.widgets;
  }

  public getRegisteredWindows(): Map<string, BrowserWindow> {
    return this.windows;
  }
  public getRegisteredWindow(id: string): BrowserWindow | undefined {
    return this.windows.get(id);
  }
  public removeRegisteredWindow(id: string): void {
    this.windows.delete(id);
  }

  public getWidgetsDirectory(): string {
    return this.widgetsDirectory;
  }

  private start() {
    if (process.env.NODE_ENV === 'production') {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }

    this.widgetsDirectory = path.resolve(__dirname, '../widgets');

    this.linkIpcEvents();
    this.registerEvents();
    this.loadWidgetsFromDirectory();
    this.createTrayIcon();
  }

  public async createWidgetWindowAsync(id: string, options?: BrowserOptions): Promise<BrowserWindow> {
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

  public async loadWidgetsFromDirectory(dir?: string): Promise<void> {
    dir = dir || this.widgetsDirectory;

    const widgetFolders: string[] = readdirSync(dir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() || dirent.isSymbolicLink())
      .map((folder) => path.resolve(dir!, folder.name));

    for await (const wpath of widgetFolders) {
      await this.loadWidget(wpath);
    }
  }



  /**
   * Load a widget
   * @param p Path to wonder widget
   */
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

    /**
   * Unload a widget
   * @param name Name of wonder widget
   */
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
      minHeight: 300,
      minWidth: 600,
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
      { label: "⚙️ Open Settings", click: () => this.createMainWindow(), type: "normal" },
      { type: "separator" },
      { label: "❌ Quit", click: () => this.app.quit(), type: "normal" }
    ]);

    this.trayIcon.setTitle("Wonders");
    this.trayIcon.setToolTip("Wonders");
    this.trayIcon.setContextMenu(contextMenu);

    this.trayIcon.on("click", () => this.createMainWindow());
    this.trayIcon.on("right-click", () => this.trayIcon?.popUpContextMenu());
  }

  private linkIpcEvents() {
    this.ipcMain.on(constants.GET_WIDGETS, (event) => {
      event.reply(constants.RECEIVE_WIDGETS, this.widgets);
    });

    this.ipcMain.on(constants.CLOSE_MAIN_WINDOW, () => {
      console.log("Received CLOSE_MAIN_WINDOW request.");
      this.mainWindow?.close();
    });
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

