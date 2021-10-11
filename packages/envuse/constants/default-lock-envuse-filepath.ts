import { file } from "../libs/file";

export const defaultLockEnvuseFilepath =
  file(process.env.ENVUSE_LOCK_FILE_PATH) ?? `${process.cwd()}/.envuse-lock`;
