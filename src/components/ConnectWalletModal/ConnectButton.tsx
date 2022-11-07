import {FC} from "react";
import { Button } from "@mui/material";

type ConnectButtonProps = {
    label: string
    onClick: () => void
    icon: React.ReactNode
}

export const ConnectButton:FC<ConnectButtonProps> = ({ label, onClick, icon }) => {
    return (
        <Button
            fullWidth
            variant='outlined'
            onClick={onClick}
            endIcon={icon}
            sx={{
                '& .MuiButton-endIcon': {
                    marginLeft: 'auto'
                }
            }}
        >
            {label}
        </Button>
    )
}
