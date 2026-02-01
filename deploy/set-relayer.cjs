const { ethers } = require("hardhat");

async function main() {
  const relayAddress = process.env.PANIC_RELAY_ADDRESS;
  if (!relayAddress) {
    throw new Error("PANIC_RELAY_ADDRESS is required");
  }

  const [deployer] = await ethers.getSigners();
  const relayerAddress = process.env.RELAYER_ADDRESS ?? deployer.address;

  const relay = await ethers.getContractAt("PanicRelay", relayAddress);
  const tx = await relay.setRelayer(relayerAddress, true);
  await tx.wait();

  console.log("Relayer whitelisted:", relayerAddress);
  console.log("Tx hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
