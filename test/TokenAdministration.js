const { expect } = require("chai").use(require("chai-as-promised"));

const TokenAdministration = artifacts.require("TokenAdministration");

contract.only("TokenAdministration", accounts => {
  const owner = accounts[0];
  let instance = null;

  beforeEach(async () => {
    instance = await TokenAdministration.new();
  });

  it("should have contract deployer as owner", async () => {
    const contractOwner = await instance.owner.call();
    expect(contractOwner).to.be.eq(owner);
  });

  describe("merchants", () => {
    describe("registration", () => {
      it("should allow anyone to register for a merchant account", async () => {
        const account = accounts[3];
        const name = "My Merchant Account";
        await instance.register(name, { from: account });

        const [nameFound, blockTime] = await instance.merchants(account);
        expect(nameFound).to.be.eq(name);
        expect(blockTime.toNumber()).to.be.gt(0);
      });

      it("should not allow re-registration", async () => {
        const account = accounts[3];
        const name = "My Merchant Account";
        await instance.register(name, { from: account });

        await expect(instance.register(name, { from: account })).to.be.rejected;
      });
    });

    describe("approval", () => {
      it("should allow owner to approve accounts", async () => {
        const account = accounts[3];
        const name = "My Merchant Account";
        await instance.register(name, { from: account });
        let approved = await instance.approved(account);
        expect(approved).to.be.false;
        await instance.approveAccount(account, { from: owner });
        approved = await instance.approved(account);
        expect(approved).to.be.true;
      });

      it("should not allow non-owner to approve accounts", async () => {
        const account = accounts[3];
        const name = "My Merchant Account";
        await instance.register(name, { from: account });

        await expect(instance.approveAccount(account, { from: account })).to.be
          .rejected;
      });
    });

    describe("disapproval", () => {
      it("should allow owner to disapprove accounts", async () => {
        const account = accounts[3];
        const name = "My Merchant Account";

        await instance.register(name, { from: account });
        let approved = await instance.approved(account);
        expect(approved).to.be.false;

        await instance.approveAccount(account, { from: owner });
        approved = await instance.approved(account);
        expect(approved).to.be.true;

        await instance.disapproveAccount(account, { from: owner });
        approved = await instance.approved(account);
        expect(approved).to.be.false;
      });

      it("should not allow non-owner to disapprove accounts", async () => {
        const account = accounts[3];
        const name = "My Merchant Account";

        await instance.register(name, { from: account });
        let approved = await instance.approved(account);
        expect(approved).to.be.false;

        await instance.approveAccount(account, { from: owner });
        approved = await instance.approved(account);
        expect(approved).to.be.true;

        await expect(instance.disapproveAccount(account, { from: account })).to
          .be.rejected;
      });
    });
  });

  describe("transfer", () => {
    it("should allow transfer to merchants", async () => {
      const account = accounts[3];
      const name = "My Merchant Account";

      await instance.register(name, { from: account });

      await instance.approveAccount(accounts[3], { from: owner });
      const canTransfer = await instance.canTransfer.call(owner, accounts[3]);
      expect(canTransfer).to.be.true;
    });

    it("should disallow transfer to non-merchants", async () => {
      const canTransfer = await instance.canTransfer.call(owner, accounts[3]);
      expect(canTransfer).to.be.false;
    });
  });

  describe("minting", () => {
    it("should disallow minting by default", async () => {
      const allowed = await instance.minters.call(owner);
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
});
