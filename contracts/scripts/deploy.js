const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy Factory
    const OrbIdSwapFactory = await hre.ethers.getContractFactory("OrbIdSwapFactory");
    const factory = await OrbIdSwapFactory.deploy(deployer.address);
    await factory.deployed();
    console.log("OrbIdSwapFactory deployed to:", factory.address);

    // Deploy WETH
    const WETH9 = await hre.ethers.getContractFactory("WETH9");
    const weth = await WETH9.deploy();
    await weth.deployed();
    console.log("WETH9 deployed to:", weth.address);

    // Deploy Router
    const OrbIdSwapRouter = await hre.ethers.getContractFactory("OrbIdSwapRouter");
    const router = await OrbIdSwapRouter.deploy(factory.address, weth.address);
    await router.deployed();
    console.log("OrbIdSwapRouter deployed to:", router.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
