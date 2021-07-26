


export const singleFormt = (value: Buffer) => {
  const str = value.toString('utf8');
  const elms: any[] = []

  const fMain = () => {
    const e = /^\s*\#\;.*$/m.exec(str)
    if (e) {
      const elm = {
        type: 'BlockCommentOperator',
        loc: e.index,
      }

      elms.push(elm)
    }
  }

  fMain()

  return {
    type: "main",
    loc: 0,
    elms,
  }
}
