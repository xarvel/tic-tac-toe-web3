import {
    atom,
} from 'recoil';


export enum Mark {
    EMPTY = 0,
    YOUR = 1,
    OPPONENT = 2,
}

export type PlaygroundData = Mark[][]

export const EmptyBoard = [
    [Mark.EMPTY, Mark.EMPTY, Mark.EMPTY],
    [Mark.EMPTY, Mark.EMPTY, Mark.EMPTY],
    [Mark.EMPTY, Mark.EMPTY, Mark.EMPTY],
]

export const playgroundAtom = atom<PlaygroundData>({
    key: 'playground',
    default: EmptyBoard,
});
