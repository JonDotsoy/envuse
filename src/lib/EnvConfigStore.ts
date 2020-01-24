import { createHash } from "crypto";
import { existsSync, statSync, readFileSync, writeFileSync, fstat } from "fs";
import { EOL } from "os";
import querystring from 'querystring';
import { HerokuEngine } from "./engines/HerokuEngine";
import { formatingEnvConfig } from "./format";
import JSON5 from 'json5';
import { LocalEngine } from "./engines/LocalEngine";
import dotenv from 'dotenv';

interface envconfig {
  config: {

  };
}

export enum TypeEnvConfig {
  heroku = 'heroku',
  local = 'local',
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
  [attr: string]: any;
}

export class EnvuseConfigStore {
  private config: envuseConfigStore;

  constructor(private cwd: string, initialConfig = {} as envuseConfigStore) {
    this.config = initialConfig;
  }

  async pullConfig(type: TypeEnvConfig, name: string) {
    if (type === TypeEnvConfig.heroku) {
      const heroku = new HerokuEngine();
      await heroku.insert(this, name);
    }
    if (type === TypeEnvConfig.local) {
      const local = new LocalEngine();
      await local.insert(this, name);
    }
  }

  async defaultSelect(type: TypeEnvConfig | undefined, name: string) {
    const envpath = `${process.cwd()}/.env`;
    if (!existsSync(envpath)) {
      this.selectConfig(type, name);
    }
  }

  async selectConfig(type: TypeEnvConfig | undefined, name: string) {
    const envFileRemplaceForced = `${process.cwd()}/.env-replace`;
    let configToReplace = {};

    if (existsSync(envFileRemplaceForced) && statSync(envFileRemplaceForced).isFile()) {
      console.warn(`Warning: the use of .env-replace is experimental.`);
      configToReplace = dotenv.parse(readFileSync(envFileRemplaceForced, 'utf8'), { debug: true });
    }

    const envpath = `${process.cwd()}/.env`;
    const envs = this.listEnvs();

    const env = envs.find(env => env.name === name && env.type === type);

    console.log(type, name);

    if (!env) {
      throw new Error(`Not found config ${type} ${name}`);
    }

    const headersFile = querystring.stringify({ type: env.type, name: env.name, createdAt: new Date(env.createdAt).toLocaleString() }, ', ', ': ', {
      encodeURIComponent: e => e
    });

    const envConfig = { ...env.config, ...configToReplace };
    writeFileSync(
      envpath,
      [
        `# `, headersFile, EOL,
        formatingEnvConfig(Object.entries(envConfig).map(([key, value]) => `${key}=${JSON5.stringify(value)}`).join(EOL), `${env.type} ${env.name}`),
      ].join(''),
      'utf8',
    );
  }

  getInfoCurrentEnvConfig() {
    const envpath = `${process.cwd()}/.env`;

    if (!existsSync(envpath) || !statSync(envpath).isFile()) {
      throw new Error(`Cannot found .env file`);
    }

    const body = readFileSync(envpath, 'utf8');

    const [linetype] = body.split(EOL).filter(e => e.startsWith('# type:'));

    if (!linetype) {
      throw new Error(`It is not recognized as a valid file`);
    }

    const { type, name } = querystring.parse(linetype.replace('# ', ''), ', ', ': ') as { type: TypeEnvConfig, name: string };

    if (!type || !name) {
      throw new Error(`It is not recognized as a valid file`);
    }

    return {
      envpath,
      body,
      type,
      name,
    };
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

  removeEnv(id: string) {
    const { [id]: envRemoved, ...nextEnvs } = this.getProject().envs;

    this.getProject().envs = nextEnvs;
    return envRemoved;
  }

  toJSON() {
    return this.config;
  }
}
