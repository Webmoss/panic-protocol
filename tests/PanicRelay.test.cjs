const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PanicRelay", () => {
  it("only relayer can execute", async () => {
    const [owner, relayer, attacker] = await ethers.getSigners();

    const PANICToken = await ethers.getContractFactory("PANICToken");
    const panicToken = await PANICToken.deploy(
      "PANIC",
      "PANIC",
      ethers.parseEther("1000000"),
      owner.address
    );

    const PanicVault = await ethers.getContractFactory("PanicVault");
    const vault = await PanicVault.deploy(panicToken.target, 300);

    const PanicRelay = await ethers.getContractFactory("PanicRelay");
    const relay = await PanicRelay.deploy(vault.target);

    await expect(relay.setRelayer(relayer.address, true))
      .to.emit(relay, "RelayerUpdated")
      .withArgs(relayer.address, true);

    const request = {
      user: owner.address,
      tokens: [],
      spenders: [],
      safeAddress: owner.address,
      deadline: Math.floor(Date.now() / 1000) + 3600,
      nonce: 0,
    };

    await expect(
      relay.connect(attacker).executeRelay(request, "0x")
    ).to.be.revertedWithCustomError(relay, "NotRelayer");
  });
});
