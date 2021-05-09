import { IWidgetFormat } from "./IWidgetFormat";

// export class Widget {
//     private _id: string;
//     private _name: string;
//     private _manifest: any;
//     private _object: IWidgetFormat;

    // get manifest() { return this._manifest }

    // get id() { return this._id };
    // // @ts-ignore
    // set id(id: string) { };

    // get name() { return this._name };
    // // @ts-ignore
    // set name(name: string) { };

    // get object() { return this._object };
    // // @ts-ignore
    // set object(object: IWidgetFormat) { };

//     constructor(id: string, name: string, object: IWidgetFormat) {
//         this._id = id;
//         this._name = name;
//         this._object = object;
//     }
// }

export class Widget {
  private _id: string;
  private _name: string;
  private _manifest: any;
  private _object: IWidgetFormat;

  get manifest() { return this._manifest }

  get id() { return this._id };
  // @ts-ignore
  set id(id: string) { };

  get name() { return this._name };
  // @ts-ignore
  set name(name: string) { };

  get object() { return this._object };
  // @ts-ignore
  set object(object: IWidgetFormat) { };

  constructor(pluginInfo: any, object: IWidgetFormat) {
    this._id = pluginInfo.id;
    this._name = pluginInfo.name;
    this._manifest = pluginInfo;
    this._object = object;
  }
}
