import { Chain, EthosConnectProvider } from "ethos-connect";
import ExampleIcon from "../icons/ExampleIcon";
import { useEffect } from "react";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NETWORK } from "../lib/constants";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loader = document.getElementById('globalLoader');
            if (loader)
                loader.style.display = 'none';
        }
    }, []);
    
  const ethosConfiguration = {
    apiKey: process.env.NEXT_PUBLIC_ETHOS_API_KEY,
    preferredWallets: ['Ethos Wallet'],
    network: NETWORK,
    chain: Chain.SUI_TESTNET
  };
  
  return (
    <EthosConnectProvider
      ethosConfiguration={ethosConfiguration}
      dappName="Soundbeats"
      dappIcon={<ExampleIcon />}
      connectMessage="Welcome to Soundbeats"
    >
      <Head>
        <title>Soundbeats on Sui</title>
      </Head>
      <Component {...pageProps} />
    </EthosConnectProvider>
  );
}

export default MyApp;
