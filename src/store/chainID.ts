import { atom } from "recoil";

export const chainIDAtom = atom<number | null>({
  key: "chainID",
  default: null,
});
