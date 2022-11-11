import React, { FC } from "react";
import { Link, Typography } from "@mui/material";
import { ETHEREUM_CHAIN } from "../ConnectWalletButton/ConnectWalletButton";
import { CONTRACT_ADDRESS } from "../../config";
import { truncateEthAddress } from "../../utils/truncateEthAddress";

export const ContactLink: FC = () => {
  return (
    <Typography variant="body1">
      Contact:{" "}
      <Link
        target="_blank"
        href={`${ETHEREUM_CHAIN.blockExplorerUrls[0]}/address/${CONTRACT_ADDRESS}`}
      >
        {truncateEthAddress(CONTRACT_ADDRESS)}
      </Link>
    </Typography>
  );
};
