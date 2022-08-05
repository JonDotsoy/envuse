export const lines = (
  template: { raw: readonly string[] | ArrayLike<string> },
  ...substitutions: any[]
) => {
  const l = String.raw(template, ...substitutions);

  const a = /^\n(\s+)/.exec(l);

  if (!a) return l;

  const b = l
    .replace(/^\n/, "")
    .replace(/\n\s+$/, "")
    .split("\n");

  let out = ``;

  for (const line of b) {
    if (line === "") {
      out += `\n`;
      continue;
    }
    if (!line.startsWith(a[1])) {
      const err = new TypeError(`Unexpected token`);
      Error.captureStackTrace(err, lines);
      throw err;
    }
    out += `${line.substring(a[0].length - 1)}\n`;
  }

  return out;
};
