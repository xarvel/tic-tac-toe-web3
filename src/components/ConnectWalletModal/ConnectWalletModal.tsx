import {FC} from "react";
import {Dialog, Box, DialogContent, Divider, Typography, Link} from "@mui/material";
import {ConnectButton} from "./ConnectButton";
import {MetamaskIcon} from "../../icons";
import {DialogTitle} from './DialogTitle';
import {useMetaMaskOnboarding} from "../MetaMaskProvider/useMetaMaskOnboarding";

type ConnectWalletModalProps = {
    open: boolean;
    onClose: () => void
    onMetamaskConnect: () => void
}

export const ConnectWalletModal:FC<ConnectWalletModalProps> = ({ open, onClose, onMetamaskConnect }) => {
    const onboarding = useMetaMaskOnboarding();

    return (
        <Dialog open={open}
                onClose={onClose}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "350px",
                        },
                    },
                }}
        >
            <DialogTitle id="alert-dialog-title" onClose={onClose}>
                Connect Your Wallet
            </DialogTitle>
            <DialogContent>
                <ConnectButton label='MetaMask' icon={<MetamaskIcon/>} onClick={onMetamaskConnect}/>

                <Box sx={{
                    mt: 5,
                    mb: 1
                }}>
                    <Typography variant="body2" gutterBottom>
                        Need help installing a wallet?{' '}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => {
                                if (onboarding) {
                                    onboarding.startOnboarding()
                                }
                            }}
                        >
                            Click here
                        </Link>
                        </Typography>
                </Box>

                <Divider />
                <Box sx={{
                    mt: 1,
                }}>
                <Typography  sx={{
                    fontSize: '0.6rem'
                }} variant="body2" gutterBottom>Wallets are provided by External Providers and by selecting you agree to Terms of those Providers. Your access to the wallet might be reliant on the External Provider being operational.</Typography>
                </Box>
                </DialogContent>
        </Dialog>
    )
}
