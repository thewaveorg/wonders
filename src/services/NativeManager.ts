import { injectable, singleton } from "tsyringe";

const WindowsNativeManager = require('../build/Release/wnatman.node');

@injectable()
@singleton()
export class NativeManager {
    constructor() {

    }

    public async start() {
        WindowsNativeManager.Initialize();
    }

    public handleWindow(hwnd: Buffer): void {
        WindowsNativeManager.HandleWindow(hwnd);
    }

    public releaseWindow(hwnd: Buffer): void {
        WindowsNativeManager.ReleaseWindow(hwnd);
    }
}
