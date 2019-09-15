import yargs, { CommandModule } from "yargs";

export = <CommandModule>{
  describe: 'Heroku utils',
  command: 'heroku',
  aliases: 'h',
  builder: yargs => yargs.commandDir(`heroku_cmds`).help().demandCommand(),
}