import {atom} from "recoil";

type ConnectionStatus = 'initial' | 'not_installed' | 'onboarding' | 'connect' | 'connected'


export const connectionStatusAtom = atom<ConnectionStatus>({
    key: 'connectionStatus',
    default: 'initial'
});
