import { app, BrowserWindow, ipcMain, shell, Tray } from "electron";
import { delay, inject, injectable, Lifecycle, scoped } from "tsyringe";

import { App } from "./App";
import { BrowserOptions, WindowManager } from "./WindowManager";
import { WidgetManager } from "./WidgetManager";

import { Widget } from "../api/Widget";

@injectable()
@scoped(Lifecycle.ResolutionScoped)
export class WondersAPI {
  private app: Electron.App = app;
  private ipcMain: Electron.IpcMain = ipcMain;
  private shell: Electron.Shell = shell;

	private widgetManager: WidgetManager;
  private windowManager: WindowManager;

  private trayIcon: Tray | null = null;

  constructor(
    @inject(delay(() => App)) _app: App,
    @inject(delay(() => WidgetManager)) _widgetManager: WidgetManager,
    @inject(delay(() => WindowManager)) _windowManager: WindowManager
  ) {
		this.widgetManager = _widgetManager;
    this.windowManager = _windowManager;
    this.trayIcon = _app.getTrayIcon();
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

	public getTrayIcon(): Electron.Tray | null {
		return this.trayIcon;
	}

  public getLoadedWidgets(): Map<string, Widget> {
    return this.widgetManager.getAllLoadedWidgets();
  }
  public isLoaded(id: string): boolean {
    return this.widgetManager.getAllLoadedWidgets().has(id);
  }

  public getEnabledWidgets(): Map<string, Widget> {
    return this.widgetManager.getAllEnabledWidgets();
  }

  public isEnabled(id: string): boolean {
    return this.widgetManager.getAllEnabledWidgets().has(id);
  }

  public getAllRegisteredWindows(): Map<string, BrowserWindow> {
    return this.windowManager.getAllWindows();
  }

  public getRegisteredWindow(widgetId: string, windowId: string): BrowserWindow | undefined {
    return this.windowManager.getWindow(widgetId, windowId);
  }

  public removeRegisteredWindow(id: string): void {
    this.windowManager.endWindow(id);
  }

  public getWidgetsDirectory(): string {
    return this.widgetManager.getDefaultWidgetsDirectory();
  }

  public async createWidgetWindowAsync(
    widgetId: string,
    windowId: string,
    options?: BrowserOptions
  ): Promise<BrowserWindow> {
		return this.windowManager.createWindowAsync(widgetId, windowId, options);
	};
}
