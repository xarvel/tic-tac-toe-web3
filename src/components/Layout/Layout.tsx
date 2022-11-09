import React, { FC, PropsWithChildren } from "react";
import { ConnectWalletButton } from "../ConnectWalletButton";
import { SwitchMark } from "../SwitchMark";
import { Box, Typography, styled } from "@mui/material";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

const LeftSidebar = styled(Box)(({ theme }) => ({
  order: 3,
  [theme.breakpoints.up("md")]: {
    width: "20%",
    order: 1,
  },
}));

const Center = styled(Box)(({ theme }) => ({
  order: 2,
  [theme.breakpoints.up("md")]: {
    width: "60%",
  },
}));

const RightSidebar = styled(Box)(({ theme }) => ({
  order: 1,

  [theme.breakpoints.up("md")]: {
    width: "20%",
    order: 3,
  },
}));

type LayoutProps = {
  leftSidebar: React.ReactNode;
  centerContent: React.ReactNode;
  rightSidebar: React.ReactNode;
};

export const Layout: FC<LayoutProps> = ({
  leftSidebar,
  centerContent,
  rightSidebar,
}) => {
  return (
    <Container>
      <LeftSidebar>{leftSidebar}</LeftSidebar>
      <Center>{centerContent}</Center>
      <RightSidebar>{rightSidebar}</RightSidebar>
    </Container>
  );
};
