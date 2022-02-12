import { app, BrowserWindow, Menu, shell, Tray } from 'electron';
import { getAssetPath } from '../util/index.js';
import WindowManager from './Managers/Window.js';

export class App {
    private windowManager: WindowManager = new WindowManager();

    async start() {
        await app.whenReady();
        await this.createMainWindow();
    }

    private async createMainWindow() {
        let prevMainWindow = this.windowManager.getMainWindow();

        if (prevMainWindow) {
            prevMainWindow.show();
            prevMainWindow.focus();
        }
        else {

            let mainWindow: BrowserWindow | null = this.windowManager.createMainWindow();

            this.windowManager.setMainWindow(mainWindow);

            mainWindow.loadURL(`file://${app.getAppPath()}/app/index.html`);

            mainWindow.webContents.on("did-finish-load", () => {
                if (!mainWindow) {
                    throw new Error('"mainWindow" is not defined');
                } else {
                    if (process.env.START_MINIMIZED) {
                        mainWindow.minimize();
                    } else {
                        mainWindow.show();
                        mainWindow.focus();
                    }
                }
            });

            mainWindow.on('closed', () => {
                mainWindow = null;
                this.windowManager.endMainWindow()
            })
        }
    }
}