const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PanicVault", () => {
  async function deployFixture() {
    const [owner, user, safe] = await ethers.getSigners();

    const PANICToken = await ethers.getContractFactory("PANICToken");
    const panicToken = await PANICToken.deploy(
      "PANIC",
      "PANIC",
      ethers.parseEther("1000000"),
      owner.address
    );

    const PanicVault = await ethers.getContractFactory("PanicVault");
    const vault = await PanicVault.deploy(panicToken.target, 300);
    await panicToken.setVault(vault.target);

    return { owner, user, safe, panicToken, vault };
  }

  it("deploys with relay cost", async () => {
    const { vault } = await deployFixture();

    expect(await vault.relayCost()).to.equal(300);
  });

  it("requires a safe address before panic", async () => {
    const { user, vault } = await deployFixture();

    await expect(vault.connect(user).panicDirect([], []))
      .to.be.revertedWithCustomError(vault, "SafeAddressRequired");
  });

  it("rejects mismatched tokens/spenders", async () => {
    const { user, vault } = await deployFixture();

    await vault.connect(user).setSafeAddress(user.address);
    await expect(vault.connect(user).panicDirect([user.address], []))
      .to.be.revertedWithCustomError(vault, "InvalidInput");
  });

  it("sweeps ERC-20 balances to safe address", async () => {
    const { owner, user, safe, vault } = await deployFixture();

    const TestUSDC = await ethers.getContractFactory("TestUSDC");
    const token = await TestUSDC.deploy(owner.address);
    await token.transfer(user.address, ethers.parseUnits("250", 6));

    await vault.connect(user).setSafeAddress(safe.address);
    await token.connect(user).approve(vault.target, ethers.parseUnits("250", 6));

    await vault.connect(user).panicDirect([token.target], [owner.address]);

    expect(await token.balanceOf(safe.address)).to.equal(
      ethers.parseUnits("250", 6)
    );
    expect(await token.balanceOf(user.address)).to.equal(0);
  });

  it("accepts a valid panicRelay signature", async () => {
    const { owner, vault, panicToken } = await deployFixture();

    const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    await owner.sendTransaction({
      to: wallet.address,
      value: ethers.parseEther("1"),
    });

    await panicToken.transfer(wallet.address, 300);
    await vault.connect(wallet).setSafeAddress(wallet.address);

    const request = {
      user: wallet.address,
      tokens: [],
      spenders: [],
      safeAddress: wallet.address,
      deadline: Math.floor(Date.now() / 1000) + 3600,
      nonce: 0,
    };

    const RELAY_TYPEHASH = ethers.keccak256(
      ethers.toUtf8Bytes(
        "RelayPanic(address user,address[] tokens,address[] spenders,address safeAddress,uint256 deadline,uint256 nonce)"
      )
    );
    const tokensHash = ethers.keccak256("0x");
    const spendersHash = ethers.keccak256("0x");
    const coder = new ethers.AbiCoder();
    const structHash = ethers.keccak256(
      coder.encode(
        ["bytes32", "address", "bytes32", "bytes32", "address", "uint256", "uint256"],
        [
          RELAY_TYPEHASH,
          request.user,
          tokensHash,
          spendersHash,
          request.safeAddress,
          request.deadline,
          request.nonce,
        ]
      )
    );
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const domainSeparator = ethers.TypedDataEncoder.hashDomain({
      name: "PanicVault",
      version: "1",
      chainId,
      verifyingContract: vault.target,
    });
    const digest = ethers.keccak256(
      ethers.concat(["0x1901", domainSeparator, structHash])
    );
    const signature = wallet.signingKey.sign(digest).serialized;

    await vault.connect(owner).panicRelay(request, signature);
    expect(await panicToken.balanceOf(wallet.address)).to.equal(0);
    expect(await vault.nonces(wallet.address)).to.equal(1);
  });

  it("rejects panicRelay with invalid signature", async () => {
    const { owner, vault, panicToken } = await deployFixture();

    const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    const attacker = ethers.Wallet.createRandom().connect(ethers.provider);
    await owner.sendTransaction({
      to: wallet.address,
      value: ethers.parseEther("1"),
    });

    await panicToken.transfer(wallet.address, 300);
    await vault.connect(wallet).setSafeAddress(wallet.address);

    const request = {
      user: wallet.address,
      tokens: [],
      spenders: [],
      safeAddress: wallet.address,
      deadline: Math.floor(Date.now() / 1000) + 3600,
      nonce: 0,
    };

    const RELAY_TYPEHASH = ethers.keccak256(
      ethers.toUtf8Bytes(
        "RelayPanic(address user,address[] tokens,address[] spenders,address safeAddress,uint256 deadline,uint256 nonce)"
      )
    );
    const tokensHash = ethers.keccak256("0x");
    const spendersHash = ethers.keccak256("0x");
    const coder = new ethers.AbiCoder();
    const structHash = ethers.keccak256(
      coder.encode(
        ["bytes32", "address", "bytes32", "bytes32", "address", "uint256", "uint256"],
        [
          RELAY_TYPEHASH,
          request.user,
          tokensHash,
          spendersHash,
          request.safeAddress,
          request.deadline,
          request.nonce,
        ]
      )
    );
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const domainSeparator = ethers.TypedDataEncoder.hashDomain({
      name: "PanicVault",
      version: "1",
      chainId,
      verifyingContract: vault.target,
    });
    const digest = ethers.keccak256(
      ethers.concat(["0x1901", domainSeparator, structHash])
    );
    const badSignature = attacker.signingKey.sign(digest).serialized;

    await expect(vault.connect(owner).panicRelay(request, badSignature))
      .to.be.revertedWithCustomError(vault, "InvalidSignature");
  });

  it("rejects panicRelay after deadline", async () => {
    const { owner, vault, panicToken } = await deployFixture();

    const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    await owner.sendTransaction({
      to: wallet.address,
      value: ethers.parseEther("1"),
    });

    await panicToken.transfer(wallet.address, 300);
    await vault.connect(wallet).setSafeAddress(wallet.address);

    const request = {
      user: wallet.address,
      tokens: [],
      spenders: [],
      safeAddress: wallet.address,
      deadline: 1,
      nonce: 0,
    };

    await expect(vault.connect(owner).panicRelay(request, "0x"))
      .to.be.revertedWithCustomError(vault, "DeadlineExpired");
  });

  it("rejects panicRelay if safe address mismatches", async () => {
    const { owner, vault, panicToken } = await deployFixture();

    const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    await owner.sendTransaction({
      to: wallet.address,
      value: ethers.parseEther("1"),
    });

    await panicToken.transfer(wallet.address, 300);
    await vault.connect(wallet).setSafeAddress(wallet.address);

    const request = {
      user: wallet.address,
      tokens: [],
      spenders: [],
      safeAddress: owner.address,
      deadline: Math.floor(Date.now() / 1000) + 3600,
      nonce: 0,
    };

    await expect(vault.connect(owner).panicRelay(request, "0x"))
      .to.be.revertedWithCustomError(vault, "SafeAddressMismatch");
  });
});
