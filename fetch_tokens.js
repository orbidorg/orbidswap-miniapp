const https = require('https');

const url = 'https://static.optimism.io/optimism.tokenlist.json';

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const tokenList = JSON.parse(data);
            const worldChainTokens = tokenList.tokens.filter(t => t.chainId === 480);

            console.log(`Found ${worldChainTokens.length} tokens for World Chain (480)`);

            const formattedTokens = {};
            worldChainTokens.forEach(t => {
                formattedTokens[t.address] = {
                    symbol: t.symbol,
                    name: t.name,
                    decimals: t.decimals,
                    icon: t.logoURI
                };
            });

            console.log(JSON.stringify(formattedTokens, null, 2));

        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });

}).on('error', (err) => {
    console.error('Error fetching URL:', err.message);
});
