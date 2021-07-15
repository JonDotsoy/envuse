#!/usr/bin/env node

import yargs = require("yargs");

yargs.commandDir(`cmds`).demandCommand().help().argv;
