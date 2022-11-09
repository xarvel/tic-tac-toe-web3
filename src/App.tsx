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
import { Box, Link, Typography } from "@mui/material";
import { ConnectWalletButton } from "./components/ConnectWalletButton";
import { SwitchMark } from "./components/SwitchMark";
import { Players } from "./components/Players";
import { SwitchTheme } from "./components/SwitchTheme";
import { truncateEthAddress } from "./utils/truncateEthAddress";
import { ETHEREUM_CHAIN } from "./components/ConnectWalletButton/ConnectWalletButton";

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
        <Box display="flex" flexDirection="column" height="100%">
          <Box mb={3} p={1} textAlign="right">
            <ConnectWalletButton />
          </Box>
          <Box mb={3} p={1} textAlign="right">
            <SwitchTheme />
          </Box>
          <Box>
            <Players />
          </Box>

          <Box flexGrow={1} />

          <Box mb={3} p={1} textAlign="right">
            <SwitchMark />
          </Box>

          <Box p={1} textAlign="right">
            <Typography variant="body1">
              Contact:{" "}
              <Link
                target="_blank"
                href={`${ETHEREUM_CHAIN.blockExplorerUrls[0]}/address/${CONTRACT_ADDRESS}`}
              >
                {truncateEthAddress(CONTRACT_ADDRESS)}
              </Link>
            </Typography>
          </Box>
        </Box>
      }
      centerContent={
        <>
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
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
        <Box display="flex" flexDirection="column" height="100%">
          <Sessions
            contract={contract}
            sessionID={currentSessionID}
            onChangeSessionID={setCurrentSessionID}
            account={accounts[0]}
          />
          <Box flexGrow={1} />

          <Box p={1}>
            <Typography variant="body1">
              Code can be found at{" "}
              <Link
                href="https://github.com/xarvel/tic-tac-toe-web3"
                target="_blank"
              >
                https://github.com/xarvel/tic-tac-toe-web3
              </Link>
            </Typography>
          </Box>
        </Box>
      }
    />
  );
}

export default App;
