const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const TestUSDC = await ethers.getContractFactory("TestUSDC");
  const TestMOSS = await ethers.getContractFactory("TestMOSS");
  const TestGUARD = await ethers.getContractFactory("TestGUARD");

  const usdc = await TestUSDC.deploy(deployer.address);
  await usdc.waitForDeployment();
  console.log("tUSDC deployed:", usdc.target);

  const moss = await TestMOSS.deploy(deployer.address);
  await moss.waitForDeployment();
  console.log("tMOSS deployed:", moss.target);

  const guard = await TestGUARD.deploy(deployer.address);
  await guard.waitForDeployment();
  console.log("tGUARD deployed:", guard.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
