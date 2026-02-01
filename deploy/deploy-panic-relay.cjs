const { ethers } = require("hardhat");

async function main() {
  const vaultAddress = process.env.PANIC_VAULT_ADDRESS;

  if (!vaultAddress) {
    throw new Error("PANIC_VAULT_ADDRESS is required");
  }

  const PanicRelay = await ethers.getContractFactory("PanicRelay");
  const relay = await PanicRelay.deploy(vaultAddress);
  await relay.waitForDeployment();

  console.log("PanicRelay deployed:", relay.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
