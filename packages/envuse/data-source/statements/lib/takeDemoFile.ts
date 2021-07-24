import path from "path";
import fs from "fs";
import { range } from "./range";
import YAML from "yaml"

const getState = () => {
  const state = expect.getState()
  const demoPath = `${path.dirname(state.testPath)}/__demo__/${path.basename(state.testPath)}.yaml`;

  return {
    demoPath,
    jestExpectState: state,
  }
}

// const once = <T>(fn: () => T, cache?: T) => () => (cache = cache ?? fn(), cache)

const readFileCached = (() => {
  const cache = new Map<string, () => Buffer>();

  return (pathFile: string) => {
    const cached = cache.get(pathFile);

    if (cached) {
      return cached();
    }

    // Check file exists
    if (!fs.existsSync(pathFile)) {
      const initialBuff = Buffer.from([]);
      fs.writeFileSync(pathFile, initialBuff);
      // Log file correctly created
      console.log(`File ${pathFile} created`);
      return initialBuff
    }

    const file = fs.readFileSync(pathFile);
    cache.set(pathFile, () => file);

    return file;
  }
})();

const readDemoFile = (filePath: string) => {
  const body = YAML.parse(readFileCached(filePath).toString())

  return body
}


const charAllow = Buffer.from([
  0x5f,
  0x2d,
  ...Array.from(range(0x61, 0x7a)),
  ...Array.from(range(0x41, 0x5a)),
  ...Array.from(range(0x30, 0x39)),
]);

export function takeDemoFile(sufixt?: string) {
  const { demoPath, jestExpectState } = getState();
  const bodyDemofile = readDemoFile(demoPath);

  const testName = `${jestExpectState.currentTestName}${sufixt ?? ''}`;
  const body = bodyDemofile?.[testName];

  // Check exists body
  if (!body) {
    const err = new Error(`No demo file for ${JSON.stringify(testName)}`);
    Error.captureStackTrace(err, takeDemoFile);
    throw err;
  }

  // Validate body is a string
  if (typeof body !== "string") {
    const err = new Error(`Demo file for ${JSON.stringify(testName)} is not a string`);
    Error.captureStackTrace(err, takeDemoFile);
    throw err;
  }

  return [demoPath, Buffer.from(body), bodyDemofile] as const
}

function escapeName(currentTestName: string) {
  return Buffer.from(currentTestName)
    .map((c) => (charAllow.includes(c) ? c : 0x2d))
    .toString();
}

