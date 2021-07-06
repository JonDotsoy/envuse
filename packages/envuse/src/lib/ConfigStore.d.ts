import dotenv from 'dotenv';
interface Result extends RegExpExecArray {
    fullpath: string;
}
export default class ConfigStore {
    cwd: any;
    constructor(init: {
        cwd: any;
    });
    getConfigs(): Result[];
    find(configName: string): Result | undefined;
    getConfig(configName: string): dotenv.DotenvParseOutput | undefined;
    setConfig(configName: string, newConfig: {
        [s: string]: string;
    } | ArrayLike<string>): void;
}
export {};
