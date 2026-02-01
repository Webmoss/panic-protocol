const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PANICToken", () => {
  it("only vault can burnFrom", async () => {
    const [owner, user, vault] = await ethers.getSigners();

    const PANICToken = await ethers.getContractFactory("PANICToken");
    const token = await PANICToken.deploy(
      "PANIC",
      "PANIC",
      ethers.parseEther("1000"),
      vault.address
    );

    await token.transfer(user.address, ethers.parseEther("10"));

    await expect(
      token.connect(user).burnFrom(user.address, ethers.parseEther("1"))
    ).to.be.revertedWithCustomError(token, "NotVault");

    await expect(
      token.connect(vault).burnFrom(user.address, ethers.parseEther("1"))
    ).to.not.be.reverted;
  });

  it("owner can update vault", async () => {
    const [owner, nextVault] = await ethers.getSigners();

    const PANICToken = await ethers.getContractFactory("PANICToken");
    const token = await PANICToken.deploy(
      "PANIC",
      "PANIC",
      ethers.parseEther("1000"),
      owner.address
    );

    await token.setVault(nextVault.address);
    expect(await token.vault()).to.equal(nextVault.address);
  });
});
