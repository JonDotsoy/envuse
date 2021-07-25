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
  type BodyFile = string | {
    path: string
    body: Buffer
  }

  type Body = {
    [key: string]: BodyFile
  }

  const body: Body = YAML.parse(readFileCached(filePath).toString(), {
    customTags: [
      {
        identify: (tagName: string) => tagName === "file",
        tag: "!file",
        resolve(data: any, cst: any) {
          const pathFile = path.resolve(path.dirname(filePath), cst.strValue)

          if (!fs.existsSync(pathFile)) {
            throw new Error(`File ${pathFile} not found`);
          }

          return { path: pathFile, body: fs.readFileSync(pathFile) }
        }
      }
    ]
  })

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
  const relativeDemoPath = path.relative(process.cwd(), demoPath);
  const bodyDemofile = readDemoFile(demoPath);

  const testName = `${jestExpectState.currentTestName}${sufixt ?? ''}`;
  const demo = bodyDemofile?.[testName];

  if (typeof demo === "object" && demo.path) {

    return [demo.path, demo.body, bodyDemofile] as const

  }

  // Check exists demo
  if (!demo) {
    const err = new Error(`Cannot found demo ${JSON.stringify(testName)} on file ${relativeDemoPath}. Please create it on ${relativeDemoPath}`);
    Error.captureStackTrace(err, takeDemoFile);
    throw err;
  }

  // Validate body is a string
  if (typeof demo !== "string") {
    const err = new Error(`Demo ${JSON.stringify(testName)} on file ${relativeDemoPath} must be a string.`);
    Error.captureStackTrace(err, takeDemoFile);
    throw err;
  }

  return [demoPath, Buffer.from(demo), bodyDemofile] as const
}

function escapeName(currentTestName: string) {
  return Buffer.from(currentTestName)
    .map((c) => (charAllow.includes(c) ? c : 0x2d))
    .toString();
}

