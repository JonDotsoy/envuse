import path from 'path';
import fs from 'fs';

const mem: { [k: string]: number } = {}
const getCount = (name: string) => {
  mem[name] = (mem[name] ?? 0) + 1
  return mem[name];
}

export function takeDemoFile(ext?: string) {
  const testPath = expect.getState().testPath;
  const filedemo = `${path.dirname(testPath)}/__demo__/${path.basename(testPath)}.${getCount(testPath)}.demo${ext ?? ''}`;
  fs.mkdirSync(path.dirname(filedemo), { recursive: true });

  if (!fs.existsSync(filedemo)) {
    fs.writeFileSync(filedemo, '')
    console.log('+ file demo created')
    return Buffer.from([])
  } else {
    return fs.readFileSync(filedemo);
  }
}
