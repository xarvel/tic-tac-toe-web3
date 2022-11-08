import React, { useMemo, useState } from "react";
import { Game } from "./components/Game";
import { Layout } from "./components/Layout";
import { useRecoilValue } from "recoil";
import { accountsAtom } from "./store/accounts";
import { Sessions } from "./components/Sessions";
import abi from "./requests/TicTacToe.json";
import { AbiItem } from "web3-utils";
import { CONTRACT_ADDRESS } from "./config";
import { useWeb3 } from "./components/Web3Provider/useWeb3";
import { Box, Typography } from "@mui/material";
import { ConnectWalletButton } from "./components/ConnectWalletButton";
import { SwitchMark } from "./components/SwitchMark";
import {Players} from "./components/Players";
import {SwitchTheme} from './components/SwitchTheme';
function App() {
  const [currentSessionID, setCurrentSessionID] = useState(-1);
  const accounts = useRecoilValue(accountsAtom);
  const web3 = useWeb3();
  const account = accounts[0];

  const contract = useMemo(
    () =>
      new web3.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS, {
        from: account,
      }),
    [account, web3]
  );


  return (
    <Layout
      rightSidebar={
        <>
          <Box p={5}>
            <ConnectWalletButton />
          </Box>

            <SwitchTheme/>
            <Box>
                <Players/>
            </Box>

            <Box p={5}>
                <SwitchMark />
            </Box>
        </>
      }
      centerContent={
        <>
          <Typography
            variant="h2"
            style={{
              textAlign: "center",
            }}
          >
            Web3 Tic-Tac-Toe
          </Typography>
          <Game
            contract={contract}
            sessionID={currentSessionID}
            account={accounts[0]}
          />
        </>
      }
      leftSidebar={
        <Sessions
          contract={contract}
          sessionID={currentSessionID}
          onChangeSessionID={setCurrentSessionID}
          account={accounts[0]}
        />
      }
    />
  );
}

export default App;
