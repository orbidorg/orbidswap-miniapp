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
    '0x4200000000000000000000000000000000000006': {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        icon: TOKEN_ICONS.WETH,
    },
    '0x0000000000000000000000000000000000000000': {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        icon: TOKEN_ICONS.ETH,
    },
    '0x2cFc85d8E48F8EAB294be644d9E25C3030863003': {
        symbol: 'WLD',
        name: 'Worldcoin',
        decimals: 18,
        icon: TOKEN_ICONS.WLD,
    },
    '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1': {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        icon: TOKEN_ICONS.USDC,
    },
    '0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3': {
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        decimals: 8,
        icon: TOKEN_ICONS.WBTC,
    },
    '0x859dbe24b90c9f2f7742083d3cf59ca41f55be5d': {
        symbol: 'sDAI',
        name: 'Savings Dai',
        decimals: 18,
        icon: TOKEN_ICONS.DAI,
    },
    '0x102d758f688a4C1C5a80b116bD945d4455460282': {
        symbol: 'USDT',
        name: 'Tether USD (Bridged)',
        decimals: 6,
        icon: TOKEN_ICONS.USDT,
    },
    '0x9A60565f305F8863BA48fe642fB55c81F0b3680d': {
        symbol: 'MVP',
        name: 'MVP Token',
        decimals: 18,
        icon: 'https://ethereum-optimism.github.io/data/MVP/logo.png',
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
