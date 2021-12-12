#!/usr/bin/env node

import child_process from "child_process";
import envuse from ".";

const main = async () => {
  envuse.register();

  const [command, ...args] = process.argv.splice(2);

  if (!command) {
    throw new Error("No command specified");
  }

  child_process.spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
    shell: true,
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
