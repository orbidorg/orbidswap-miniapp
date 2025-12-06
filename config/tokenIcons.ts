// Token icon URLs - using direct reliable sources
// Fallback to placeholder if image fails

export const TOKEN_ICONS: Record<string, string> = {
    // Main tokens with verified working URLs
    WLD: 'https://s2.coinmarketcap.com/static/img/coins/64x64/13502.png',
    ETH: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    WETH: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png',

    // Stablecoins
    USDC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    USDT: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    DAI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',

    // Major cryptos
    BTC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    WBTC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png',

    // Default fallback - gradient placeholder
    DEFAULT: '',
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
