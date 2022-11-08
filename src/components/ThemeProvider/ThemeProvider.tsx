import {FC, useMemo, PropsWithChildren} from "react";
import {createTheme, ThemeProvider as ThemeProviderBase} from "@mui/material";
import {useRecoilValue} from "recoil";
import {colorModeAtom} from "../../store/colorMode";

export const ThemeProvider:FC<PropsWithChildren> = ({ children }) => {
    const colorMode = useRecoilValue(colorModeAtom);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: colorMode,
                    background: {
                        default: colorMode === 'dark' ?  'black' : 'white',
                    },
                },
            }),
        [colorMode],
    );

    return (
        <ThemeProviderBase theme={theme}>
            {children}
        </ThemeProviderBase>
    )
}
