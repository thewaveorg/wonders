import fs, { fstat, readdirSync } from "fs";
import path from "path";
import { delay, inject, injectable, singleton } from "tsyringe";

import { WondersAPI } from "./WondersAPI";

import { IWidget } from "../api/IWidget";

@injectable()
@singleton()
export class WidgetManager {
	private wondersApi: WondersAPI;

  private widgets: Map<string, IWidget>;
  private widgetsDirectory: string;
	
	constructor(@inject(delay(() => WondersAPI)) _wondersApi: WondersAPI) {
		this.wondersApi = _wondersApi;

		this.widgets = new Map();
		this.widgetsDirectory  = "";
	}

	public getAllActiveWidgets(): Map<string, IWidget> {
		return this.widgets;
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

	public async loadWidgetsFromDirectory(dir?: string): Promise<void> {
    dir = dir || this.widgetsDirectory;

    const widgetFolders: string[] = readdirSync(dir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() || dirent.isSymbolicLink())
      .map((folder) => path.resolve(dir!, folder.name));

    for await (const wpath of widgetFolders) {
      await this.loadWidget(wpath);
    }
  }

  /**
   * Load a widget
   * @param p Path to wonder widget
   */
  public async loadWidget(p: string): Promise<void> {
    let pluginInfo;
    try {
      pluginInfo = require(path.resolve(p, './wonders.json'));
    } catch {
      console.log(`Found no wonders.json at ${p}. Ignoring...`);
      return;
    }

    if (!pluginInfo) {
      console.log(`Failed to read wonders.json.`);
      return;
    }
    const imported = require(path.resolve(p, pluginInfo.entry));

    const widgetObjectFactory: any =
      typeof imported === 'function' ? imported : imported.WONDERS;

    if (typeof widgetObjectFactory !== 'function') {
      console.log("Widget doesn't have any entry point for Wonders.");
      return;
    }

    const widgetObject = widgetObjectFactory(this.wondersApi);
    this.widgets.set(pluginInfo.name, widgetObject);
    widgetObject.start();
  }

  /**
   * Unload a widget
   * @param name Name of wonder widget
   */
  public async unloadWidget(name: string): Promise<void> {
    const widget = this.widgets.get(name);
    widget?.stop();
    this.widgets.delete(name);
    delete require.cache[name];
  }
}
