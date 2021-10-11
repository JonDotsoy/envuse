import fs from "fs";

// ensure filepath is a file or return null

export const file = (filepath?: string) => {
  if (filepath && fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
    return filepath;
  }
  return null;
};
