export type GameMove = {
  row: number;
  col: number;
};

export const makeMove = async (
  contract: any,
  move: GameMove,
  sessionID: number,
  account: string
) => {
  const transaction = await contract.methods.makeMove(sessionID, move).send({
    from: account,
  });

  return transaction;
};
