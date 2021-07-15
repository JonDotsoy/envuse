import { getConfigStore } from "../../lib/getConfigStore";
import { EOL } from "os";
import chalk from "chalk";
import { CommandModule } from "yargs";

type n = CommandModule<
  {},
  {
    cwd: string;
  }
>;

export = <n>{
  command: "list",
  describe: "List environments",
  aliases: ["ls", "l"],
  builder: {
    cwd: {
      type: "string",
      default: process.cwd(),
    },
  },
  handler(args) {
    const { configStore } = getConfigStore(args.cwd);

    const envs = configStore.listEnvs();

    if (!envs.length) return console.log(chalk`{red No envs}`);

    console.log(
      envs.map((e) => chalk`{green ${e.type || ""}}: ${e.name}`).join(EOL)
    );
  },
};
