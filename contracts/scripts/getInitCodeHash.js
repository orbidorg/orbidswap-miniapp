const { ethers } = require("hardhat");

async function main() {
    const OrbIdSwapPair = await ethers.getContractFactory("OrbIdSwapPair");
    const bytecode = OrbIdSwapPair.bytecode;
    const initCodeHash = ethers.keccak256(bytecode);
    console.log("Init Code Hash:", initCodeHash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
