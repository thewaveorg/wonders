import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from "electron";
import windowStateKeeper from "electron-window-state";
import path from "path";
import { injectable, singleton } from "tsyringe";

import { WidgetManager } from "./WidgetManager";
import { WindowManager } from "./WindowManager";

import constants from "../util/constants";

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

	public start() {
		this.widgetManager.setDefaultWidgetsDirectory(path.resolve(__dirname, '../widgets'));

    this.linkIpcEvents();
    this.registerEvents();
    this.createTrayIcon();

		this.widgetManager.loadWidgetsFromDirectory();
	}

	public getTrayIcon(): Tray | null {
		return this.trayIcon;
	}

  private async createMainWindow() {
		await app.whenReady();

		const manager = this.windowManager;

    const RESOURCES_PATH = app.isPackaged ?
      path.join(process.resourcesPath, 'assets') :
      path.join(__dirname, '../assets');

    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths);
    };

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
			icon: getAssetPath('icon.png'),
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

    windowState.manage(mainWindow);
  }

  private async createTrayIcon() {
    await app.whenReady();

    this.trayIcon = new Tray(path.resolve(__dirname, "../assets/icon.ico"));
    const contextMenu = Menu.buildFromTemplate([{
        label: "⚙️ Open Settings",
        click: () => this.createMainWindow(),
        type: "normal"
      },
      {
        type: "separator"
      },
      {
        label: "❌ Quit",
        click: () => app.quit(),
        type: "normal"
      }
    ]);

    this.trayIcon.setTitle("Wonders");
    this.trayIcon.setToolTip("Wonders");
    this.trayIcon.setContextMenu(contextMenu);

    this.trayIcon.on("click", () => this.createMainWindow());
    this.trayIcon.on("right-click", () => this.trayIcon?.popUpContextMenu());
  }

  private linkIpcEvents() {
		const mainWindow = this.windowManager.getMainWindow();

    ipcMain.on(constants.GET_WIDGETS, (event) => {
      event.reply(constants.RECEIVE_WIDGETS, []);
    });

    ipcMain.on(constants.CLOSE_MAIN_WINDOW, () => {
      mainWindow?.close();
    });

    ipcMain.on(constants.MAXIMIZE_MAIN_WINDOW, () => {
      if (!mainWindow?.maximizable)
        return;

      if (mainWindow.isMaximized())
        mainWindow.restore();

      if (!mainWindow.isMaximized())
        mainWindow.maximize();
    });

    ipcMain.on(constants.MINIMIZE_MAIN_WINDOW, () => {
      if (mainWindow?.minimizable)
        mainWindow.minimize();
    });
  }

  private registerEvents() {
    app.on('window-all-closed', () => {
      // Maintain process.
    });

    app.on('activate', () => {
      if (this.windowManager.getMainWindow() === null)
        this.createMainWindow();
    });
  }
}