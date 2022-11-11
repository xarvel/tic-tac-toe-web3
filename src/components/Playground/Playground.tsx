import React, { FC, useCallback } from "react";
import {
  Mark,
  PlaygroundData as PlaygroundType,
} from "../../store/playgroundData";
import { MarkFigure } from "../../store/markFigure";
import { IconO } from "../../icons/IconO";
import { IconX } from "../../icons/IconX";
import { Box, styled } from "@mui/material";

const PlaygroundContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(3, 1fr)",

  gridGap: "5px",
  aspectRatio: "1 / 1",

  backgroundColor: theme.palette.mode === "dark" ? "white" : "#121212",
  width: "90%",

  [theme.breakpoints.up("md")]: {
    width: "500px",
    height: "500px",
  },
}));

const PlaygroundItem = styled("button")(({ theme }) => ({
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "10%",

  border: "none",
  aspectRatio: "1 / 1",

  backgroundColor: theme.palette.background.default,
}));

type PlaygroundProps = {
  playground: PlaygroundType;
  markFigure: MarkFigure;
  onMove: (row: number, col: number) => void;
  disabled: boolean;
};

export const Playground: FC<PlaygroundProps> = ({
  playground,
  markFigure,
  onMove,
  disabled,
}) => {
  const handleMakeMove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const row = event.currentTarget.getAttribute("data-row");
      const col = event.currentTarget.getAttribute("data-col");

      if (row && col) {
        onMove(parseInt(row), parseInt(col));
      }
    },
    [onMove]
  );

  const renderSquare = useCallback(
    (rowIndex: number, colIndex: number, item: Mark) => {
      const iconSX = {
        height: "100%",
        width: "100%",
      } as const;

      if (item !== Mark.EMPTY) {
        const color = item === Mark.YOUR ? "primary" : "secondary";
        const YourIcon = markFigure === MarkFigure.NOUGHT ? IconO : IconX;
        const OpponentIcon = markFigure !== MarkFigure.NOUGHT ? IconO : IconX;
        const Icon = item === Mark.YOUR ? YourIcon : OpponentIcon;
        return <Icon color={color} sx={iconSX} />;
      }
    },
    [markFigure]
  );

  return (
    <PlaygroundContainer>
      {playground.map((cols, rowIndex) =>
        cols.map((item, colIndex) => (
          <PlaygroundItem
            onClick={handleMakeMove}
            disabled={item !== Mark.EMPTY || disabled}
            data-row={rowIndex}
            data-col={colIndex}
            className="playground__item"
            key={`${rowIndex}-${colIndex}`}
          >
            {renderSquare(rowIndex, colIndex, item)}
          </PlaygroundItem>
        ))
      )}
    </PlaygroundContainer>
  );
};
