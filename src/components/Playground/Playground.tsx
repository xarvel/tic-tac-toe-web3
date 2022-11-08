import React, { FC, useCallback } from "react";
import {
  Mark,
  PlaygroundData as PlaygroundType,
} from "../../store/playgroundData";
import { MarkFigure } from "../../store/markFigure";
import { IconO } from "../../icons/IconO";
import { IconX } from "../../icons/IconX";
import "./style.css";
import {Box, styled} from "@mui/material";

const PlaygroundContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'black',
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: 'auto',
        maxWidth: '100%',
    },
}));


const PlaygroundItem = styled('button')(({ theme }) => ({
    backgroundColor: theme.palette.mode !== 'dark' ? 'white' : 'black',
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

  const renderSquare = (rowIndex: number, colIndex: number, item: any) => {
    if (item !== Mark.EMPTY) {
      if (item === Mark.YOUR) {
        return markFigure === MarkFigure.NOUGHT ? (
          <IconO
              color='secondary'
            sx={{
              height: "100%",
              width: "100%",
            }}
          />
        ) : (
          <IconX
              color='primary'
            sx={{

              height: "100%",
              width: "100%",
            }}
          />
        );
      } else {
        return markFigure === MarkFigure.NOUGHT ? (
          <IconX
              color='secondary'
              sx={{
                  height: "100%",
                  width: "100%",
              }}
          />
        ) : (
          <IconO
              color='secondary'
              sx={{
                  height: "100%",
                  width: "100%",
              }}
          />
        );
      }
    }
  };

  return (
    <PlaygroundContainer className="playground">
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
