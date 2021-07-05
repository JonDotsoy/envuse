import { CommandModule } from "yargs";

export = <CommandModule>{
  describe: 'Added environmment origen.',
  command: 'add',
  aliases: 'a',
  builder: yargs => yargs.commandDir(`adds_cmds`).help().demandCommand(),
}