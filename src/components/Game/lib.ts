import { Mark, PlaygroundData } from "../../store/playgroundData";

export type GameMove = {
  row: number;
  col: number;
};

export const combinePlayground = (
  playground: PlaygroundData,
  gameMove: GameMove | null,
  mark: Mark
) => {
  return playground.map((row, rowIndex) =>
    row.map((col, colIndex) => {
      if (gameMove) {
        if (gameMove.row === rowIndex && gameMove.col === colIndex) {
          return mark;
        }
      }

      return col;
    })
  );
};
