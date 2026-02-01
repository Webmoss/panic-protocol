const { ethers } = require("hardhat");

async function main() {
  const recipient = process.env.RECIPIENT;
  if (!recipient) {
    throw new Error("RECIPIENT is required");
  }

  const tUsdc = process.env.VITE_TEST_USDC_SEPOLIA_ADDRESS;
  const tMoss = process.env.VITE_TEST_MOSS_SEPOLIA_ADDRESS;
  const tGuard = process.env.VITE_TEST_GUARD_SEPOLIA_ADDRESS;

  if (!tUsdc || !tMoss || !tGuard) {
    throw new Error("Test token addresses are required in .env");
  }

  const [sender] = await ethers.getSigners();
  const usdc = await ethers.getContractAt("TestUSDC", tUsdc, sender);
  const moss = await ethers.getContractAt("TestMOSS", tMoss, sender);
  const guard = await ethers.getContractAt("TestGUARD", tGuard, sender);

  console.log("Sender:", sender.address);
  console.log("Sending tokens to:", recipient);

  const usdcAmount = 100n * 10n ** 6n;
  const erc20Amount = ethers.parseEther("100");

  const usdcBal = await usdc.balanceOf(sender.address);
  const mossBal = await moss.balanceOf(sender.address);
  const guardBal = await guard.balanceOf(sender.address);

  console.log("Sender balances:");
  console.log("tUSDC:", usdcBal.toString());
  console.log("tMOSS:", mossBal.toString());
  console.log("tGUARD:", guardBal.toString());

  const usdcTx = await usdc.transfer(recipient, usdcAmount);
  await usdcTx.wait();
  console.log("tUSDC transfer tx:", usdcTx.hash);

  const mossTx = await moss.transfer(recipient, erc20Amount);
  await mossTx.wait();
  console.log("tMOSS transfer tx:", mossTx.hash);

  const guardTx = await guard.transfer(recipient, erc20Amount);
  await guardTx.wait();
  console.log("tGUARD transfer tx:", guardTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
