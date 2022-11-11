import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { EmptyBoard, Mark, playgroundAtom } from "../../store/playgroundData";
import { markFigureAtom } from "../../store/markFigure";
import { getSession } from "./getSession";
import { Button } from "@mui/material";
import { connectionStatusAtom } from "../../store/connectionStatus";
import { Playground } from "../Playground";
import { useSnackbar } from "notistack";
import { truncateText } from "../../utils/truncateText";
import { Contract, EventData } from "web3-eth-contract";
import { isAddresessEqual } from "../../utils/isAddresessEqual";
import { GameContainer } from "./GameContainer";
import { GamePlayground } from "./GamePlayground";
import { currentSessionAtom } from "../../store/currentSession";
import { combinePlayground, GameMove } from "./lib";
import { GameActions } from "./GameActions";

type GameProps = {
  sessionID: number;
  account: string;
  contract: Contract;
};

export const Game: FC<GameProps> = ({ sessionID, account, contract }) => {
  const [playground, setPlayground] = useRecoilState(playgroundAtom);
  const setCurrentSession = useSetRecoilState(currentSessionAtom);
  const markFigure = useRecoilValue(markFigureAtom);
  const connectionStatus = useRecoilValue(connectionStatusAtom);
  const [nextMove, setNextMove] = useState<GameMove | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const playgroundWithUncommited = useMemo(
    () => combinePlayground(playground, nextMove, Mark.YOUR),
    [playground, nextMove]
  );
  const [yourTurn, setYourTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);

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
      getSession(contract, sessionID, account).then((session) => {
        setCurrentSession(session);
        setGameOver(!!session.winner);
        setYourTurn(isAddresessEqual(session.nextPlayer, account));
        setPlayground(session.playground);
      });
    } else {
      setCurrentSession(null);
      setYourTurn(true);
      setPlayground(EmptyBoard);
    }
  }, [sessionID, contract, account, setCurrentSession, setPlayground]);

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
        .on("error", function (error: any, receipt: any) {
          enqueueSnackbar("GameMove error", {
            variant: "error",
          });
        });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [contract, sessionID, account, commitMove, enqueueSnackbar]);

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
        .on("error", function (error: any, receipt: any) {
          if (error.message) {
            console.error("HasWinner", error, receipt);
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          }
        });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [account, contract, enqueueSnackbar, sessionID]);

  useEffect(() => {
    setNextMove(null);
  }, [sessionID]);

  useEffect(() => {
    if (connectionStatus === "connected") {
      reloadSession();
    }
  }, [connectionStatus, account, sessionID, reloadSession]);

  const handleCommitMove = useCallback(async () => {
    if (nextMove) {
      try {
        await contract.methods.makeMove(sessionID, nextMove).send({
          from: account,
        });

        commitMove(nextMove, Mark.YOUR);
      } catch (e: any) {
        enqueueSnackbar(truncateText(e.message, 100), {
          variant: "error",
        });
      } finally {
        setNextMove(null);
      }
    }
  }, [
    nextMove,
    contract.methods,
    sessionID,
    account,
    commitMove,
    enqueueSnackbar,
  ]);

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
  }, [nextMove, yourTurn, gameOver, connectionStatus]);

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
      <GameActions>
        <Button
          variant="contained"
          type="button"
          disabled={!nextMovePossible}
          onClick={handleCommitMove}
        >
          {makeMoveButtonText}
        </Button>
      </GameActions>
    </GameContainer>
  );
};
