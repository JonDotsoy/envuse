import yargs, { CommandModule } from "yargs";
import { readFileSync, fstat, existsSync, statSync } from "fs";
import { relative } from "path";
import dotenv from 'dotenv';
import { EOL } from "os";
import querystring from 'querystring';
import { getConfigStore } from "../getConfigStore";
import { HerokuEngine } from "../../lib/engines/HerokuEngine";
import { TypeEnvConfig } from "../../lib/EnvConfigStore";
import chalk from "chalk";

type c = CommandModule<{}, {
  cwd: string;
}>;

export = <c>{
  describe: 'Sync the currect selected environment',
  command: 'pull',
  aliases: 'p',
  builder: {
    cwd: {
      type: 'string',
      default: process.cwd(),
    },
  },
  async handler(args) {
    const { configStore, saveConfigStore } = getConfigStore(args.cwd);

    const { type, name } = configStore.getInfoCurrentEnvConfig();

    console.log(chalk`Pull config {green ${name}}`);
    await configStore.pullConfig(type, name);
    
    console.log(chalk`Select config {green ${name}}`);
    await configStore.selectConfig(type, name);
  }
}