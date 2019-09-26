import { CommandModule } from "yargs";
import inquirer = require("inquirer");
import { getConfigStore } from "../getConfigStore";
import { resolve } from "path";
import chalk from "chalk";
import { writeFileSync } from "fs";
import { EOL } from "os";
import { formatingEnvConfig } from "../../lib/format";
import querystring from 'querystring';

type c = CommandModule<{}, {
  cwd: string;
}>;

export = <c>{
  command: 'select',
  describe: 'select a env to use',
  aliases: 's',
  builder: {
    cwd: {
      type: 'string',
      default: process.cwd(),
    },
  },
  async handler(args) {
    const { configStore } = getConfigStore(args.cwd);

    const answers = await inquirer.prompt({
      name: 'envSelected',
      type: 'list',
      choices: Object.entries(configStore.listEnvs()).map(([, env]) => ({
        key: env.id,
        name: env.name,
        value: env.id,
      })),
    });

    const env = configStore.getEnvConfig(answers.envSelected);

    configStore.selectConfig(env.type, env.name);
  }
};
