import {atom} from "recoil";

export enum MarkFigure {
    NOUGHT ,
    CROSS
}

export const markFigureAtom = atom<MarkFigure>({
    key: 'mark',
    default: MarkFigure.NOUGHT
});
