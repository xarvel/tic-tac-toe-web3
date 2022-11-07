import React, {useMemo, useState} from 'react';
import {Game} from "./components/Game";
import {Layout} from './components/Layout';
import {useRecoilValue} from "recoil";
import {accountsAtom} from "./store/accounts";
import {Sessions} from "./components/Sessions";
import abi from "./requests/TicTacToe.json";
import {AbiItem} from "web3-utils";
import {CONTRACT_ADDRESS} from "./config";
import {useWeb3} from "./components/Web3Provider/useWeb3";

function App() {
    const [currentSessionID, setCurrentSessionID] = useState(-1);
    const accounts = useRecoilValue(accountsAtom);
    const web3 = useWeb3();
    const account = accounts[0];

    const contract = useMemo(() => new web3.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS, {
        from: account
    }),[account, web3])

    return (
        <Layout
            leftSidebar={<Sessions
                contract={contract}
                sessionID={currentSessionID}
                onChangeSessionID={setCurrentSessionID}
                account={accounts[0]}/>}>
            <Game contract={contract} sessionID={currentSessionID} account={accounts[0]}/>
        </Layout>
    );
}

export default App;
