import { createHash } from "crypto";

interface envconfig {
  config: {

  };
}

export enum TypeEnvConfig {
  heroku = 'heroku',
}

export class EnvConfig {
  type?: TypeEnvConfig;
  name: string = 'default';
  config: { [env: string]: string; } = {};
  createdAt: Date = new Date();

  static from(i: EnvConfig | object): EnvConfig {
    return Object.assign(new EnvConfig(), i);
  }
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
}

export class EnvuseConfigStore {
  private config: envuseConfigStore;

  constructor(private cwd: string, initialConfig = {} as envuseConfigStore) {
    this.config = initialConfig;
  }

  getProject(cwd: string = this.cwd) {
    this.config.projects = this.config.projects || {};
    this.config.projects[cwd] = this.config.projects[cwd] || {
      cwd,
      envs: {},
    };
    return this.config.projects[cwd];
  }

  getEnvConfig(envname: string, cwd?: string) {
    const project = this.getProject(cwd);
    project.envs = project.envs || {};
    project.envs[envname] = project.envs[envname] ? EnvConfig.from(project.envs[envname]) : new EnvConfig();
    return project.envs[envname];
  }

  setEnv(name: string, originResource: OriginResource) {
    const env = this.getEnvConfig(name);
    env.type = originResource.type;
    env.name = originResource.name;
    env.config = originResource.config;
  }

  setOriginResource(originResource: OriginResource) {
    const hash = createHash('sha512').update(`${originResource.type}-${originResource.name}`).digest('hex');
    this.setEnv(hash, originResource);
  }

  listEnvs() {
    return Object.entries(this.getProject().envs)
      .map(([id, env]) => ({
        id,
        ...env,
      }));
  }

  toJSON() {
    return this.config;
  }
}
