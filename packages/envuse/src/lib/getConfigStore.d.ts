import { EnvuseConfigStore as EnvuseConfigStore } from './EnvConfigStore';
export declare const getConfigStore: (cwd: string) => {
    pathconfig: string;
    configStore: EnvuseConfigStore;
    saveConfigStore: () => void;
};
