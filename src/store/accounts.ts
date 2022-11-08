import { atom } from "recoil";

export const accountsAtom = atom<string[]>({
  key: "accounts",
  default: [],
});
