import { IWidgetFormat } from "./IWidgetFormat";

export class Widget {
    private _id: string;
    private _name: string;
    private _object: IWidgetFormat;

    get id() { return this._id };
    // @ts-ignore
    set id(id: string) { };

    get name() { return this._name };
    // @ts-ignore
    set name(name: string) { };

    get object() { return this._object };
    // @ts-ignore
    set object(object: IWidgetFormat) { };

    constructor(id: string, name: string, object: IWidgetFormat) {
        this._id = id;
        this._name = name;
        this._object = object;
    }
}