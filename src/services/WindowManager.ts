import { app, BrowserWindow, shell } from "electron";
import windowStateKeeper from "electron-window-state";
import { injectable, singleton } from "tsyringe";


export type BrowserOptions = Electron.BrowserWindowConstructorOptions | undefined;

@injectable()
@singleton()
export class WindowManager {
	private mainWindow: BrowserWindow | null;
  private mainWindowState: windowStateKeeper.State | null;

	private widgetWindows: Map<string, BrowserWindow>;

	constructor() {
		this.mainWindow = null;
		this.mainWindowState = null;
		this.widgetWindows = new Map<string, BrowserWindow>();
	}

	public getMainWindow(): BrowserWindow | null {
		return this.mainWindow;
	}
	public setMainWindow(window: BrowserWindow): void {
		this.mainWindow = window;
	}
	public endMainWindow() {
		this.mainWindow = null;
	}

	public getMainWindowState(): windowStateKeeper.State | null {
		return this.mainWindowState;
	}
	public setMainWindowState(state: windowStateKeeper.State): void {
		this.mainWindowState = state;
	}

	public getAllWindows(): Map<string, BrowserWindow> {
		return this.widgetWindows;
	}
	public getWindow(id: string): BrowserWindow | undefined {
		return this.widgetWindows.get(id);
	}
	public endWindow(id: string): void {
		this.widgetWindows.delete(id);
	}

  public async createWindowAsync(id: string, options?: BrowserOptions): Promise<BrowserWindow> {
    await app.whenReady();

    // Override certain options.
    options = options ?? {};
    options.frame = false;
    options.skipTaskbar = true;
    options.webPreferences = {
      ...options.webPreferences,
      contextIsolation: false
    } ?? {};

    const window = new BrowserWindow(options);
    this.widgetWindows.set(id, window);

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
      this.widgetWindows.delete(id);
    });

    window.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });

    return window;
  }
}
