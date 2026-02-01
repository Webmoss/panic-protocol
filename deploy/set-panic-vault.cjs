const { ethers } = require("hardhat");

async function main() {
  const panicTokenAddress = process.env.PANIC_TOKEN_ADDRESS;
  const panicVaultAddress = process.env.PANIC_VAULT_ADDRESS;

  if (!panicTokenAddress) {
    throw new Error("PANIC_TOKEN_ADDRESS is required");
  }
  if (!panicVaultAddress) {
    throw new Error("PANIC_VAULT_ADDRESS is required");
  }

  const token = await ethers.getContractAt("PANICToken", panicTokenAddress);
  const tx = await token.setVault(panicVaultAddress);
  await tx.wait();

  console.log("PANICToken vault set to:", panicVaultAddress);
  console.log("Tx hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
