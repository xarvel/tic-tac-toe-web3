import { FC, useCallback } from "react";
import { useRecoilState } from "recoil";
import { markFigureAtom } from "../../store/markFigure";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { MarkFigure } from "../../store/markFigure";
import * as React from "react";
import { IconX } from "../../icons/IconX";
import { IconO } from "../../icons/IconO";

export const SwitchMark: FC = () => {
  const [mark, setMark] = useRecoilState(markFigureAtom);

  const handleChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, value: MarkFigure) => setMark(value),
    [setMark]
  );

  return (
    <ToggleButtonGroup
      fullWidth
      color="primary"
      value={mark}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value={MarkFigure.NOUGHT}>
        <IconO />
      </ToggleButton>
      <ToggleButton value={MarkFigure.CROSS}>
        <IconX />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
