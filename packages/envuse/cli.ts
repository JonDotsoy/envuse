#!/usr/bin/env node

import { Cli } from "./libs/cli";
import { RunCmd } from "./libs/cli_cmds/run.cmd";

const cli = new Cli();

cli.use(new RunCmd());
