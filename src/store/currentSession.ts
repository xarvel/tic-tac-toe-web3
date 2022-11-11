import { atom } from "recoil";
import { Session } from "../components/Game/getSession";

export const currentSessionAtom = atom<Session | null>({
  key: "currentSession",
  default: null,
});
