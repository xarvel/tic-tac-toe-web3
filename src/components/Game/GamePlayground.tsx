import { Box, styled } from "@mui/material";

export const GamePlayground = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",

  [theme.breakpoints.up("md")]: {
    height: "80%",
  },
}));
