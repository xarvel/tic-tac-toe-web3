import Web3 from "web3";
import abi from "./TicTacToe.json";
import { AbiItem } from "web3-utils";
import { CONTRACT_ADDRESS } from "../config";
import { Mark, PlaygroundData } from "../store/playgroundData";
import _ from "lodash";

export type Session = {
  player1: string;
  player2: string;
  opponent: string;
  account: string;
  playground: PlaygroundData;
  winner: string | null;
  nextPlayer: string;
};

const addressEqual = (address1: string, address2: string) =>
  address1.toLowerCase() === address2.toLowerCase();

export const getSession = async (
  web3: Web3,
  sessionID: number,
  account: string
): Promise<Session> => {
  const contract = new web3.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS, {
    from: account,
  });

  const session = await contract.methods.getSession(sessionID).call({
    from: account,
  });

  const opponent =
    account === session.player1 ? session.player2 : session.player1;

  const playground: PlaygroundData = session.playground.map((row: string[]) =>
    row.map((col: string) => {
      if (addressEqual(account, session.player1)) {
        if (col === "1") {
          return Mark.YOUR;
        } else if (col === "2") {
          return Mark.OPPONENT;
        }
      }

      if (
        addressEqual(account, session.player2) ||
        addressEqual(
          session.player2,
          "0x0000000000000000000000000000000000000000"
        )
      ) {
        if (col === "1") {
          return Mark.OPPONENT;
        } else if (col === "2") {
          return Mark.YOUR;
        }
      }

      return Mark.EMPTY;
    })
  );

  const yourMarksCount = _.flatten(playground).filter(
    (mark: Mark) => mark === Mark.YOUR
  ).length;
  const opponentMarksCount = _.flatten(playground).filter(
    (mark: Mark) => mark === Mark.OPPONENT
  ).length;

  const nextPlayer = addressEqual(session.player1, account)
    ? yourMarksCount > opponentMarksCount
      ? session.player2
      : session.player1
    : yourMarksCount > opponentMarksCount
    ? session.player1
    : account;
  return {
    nextPlayer,
    player1: session.player1,
    player2: session.player2,
    account: account,
    opponent,
    winner: addressEqual(
      session.winner,
      "0x0000000000000000000000000000000000000000"
    )
      ? null
      : session.winner,
    playground,
  };
};
