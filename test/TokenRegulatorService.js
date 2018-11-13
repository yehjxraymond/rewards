const { expect } = require("chai").use(require("chai-as-promised"));

const TokenRegulatorService = artifacts.require("TokenRegulatorService");

contract("TokenRegulatorService", accounts => {
  let instance = null;

  beforeEach(async () => {
    instance = await TokenRegulatorService.new();
  });

  it("should have contract deployer as owner", async () => {
    const owner = await instance.owner.call();
    expect(owner).to.be.eq(accounts[0]);
  });

  it("should disallow minting by default", async () => {
    const allowed = await instance.minters.call(accounts[0]);
    expect(allowed).to.be.false;
  });

  it("should allow owner to add minter", async () => {
    const allowedAccount = accounts[2];

    await instance.allowMinting(allowedAccount);
    const allowed = await instance.minters.call(allowedAccount);

    expect(allowed).to.be.true;
  });

  it("should not allow non-owner to add minter", async () => {
    await expect(instance.allowMinting(accounts[1], { from: accounts[1] })).to
      .be.rejected;
  });

  it("should allow owner to remove minter", async () => {
    const allowedAccount = accounts[2];

    await instance.allowMinting(allowedAccount);
    let allowed = await instance.minters.call(allowedAccount);
    expect(allowed).to.be.true;

    await instance.disallowMinting(allowedAccount);
    allowed = await instance.minters.call(allowedAccount);
    expect(allowed).to.be.false;
  });

  it("should not allow non-owner to remove minter", async () => {
    await expect(instance.allowMinting(accounts[1], { from: accounts[1] })).to
      .be.rejected;
  });
});
