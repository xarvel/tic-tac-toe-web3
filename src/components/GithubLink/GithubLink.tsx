import React, { FC } from "react";
import { Link, Typography } from "@mui/material";

export const GithubLink: FC = () => {
  return (
    <Typography variant="body1">
      Code can be found at{" "}
      <Link href="https://github.com/xarvel/tic-tac-toe-web3" target="_blank">
        https://github.com/xarvel/tic-tac-toe-web3
      </Link>
    </Typography>
  );
};
