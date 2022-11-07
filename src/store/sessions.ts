import {
    atom,
} from 'recoil';


type Session = {
    sessionID: number,
    player: string
}

export const sessionsAtom = atom<Session[]>({
    key: 'sessions',
    default: [],
});
