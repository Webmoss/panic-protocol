const { ethers } = require("hardhat");

async function main() {
  const panicTokenAddress = process.env.PANIC_TOKEN_ADDRESS;
  const relayCost = process.env.RELAY_COST ?? "300";

  if (!panicTokenAddress) {
    throw new Error("PANIC_TOKEN_ADDRESS is required");
  }

  const PanicVault = await ethers.getContractFactory("PanicVault");
  const vault = await PanicVault.deploy(panicTokenAddress, relayCost);
  await vault.waitForDeployment();

  console.log("PanicVault deployed:", vault.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
