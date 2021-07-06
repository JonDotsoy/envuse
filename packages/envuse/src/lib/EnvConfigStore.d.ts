export declare enum TypeEnvConfig {
    heroku = "heroku",
    local = "local"
}
export declare class EnvConfig {
    type?: TypeEnvConfig;
    name: string;
    config: {
        [env: string]: string;
    };
    createdAt: Date;
    static from(i: EnvConfig | object): EnvConfig;
}
interface envuseConfigStore {
    projects: {
        [cwd: string]: {
            cwd: string;
            envs: {
                [envname: string]: EnvConfig;
            };
        };
    };
}
interface OriginResource {
    name: string;
    type: TypeEnvConfig;
    config: {
        [env: string]: string;
    };
    [attr: string]: any;
}
export declare class EnvuseConfigStore {
    private cwd;
    private config;
    constructor(cwd: string, initialConfig?: envuseConfigStore);
    pullConfig(type: TypeEnvConfig, name: string): Promise<void>;
    defaultSelect(type: TypeEnvConfig | undefined, name: string): Promise<void>;
    selectConfig(type: TypeEnvConfig | undefined, name: string): Promise<void>;
    getInfoCurrentEnvConfig(): {
        envpath: string;
        body: string;
        type: TypeEnvConfig;
        name: string;
    };
    getProject(cwd?: string): {
        cwd: string;
        envs: {
            [envname: string]: EnvConfig;
        };
    };
    getEnvConfig(envname: string, cwd?: string): EnvConfig;
    setEnv(name: string, originResource: OriginResource): void;
    setOriginResource(originResource: OriginResource): void;
    listEnvs(): {
        type?: TypeEnvConfig | undefined;
        name: string;
        config: {
            [env: string]: string;
        };
        createdAt: Date;
        id: string;
    }[];
    removeEnv(id: string): EnvConfig;
    toJSON(): envuseConfigStore;
}
export {};
