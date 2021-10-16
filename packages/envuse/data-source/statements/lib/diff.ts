import { Base } from "../components/base";
import { Block } from "../components/block";
import { CommentOperator } from "../components/comment-operator";
import { Variable } from "../components/variable";
import util from "util";

class TableOfDiff {
  table = new Map<symbol, (Base | undefined)[]>();

  append(colNum: number, key: symbol, element: Base) {
    const dt = this.table.get(key) ?? [];

    dt[colNum] = element;

    this.table.set(key, dt);
  }
}

const keySymbol = Symbol();

type MapSymbols = {
  [keySymbol]?: symbol;
  [k: string]: MapSymbols | undefined;
};

class KeySymbolMemory {
  private memorySymbols: MapSymbols = {};

  arrToSymbol(k: (string | number)[]) {
    let selected = this.memorySymbols;

    k.forEach((k) => {
      const keyChildren = k;

      const tmpSelected = selected[keyChildren];

      if (tmpSelected) {
        selected = tmpSelected;
      } else {
        const newChildren = {};
        selected[keyChildren] = newChildren;
        selected = newChildren;
      }
    });

    const symbolFound = selected[keySymbol];

    if (symbolFound) return symbolFound;

    const newSymbol = Symbol(util.inspect(k));
    selected[keySymbol] = newSymbol;
    return newSymbol;
  }
}

class KeyGenerator {
  map = new Map<symbol, number>();

  constructor(private keySymbolMemory: KeySymbolMemory) {}

  match(element: Base) {
    const baseKey = [element.$type, elementToKey(element)];
    const keyElement = this.keySymbolMemory.arrToSymbol(baseKey);
    let counter = this.map.get(keyElement) ?? 0;
    this.map.set(keyElement, counter + 1);

    const keyResult = this.keySymbolMemory.arrToSymbol([...baseKey, counter]);

    return keyResult;
  }
}

type Change =
  | {
      type: "deleted";
      base: Base;
    }
  | {
      type: "append";
      compare: Base;
    }
  | {
      type: "changed";
      base: Base;
      compare: Base;
    };

const filterCommentVariable = (
  element: Base
): element is CommentOperator | Variable =>
  element.$type === "CommentOperator" || element.$type === "Variable";

const elementToKey = (element: Base) => {
  if (element instanceof Variable) {
    return element.keyVariable.value;
  } else {
    return element.$type;
  }
};

export const diff = (blockBase: Block, blockCompare: Block) => {
  const keySymbolMemory = new KeySymbolMemory();
  const keyGeneratorBase = new KeyGenerator(keySymbolMemory);
  const keyGeneratorCompare = new KeyGenerator(keySymbolMemory);
  const tableOfDiff = new TableOfDiff();

  const changes: Change[] = [];

  const elementsBase = blockBase.elementList.filter(filterCommentVariable);
  const elementsCompare = blockCompare.elementList.filter(
    filterCommentVariable
  );

  elementsBase.map((element, index) => {
    tableOfDiff.append(0, keyGeneratorBase.match(element), element);
  });

  elementsCompare.map((element, index) => {
    tableOfDiff.append(1, keyGeneratorCompare.match(element), element);
  });

  for (const [elementBase, elementCompare] of tableOfDiff.table.values()) {
    if (elementBase && !elementCompare) {
      changes.push({
        type: "deleted",
        base: elementBase,
      });
      continue;
    } else if (!elementBase && elementCompare) {
      changes.push({
        type: "append",
        compare: elementCompare,
      });
      continue;
    } else if (
      elementBase instanceof Variable &&
      elementCompare instanceof Variable &&
      elementBase.valueVariable.value !== elementCompare.valueVariable.value
    ) {
      changes.push({
        type: "changed",
        base: elementBase,
        compare: elementCompare,
      });
      continue;
    }
  }

  return { changes } as const;
};
