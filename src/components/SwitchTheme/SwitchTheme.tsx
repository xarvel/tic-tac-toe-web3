import { FC, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";
import { LightModeIcon } from "../../icons/LightModeIcon";
import { DarkModeIcon } from "../../icons/DarkModeIcon";
import { useSetRecoilState } from "recoil";
import { colorModeAtom } from "../../store/colorMode";

export const SwitchTheme: FC = () => {
  const theme = useTheme();
  const setColorMode = useSetRecoilState(colorModeAtom);

  const handleChangeMode = useCallback(() => {
    setColorMode((colorMode) => (colorMode === "dark" ? "light" : "dark"));
  }, [setColorMode]);

  return (
    <Box>
      {theme.palette.mode} mode
      <IconButton sx={{ ml: 1 }} onClick={handleChangeMode} color="inherit">
        {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Box>
  );
};
