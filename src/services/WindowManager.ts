import { app, BrowserWindow, shell } from "electron";
import windowStateKeeper from "electron-window-state";
import { injectable, singleton } from "tsyringe";

import { NativeManager } from "./NativeManager";

export type BrowserOptions = Electron.BrowserWindowConstructorOptions | undefined;

@injectable()
@singleton()
export class WindowManager {
  private nativeManager: NativeManager;

	private mainWindow: BrowserWindow | null;
  private mainWindowState: windowStateKeeper.State | null;

	private widgetWindows: Map<string, Map<string, BrowserWindow>>;

	constructor(_nativeManager: NativeManager) {
    this.nativeManager = _nativeManager;

		this.mainWindow = null;
		this.mainWindowState = null;
		this.widgetWindows = new Map();

    // WindowsNativeManager.Initialize();
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
		let windows = new Map<string, BrowserWindow>();
    for (let w of this.widgetWindows.values())
      for (let [ id, window ] of w)
        windows.set(id, window);

    return windows;
	}

  public getAllWidgetWindows(widgetId: string): Map<string, BrowserWindow> {
    if (!this.widgetWindows.has(widgetId)) {
      this.widgetWindows.set(widgetId, new Map());
    }

    return this.widgetWindows.get(widgetId)!;
  }

	public getWindow(widgetId: string, windowId: string): BrowserWindow | undefined {
		return this.widgetWindows.get(widgetId)?.get(windowId);
	}

  public clearUnregisteredWindows(): void {
    for (let window of BrowserWindow.getAllWindows()) {
      if (![...this.getAllWindows().values()].includes(window))
        window?.close();
    }
  }

  public async createWindowAsync(widgetId: string, windowId: string, options?: BrowserOptions): Promise<BrowserWindow> {
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
    if (!this.widgetWindows.has(widgetId)) {
      this.widgetWindows.set(widgetId, new Map());
    }

    this.widgetWindows.get(widgetId)?.set(windowId, window);
    this.nativeManager.handleWindow(window.getNativeWindowHandle());

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
      this.widgetWindows.get(widgetId)?.delete(windowId);
    });

    window.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });

    return window;
  }
}
