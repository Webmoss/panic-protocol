const { ethers } = require("hardhat");

async function main() {
  const {
    SEPOLIA_PRIVATE_KEY,
    PANIC_VAULT_ADDRESS,
    PANIC_RELAY_ADDRESS,
    VITE_TEST_USDC_SEPOLIA_ADDRESS,
    VITE_TEST_MOSS_SEPOLIA_ADDRESS,
    VITE_TEST_GUARD_SEPOLIA_ADDRESS,
  } = process.env;

  if (!SEPOLIA_PRIVATE_KEY) {
    throw new Error("SEPOLIA_PRIVATE_KEY is required");
  }
  if (!PANIC_VAULT_ADDRESS || !PANIC_RELAY_ADDRESS) {
    throw new Error("PANIC_VAULT_ADDRESS and PANIC_RELAY_ADDRESS are required");
  }
  if (
    !VITE_TEST_USDC_SEPOLIA_ADDRESS ||
    !VITE_TEST_MOSS_SEPOLIA_ADDRESS ||
    !VITE_TEST_GUARD_SEPOLIA_ADDRESS
  ) {
    throw new Error("Test token addresses are required in .env");
  }

  const user = new ethers.Wallet(SEPOLIA_PRIVATE_KEY, ethers.provider);
  const relayer = user;
  const safeAddress = ethers.Wallet.createRandom().address;

  const vault = await ethers.getContractAt("PanicVault", PANIC_VAULT_ADDRESS, user);
  const relay = await ethers.getContractAt("PanicRelay", PANIC_RELAY_ADDRESS, relayer);

  const tokens = [
    VITE_TEST_USDC_SEPOLIA_ADDRESS,
    VITE_TEST_MOSS_SEPOLIA_ADDRESS,
    VITE_TEST_GUARD_SEPOLIA_ADDRESS,
  ];
  const spenders = tokens.map(() => ethers.ZeroAddress);

  console.log("User:", user.address);
  console.log("Safe address:", safeAddress);
  console.log("Vault:", PANIC_VAULT_ADDRESS);
  console.log("Relay:", PANIC_RELAY_ADDRESS);

  const TestUSDC = await ethers.getContractAt("TestUSDC", tokens[0], user);
  const TestMOSS = await ethers.getContractAt("TestMOSS", tokens[1], user);
  const TestGUARD = await ethers.getContractAt("TestGUARD", tokens[2], user);

  console.log("Approving vault for test tokens...");
  await (await TestUSDC.approve(PANIC_VAULT_ADDRESS, ethers.MaxUint256)).wait();
  await (await TestMOSS.approve(PANIC_VAULT_ADDRESS, ethers.MaxUint256)).wait();
  await (await TestGUARD.approve(PANIC_VAULT_ADDRESS, ethers.MaxUint256)).wait();

  console.log("Setting safe address...");
  await (await vault.setSafeAddress(safeAddress)).wait();

  const nonce = await vault.nonces(user.address);
  const deadline = Math.floor(Date.now() / 1000) + 600;

  const RELAY_TYPEHASH = ethers.keccak256(
    ethers.toUtf8Bytes(
      "RelayPanic(address user,address[] tokens,address[] spenders,address safeAddress,uint256 deadline,uint256 nonce)"
    )
  );
  const tokensHash = ethers.keccak256(
    ethers.solidityPacked(["address[]"], [tokens])
  );
  const spendersHash = ethers.keccak256(
    ethers.solidityPacked(["address[]"], [spenders])
  );
  const coder = new ethers.AbiCoder();
  const structHash = ethers.keccak256(
    coder.encode(
      ["bytes32", "address", "bytes32", "bytes32", "address", "uint256", "uint256"],
      [
        RELAY_TYPEHASH,
        user.address,
        tokensHash,
        spendersHash,
        safeAddress,
        deadline,
        nonce,
      ]
    )
  );
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const domainSeparator = ethers.TypedDataEncoder.hashDomain({
    name: "PanicVault",
    version: "1",
    chainId,
    verifyingContract: PANIC_VAULT_ADDRESS,
  });
  const digest = ethers.keccak256(
    ethers.concat(["0x1901", domainSeparator, structHash])
  );
  const signature = user.signingKey.sign(digest).serialized;

  const request = {
    user: user.address,
    tokens,
    spenders,
    safeAddress,
    deadline,
    nonce,
  };

  console.log("Executing gasless relay...");
  const tx = await relay.executeRelay(request, signature);
  await tx.wait();
  console.log("Relay tx:", tx.hash);

  const usdcSafe = await TestUSDC.balanceOf(safeAddress);
  const mossSafe = await TestMOSS.balanceOf(safeAddress);
  const guardSafe = await TestGUARD.balanceOf(safeAddress);

  console.log("Safe balances after rescue:");
  console.log("tUSDC:", usdcSafe.toString());
  console.log("tMOSS:", mossSafe.toString());
  console.log("tGUARD:", guardSafe.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
