import {FC, createContext, PropsWithChildren} from "react";
import Web3 from 'web3';

export const Web3Context = createContext(new Web3(window.ethereum as any))

export const Web3Provider:FC<PropsWithChildren> = ({ children }) => {
    return (
        <Web3Context.Provider value={new Web3(window.ethereum as any)}>
            {children}
        </Web3Context.Provider>
    )
}
