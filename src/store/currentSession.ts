import { atom } from "recoil";
import { Session } from "../requests/getSession";

export const currentSessionAtom = atom<Session | null>({
  key: "currentSession",
  default: null,
});
