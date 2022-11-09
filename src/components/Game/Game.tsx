import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  EmptyBoard,
  Mark,
  playgroundAtom,
  PlaygroundData,
} from "../../store/playgroundData";
import { markFigureAtom } from "../../store/markFigure";
import { useWeb3 } from "../Web3Provider/useWeb3";
import { GameMove, makeMove } from "../../requests/makeMove";
import { getSession } from "../../requests/getSession";
import { Box, Button } from "@mui/material";
import { connectionStatusAtom } from "../../store/connectionStatus";
import { Playground } from "../Playground";
import { useSnackbar } from "notistack";
import { truncateText } from "../../utils/truncateText";
import { EventData } from "web3-eth-contract";
import { isAddresessEqual } from "../../utils/isAddresessEqual";
import { GameContainer } from "./GameContainer";
import { GamePlayground } from "./GamePlayground";
import { currentSessionAtom } from "../../store/currentSession";

const combinePlayground = (
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

type GameProps = {
  sessionID: number;
  account: string;
  contract: any;
};

export const Game: FC<GameProps> = ({ sessionID, account, contract }) => {
  const [playground, setPlayground] = useRecoilState(playgroundAtom);
  const setCurrentSession = useSetRecoilState(currentSessionAtom);
  const markFigure = useRecoilValue(markFigureAtom);
  const web3 = useWeb3();
  const connectionStatus = useRecoilValue(connectionStatusAtom);
  const [nextMove, setNextMove] = useState<GameMove | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const playgroundWithUncommited = useMemo(
    () => combinePlayground(playground, nextMove, Mark.YOUR),
    [playground, nextMove]
  );
  const [yourTurn, setYourTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  console.log("gameOver", gameOver);

  const commitMove = useCallback(
    (gameMove: GameMove, mark: Mark) => {
      setPlayground((playground) =>
        combinePlayground(playground, gameMove, mark)
      );
    },
    [setPlayground]
  );

  const reloadSession = useCallback(() => {
    if (sessionID !== -1) {
      getSession(web3, sessionID, account).then((session) => {
        console.log("session", session);
        setCurrentSession(session);
        setGameOver(!!session.winner);
        setYourTurn(isAddresessEqual(session.nextPlayer, account));
        setPlayground(session.playground);
      });
    } else {
      setYourTurn(true);
      setPlayground(EmptyBoard);
    }
  }, [account, sessionID, setPlayground, web3]);

  useEffect(() => {
    let subscription: any;

    if (sessionID !== -1) {
      subscription = contract.events
        .GameMove({
          // filter: {
          //     sessionID: sessionID.toString()
          // },
          // fromBlock: 'earliest',
          // toBlock: 'latest'
        })
        .on("data", (event: EventData) => {
          console.log("GameMove fired", event);
          if (event.returnValues.sessionID === sessionID.toString()) {
            if (isAddresessEqual(event.returnValues.player, account)) {
              commitMove(
                {
                  row: parseInt(event.returnValues.move.row),
                  col: parseInt(event.returnValues.move.col),
                },
                Mark.YOUR
              );
              setYourTurn(false);
            } else {
              commitMove(
                {
                  row: parseInt(event.returnValues.move.row),
                  col: parseInt(event.returnValues.move.col),
                },
                Mark.OPPONENT
              );
              setYourTurn(true);
            }
          }
        })
        .on("changed", function (event: any) {
          console.log("GameMove changed", event);
        })
        .on("error", function (error: any, receipt: any) {
          console.log("GameMove error", error, receipt);
        });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
        console.log("GameMove unsubscribed");
      }
    };
  }, [contract, sessionID, account]);

  useEffect(() => {
    let subscription: any;

    if (sessionID !== -1) {
      subscription = contract.events
        .HasWinner({
          // filter: {
          //     sessionID: sessionID.toString()
          // },
        })
        .on("data", (event: EventData) => {
          console.log("HasWinner fired", event);

          if (event.returnValues.sessionID === sessionID.toString()) {
            setGameOver(true);
            if (isAddresessEqual(event.returnValues.playerWinner, account)) {
              enqueueSnackbar("You won", {
                variant: "success",
              });
            } else {
              enqueueSnackbar("You loose", {
                variant: "warning",
              });
            }
          }
        })
        .on("changed", function (event: any) {
          console.log("HasWinner changed", event);
        })
        .on("error", function (error: any, receipt: any) {
          console.log("HasWinner error", error, receipt);
        });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
        console.log("HasWinner unsubscribed");
      }
    };
  }, [contract, sessionID]);

  useEffect(() => {
    setNextMove(null);
  }, [sessionID]);

  useEffect(() => {
    if (connectionStatus === "connected") {
      reloadSession();
    }
  }, [connectionStatus, account, sessionID]);

  const handleCommitMove = useCallback(async () => {
    if (nextMove) {
      try {
        await makeMove(
          contract,
          {
            row: nextMove.row,
            col: nextMove.col,
          },
          sessionID,
          account
        );
        commitMove(nextMove, Mark.YOUR);
      } catch (e: any) {
        enqueueSnackbar(truncateText(e.message, 100), {
          variant: "error",
        });
      } finally {
        setNextMove(null);
      }
    }
  }, [account, nextMove, contract, sessionID, commitMove]);

  const handleMakeMove = useCallback((row: number, col: number) => {
    setNextMove({
      row,
      col,
    });
  }, []);

  const nextMovePossible = useMemo(() => {
    return (
      nextMove !== null &&
      yourTurn &&
      !gameOver &&
      connectionStatus === "connected"
    );
  }, [nextMove, yourTurn, gameOver]);

  const makeMoveButtonText = useMemo(() => {
    if (connectionStatus !== "connected") {
      return "Not Connected";
    }
    if (gameOver) {
      return "Game Over";
    }
    if (!yourTurn) {
      return "Not Your Turn";
    }

    return "Make Move";
  }, [yourTurn, gameOver, connectionStatus]);

  const isPlaygroundDisabled = useMemo(() => {
    return gameOver || connectionStatus !== "connected";
  }, [gameOver, connectionStatus]);

  return (
    <GameContainer>
      <GamePlayground>
        <Playground
          disabled={isPlaygroundDisabled}
          playground={playgroundWithUncommited}
          markFigure={markFigure}
          onMove={handleMakeMove}
        />
      </GamePlayground>
      <Box
        className="game__buttons"
        sx={{
          p: 5,
          textAlign: "center",
          height: "20%",
        }}
      >
        <Button
          variant="contained"
          type="button"
          disabled={!nextMovePossible}
          onClick={handleCommitMove}
        >
          {makeMoveButtonText}
        </Button>
      </Box>
    </GameContainer>
  );
};
