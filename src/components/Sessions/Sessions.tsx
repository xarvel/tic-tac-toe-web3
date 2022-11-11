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
import { Contract, EventData } from "web3-eth-contract";
import { isAddresessEqual } from "../../utils/isAddresessEqual";
import { RefreshIcon as RefreshIconBase } from "../../icons";
import { NEW_SESSION_ID } from "../../App";
import { useSnackbar } from "notistack";

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
  currentSessionID: number;
  onChangeSessionID: (sessionID: number) => void;
  contract: Contract;
};

export const Sessions: FC<SessionsProps> = ({
  account,
  onChangeSessionID,
  currentSessionID,
  contract,
}) => {
  const [sessions, setSession] = useRecoilState(sessionsAtom);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleReloadAvailableSessions = useCallback(async () => {
    if (account) {
      try {
        setLoading(true);
        const result: string[] = await contract.methods
          .getAvailableSessions(account)
          .call({
            from: account,
          });

        setSession(result.map((sessionID) => Number(sessionID)));
      } finally {
        setLoading(false);
      }
    }
  }, [account, contract, setSession]);

  useEffect(() => {
    handleReloadAvailableSessions();
  }, [account, handleReloadAvailableSessions]);

  useEffect(() => {
    const subscription = contract.events
      .SessionCreated({})
      .on("data", (event: EventData) => {
        if (
          isAddresessEqual(event.returnValues.playerSessionCreator, account)
        ) {
          onChangeSessionID(Number(event.returnValues.sessionID));
        }

        setTimeout(() => handleReloadAvailableSessions(), 1000);
      })
      .on("error", function (error: any, receipt: any) {
        enqueueSnackbar("SessionCreated error", {
          variant: "error",
        });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [
    account,
    contract,
    onChangeSessionID,
    handleReloadAvailableSessions,
    enqueueSnackbar,
  ]);

  const handleNextSession = useCallback(
    () => onChangeSessionID(NEW_SESSION_ID),
    [onChangeSessionID]
  );

  return (
    <div className="sessions">
      <List
        subheader={
          <ListSubheader>
            <Box mr={1} display="inline">
              Sessions
            </Box>

            <IconButton
              disabled={loading}
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
          <ListItemButton onClick={handleNextSession}>
            <ListItemIcon>
              <Radio
                edge="start"
                checked={currentSessionID === NEW_SESSION_ID}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary="New Session" />
          </ListItemButton>
        </ListItem>
        {sessions.map((sessionID) => (
          <ListItem key={sessionID}>
            <ListItemButton onClick={() => onChangeSessionID(sessionID)}>
              <ListItemIcon>
                <Radio
                  edge="start"
                  checked={currentSessionID === sessionID}
                  disableRipple
                />
              </ListItemIcon>

              <ListItemText primary={`#${sessionID}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
