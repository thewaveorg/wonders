import fs, { readdirSync } from "fs";
import path from "path";
import { container, injectable, singleton } from "tsyringe";

import { WondersAPI } from "./WondersAPI";
import { NativeManager } from "./NativeManager";
import { WindowManager } from "./WindowManager";

import { Widget } from "../api/Widget";
import { IWidgetInfo } from "../api/IWidgetInfo";

import { validateWondersJson } from "../utils/validateWondersJson";
import { validateWidgetExport } from "../utils/validateWidgetExport";


@injectable()
@singleton()
export class WidgetManager {
  private nativeManager: NativeManager;
  private windowManager: WindowManager;

  private enabledWidgets: Map<string, Widget>;
  private loadedWidgets: Map<string, Widget>;
  private widgetsDirectory: string;

	constructor(_nativeManager: NativeManager, _windowManager: WindowManager) {
    this.nativeManager = _nativeManager;
    this.windowManager = _windowManager;

    this.enabledWidgets = new Map();
		this.loadedWidgets = new Map();
		this.widgetsDirectory  = "";
	}

  public isEnabled(id: string): boolean {
    return this.enabledWidgets.has(id);
  }

	public getAllEnabledWidgets(): Map<string, Widget> {
		return this.enabledWidgets;
	}

  public getAllLoadedWidgets(): Map<string, Widget> {
    return this.loadedWidgets;
  }

	public getDefaultWidgetsDirectory() {
		return this.widgetsDirectory;
	};
	public setDefaultWidgetsDirectory(p: string) {
    if (!fs.existsSync(p)) {
      console.log("Provided widgets directory doesn't exist.");
      return;
    }
		this.widgetsDirectory = p;
	};

	public async loadWidgetsFromDirectory(dir?: string, enable: boolean = false): Promise<void> {
    dir = dir || this.widgetsDirectory;

    const widgetFolders: string[] = readdirSync(dir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() || dirent.isSymbolicLink())
      .map((folder) => path.resolve(dir!, folder.name));

    for await (const wpath of widgetFolders) {
      await this.loadWidget(wpath, enable);
    }
  }

  private hashID(name: string): number {
    var hash = 0, i, chr, len;
    if(name.length === 0) return hash;
    for(i = 0, len = name.length; i < len; i++) {
      chr = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }

  /**
   * Load a widget
   * @param p Path to wonder widget
   * @returns Promise<IWidget|null> A promise that resolves to the Widget object.
   */
  public async loadWidget(p: string, enable: boolean = false): Promise<Widget | null> {
    let widgetInfo: IWidgetInfo;
    try {
      let manifestPath = path.resolve(p, './wonders.json');

      delete require.cache[require.resolve(manifestPath)];
      widgetInfo = require(path.resolve(manifestPath));

      let check = validateWondersJson(widgetInfo);
      if (check !== true)
      {
        console.log(check);
        return null;
      }

      widgetInfo.id = this.hashID(widgetInfo.name).toString();
    } catch {
      console.log(`Found no wonders.json at ${p}. Ignoring...`);
      return null;
    }

    if (!widgetInfo) {
      console.log(`Failed to read wonders.json.`);
      return null;
    }
    if (this.loadedWidgets.has(widgetInfo.id))
    {
      console.log(`Widget ${widgetInfo.name} at ${p} has the same ID as another widget. Ignoring...`);
      return null;
    }

    let entryPath = path.resolve(p, widgetInfo.entry!);
    delete require.cache[require.resolve(entryPath)];
    const imported = require(path.resolve(p, widgetInfo.entry!));

    let check = validateWidgetExport(imported);
    if (check !== true) {
      console.log(check);
      return null;
    }

    var scopedApi = container.resolve(WondersAPI);
    const widgetObject = imported(scopedApi, widgetInfo.id);
    const widget = new Widget(widgetInfo, widgetObject);

    this.loadedWidgets.set(widgetInfo.id, widget);

    if (enable)
      await this.enableWidget(widgetInfo.id);

    console.log(`[WONDERS] \x1b[32mLoaded widget ${widgetInfo.name} (${widgetInfo.version}) by ${widgetInfo.author}\x1b[39m`);

    return widget;
  }

  /**
   * Unload a widget
   * @param id ID of wonder widget
   */
  public async unloadWidget(id: string): Promise<boolean> {
    const widget = this.loadedWidgets.get(id);
    if (!widget)
      return false;

    await this.disableWidget(id);
    this.loadedWidgets.delete(id);

    return true;
  }

  public async unloadAllWidgets(): Promise<void> {
    for (let [ id, _ ] of this.loadedWidgets) {
      await this.disableWidget(id);
      this.loadedWidgets.delete(id);
    }
  }

  public async enableWidget(id: string): Promise<boolean> {
    const widget = this.loadedWidgets.get(id);
    if (!widget)
      return false;

    if (!widget.object?.start)
      return false;

    await widget.object?.start();
    this.enabledWidgets.set(id, widget!);

    return true;
  }

  public async enableAllWidgets(): Promise<boolean> {
    for (let widget of this.loadedWidgets.values())
      if (!this.isEnabled(widget.id))
        await this.enableWidget(widget.id);

    return true;
  }

  public async disableWidget(id: string): Promise<boolean> {
    const widget = this.enabledWidgets.get(id);
    if (!widget)
      return true;

    await widget.object?.stop?.();

    for (let window of this.windowManager.getAllWidgetWindows(id).values()) {
      this.nativeManager.releaseWindow(window.getNativeWindowHandle());
      window.close();
    }

    this.enabledWidgets.delete(id);

    return true;
  }

  public async disableAllWidgets(): Promise<boolean> {
    for (let widget of this.loadedWidgets.values())
      if (this.isEnabled(widget.id))
        await this.disableWidget(widget.id);

    return true;
  }
}
