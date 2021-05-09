import {
  app,
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  shell,
  Tray,
} from 'electron';
import { ipcMain } from 'electron-better-ipc';
import windowStateKeeper from 'electron-window-state';
import path from 'path';
import { injectable, singleton } from 'tsyringe';

import { WidgetManager } from './WidgetManager';
import { WindowManager } from './WindowManager';

import constants from '../api/Constants';

@injectable()
@singleton()
export class App {
  private widgetManager: WidgetManager;
  private windowManager: WindowManager;

  private trayIcon: Tray | null;

  constructor(_widgetManager: WidgetManager, _windowManager: WindowManager) {
    this.widgetManager = _widgetManager;
    this.windowManager = _windowManager;

    this.trayIcon = null;
  }

  public async start() {
    this.widgetManager.setDefaultWidgetsDirectory(
      path.resolve(app.getAppPath(), '../widgets')
    );

    this.registerEvents();

    await this.widgetManager.loadWidgetsFromDirectory(undefined, true);
    //  this.widgetManager.getAllLoadedWidgets().forEach((w) => this.widgetManager.activateWidget(w.id));

    await this.createTrayIcon();
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

    if (manager.getMainWindow()) {
      manager.getMainWindow()?.focus();
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
    const contextMenu = this.createTrayMenu();

    this.trayIcon.setTitle('Wonders');
    this.trayIcon.setToolTip('Wonders');
    this.trayIcon.setContextMenu(contextMenu);

    this.trayIcon.on('click', () => this.createMainWindow());
    this.trayIcon.on('right-click', () => this.trayIcon?.popUpContextMenu());
  }

  private createTrayMenu() {
    let submenu: MenuItemConstructorOptions[] = [];
    this.widgetManager.getAllLoadedWidgets().forEach((lw) => {
      submenu.push({
        label: lw.name,
        type: 'checkbox',
        click: () => {
          if (this.widgetManager.getAllActiveWidgets().has(lw.id))
            this.widgetManager.deactivateWidget(lw.id);
          else this.widgetManager.activateWidget(lw.id);
        },
        checked: this.widgetManager.getAllActiveWidgets().has(lw.id),
      });
    });

    let menu = Menu.buildFromTemplate([
      {
        label: '⚙️ Settings',
        click: () => this.createMainWindow(),
        type: 'normal',
      },
      {
        label: '💾 Widgets',
        type: 'submenu',
        submenu: submenu,
      },
      {
        type: 'separator',
      },
      {
        label: '❌ Quit',
        click: () => app.quit(),
        type: 'normal',
      },
    ]);

    return menu;
  }

  private linkIpcEvents() {
    const msgs = constants.ipcMessages;

    ipcMain.answerRenderer(msgs.GET_WIDGETS, async () => {
      let arrToPush: any = [];
      for (let w of this.widgetManager.getAllLoadedWidgets().values()) {
        arrToPush.push({
          id: w.id,
          name: w.name,
          description: w.manifest.description,
          version: w.manifest.version,
          author: w.manifest.author,
          enabled: this.widgetManager.isActive(w.id)
        });
      }

      return arrToPush;
    });

    ipcMain.answerRenderer(msgs.GET_LOADED_WIDGET, async (id: any) => {
      return this.widgetManager.getAllLoadedWidgets().get(id)?.info;
    });

    ipcMain.answerRenderer(msgs.GET_ACTIVE_WIDGET, async (id: any) => {
      return this.widgetManager.getAllActiveWidgets().get(id)?.info;
    });

    ipcMain.answerRenderer(msgs.ACTIVATE_WIDGET, async (id: any) => {
      this.widgetManager.activateWidget(id);
    });

    ipcMain.answerRenderer(msgs.DEACTIVATE_WIDGET, async (id: any) => {
      this.widgetManager.deactivateWidget(id);
    });

    ipcMain.answerRenderer(msgs.CLOSE_MAIN_WINDOW, async () => {
      this.windowManager.getMainWindow()?.close();
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

    /*
    ipcMain.on(channel, (event, a) => {
      const { messageType, args } = getIpcArguments(a);
      if (!messageType)
        return;
      }

      let messageType = args.shift();
      if (!messageType) {
        console.log("No IPC message type given. Ignoring...");
      }

      console.log("RECEIVED "+messageType);

      let msgs = constants.ipcMessages;

      switch (messageType) {
        default:
          {
            console.log(`Unknown IPC message type "${messageType}"`);
          }
          break;

        case msgs.GET_WIDGETS:
          {
            let arrToPush: any = [];
            for (let w of this.widgetManager.getAllLoadedWidgets().values()) {
              arrToPush.push({
                id: w.id,
                name: w.name,
                description: w.manifest.description,
                version: w.manifest.version,
                author: w.manifest.author,
                enabled: this.widgetManager.isActive(w.id)
              });
            }

            event.reply(channel, [constants.ipcMessages.RECEIVE_WIDGETS, arrToPush]);
          }
          break;

        case msgs.GET_LOADED_WIDGET:
          {
            event.reply(channel, this.widgetManager.getAllLoadedWidgets().get(args[0]));
          }
          break;

        case msgs.GET_ACTIVE_WIDGET:
          {
            event.reply(channel, this.widgetManager.getAllActiveWidgets().get(args[0]));
          }
          break;

        case msgs.ACTIVATE_WIDGET:
          {
            this.widgetManager.activateWidget(args[0]);
          }
          break;

        case msgs.DEACTIVATE_WIDGET:
          {
            this.widgetManager.deactivateWidget(args[0]);
          }
          break

        case msgs.CLOSE_MAIN_WINDOW:
          {
            this.windowManager.getMainWindow()?.close();
          }
          break

        case msgs.MAXIMIZE_MAIN_WINDOW:
          {
            let mainWindow = this.windowManager.getMainWindow();
            if (!mainWindow?.maximizable)
              return;

            if (mainWindow.isMaximized())
              mainWindow.restore(); // Doesn't work as I expected.
            else (!mainWindow.isMaximized())
              mainWindow.maximize();
          }
          break

        case msgs.MINIMIZE_MAIN_WINDOW:
          {
            let mainWindow = this.windowManager.getMainWindow();
            if (mainWindow?.minimizable)
              mainWindow.minimize();
          }
          break
      }
    });
    */
  }

  private registerEvents() {
    app.on('window-all-closed', () => {
      // Maintain process.
    });

    app.on('activate', () => {
      if (this.windowManager.getMainWindow() === null) this.createMainWindow();
    });
  }
}
