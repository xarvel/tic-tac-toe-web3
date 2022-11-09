import React, { FC, useCallback, useEffect, useState } from "react";
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
  IconButton,
  Box,
  styled,
  IconProps,
} from "@mui/material";
import { EventData } from "web3-eth-contract";
import { isAddresessEqual } from "../../utils/isAddresessEqual";
import { RefreshIcon as RefreshIconBase } from "../../icons";

type StyledSpinnerProps = {
  loading: boolean;
} & IconProps;

const RefreshIcon = styled(RefreshIconBase)(
  ({ loading }: StyledSpinnerProps) => ({
    animation: loading ? `nfLoaderSpin infinite 700ms linear` : "none",
    transformBox: "fill-box",

    "@keyframes nfLoaderSpin": {
      from: {
        transform: "rotate(0deg)",
      },
      to: {
        transform: "rotate(360deg)",
      },
    },
  })
);

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
  const [loading, setLoading] = useState(false);

  const handleReloadAvailableSessions = useCallback(async () => {
    if (account) {
      try {
        setLoading(true);
        const result: string[] = await contract.methods
            .getAvailableSessions(account)
            .call({
              from: account,
            });

        setSession(
            result.map((sessionID) => ({
              sessionID: Number(sessionID),
              player: "",
            }))
        );
      }finally {
        setLoading(false);
      }

    }
  }, [account, contract.methods, setSession]);

  useEffect(() => {
    handleReloadAvailableSessions();
  }, [account, handleReloadAvailableSessions]);

  useEffect(() => {
    const subscription = contract.events
      .SessionCreated({})
      .on("data", (event: EventData) => {
        console.log("SessionCreated fired", event);

        if (
          isAddresessEqual(event.returnValues.playerSessionCreator, account)
        ) {
          onChangeSessionID(Number(event.returnValues.sessionID));
        }

        setTimeout(() => handleReloadAvailableSessions(), 1000);
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
  }, [account, contract, onChangeSessionID, handleReloadAvailableSessions]);

  return (
    <div className="sessions">
      <List
        subheader={
          <ListSubheader>
            <Box mr={1} display="inline">
              Sessions
            </Box>

            <IconButton
              size="small"
              onClick={handleReloadAvailableSessions}
              color="inherit"
            >
              <RefreshIcon color="inherit" loading={loading} />
            </IconButton>
          </ListSubheader>
        }
      >
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
