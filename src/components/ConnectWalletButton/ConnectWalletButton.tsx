import React, { FC, useCallback, useEffect } from "react";
import { isMetaMaskInstalled } from "../../utils/isMetaMaskInstalled";
import { accountsAtom } from "../../store/accounts";
import { useRecoilState } from "recoil";
import { chainIDAtom } from "../../store/chainID";
import { Button } from "@mui/material";
import { ConnectButton } from "./ConnectButton";
import { connectionStatusAtom } from "../../store/connectionStatus";

import Web3 from "web3";
import { MetamaskIcon } from "../../icons";
import { truncateEthAddress } from "../../utils/truncateEthAddress";
import { useMetaMaskOnboarding } from "../MetaMaskProvider/useMetaMaskOnboarding";

const GOERLI_CHAIN = {
  chainId: Web3.utils.numberToHex(5),
  chainName: "Goerli",
  rpcUrls: ["https://goerli.infura.io/v3/"],
  nativeCurrency: {
    name: "GoerliETH",
    symbol: "GoerliETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://goerli.etherscan.io"],
};
const ETHEREUM_CHAIN = GOERLI_CHAIN;
// const ETHEREUM_CHAIN = {
//     chainId: Web3.utils.numberToHex(1337),
//     chainName: "TIC-TAC-TOE",
//     rpcUrls: ["http://127.0.0.1:7545"],
//     nativeCurrency: {
//         name: "TEST",
//         symbol: "CPAY",
//         decimals: 18,
//     },
//     blockExplorerUrls: ["https://test.com"],
// }

interface ConnectInfo {
  chainId: string;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export const ConnectWalletButton: FC = () => {
  const [status, setStatus] = useRecoilState(connectionStatusAtom);
  const onboarding = useMetaMaskOnboarding();

  const [accounts, setAccounts] = useRecoilState(accountsAtom);
  const [chainID, setChainID] = useRecoilState(chainIDAtom);

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  useEffect(() => {
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum.on("connect", (connectInfo: ConnectInfo) => {
        setChainID(parseInt(connectInfo.chainId, 16));
      });

      // @ts-ignore
      window.ethereum.on("disconnect", (error: ProviderRpcError) => {
        setChainID(null);
        setStatus("initial");
        setAccounts([]);
      });

      // @ts-ignore
      window.ethereum.on("chainChanged", (chainID: string) =>
        setChainID(parseInt(chainID, 16))
      );
      // @ts-ignore
      window.ethereum.on("accountsChanged", (accounts: Array<string>) =>
        setAccounts(accounts)
      );
      window.ethereum.on("networkChanged", (...args) =>
        console.log("networkChanged", args)
      );
    }
  }, []);

  const onClickInstall = useCallback(() => {
    setStatus("onboarding");
    if (onboarding) {
      onboarding.startOnboarding();
    }
  }, [onboarding]);

  const handleSetChain = useCallback(async () => {
    if (!window.ethereum) return null;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ETHEREUM_CHAIN.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ETHEREUM_CHAIN],
          });
        } catch (error: any) {
          alert(error.message);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      setStatus("not_installed");
    } else if (isMetaMaskConnected()) {
      setStatus("connected");
    } else {
      setStatus("connect");
    }
  }, [onClickInstall, accounts]);

  if (status === "initial") {
    return (
      <Button type="button" variant="contained" disabled={false}>
        Connect Wallet
      </Button>
    );
  }

  if (status === "not_installed") {
    return (
      <Button
        type="button"
        variant="contained"
        endIcon={<MetamaskIcon />}
        disabled={false}
        onClick={onClickInstall}
      >
        Click here to install MetaMask!
      </Button>
    );
  }

  if (status === "onboarding") {
    return (
      <Button type="button" variant="contained" disabled={true}>
        Onboarding in progress
      </Button>
    );
  }

  if (status === "connect") {
    return <ConnectButton />;
  }

  if (status === "connected") {
    if (chainID === Web3.utils.hexToNumber(ETHEREUM_CHAIN.chainId)) {
      return (
        <Button
          type="button"
          variant="contained"
          fullWidth
          endIcon={<MetamaskIcon />}
          disabled={true}
        >
          Connected with {truncateEthAddress(accounts[0])}
        </Button>
      );
    } else {
      return (
        <Button
          type="button"
          variant="contained"
          disabled={false}
          onClick={handleSetChain}
        >
          Change Chain
        </Button>
      );
    }
  }

  return null;
};
