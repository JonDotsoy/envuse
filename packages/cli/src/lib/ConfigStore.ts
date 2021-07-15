import fs from "fs";
import dotenv from "dotenv";
import path from "path";

interface Result extends RegExpExecArray {
  fullpath: string;
}

export default class ConfigStore {
  cwd: any;

  constructor(init: { cwd: any }) {
    this.cwd = init.cwd;
  }

  getConfigs() {
    const cwd = this.cwd;
    return fs
      .readdirSync(`${cwd}`)
      .map((fileName) => {
        const result = /^\.(?<config>.*)\.env$/i.exec(
          fileName
        ) as Result | null;
        if (result) {
          result.fullpath = path.resolve(`${cwd}/${result.input}`);
          return result;
        }
      })
      .filter(Boolean) as Result[];
  }

  find(configName: string) {
    return this.getConfigs().find(
      (e) => e.groups && e.groups.config === configName
    );
  }

  getConfig(configName: string) {
    const config = this.find(configName);

    if (config) {
      return dotenv.parse(fs.readFileSync(config.fullpath));
    }
  }

  setConfig(
    configName: string,
    newConfig: { [s: string]: string } | ArrayLike<string>
  ) {
    const buffers = Object.entries(newConfig).map(([key, value]) => {
      const newKey = key.replace(/\"|\=/gi, "");
      const newValue = value.replace(/\n/gi, "\\n");
      // const valueFormat = /\"|\n/ig.test(newValue) ? JSON.stringify(newValue): newValue;
      const valueFormat = newValue;

      return Buffer.from(`${newKey}=${valueFormat}\n`);
    });

    const buffer = Buffer.concat(buffers);

    const config = this.find(configName);
    if (config) {
      fs.writeFileSync(config.fullpath, buffer);
    }
  }
}
