// Token icon URLs from TrustWallet assets CDN
// These are the official token logos

export const TOKEN_ICONS: Record<string, string> = {
    // World Chain native tokens
    WLD: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/worldchain/assets/0x2cFc85d8E48F8EAB294be644d9E25C3030863003/logo.png',
    ETH: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    WETH: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',

    // Stablecoins
    USDC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    USDT: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    DAI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EesdeaD5B0256',

    // Major cryptos
    BTC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    WBTC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',

    // Default fallback
    DEFAULT: '/globe.svg',
}

// Known token addresses on World Chain Mainnet
export const WORLD_CHAIN_TOKENS: Record<string, { symbol: string; name: string; decimals: number; icon: string }> = {
    '0x2cFc85d8E48F8EAB294be644d9E25C3030863003': {
        symbol: 'WLD',
        name: 'Worldcoin',
        decimals: 18,
        icon: TOKEN_ICONS.WLD,
    },
    // Add more World Chain tokens as they become available
}

export function getTokenIcon(symbol: string): string {
    const upperSymbol = symbol.toUpperCase()
    return TOKEN_ICONS[upperSymbol] || TOKEN_ICONS.DEFAULT
}

export function getTokenIconByAddress(address: string): string {
    const token = WORLD_CHAIN_TOKENS[address.toLowerCase()]
    return token?.icon || TOKEN_ICONS.DEFAULT
}
