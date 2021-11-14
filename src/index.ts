import { type } from "os";
import { replaceAt } from "./util/array";

interface Matrix {
  cells: Row[];
  totalMines: number;
  totalCells: number;
}

type Cell = 0 | 1;
type Row = Cell[];

const generateMatrixCells = (rows: number, columns: number): Row[] => {
  return new Array(rows).fill(0).map((_, row) => {
    return new Array(columns).fill(0).map((_, column) => {
      return 0;
    });
  });
};

const generateMatrix = (rows: number, columns: number): Matrix => {
  return {
    cells: generateMatrixCells(rows, columns),
    totalMines: 0,
    totalCells: rows * columns,
  };
};

const getMineCount = (matrix: Matrix) => {
  return matrix.cells.reduce((acc, row) => {
    return (
      acc +
      row.reduce((acc, cell) => {
        return acc + cell;
      }, 0)
    );
  }, 0);
};

const getCellExplored = (row: number, column: number, columnCount: number) =>
  row * columnCount + column + 1;

const calcProbability = (
  mineCount: number,
  minePlaced: number,
  cellCount: number,
  cellExplored: number
) => {
  if (cellCount - cellExplored === 0) {
    return mineCount > minePlaced ? 1 : 0;
  }

  return (mineCount - minePlaced) / (cellCount - cellExplored);
};

const fillRowWithMine = (
  matrix: Matrix,
  row: number,
  column: number
): Matrix => {
  const currentRow = matrix.cells[row];
  const cell =
    Math.random() >
    1 -
      calcProbability(
        matrix.totalMines,
        getMineCount(matrix),
        matrix.totalCells,
        getCellExplored(row, column, currentRow.length)
      )
      ? 1
      : 0;

  return {
    ...matrix,
    cells: replaceAt(matrix.cells, row, replaceAt(currentRow, column, cell)),
  };
};

const fillRowWithMines = (row: number, matrix: Matrix): Matrix => {
  const changeCell = (matrix: Matrix, column: number = 0) => {
    if (column === matrix.cells[row].length) {
      return matrix;
    }

    return changeCell(fillRowWithMine(matrix, row, column), column + 1);
  };

  return changeCell(matrix);
};

const fillMatrixWithMines = (matrix: Matrix, mineCount: number) => {
  const fillRow = (matrix: Matrix, row: number = 0) => {
    if (row === matrix.cells.length) {
      return matrix;
    }

    return fillRow(fillRowWithMines(row, matrix), row + 1);
  };

  return fillRow({ ...matrix, totalMines: mineCount });
};

const matrix = fillMatrixWithMines(generateMatrix(10, 10), 25);
