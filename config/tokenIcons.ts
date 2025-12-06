// Token icon URLs - using reliable CDN sources
// These are the official token logos

export const TOKEN_ICONS: Record<string, string> = {
    // World Chain tokens - using CoinGecko/other reliable sources
    WLD: 'https://assets.coingecko.com/coins/images/31069/standard/worldcoin.jpg',
    ETH: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
    WETH: 'https://assets.coingecko.com/coins/images/2518/standard/weth.png',

    // Stablecoins
    USDC: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png',
    USDT: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
    DAI: 'https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png',

    // Major cryptos
    BTC: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png',
    WBTC: 'https://assets.coingecko.com/coins/images/7598/standard/wrapped_bitcoin_wbtc.png',

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
}

export function getTokenIcon(symbol: string): string {
    const upperSymbol = symbol.toUpperCase()
    return TOKEN_ICONS[upperSymbol] || TOKEN_ICONS.DEFAULT
}

export function getTokenIconByAddress(address: string): string {
    const token = WORLD_CHAIN_TOKENS[address.toLowerCase()]
    return token?.icon || TOKEN_ICONS.DEFAULT
}
