import {
  app,
  BrowserWindow,
  Menu,
  shell,
  Tray,
} from 'electron';
import { ipcMain } from 'electron-better-ipc';
import windowStateKeeper from 'electron-window-state';
import path from 'path';
import { injectable, singleton } from 'tsyringe';

import { WidgetManager } from './WidgetManager';
import { WindowManager } from './WindowManager';
import { SettingsManager } from "./SettingsManager";

import constants from '../api/Constants';

@injectable()
@singleton()
export class App {
  private widgetManager: WidgetManager;
  private windowManager: WindowManager;
  private settingsManager: SettingsManager;
  private trayIcon: Tray | null;

  constructor(_widgetManager: WidgetManager, _windowManager: WindowManager, _settingsManager: SettingsManager) {
    this.widgetManager = _widgetManager;
    this.windowManager = _windowManager;
    this.settingsManager = _settingsManager

    this.trayIcon = null;
  }

  public async start() {
    await this.settingsManager.start()
    this.widgetManager.setDefaultWidgetsDirectory(
      path.resolve(app.getAppPath(), '../widgets')
    );
    this.registerEvents();

    await this.widgetManager.loadWidgetsFromDirectory(undefined, true);

    await this.createTrayIcon();
    setTimeout(() => {
      console.log(this.settingsManager.cache)
    }, 5000)
  }

  public getTrayIcon(): Tray | null {
    return this.trayIcon;
  }

  private async createMainWindow() {
    await app.whenReady();

    const manager = this.windowManager;

    const RESOURCES_PATH = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(app.getAppPath(), '../assets');

    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths);
    };

    let existing = manager.getMainWindow();
    if (existing) {
      existing?.show();
      existing?.focus();
      return;
    }

    const windowState = windowStateKeeper({
      defaultHeight: 728,
      defaultWidth: 1024,
    });

    let mainWindow: BrowserWindow | null = new BrowserWindow({
      show: false,
      x: windowState.x,
      y: windowState.y,
      height: windowState.height,
      width: windowState.width,
      minHeight: 700,
      minWidth: 1000,
      frame: false,
      transparent: true,
      icon: getAssetPath('icon.ico'),
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
    });

    this.windowManager.setMainWindowState(windowState);
    this.windowManager.setMainWindow(mainWindow);

    mainWindow.loadURL(`file://${app.getAppPath()}/app/index.html`);

    mainWindow.webContents.on('did-finish-load', () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
      manager.endMainWindow();
    });

    mainWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });

    // windowState.manage(mainWindow);

    this.linkIpcEvents();
  }

  private async createTrayIcon() {
    await app.whenReady();

    this.trayIcon = new Tray(
      path.resolve(app.getAppPath(), '../assets/icon.ico')
    );

    const menu = Menu.buildFromTemplate([
      {
        label: '⚙️ Settings',
        click: () => this.createMainWindow(),
        type: 'normal',
      },
      {
        type: 'separator',
      },
      {
        label: '❌ Quit',
        click: () => app.quit(),
        type: 'normal',
      },
    ]);;

    this.trayIcon.setTitle('Wonders');
    this.trayIcon.setToolTip('Wonders');
    this.trayIcon.setContextMenu(menu);

    this.trayIcon.on('click', () => this.createMainWindow());
    this.trayIcon.on('right-click', () => this.trayIcon?.popUpContextMenu());
  }

  private linkIpcEvents() {
    const msgs = constants.ipcMessages;

    const getAllWidgetsInfo = () => {
      let arrToPush: any = [];
      for (let w of this.widgetManager.getAllLoadedWidgets().values()) {
        arrToPush.push({
          id: w.id,
          name: w.name,
          description: w.manifest.description,
          version: w.manifest.version,
          author: w.manifest.author,
          enabled: this.widgetManager.isEnabled(w.id)
        });
      }

      return arrToPush;
    }

    ipcMain.answerRenderer(msgs.GET_WIDGETS, async () => {
      return getAllWidgetsInfo();
    });

    ipcMain.answerRenderer(msgs.GET_LOADED_WIDGET, async (id: any) => {
      return this.widgetManager.getAllLoadedWidgets().get(id)?.info;
    });

    ipcMain.answerRenderer(msgs.GET_ENABLED_WIDGET, async (id: any) => {
      return this.widgetManager.getAllEnabledWidgets().get(id)?.info;
    });

    ipcMain.answerRenderer(msgs.ENABLE_WIDGET, async (id: any) => {
      await this.widgetManager.enableWidget(id);
      return this.widgetManager.isEnabled(id);
    });

    ipcMain.answerRenderer(msgs.DISABLE_WIDGET, async (id: any) => {
      await this.widgetManager.disableWidget(id);
      return this.widgetManager.isEnabled(id);
    });

    ipcMain.answerRenderer(msgs.ENABLE_ALL_WIDGETS, async () => {
      await this.widgetManager.enableAllWidgets();
      return getAllWidgetsInfo();
    });

    ipcMain.answerRenderer(msgs.DISABLE_ALL_WIDGETS, async () => {
      await this.widgetManager.disableAllWidgets();
      return getAllWidgetsInfo();
    });

    ipcMain.answerRenderer(msgs.CLOSE_MAIN_WINDOW, async () => {
      this.windowManager.getMainWindow()?.hide();
    });

    ipcMain.answerRenderer(msgs.MAXIMIZE_MAIN_WINDOW, async () => {
      let mainWindow = this.windowManager.getMainWindow();
      if (!mainWindow?.maximizable)
        return;

      if (mainWindow.isMaximized())
        mainWindow.restore(); // Doesn't work as I expected.
      else (!mainWindow.isMaximized())
        mainWindow.maximize();
    });

    ipcMain.answerRenderer(msgs.MINIMIZE_MAIN_WINDOW, async () => {
      let mainWindow = this.windowManager.getMainWindow();
      if (mainWindow?.minimizable)
        mainWindow.minimize();
    });
  }

  private registerEvents() {
    app.on('window-all-closed', () => {
      // Maintain process.
    });

    app.on('activate', () => {
      // Nothing, for now.
    });
  }
}
