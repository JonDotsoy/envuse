#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
yargs.commandDir("cmds").demandCommand().help().argv;
