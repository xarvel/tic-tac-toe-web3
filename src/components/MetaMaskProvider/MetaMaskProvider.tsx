import {createContext, FC, PropsWithChildren, useEffect, useState} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";

export const MetaMaskProviderContext = createContext<{
    onboarding: null | MetaMaskOnboarding
}>({
    onboarding: null
})

const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
    ? 'http://localhost:9010'
    : undefined


export const MetaMaskProvider:FC<PropsWithChildren> = ({ children }) => {
    const [onboarding, setOnboarding] = useState<MetaMaskOnboarding | null>(null)

    useEffect(() => {
        let onboarding = null;
        try {
            onboarding = new MetaMaskOnboarding({forwarderOrigin})
        } catch (error) {
            console.error(error)
        }
        setOnboarding(onboarding);
    }, []);


    return (
        <MetaMaskProviderContext.Provider value={{onboarding}}>
            {children}
        </MetaMaskProviderContext.Provider>
    )
}
