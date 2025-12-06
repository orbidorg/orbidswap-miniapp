const { ethers } = require("ethers");

async function main() {
    const wallet = ethers.Wallet.createRandom();
    console.log("New Wallet Generated:");
    console.log("Address:", wallet.address);
    console.log("Private Key:", wallet.privateKey);
    console.log("\nPlease fund this address with ETH on World Chain Sepolia.");
}

main();
