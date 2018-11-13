const Counter = artifacts.require("Counter");

contract("Counter", (accounts) => {
  it("should have zero count", async () => {
    let instance = await Counter.deployed();
    let balance = await instance.count.call();
    assert.equal(balance, 0);
  });

  it("should have zero count", async () => {
    let instance = await Counter.deployed();
    let tx = await instance.increase();
    let balance = await instance.count.call();
    assert.equal(balance.toNumber(), 1);
  });
});