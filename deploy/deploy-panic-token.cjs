const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const name = process.env.PANIC_NAME ?? "Panic";
  const symbol = process.env.PANIC_SYMBOL ?? "PANIC";
  const supply = process.env.PANIC_SUPPLY ?? "100000000";
  const vaultAddress = process.env.PANIC_VAULT_ADDRESS ?? deployer.address;

  const PANICToken = await ethers.getContractFactory("PANICToken");
  const token = await PANICToken.deploy(
    name,
    symbol,
    ethers.parseEther(supply),
    vaultAddress
  );
  await token.waitForDeployment();

  console.log("PANICToken deployed:", token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
