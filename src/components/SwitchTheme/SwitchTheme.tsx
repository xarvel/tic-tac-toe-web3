import {FC, useCallback} from "react";
import { useTheme } from '@mui/material/styles';
import { Box, IconButton } from "@mui/material";
import {LightModeIcon} from "../../icons/LightModeIcon";
import {DarkModeIcon} from "../../icons/DarkModeIcon";
import {useSetRecoilState} from "recoil";
import {colorModeAtom} from "../../store/colorMode";

export const SwitchTheme:FC = () => {
    const theme = useTheme();
    const setColorMode = useSetRecoilState(colorModeAtom);

    const handleChangeMode = useCallback(() => {
        setColorMode((colorMode) => colorMode === 'dark'? 'light' : 'dark' )
    }, [setColorMode]);

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                color: 'text.primary',
                borderRadius: 1,
                p: 3,
            }}
        >
            {theme.palette.mode} mode
            <IconButton sx={{ ml: 1 }} onClick={handleChangeMode} color="inherit">
                {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Box>
    )
}
