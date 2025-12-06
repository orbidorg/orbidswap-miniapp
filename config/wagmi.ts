import { http, createConfig } from 'wagmi'
import { worldchain } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [worldchain],
    connectors: [
        injected(),
    ],
    transports: {
        [worldchain.id]: http(),
    },
})
