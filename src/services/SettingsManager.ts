import { injectable, singleton } from 'tsyringe';
import fs from 'fs';
import lodash from 'lodash';
@injectable()
@singleton()
export class SettingsManager {
  currentSettings: Map<string, object>;
  constructor() {
    this.currentSettings = new Map();
  }

  public async start() {
    await fs.readdir('./src/settings', (err, files) => {
      if (err) throw new Error(err);
      files.forEach(async (file) => {
        if (file === '.exists') return;
        var { default: fileContent }: any = await import(`../settings/${file}`);
        this.currentSettings.set(file.split('.')[0], fileContent);
      });
    });
  }

  get cache() {
    return this.currentSettings;
  }

  public initSettings(name: string, settings: any) {
    if (fs.existsSync(`./src/settings/${name}.json`)) {
      console.log('File already exists');
    } else {
      fs.writeFile(
        `./src/settings/${name}.json`,
        JSON.stringify(settings),
        (e: any) => {
          if (e) console.log('An error occured creating settings', e);
        }
      );
    }
  }

  public fetchSettings(name: string) {
    if (!this.currentSettings.has(name))
      return console.log('No setting exists');
    return this.currentSettings.get(name);
  }

  public updateSetting(name: string, settings: any) {
    if (!this.currentSettings.has(name))
      return console.log(`Setting ${name} does not exist`);
    var obj = this.currentSettings.get(name);
    var newObj = lodash.merge(obj, settings);
    this.currentSettings.set(name, newObj);
    fs.writeFile(
      `./src/settings/${name}.json`,
      JSON.stringify(newObj),
      (e: any) => {
        if (e) console.error(e);
      }
    );
  }
}
