import { file } from "../libs/file";

export const defaultEnvuseFilepath =
  file(process.env.ENVUSE_FILE_PATH) ?? file(`${process.cwd()}/.envuse`);
