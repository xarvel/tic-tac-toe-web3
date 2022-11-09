import React, { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import { IconO } from "../../icons/IconO";
import { IconX } from "../../icons/IconX";
import { truncateEthAddress } from "../../utils/truncateEthAddress";
import { useRecoilValue } from "recoil";
import { currentSessionAtom } from "../../store/currentSession";
import { MarkFigure, markFigureAtom } from "../../store/markFigure";

export const Players: FC = () => {
  const markFigure = useRecoilValue(markFigureAtom);

  const currentSession = useRecoilValue(currentSessionAtom);
  if (currentSession === null) {
    return null;
  }

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          {markFigure === MarkFigure.NOUGHT ? (
            <IconO color="primary" />
          ) : (
            <IconX color="primary" />
          )}
        </ListItemIcon>
        <ListItemText
          primary="You"
          secondary={truncateEthAddress(currentSession.account)}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {markFigure === MarkFigure.NOUGHT ? (
            <IconX color="secondary" />
          ) : (
            <IconO color="secondary" />
          )}
        </ListItemIcon>
        <ListItemText
          primary="Opponent"
          secondary={truncateEthAddress(currentSession.opponent)}
        />
      </ListItem>
    </List>
  );
};
