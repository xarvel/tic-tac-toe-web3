import { atom } from "recoil";

export const colorModeAtom = atom<"light" | "dark">({
  key: "colorMode",
  default: "dark",
});
