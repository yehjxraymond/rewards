const { expect } = require("chai").use(require("chai-as-promised"));

const RegulatedToken = artifacts.require("RegulatedToken");
const TokenRegulatorService = artifacts.require("TokenRegulatorService");

contract("RegulatedToken", accounts => {
  const mintingAccount = accounts[2];
  let regulatorService;
  let instance = null;

  before(async () => {
    regulatorService = await TokenRegulatorService.new();
    await regulatorService.allowMinting(mintingAccount);
  });

  beforeEach(async () => {
    instance = await RegulatedToken.new(
      "Rewards",
      "RWD",
      18,
      regulatorService.address
    );
  });

  it("should be initialised correctly", async () => {
    const name = await instance.name.call();
    const symbol = await instance.symbol.call();
    const decimals = await instance.decimals.call();
    const regulator = await instance.tokenRegulator.call();
    const totalSupply = await instance.totalSupply.call();

    expect(name).to.be.eq("Rewards");
    expect(symbol).to.be.eq("RWD");
    expect(decimals.toNumber()).to.be.eq(18);
    expect(regulator).to.be.eq(regulatorService.address);
    expect(totalSupply.toNumber()).to.be.eq(0);
  });

  it("should allow minter to mint new coins", async () => {
    const creditAccount = accounts[1];
    const amountToCredit = 1000;
    await instance.mint(creditAccount, amountToCredit, {
      from: mintingAccount
    });
    const balance = await instance.balanceOf(creditAccount);
    const totalSupply = await instance.totalSupply.call();

    expect(balance.toNumber()).to.be.eq(amountToCredit);
    expect(totalSupply.toNumber()).to.be.eq(amountToCredit);
  });

  it("should not allow non-minter to mint new coins", async () => {
    const creditAccount = accounts[1];
    await expect(instance.mint(creditAccount, 1000, { from: creditAccount })).to
      .be.rejected;
  });
});
