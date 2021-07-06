import path from 'path';
import fs from 'fs';
import { range } from './range';

const charAllow = Buffer.from([
  0x5f,
  0x2d,
  ...Array.from(range(0x61, 0x7a)),
  ...Array.from(range(0x41, 0x5a)),
  ...Array.from(range(0x30, 0x39)),
]);

export function takeDemoFile(ext?: string) {
  const expectState = expect.getState();

  const testName = Buffer.from(expectState.currentTestName).map(c => charAllow.includes(c) ? c : 0x2d).toString();

  const testPath = expectState.testPath;
  const filedemo = `${path.dirname(testPath)}/__demo__/${path.basename(testPath)}--${testName}.demo${ext ?? ''}`;
  fs.mkdirSync(path.dirname(filedemo), { recursive: true });

  if (!fs.existsSync(filedemo)) {
    fs.writeFileSync(filedemo, '')
    console.log(`+ file demo created ${filedemo}`)
    return [filedemo, Buffer.from([])] as const
  } else {
    return [filedemo, fs.readFileSync(filedemo)] as const
  }
}
