import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CssBaseline } from "@mui/material";
import { RecoilRoot } from "recoil";
import { SnackbarProvider } from "notistack";
import { Web3Provider } from "./components/Web3Provider";
import { MetaMaskProvider } from "./components/MetaMaskProvider";
import { ThemeProvider } from "./components/ThemeProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider>
        <CssBaseline />

        <MetaMaskProvider>
          <SnackbarProvider>
            <Web3Provider>
              <App />
            </Web3Provider>
          </SnackbarProvider>
        </MetaMaskProvider>
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
