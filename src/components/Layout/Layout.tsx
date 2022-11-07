import React, {FC, PropsWithChildren} from "react";
import {ConnectWalletButton} from "../ConnectWalletButton";
import {SwitchMark} from '../SwitchMark';
import {Box, Grid, Typography} from '@mui/material';

type LayoutProps = {
    leftSidebar: React.ReactNode
} & PropsWithChildren

export const Layout:FC<LayoutProps> = ({ children, leftSidebar }) => {
    return (
        <Grid container spacing={2} sx={{
            height: '100%'
        }}>
            <Grid item xs={3}>
                {leftSidebar}
            </Grid>
            <Grid item xs={6} sx={{
                height: '100%'
            }}>
                <Typography variant='h2' style={{
                    textAlign: 'center'
                }}>
                    Web3 Tic-Tac-Toe
                </Typography>
                {children}
            </Grid>
            <Grid item xs={3}>
                <Box p={5}>
                    <ConnectWalletButton/>
                </Box>
                <Box p={5}>
                    <SwitchMark/>
                </Box>
            </Grid>
        </Grid>
    )
}
