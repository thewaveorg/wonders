import { IWidgetFormat } from "./IWidgetFormat";
import { IWidgetInfo } from "./IWidgetInfo";

export class Widget {
  private _id: string;
  private _name: string;
  private _manifest: any;
  private _object: IWidgetFormat;
  public enabled?: boolean;

  get info() {
    return {
      id: this.id,
      name: this.name,
      description: this.manifest.description,
      version: this.manifest.version,
      author: this.manifest.author,
    } as IWidgetInfo;
  }


  get manifest(): any {
    return this._manifest;
  }

  get id(): string {
    return this._id;
  };
  // @ts-ignore
  set id(id: string) { };

  get name(): string {
    return this._name;
  };
  // @ts-ignore
  set name(name: string) { };

  get object(): IWidgetFormat {
    return this._object;
  };
  // @ts-ignore
  set object(object: IWidgetFormat) { };

  constructor(pluginInfo: any, object: IWidgetFormat) {
    this._id = pluginInfo.id;
    this._name = pluginInfo.name;
    this._manifest = pluginInfo;
    this._object = object;
  }
}