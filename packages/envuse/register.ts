import fs from 'fs'
import { Envuse } from './src/lib/envuse-file/envuse-source';

// ensure filepath is a file or return null
const f = (filepath?: string) => {
  if (filepath && fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
    return filepath
  }
  return null
}

const filepath = f(process.env.ENVUSE_PATH) ?? f(`${process.cwd()}/.envuse`);


const register = () => {
  if (filepath) {
    const { parsed } = Envuse.parseFile(filepath, process.env)

    for (const key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        process.env[key] = parsed[key]
      }
    }
  }
}

register()
