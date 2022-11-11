import { atom } from "recoil";

export const sessionsAtom = atom<number[]>({
  key: "sessions",
  default: [],
});
