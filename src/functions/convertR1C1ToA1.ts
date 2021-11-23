export interface R1C1 {
  col: number;
  row: number;
}

export const convertR1C1ToA1 = (cell: R1C1) => {
  const colA1 = convertR1C1Col(cell.col);
  const rowA1 = convertR1C1Row(cell.row);

  return colA1 + rowA1;
};

export const convertR1C1Col = (col: number) => {
  let colA1 = "";

  const codeA = "A".charCodeAt(0);
  const codeZ = "Z".charCodeAt(0);

  const radix = codeZ - codeA + 1;
  let value = (col - 1) % radix;
  let remaining = Math.floor((col - 1) / radix);
  while (true) {
    colA1 = String.fromCharCode(codeA + value) + colA1;

    if (remaining === 0) {
      break;
    }

    value = (remaining - 1) % radix;
    remaining = Math.floor((remaining - 1) / radix);
  }

  return colA1;
};

export const convertR1C1Row = (row: number) => `${row}`;
