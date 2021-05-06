import 'core-js/stable';
import 'regenerator-runtime/runtime';

import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
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
	}

	public async createAndRegisterWindowAsync(id: string, options: BrowserOptions | undefined): Promise<BrowserWindow> {
		await app.whenReady();
		var window = new BrowserWindow(options);
		this.windows.set(id, window);
		return window;
	}

	public async loadWidget(p: string): Promise<void> {
		var pluginInfo;
		try {
			pluginInfo = require(path.resolve(p, "./package.json"));
		} catch {
			console.log(`Found no wonders.json at ${p}. Ignoring...`);
			return;
		}

		if (!pluginInfo)
		{
			console.log(`Failed to read package.json.`);
			return;
		}
		var imported = require(p);

		var widgetObjectFactory: any = (typeof(imported) == "function") ? imported : imported["WONDERS"];
		
		if (typeof(widgetObjectFactory) != "function")
		{
			console.log("Widget doesn't have any start point for Wonders.");
			return;
		}

		var widgetObject = widgetObjectFactory(this);
		this.widgets.set(pluginInfo.name, widgetObject);
		widgetObject.start();
	}

	public async unloadWidget(name: string): Promise<void> {
		var widget = this.widgets.get(name);
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
		
		this.mainWindow.loadURL(`file://${__dirname}/index.html`);

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

	private registerEvents() {
		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
			  	app.quit();
			}
		});
		  
		app.whenReady()
			.then(this.createMainWindow)
			.catch(console.log);

		app.on('activate', () => {
			if (this.mainWindow === null)
				this.createMainWindow();
		});
	}
}

export default new WondersAPI();