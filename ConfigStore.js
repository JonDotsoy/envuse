const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

class ConfigStore {
    constructor(init) {
        this.cwd = init.cwd;
    }

    getConfigs() {
        const cwd = this.cwd;
        return fs.readdirSync(`${cwd}`)
            .map(fileName => {
                const result = /^\.(?<config>.*)\.env$/i.exec(fileName);
                if (result) {
                    result.fullpath = path.resolve(`${cwd}/${result.input}`);
                    return result;
                }
            }).filter(Boolean);
    }

    find(configName) {
        return this.getConfigs().find(e => e.groups.config === configName);
    }

    getConfig(configName) {
        const config = this.find(configName);

        return dotenv.parse(fs.readFileSync(config.fullpath));
    }

    setConfig(configName, newConfig) {
        const buffers = Object.entries(newConfig).map(([key, value]) => {
            const newKey = key.replace(/\"|\=/ig, "");
            const newValue = value.replace(/\n/gi, '\\n');
            // const valueFormat = /\"|\n/ig.test(newValue) ? JSON.stringify(newValue): newValue;
            const valueFormat = newValue;
            
            return Buffer.from(`${newKey}=${valueFormat}\n`);
        });

        const buffer = Buffer.concat(buffers);

        const config = this.find(configName);
        fs.writeFileSync(config.fullpath, buffer);
    }
}

module.exports = ConfigStore;
