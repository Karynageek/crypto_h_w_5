import { expect } from "chai";
import { ethers } from "hardhat";
import { parseUnits } from "@ethersproject/units";
import { OrangeToken__factory } from "../typechain-types/factories/contracts/OrangeToken__factory";
import { OrangeToken } from "../typechain-types/contracts/OrangeToken";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe('Orange Token contract', () => {
  let token: OrangeToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];
  const name = 'Orange Token';
  const symbol = 'OT';
  const decimals = 18;
  const amount = parseUnits("100", decimals);
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const OrangeToken = (await ethers.getContractFactory('OrangeToken')) as OrangeToken__factory;
    token = await OrangeToken.deploy(name, symbol);

    await token.deployed();
  });

  describe("initial values", () => {
    it("gets the name", async () => {
      expect(await token.name()).to.equal(name);
    })

    it("gets the symbol", async () => {
      expect(await token.symbol()).to.equal(symbol);
    })
  });

  describe('mint', () => {
    it('mints successfully', async () => {
      const ownerBalanceBefore = await token.balanceOf(owner.address);
      const totalSupplyBefore = await token.totalSupply();

      const result = await token.mint(owner.address, amount);

      const ownerBalanceAfter = await token.balanceOf(owner.address);
      const totalSupplyAfter = await token.totalSupply();

      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(amount));
      expect(totalSupplyAfter).to.equal(totalSupplyBefore.add(amount));

      await expect(result).to.emit(token, "Transfer")
        .withArgs(zeroAddress, owner.address, amount);
    })
  })

  describe('burn', () => {
    it('burns successfully', async () => {
      await token.mint(owner.address, amount);

      const ownerBalanceBefore = await token.balanceOf(owner.address);
      const totalSupplyBefore = await token.totalSupply();

      const result = await token.burn(owner.address, amount);

      const ownerBalanceAfter = await token.balanceOf(owner.address);
      const totalSupplyAfter = await token.totalSupply();

      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.sub(amount));
      expect(totalSupplyAfter).to.equal(totalSupplyBefore.sub(amount));

      await expect(result).to.emit(token, "Transfer")
        .withArgs(owner.address, zeroAddress, amount);
    })
  })
});
