import { CommandModule } from "yargs";
import chalk from "chalk";
import inquirer from "inquirer";
import ow from "ow";
import { getConfigStore } from "../../../lib/getConfigStore";
import { LocalEngine } from "../../../lib/engines/LocalEngine";
import { TypeEnvConfig } from "../../../lib/EnvConfigStore";

type c = CommandModule<
  {},
  {
    cwd: string;
    fileEnv: string;
  }
>;

export = <c>{
  command: "local <fileEnv>",
  describe: "Added ennviroment from heroku",
  builder: {
    cwd: {
      type: "string",
      default: process.cwd(),
    },
    fileEnv: {
      type: "string",
      required: true,
    },
  },
  async handler(args) {
    const { configStore, saveConfigStore } = getConfigStore(args.cwd);
    const local = new LocalEngine();

    const resource = await local.insert(configStore, args.fileEnv);

    console.log(chalk`env local {green ${args.fileEnv}} added ☑`);

    saveConfigStore();

    configStore.defaultSelect(TypeEnvConfig.local, resource.name);
  },
};
