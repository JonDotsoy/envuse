import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { homedir } from 'os';
import { EnvuseConfigStore as EnvuseConfigStore } from '../lib/EnvConfigStore';

// async function copyFileEnv(args: { editor: any; CONFIGFILE: any; }) {
//     if (args.editor) {
//         return require('../editor/server');
//     }
//     const cwd = process.cwd();
//     const configStore = new ConfigStore({
//         cwd,
//     });
//     const files = configStore.getConfigs();
//     const outEnvFile = path.resolve(`${cwd}/.env`);
//     if (files.length === 0) {
//         return console.log(`No found configs`);
//     }
//     // console.log(files)
//     console.log(`# ${cwd}`);
//     const configs = files.map(e => (e.groups && e.groups.config)) as string[];
//     const configSelected = args.CONFIGFILE ? args.CONFIGFILE : await loadTheConfigSelected(configs);
//     const config = loadConfigFiles(files, configSelected);
//     console.log(`# copy ${config.fullpath} to`)
//     console.log(`# ${outEnvFile}`)
//     fs.writeFileSync(outEnvFile,
//         Buffer.concat([
//             Buffer.from(`# Copy from ${config.fullpath}\n`, 'utf8'),
//             fs.readFileSync(config.fullpath),
//         ])
//     );
// }
// async function loadTheConfigSelected(configs: string[]) {
//     // @ts-ignore
//     const cav = await inquirer.prompt({
//         type: 'autocomplete',
//         message: 'Select config',
//         name: 'configSelected',
//         source: async (_: any, _input: any) => {
//             return configs;
//         },
//     });
//     const configSelected = cav.configSelected;
//     return configSelected;
// }
// function loadConfigFiles(files: any[], configSelected: string) {
//     const configFound = files.find((f: { groups: { config: any; }; }) => f.groups.config === configSelected);
//     if (!configFound) {
//         throw new Error(chalk`Config {blue ${configSelected}} is not found`);
//     }
//     return configFound;
// }

export const getConfigStore = (cwd: string) => {
    const pathconfig = resolve(homedir(), '.envuse');
    const bodyConfig = existsSync(pathconfig) ? JSON.parse(readFileSync(pathconfig, 'utf8')) : {};
    const configStore = new EnvuseConfigStore(cwd, bodyConfig);
    return {
        pathconfig,
        configStore,
        saveConfigStore: () => writeFileSync(pathconfig, JSON.stringify(configStore.toJSON(), null, 2)),
    };
};
