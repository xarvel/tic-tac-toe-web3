import { useContext } from "react";
import { MetaMaskProviderContext } from "./MetaMaskProvider";

export const useMetaMaskOnboarding = () => {
  return useContext(MetaMaskProviderContext).onboarding;
};
