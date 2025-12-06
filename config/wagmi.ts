import { http, createConfig } from 'wagmi'
import { worldchainSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [worldchainSepolia],
    connectors: [
        injected(),
    ],
    transports: {
        [worldchainSepolia.id]: http(),
    },
})
