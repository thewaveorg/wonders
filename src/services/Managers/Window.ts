import { app, BrowserWindow, shell } from 'electron';
import { getAssetPath } from '../../util';

export default class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  public setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
    return this.getMainWindow();
  }

  public endMainWindow() {
    this?.mainWindow?.close();
    this.mainWindow = null;
  }

  public createMainWindow() {
    return new BrowserWindow({
        show: false,
        x: 0,
        y: 0,
        height: 728,
        width: 1024,
        minHeight: 700,
        minWidth: 1000,
        frame: true,
        transparent: true,
        icon: getAssetPath('icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
     });
  }
}