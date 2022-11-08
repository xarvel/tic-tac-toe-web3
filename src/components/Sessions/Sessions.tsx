import React, { FC, useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { sessionsAtom } from "../../store/sessions";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  ListItemIcon,
  ListSubheader,
} from "@mui/material";
import { EventData } from "web3-eth-contract";
import {isAddresessEqual} from "../../utils/isAddresessEqual";

type SessionsProps = {
  account: string;
  sessionID: number;
  onChangeSessionID: (sessionID: number) => void;
  contract: any;
};

export const Sessions: FC<SessionsProps> = ({
  account,
  onChangeSessionID,
  sessionID,
  contract,
}) => {
  const [sessions, setSession] = useRecoilState(sessionsAtom);

  const reloadAvailableSessions = useCallback(() => {
    if (account) {
      contract.methods
        .getAvailableSessions(account)
        .call({
          from: account,
        })
        .then((result: string[]) => {
          setSession(
            result.map((sessionID) => ({
              sessionID: Number(sessionID),
              player: "",
            }))
          );
        });
    }
  }, [account, contract.methods, setSession]);

  useEffect(() => {
    reloadAvailableSessions();
  }, [account, reloadAvailableSessions]);

  useEffect(() => {
    let subscriptionID: string;
    let subscription: any;

    subscription = contract.events
      .SessionCreated({})
      .on("data", (event: EventData) => {
        console.log("SessionCreated fired", event);

        if(isAddresessEqual(event.returnValues.playerSessionCreator, account)){
          onChangeSessionID(Number(event.returnValues.sessionID));
        }

        setTimeout(() => reloadAvailableSessions(), 1000);
      })
      .on("connected", (id: string) => {
        console.log("SessionCreated subscribed", id);

        subscriptionID = id;
      })
      .on("changed", function (event: any) {
        console.log("SessionCreated changed", event);
      })
      .on("error", function (error: any, receipt: any) {
        console.log("SessionCreated error", error, receipt);
      });

    return () => {
      subscription.unsubscribe();
      console.log("SessionCreated unsubscribed");
    };
  }, [account, contract, onChangeSessionID, reloadAvailableSessions]);

  return (
    <div className="sessions">
      <List subheader={<ListSubheader>Sessions</ListSubheader>}>
        <ListItem>
          <ListItemButton onClick={() => onChangeSessionID(-1)}>
            <ListItemIcon>
              <Radio
                edge="start"
                checked={sessionID === -1}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary="New Session" />
          </ListItemButton>
        </ListItem>
        {sessions.map((session) => (
          <ListItem key={session.sessionID}>
            <ListItemButton
              onClick={() => onChangeSessionID(session.sessionID)}
            >
              <ListItemIcon>
                <Radio
                  edge="start"
                  checked={sessionID === session.sessionID}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>

              <ListItemText primary={`#${session.sessionID}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
