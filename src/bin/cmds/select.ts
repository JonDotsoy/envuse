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
  envfile: string;
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
    envfile: {
      type: 'string',
      default: '.env',
    }
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

    const envfiletoWrite = resolve(`${args.cwd}/${args.envfile}`);

    console.log(chalk`Writing {green ${envfiletoWrite}}`);

    writeFileSync(
      envfiletoWrite,
      [
        `# `,
        querystring.stringify({ type: env.type, name: env.name, createdAt: new Date(env.createdAt).toLocaleString() }, ', ', ': ', {
          encodeURIComponent: e => e
        }),
        EOL,
        formatingEnvConfig(Object.entries(env.config).map(([key, value]) => `${key}=${value}`).join(EOL), `${env.type} ${env.name}`),
      ].join(''),
      'utf8',
    );
  }
};
