import {Box, styled} from "@mui/material";

export const GameContainer = styled(Box)(({ theme }) => ({

    width: '100%',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',


    [theme.breakpoints.up('md')]: {
        height: 'calc(100% - 72px)',
    },
}));




