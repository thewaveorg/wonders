import fs, { readdirSync } from "fs";
import path from "path";
import { delay, inject, injectable, singleton } from "tsyringe";

import { WondersAPI } from "./WondersAPI";

import { Widget } from "../api/Widget";
import { Console } from "console";

@injectable()
@singleton()
export class WidgetManager {
	private wondersApi: WondersAPI;

  private activeWidgets: Map<string, Widget>;
  private loadedWidgets: Map<string, Widget>;
  private widgetsDirectory: string;

	constructor(@inject(delay(() => WondersAPI)) _wondersApi: WondersAPI) {
		this.wondersApi = _wondersApi;

    this.activeWidgets = new Map();
		this.loadedWidgets = new Map();
		this.widgetsDirectory  = "";
	}

	public getAllActiveWidgets(): Map<string, Widget> {
		return this.activeWidgets;
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

	public async loadWidgetsFromDirectory(dir?: string, activate: boolean = false): Promise<void> {
    dir = dir || this.widgetsDirectory;

    const widgetFolders: string[] = readdirSync(dir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() || dirent.isSymbolicLink())
      .map((folder) => path.resolve(dir!, folder.name));

    for await (const wpath of widgetFolders) {
      await this.loadWidget(wpath, activate);
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
   * @returns Promise<IWidget|null> A promise that resolves to the IWidget object.
   */
  public async loadWidget(p: string, activate: boolean = false): Promise<Widget | null> {
    let pluginInfo;
    try {
      pluginInfo = require(path.resolve(p, './wonders.json'));
      pluginInfo.id = this.hashID(pluginInfo.name);
    } catch {
      console.log(`Found no wonders.json at ${p}. Ignoring...`);
      return null;
    }

    if (!pluginInfo) {
      console.log(`Failed to read wonders.json.`);
      return null;
    }
    if (this.loadedWidgets.has(pluginInfo.id))
    {
      console.log(`Plugin ${pluginInfo.name} at ${p} has the same ID as another plugin. Ignoring...`);
      return null;
    }

    const imported = require(path.resolve(p, pluginInfo.entry));

    const widgetObjectFactory: any =
      typeof imported === 'function' ? imported : imported.WONDERS;

    if (typeof widgetObjectFactory !== 'function') {
      console.log("Widget doesn't have any entry point for Wonders.");
      return null;
    }

    const widgetObject = widgetObjectFactory(this.wondersApi);

    const widget = new Widget(pluginInfo.id, pluginInfo.name, widgetObject);

    this.loadedWidgets.set(pluginInfo.id, widget);

    if (activate)
      this.activateWidget(pluginInfo.id);

    return widget;
  }

  /**
   * Unload a widget
   * @param id ID of wonder widget
   */
  public async unloadWidget(id: string): Promise<void> {
    const widget = this.loadedWidgets.get(id);
    if (!widget)
      return;

    this.deactivateWidget(id);
    this.loadedWidgets.delete(id);
  }

  public async activateWidget(id: string): Promise<void> {
    const widget = this.loadedWidgets.get(id);
    if (!widget)
      return;

    await widget?.object.start();
    this.activeWidgets.set(id, widget!);
  }

  public async deactivateWidget(id: string): Promise<void> {
    const widget = this.activeWidgets.get(id);
    if (!widget)
      return;

    widget?.object.stop();
    this.activeWidgets.delete(id);
  }
}
