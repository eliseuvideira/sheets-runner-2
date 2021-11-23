export const convertA1ToR1C1 = (cell: string) => {
  const matches = cell.match(/^\$?(?<col>[A-Z]+)\$?(?<row>[0-9]+)$/);

  if (!matches || !matches.groups) {
    throw new Error(`failed to match cell ${cell}`);
  }

  const { col, row } = matches.groups;

  if (!col || !row) {
    throw new Error(`invalid cell ${cell}, missing col and/or row`);
  }

  const colR1C1 = convertA1ToR1C1Col(col);
  const rowR1C1 = convertA1ToR1C1Row(row);

  return {
    col: colR1C1,
    row: rowR1C1,
  };
};

export const convertA1ToR1C1Col = (col: string) => {
  let colR1C1 = 0;

  const codeA = "A".charCodeAt(0);
  const codeZ = "Z".charCodeAt(0);

  const radix = codeZ - codeA + 1;

  for (const char of [...col]) {
    colR1C1 = colR1C1 * radix + char.charCodeAt(0) - codeA + 1;
  }

  return colR1C1;
};

export const convertA1ToR1C1Row = (row: string) => +row;
