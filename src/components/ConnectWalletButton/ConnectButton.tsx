import React, { FC, useCallback, useState } from "react";
import { Button } from "@mui/material";
import { ConnectWalletModal } from "../ConnectWalletModal";
import { useWeb3 } from "../Web3Provider/useWeb3";
import { useSetRecoilState } from "recoil";
import { accountsAtom } from "../../store/accounts";
import { chainIDAtom } from "../../store/chainID";
import { useSnackbar } from "notistack";
import { truncateText } from "../../utils/truncateText";
import { MetamaskIcon } from "../../icons";
import { useMetaMaskOnboarding } from "../MetaMaskProvider/useMetaMaskOnboarding";

export const ConnectButton: FC = () => {
  const web3 = useWeb3();
  const setAccounts = useSetRecoilState(accountsAtom);
  const setChainID = useSetRecoilState(chainIDAtom);
  const { enqueueSnackbar } = useSnackbar();
  const onboarding = useMetaMaskOnboarding();

  const [open, setOpen] = useState(false);

  const handleMetamaskConnect = useCallback(async () => {
    if (!window.ethereum) {
      return null;
    }

    try {
      const newAccounts = await web3.eth.requestAccounts();
      setAccounts(newAccounts);

      const chainID = await web3.eth.getChainId();

      setChainID(chainID);

      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } catch (error: any) {
      let errorText = "Something happened";

      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        errorText = "Please connect to MetaMask.";
      } else {
        errorText = truncateText(error.message, 100);
      }

      enqueueSnackbar(errorText, {
        variant: "error",
      });
    }
  }, [enqueueSnackbar, onboarding, setAccounts, setChainID, web3.eth]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button
        type="button"
        variant="contained"
        endIcon={<MetamaskIcon />}
        onClick={handleOpen}
      >
        Connect
      </Button>
      <ConnectWalletModal
        onMetamaskConnect={handleMetamaskConnect}
        open={open}
        onClose={handleClose}
      />
    </>
  );
};
