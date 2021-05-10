import { injectable, singleton } from "tsyringe";
import fs from "fs";

@injectable()
@singleton()
export class SettingsManager {
  constructor() {

  }

  public initSettings(name: string, settings: any) {
    if(fs.existsSync(`./src/settings/${name}.json`)) {
      throw new Error(`File ${name} already exists!`)
    } else {
      // create file but im not gonna do the rest of this because im tired and im going to bed goodbye.
    }
  }
}
