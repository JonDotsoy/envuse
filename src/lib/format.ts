import { readFileSync, writeFileSync, existsSync, statSync } from "fs";
import { EOL } from "os";
import path from "path";

interface A {
  key: string;
  indexGroup: string[];
  str: string;
  line: number;
}

export async function formatFile(filepath: string) {
  if (!existsSync(filepath) || !statSync(filepath).isFile()) {
    throw new Error(`Cannot found '${path.relative(process.cwd(), filepath)}'`);
  }
  if (path.parse(filepath).ext !== '.env') {
    throw new Error(`Require a dotenv file: '${path.relative(process.cwd(), filepath)}'`);
  }

  const bodyfile = readFileSync(filepath).toString();

  const enddata = formatingEnvConfig(bodyfile, filepath);

  return writeFileSync(filepath, enddata);
}

export function formatingEnvConfig(bodyfile: string, filepath: string) {
  const configs = bodyfile.split(EOL)
    .map((str, line): A => {
      const key = str.split(/=/)[0];
      const indexGroup = key.split(/_|-/);
      return {
        key,
        indexGroup,
        str,
        line,
      };
    })
    .filter(a => !/^#|^$|^\s*#/.test(a.str))
    .reduce((previousValue, currentValue) => {
      const [param] = currentValue.indexGroup;
      const g = previousValue[param] = previousValue[param] || [];
      g.push(currentValue);
      g.sort(({ key: a }, { key: b }) => a > b ? 1 : b > a ? -1 : 0);
      return previousValue;
    }, ({} as {
      [param: string]: A[];
    }));

  const { NODE: nodeConfig = [], PORT: portConfig = [], HTTP: httpConfig = [], HTTPS: httpsConfig = [], ...otherConfigs } = configs;
  const configsLists = [
    ['NODE', nodeConfig],
    ['HTTP', [...portConfig, ...httpConfig]],
    ['HTTPS', httpsConfig],
    ...Object.entries(otherConfigs).sort(([a], [b]) => a > b ? 1 : b > a ? -1 : 0),
  ]
    .filter(([, e]) => e.length);
  const enddata = configsLists.reduce((previousValue, [_configName, _opts]) => {
    const configName = _configName as string;
    const opts = _opts as A[];
    previousValue += [
      `# ${configName}`,
      ...opts.map(a => a.str),
      EOL,
    ].join('\n');
    return previousValue;
  }, `# ${path.basename(process.cwd())}: ${path.parse(filepath).name}${EOL}`);
  return enddata;
}

// formatFile('/Users/jonathandelgadozamorano/Repositories/reigndesign/smu-unimarc-auth-service/.heroku-staging.env')
//   .then(console.log);
