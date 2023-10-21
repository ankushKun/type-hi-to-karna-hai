import '@/styles/globals.css'
import '@mantine/core/styles.css';
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { SessionProvider } from "next-auth/react"


const projectId = '8eb3ea359713a5c3e40567c8f1178ea9'

const metadata = {
  name: 'GitRaven',
  description: 'Opensource issue bounty platform',
}

const chains = [polygonMumbai]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
createWeb3Modal({
  wagmiConfig, projectId, chains, themeVariables: {
    '--w3m-accent': "#FFD600",
    "--w3m-border-radius-master": "1px"
  }
})

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <WagmiConfig config={wagmiConfig}>
    <SessionProvider session={session}>
      <MantineProvider defaultColorScheme='dark' >
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  </WagmiConfig>
}
